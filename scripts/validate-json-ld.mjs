#!/usr/bin/env node
/* Offline JSON-LD validator, checked against the real schema.org vocabulary.
 *
 * Why this exists: neither validator.schema.org nor Google's Rich Results Test
 * has a usable public API (POSTing to them returns `numObjects: 0`), and both
 * only accept a pasted snippet by hand. This script does the mechanical half —
 * does every @type exist, does every property exist, is every property allowed
 * on the type that carries it — against the vocabulary those tools use, so a
 * regression is caught before anyone opens a browser.
 *
 * It does NOT replace the Rich Results Test: that tool also knows Google's
 * *rich-result* requirements (which fields are required/recommended for a
 * given feature), which are not part of the vocabulary and cannot be derived
 * from it. Use this for "is the markup well-formed and legal", use the RRT for
 * "will Google do something with it".
 *
 * Usage:
 *   node scripts/validate-json-ld.mjs <url|file> [...]     validate pages
 *   node scripts/validate-json-ld.mjs --self-test          negative control
 *   node scripts/validate-json-ld.mjs --site http://localhost:3000
 *
 * A URL is fetched and every <script type="application/ld+json"> in it is
 * validated. A file is read as raw JSON-LD, or scanned for script tags if it
 * looks like HTML.
 *
 * The vocabulary (~1.5 MB) is downloaded once and cached under .cache/ — which
 * is gitignored, so the first run needs network and later ones do not.
 */

import {readFile, writeFile, mkdir} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";

const VOCAB_URL = "https://schema.org/version/latest/schemaorg-current-https.jsonld";
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "schemaorg-current-https.jsonld");

/* Keys that are JSON-LD syntax, not schema.org properties. Never look these up. */
const JSONLD_KEYWORDS = new Set([
    "@context", "@type", "@id", "@graph", "@value", "@language",
    "@list", "@set", "@reverse", "@index", "@base", "@vocab",
]);

/* ---------------------------------------------------------------- vocabulary */

async function loadVocabulary({offline = false} = {}) {
    if (existsSync(CACHE_FILE)) {
        return JSON.parse(await readFile(CACHE_FILE, "utf8"));
    }
    if (offline) throw new Error(`No cached vocabulary at ${CACHE_FILE} and offline mode requested.`);

    process.stderr.write(`Downloading schema.org vocabulary → ${CACHE_FILE}\n`);
    const res = await fetch(VOCAB_URL);
    if (!res.ok) throw new Error(`Vocabulary download failed: HTTP ${res.status}`);
    const text = await res.text();
    await mkdir(CACHE_DIR, {recursive: true});
    await writeFile(CACHE_FILE, text, "utf8");
    return JSON.parse(text);
}

/* schema.org ships one flat @graph of rdfs:Class and rdf:Property nodes.
   Flatten it into: class → parents, property → the types it is allowed on. */
function indexVocabulary(vocab) {
    const classes = new Map();     // "Organization" → Set(parent names)
    const properties = new Map();  // "address" → Set(class names from domainIncludes)

    /* The dump identifies its own terms as `schema:Organization`, not as the
       full https URL. It also references foreign vocabularies (`gs1:`,
       `fibo-fnd-org-org:`) in owl:equivalentClass and occasionally in
       subClassOf — returning null for those keeps them out of the index
       instead of registering a bogus `Organization` twice. */
    const localName = (v) => {
        if (typeof v === "string") {
            const m = /^(?:https?:\/\/schema\.org\/|schema:)(.+)$/.exec(v);
            return m ? m[1] : null;
        }
        if (v && typeof v === "object" && v["@id"]) return localName(v["@id"]);
        return null;
    };
    const list = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
    /* Raw, not localName()d: these are `rdfs:Class` / `rdf:Property`, terms of
       the meta-vocabulary rather than schema.org types. */
    const types = (node) => list(node["@type"]).map((t) => (typeof t === "string" ? t : t?.["@id"]));

    for (const node of vocab["@graph"] ?? []) {
        const name = localName(node["@id"]);
        if (!name) continue;
        const nodeTypes = types(node);

        if (nodeTypes.includes("rdfs:Class")) {
            classes.set(name, new Set(list(node["rdfs:subClassOf"]).map(localName).filter(Boolean)));
        }
        if (nodeTypes.includes("rdf:Property")) {
            properties.set(name, new Set(list(node["schema:domainIncludes"]).map(localName).filter(Boolean)));
        }
    }
    return {classes, properties};
}

