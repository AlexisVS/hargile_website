#!/usr/bin/env node
/* Portfolio → site : une seule liste de projets, et elle n'habite pas ici.
 *
 * Le dépôt Hargile Portfolio possède les projets livrés. Ce script les lit et
 * écrit src/data/portfolio-projects.json, qui est **commité**. Rien ne se
 * synchronise à la construction : un build hors ligne rend exactement ce que le
 * dernier `git diff` a montré, et l'ajout d'un projet est une ligne de diff
 * lisible plutôt qu'un chiffre qui bouge tout seul en production.
 *
 * Pourquoi ce script existe : src/data/portfolio-data.js — la copie locale du
 * portfolio utilisée par la page /portfolio — avait dérivé. 22 projets et 13
 * catégories contre 23 projets et 18 secteurs côté portfolio, et /services
 * annonçait « 22 projets en ligne » avec le 22 écrit en dur dans
 * hero-stats.jsx. Le mode d'échec n'est jamais un chiffre faux, c'est un
 * chiffre périmé — le même que pour les mesures Lighthouse.
 *
 * Ce qu'on lit, et pourquoi cette source-là :
 *   - src/data/projects/index.ts        → l'ordre et surtout **ce qui est publié**.
 *                                         Un dossier de projet peut exister sans
 *                                         être exporté (creativeid, aujourd'hui) :
 *                                         lister les dossiers compterait 24.
 *   - <projet>/meta.ts, sinon index.ts  → les champs. Les deux formes coexistent
 *                                         dans le dépôt portfolio.
 *
 * Le parsing est volontairement littéral (des regex, pas un import TS) : ces
 * fichiers importent des images et des .md?raw que seul Vite sait résoudre, donc
 * les charger ici demanderait la chaîne de build du portfolio. Contrepartie : le
 * script **échoue bruyamment** dès qu'un champ manque plutôt que d'écrire une
 * chaîne vide. Un carré sans lien serait un bug silencieux sur la page.
 *
 * Usage :
 *   node scripts/sync-portfolio.mjs                    # dépôt voisin par défaut
 *   node scripts/sync-portfolio.mjs --from="D:/chemin" # ailleurs
 *   node scripts/sync-portfolio.mjs --check            # échoue si le JSON est périmé (CI)
 *
 * Étape suivante, quand le portfolio sera repris : lui faire écrire un
 * public/projects.json dans son prebuild (il génère déjà og-data.json depuis la
 * même liste) et lire ce fichier ici, par le disque ou par l'URL publiée. Le
 * format de sortie ci-dessous est déjà celui-là — seule la source changerait.
 */

import {readFile, writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "data", "portfolio-projects.json");
const DEFAULT_REPO = path.resolve(ROOT, "..", "..", "Hargile Portfolio", "hargile-portfolio");

