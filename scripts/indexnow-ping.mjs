#!/usr/bin/env node
/* IndexNow — push the sitemap's URLs to Bing (and Yandex, Seznam, Naver).
 *
 * Why this exists, specifically: **ChatGPT Search retrieves from the Bing
 * index.** A page Bing has not indexed cannot be cited in a ChatGPT answer,
 * whatever it ranks on Google. IndexNow is a push protocol — instead of
 * waiting weeks for a crawler to come back, we say "these URLs changed" and
 * they fetch within minutes. Google does not participate; this buys nothing
 * on Google's side.
 *
 * The key: the protocol verifies host ownership by fetching
 * https://<host>/<key>.txt and checking it contains the key and nothing else.
 * So the key is public by design — it is not a secret, and public/<key>.txt is
 * the single source for it. This script discovers it there rather than
 * carrying a second copy; renaming that file is all it takes to rotate.
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                 # submit the live sitemap's URLs
 *   node scripts/indexnow-ping.mjs --dry-run       # show what would be sent
 *   node scripts/indexnow-ping.mjs <url> [...]     # submit specific URLs
 *
 * Run it AFTER a deploy is actually live — see docs/next-session-prompt.md,
 * "Comment le déploiement marche". A tag is not a deploy, and submitting URLs
 * that still serve the old HTML just gets the old HTML indexed.
 */

import {readdir} from "node:fs/promises";
import path from "node:path";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || "hargile.com";
const HOST = RAW_SITE.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const SITE_URL = `https://${HOST}`;
const PUBLIC_DIR = path.join(process.cwd(), "public");

const die = (msg) => {
    process.stderr.write(`✗ ${msg}\n`);
    process.exit(1);
};

/* The key file is the source of truth for the key. Exactly one must exist —
   two would mean a rotation left the old one behind, and the endpoint would
   accept submissions signed with a key we thought was retired. */
async function findKey() {
    const entries = await readdir(PUBLIC_DIR);
    const candidates = entries.filter((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
    if (candidates.length === 0) die(`No IndexNow key file in ${PUBLIC_DIR} (expected <key>.txt).`);
    if (candidates.length > 1) die(`Several IndexNow key files in public/: ${candidates.join(", ")}. Keep exactly one.`);
    return candidates[0].replace(/\.txt$/i, "");
}

/* Confirm the endpoint can actually read the key before submitting: a wrong or
   undeployed key file comes back as a bare 403 from the API, which is easy to
   misread as "IndexNow is broken". Check the cause first. */
async function assertKeyIsLive(key) {
    const keyUrl = `${SITE_URL}/${key}.txt`;
    const res = await fetch(keyUrl, {headers: {"user-agent": "hargile-indexnow-ping"}});
    if (!res.ok) {
        die(`${keyUrl} → HTTP ${res.status}. The key file is not deployed yet; nothing to submit.`);
    }
    const served = (await res.text()).trim();
    if (served !== key) {
        die(`${keyUrl} serves ${JSON.stringify(served.slice(0, 80))}, expected ${JSON.stringify(key)}.`);
    }
    process.stdout.write(`✓ key file live at ${keyUrl}\n`);
    return keyUrl;
}

async function urlsFromSitemap() {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const res = await fetch(sitemapUrl, {headers: {"user-agent": "hargile-indexnow-ping"}});
    if (!res.ok) die(`${sitemapUrl} → HTTP ${res.status}`);
    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    if (urls.length === 0) die(`No <loc> entries in ${sitemapUrl}.`);
    return urls;
}

async function main() {
    const argv = process.argv.slice(2);
    const dryRun = argv.includes("--dry-run");
    const explicit = argv.filter((a) => !a.startsWith("--"));

    const key = await findKey();
    const urlList = explicit.length > 0 ? explicit : await urlsFromSitemap();

    /* The endpoint rejects the whole batch with 422 if a single URL is on
       another host — catch that here, where the message can say which one. */
    const foreign = urlList.filter((u) => {
        try {
            return new URL(u).host !== HOST;
        } catch {
            return true;
        }
    });
    if (foreign.length > 0) die(`Not on ${HOST}: ${foreign.join(", ")}`);

    process.stdout.write(`${urlList.length} URL(s) for ${HOST}:\n${urlList.map((u) => `  ${u}`).join("\n")}\n`);

    if (dryRun) {
        process.stdout.write("\n--dry-run: nothing submitted.\n");
        return;
    }

    const keyLocation = await assertKeyIsLive(key);

    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {"content-type": "application/json; charset=utf-8"},
        body: JSON.stringify({host: HOST, key, keyLocation, urlList}),
    });

    /* 200 = accepted, 202 = accepted with the key still being validated. Both
       are success; everything else is not, and must be loud. */
    if (res.status === 200 || res.status === 202) {
        process.stdout.write(`✓ submitted — HTTP ${res.status}\n`);
        return;
    }
    const explain = {
        400: "malformed request",
        403: "key not valid — the key file did not match",
        422: "URLs do not belong to the host, or the key is not the one in keyLocation",
        429: "too many requests — wait before retrying",
    }[res.status];
    die(`IndexNow returned HTTP ${res.status}${explain ? ` (${explain})` : ""}\n${(await res.text()).slice(0, 500)}`);
}

main().catch((err) => {
    process.stderr.write(`${err.stack ?? err}\n`);
    process.exit(1);
});