/* Every ancestor of `name`, inclusive. Used because domainIncludes is declared
   on the most general type that accepts a property: `address` is declared on
   Organization/Person/Place, and a ProfessionalService only inherits it. */
function ancestorsOf(name, classes, seen = new Set()) {
    if (seen.has(name) || !classes.has(name)) return seen;
    seen.add(name);
    for (const parent of classes.get(name)) ancestorsOf(parent, classes, seen);
    return seen;
}

/* ---------------------------------------------------------------- validation */

function validateNode(node, {classes, properties}, where, errors, warnings) {
    if (Array.isArray(node)) {
        node.forEach((n, i) => validateNode(n, {classes, properties}, `${where}[${i}]`, errors, warnings));
        return;
    }
    if (node === null || typeof node !== "object") return;

    const declared = (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]).filter(Boolean);

    for (const t of declared) {
        if (!classes.has(t)) {
            errors.push(`${where}: "@type": "${t}" is not a schema.org type`);
        }
    }

    /* A node that is only an {@id} reference to another node carries no
       properties of its own — that is legal and common (publisher: {@id}). */
    const isReference = declared.length === 0 && Object.keys(node).every((k) => k === "@id");

    const allowed = new Set();
    for (const t of declared) for (const a of ancestorsOf(t, classes)) allowed.add(a);

    for (const [key, value] of Object.entries(node)) {
        if (JSONLD_KEYWORDS.has(key)) {
            if (key === "@graph") validateNode(value, {classes, properties}, `${where}.@graph`, errors, warnings);
            continue;
        }
        const childWhere = `${where}.${key}`;

        if (!properties.has(key)) {
            errors.push(`${childWhere}: "${key}" is not a schema.org property`);
        } else if (declared.length === 0 && !isReference) {
            warnings.push(`${childWhere}: property on a node with no @type — cannot check it is allowed here`);
        } else if (declared.length > 0) {
            const domain = properties.get(key);
            /* An empty domainIncludes means the vocabulary does not constrain it. */
            if (domain.size > 0 && ![...domain].some((d) => allowed.has(d))) {
                errors.push(
                    `${childWhere}: "${key}" is not allowed on ${declared.join(" + ")} ` +
                    `(allowed on: ${[...domain].sort().join(", ")})`,
                );
            }
        }

        validateNode(value, {classes, properties}, childWhere, errors, warnings);
    }
}

function validateDocument(doc, vocab, label) {
    const errors = [];
    const warnings = [];
    if (!doc["@context"]) warnings.push(`${label}: no @context`);
    validateNode(doc, vocab, label, errors, warnings);

    let count = 0;
    (function countProps(n) {
        if (Array.isArray(n)) return n.forEach(countProps);
        if (n === null || typeof n !== "object") return;
        for (const [k, v] of Object.entries(n)) {
            if (!JSONLD_KEYWORDS.has(k)) count++;
            countProps(v);
        }
    })(doc);

    return {errors, warnings, propertyCount: count};
}

/* ------------------------------------------------------------------- sources */

function extractFromHtml(html) {
    const blocks = [];
    const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(html)) !== null) blocks.push(m[1]);
    return blocks;
}