const args = process.argv.slice(2);
const check = args.includes("--check");
const fromArg = args.find((a) => a.startsWith("--from="));
const repo = path.resolve(
    fromArg ? fromArg.slice("--from=".length).replace(/^["']|["']$/g, "")
        : process.env.PORTFOLIO_REPO || DEFAULT_REPO
);

/* Une valeur de champ TS, en guillemets simples ou doubles — les deux existent
   dans le dépôt portfolio (`client: "It's About To Go"` contre
   `client: 'Alia Nature'`), et ne lire que l'une des deux produisait un nom
   vide sans le moindre message. */
const field = (source, key) => {
    const m = source.match(
        new RegExp(`\\b${key}\\s*:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`)
    );
    if (!m) return null;
    return (m[1] ?? m[2]).replace(/\\(['"])/g, "$1");
};

/* Regroupement de secteurs — le seul jugement éditorial de ce script, et il est
 * ici pour être vu.
 *
 * Le portfolio distingue « Tourisme », « Hotellerie » et « Hébergement &
 * Tourisme » : trois façons de dire le même métier, qui gonflaient le compte
 * publié de deux unités. Idem pour « Streetwear », qui est de la mode. Sans ce
 * tableau la page annonçait 18 secteurs ; avec, elle en annonce 15, et les
 * quinze sont réellement quinze métiers différents.
 *
 * Le secteur d'origine reste dans le JSON : rien n'est perdu, et le jour où le
 * portfolio renomme ses `industry` — le vrai correctif, en amont — ce tableau
 * se vide au lieu de mentir. Tout ce qui n'est pas listé se groupe sous
 * lui-même. */
const SECTOR_GROUPS = {
    "Tourisme": ["Tourisme & hôtellerie", "Tourism & hospitality"],
    "Hotellerie": ["Tourisme & hôtellerie", "Tourism & hospitality"],
    "Hébergement & Tourisme": ["Tourisme & hôtellerie", "Tourism & hospitality"],
    "Streetwear": ["Mode", "Fashion"],
};

const fail = (message) => {
    console.error(`✗ ${message}`);
    process.exit(1);
};

if (!existsSync(repo)) {
    fail(`dépôt portfolio introuvable : ${repo}\n  → passer --from="<chemin>" ou définir PORTFOLIO_REPO.`);
}

const projectsDir = path.join(repo, "src", "data", "projects");
const indexSource = await readFile(path.join(projectsDir, "index.ts"), "utf8").catch(() =>
    fail(`pas de src/data/projects/index.ts dans ${repo}`)
);

/* L'export est la liste publiée. On le lit lui, pas le contenu du dossier. */
const exported = indexSource.match(/export const projects[^=]*=\s*\[([\s\S]*?)\];/);
if (!exported) fail("impossible de lire `export const projects` dans index.ts");

const ids = exported[1]
    .split(",")
    .map((line) => line.replace(/\/\/.*$/gm, "").trim())
    .filter(Boolean);

if (!ids.length) fail("la liste des projets exportés est vide");

const projects = [];

for (const id of ids) {
    const candidates = [
        path.join(projectsDir, id, "meta.ts"),
        path.join(projectsDir, id, "index.ts"),
    ];
    const file = candidates.find((f) => existsSync(f));
    if (!file) fail(`${id} : ni meta.ts ni index.ts`);

    const source = await readFile(file, "utf8");
    const entryFile = await readFile(path.join(projectsDir, id, "index.ts"), "utf8");
    /* meta.ts existe parfois sans porter les champs : on retombe sur index.ts. */
    const holder = field(source, "category") ? source : entryFile;

    /* Le secteur anglais vit dans le bloc `en:` de index.ts, même quand les
       champs canoniques sont dans meta.ts. On coupe à ce bloc plutôt que de
       chercher la deuxième occurrence d'`industry` : les deux clés portent le
       même nom, et se tromper d'occurrence donnerait une page anglaise en
       français sans que rien n'échoue. */
    const [, afterEn] = entryFile.split(/\n\s{2}en:\s*\{/);

    const entry = {
        id,
        client: field(holder, "client"),
        sector: field(holder, "industry"),
        sectorEn: (afterEn && field(afterEn, "industry")) || null,
        year: field(holder, "year"),
        url: field(holder, "websiteUrl"),
        caseStudy: !/\bnoCaseStudy\s*:\s*true/.test(holder),
    };

    for (const key of ["client", "sector", "year", "url"]) {
        if (!entry[key]) fail(`${id} : champ « ${key} » absent ou vide dans ${path.relative(repo, file)}`);
    }
    if (!/^https?:\/\//.test(entry.url)) fail(`${id} : websiteUrl n'est pas une URL absolue (${entry.url})`);

    const [group, groupEn] = SECTOR_GROUPS[entry.sector] || [];
    entry.group = group || entry.sector;
    entry.groupEn = groupEn || entry.sectorEn || entry.sector;

    projects.push(entry);
}

const sectors = [...new Set(projects.map((p) => p.group))];
const sectorsEn = [...new Set(projects.map((p) => p.groupEn))];

const merged = Object.keys(SECTOR_GROUPS).filter((s) => projects.some((p) => p.sector === s));
if (merged.length) {
    const raw = new Set(projects.map((p) => p.sector)).size;
    console.log(`  ${raw} secteurs bruts → ${sectors.length} après regroupement (${merged.join(", ")}).`);
}

/* Les deux locales doivent annoncer le même nombre de secteurs. Si une
   traduction fusionne deux métiers (ou en sépare deux), la page dirait 18 en
   français et 17 en anglais — un écart que personne ne verrait avant qu'un
   lecteur ne le voie. La page compte sur le champ canonique ; ce contrôle
   existe pour que la divergence se règle à la source, dans le portfolio. */
if (sectors.length !== sectorsEn.length) {
    console.warn(
        `⚠ secteurs : ${sectors.length} en français, ${sectorsEn.length} en anglais.` +
        " La page publie le compte français. À corriger côté portfolio."
    );
}
const missingEn = projects.filter((p) => !p.sectorEn).map((p) => p.id);
if (missingEn.length) console.warn(`⚠ pas de secteur anglais : ${missingEn.join(", ")} — repli sur le français.`);

/* Les deux nombres publiés ne sont écrits nulle part : la page fait
   projects.length et Set(sector).size. Ils sont repris ici pour que le diff les
   montre, pas pour que quiconque les recopie. */
const payload = {
    _comment:
        "Généré par scripts/sync-portfolio.mjs depuis le dépôt Hargile Portfolio. Ne pas éditer à la main.",
    syncedFrom: "hargile-portfolio/src/data/projects",
    projects,
};

const next = `${JSON.stringify(payload, null, 2)}\n`;
const previous = await readFile(OUT, "utf8").catch(() => null);

if (check) {
    if (previous !== next) {
        fail(`${path.relative(ROOT, OUT)} est périmé — lancer « npm run sync:portfolio ».`);
    }
    console.log(`✓ à jour — ${projects.length} projets, ${sectors.length} secteurs.`);
    process.exit(0);
}

await writeFile(OUT, next, "utf8");

const before = previous ? JSON.parse(previous).projects : null;
console.log(`✓ ${path.relative(ROOT, OUT)} — ${projects.length} projets, ${sectors.length} secteurs.`);
if (before && before.length !== projects.length) {
    console.log(`  ${before.length} → ${projects.length} projets. Les compteurs de la page suivent tout seuls.`);
}
if (!before) console.log("  Premier export.");