async function readSource(source) {
    if (/^https?:\/\//.test(source)) {
        const res = await fetch(source, {headers: {"user-agent": "hargile-json-ld-validator"}});
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${source}`);
        return extractFromHtml(await res.text());
    }
    const text = await readFile(source, "utf8");
    return text.trimStart().startsWith("<") ? extractFromHtml(text) : [text];
}

/* -------------------------------------------------------------- negative control
 * A validator that reports "0 errors" is worthless until it has been shown to
 * report errors on something known-broken. Each case below must be caught, and
 * the script exits non-zero if any of them slips through. */

const SELF_TEST_CASES = [
    {
        name: "unknown @type",
        doc: {"@context": "https://schema.org", "@type": "WebPageThatDoesNotExist", name: "x"},
        expect: /is not a schema.org type/,
    },
    {
        name: "unknown property",
        doc: {"@context": "https://schema.org", "@type": "WebPage", totallyMadeUpProperty: "x"},
        expect: /is not a schema.org property/,
    },
    {
        name: "property on the wrong type",
        doc: {"@context": "https://schema.org", "@type": "WebPage", telephone: "+32477045080"},
        expect: /is not allowed on WebPage/,
    },
    {
        name: "broken nested node",
        doc: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            publisher: {"@type": "Organization", addressCountry: "BE"},
        },
        expect: /publisher\.addressCountry/,
    },
    {
        name: "valid document stays clean",
        doc: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "x",
            publisher: {
                "@type": ["Organization", "ProfessionalService"],
                telephone: "+32477045080",
                address: {"@type": "PostalAddress", addressCountry: "BE"},
            },
        },
        expect: null,
    },
];

async function selfTest(vocab) {
    let failed = 0;
    for (const {name, doc, expect} of SELF_TEST_CASES) {
        const {errors} = validateDocument(doc, vocab, "self-test");
        const matched = expect === null ? errors.length === 0 : errors.some((e) => expect.test(e));
        process.stdout.write(`${matched ? "  ok  " : " FAIL "} ${name}\n`);
        if (!matched) {
            failed++;
            process.stdout.write(`        errors: ${JSON.stringify(errors)}\n`);
        }
    }
    process.stdout.write(failed === 0
        ? "\nNegative control passed — the validator does detect broken markup.\n"
        : `\n${failed} self-test case(s) failed — do not trust this validator's output.\n`);
    return failed === 0;
}

/* ---------------------------------------------------------------------- main */

const LOCALES = ["fr", "en"];
const SITE_PATHS = ["", "/contact", "/legal/privacy-policy"];

async function main() {
    const argv = process.argv.slice(2);
    const vocab = indexVocabulary(await loadVocabulary());

    if (argv.includes("--self-test")) {
        process.exit((await selfTest(vocab)) ? 0 : 1);
    }

    const siteIndex = argv.indexOf("--site");
    let sources = argv.filter((a) => !a.startsWith("--"));
    if (siteIndex !== -1) {
        const base = argv[siteIndex + 1]?.replace(/\/$/, "");
        if (!base) throw new Error("--site needs a base URL, e.g. --site http://localhost:3000");
        sources = LOCALES.flatMap((l) => SITE_PATHS.map((p) => `${base}/${l}${p}`));
    }
    if (sources.length === 0) {
        process.stderr.write("Nothing to validate. Pass URLs/files, --site <base>, or --self-test.\n");
        process.exit(2);
    }

    /* Always run the negative control first: a green report means nothing if the
       checks themselves are dead. */
    if (!(await selfTest(vocab))) process.exit(1);
    process.stdout.write("\n");

    let totalErrors = 0;
    let totalWarnings = 0;
    for (const source of sources) {
        let blocks;
        try {
            blocks = await readSource(source);
        } catch (err) {
            process.stdout.write(`✗ ${source}: ${err.message}\n`);
            totalErrors++;
            continue;
        }
        if (blocks.length === 0) {
            process.stdout.write(`✗ ${source}: no application/ld+json block found\n`);
            totalErrors++;
            continue;
        }
        blocks.forEach((raw, i) => {
            const label = blocks.length > 1 ? `${source} [block ${i}]` : source;
            let doc;
            try {
                doc = JSON.parse(raw);
            } catch (err) {
                process.stdout.write(`✗ ${label}: not valid JSON — ${err.message}\n`);
                totalErrors++;
                return;
            }
            const {errors, warnings, propertyCount} = validateDocument(doc, vocab, "$");
            totalErrors += errors.length;
            totalWarnings += warnings.length;
            const mark = errors.length === 0 ? "✓" : "✗";
            process.stdout.write(
                `${mark} ${label} — ${propertyCount} properties, ` +
                `${errors.length} error(s), ${warnings.length} warning(s)\n`,
            );
            for (const e of errors) process.stdout.write(`    ERROR   ${e}\n`);
            for (const w of warnings) process.stdout.write(`    WARN    ${w}\n`);
        });
    }

    process.stdout.write(`\n${totalErrors} error(s), ${totalWarnings} warning(s) across ${sources.length} source(s).\n`);
    process.exit(totalErrors === 0 ? 0 : 1);
}

main().catch((err) => {
    process.stderr.write(`${err.stack ?? err}\n`);
    process.exit(1);
});
