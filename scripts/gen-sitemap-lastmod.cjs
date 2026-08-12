#!/usr/bin/env node
/* Resolves each sitemap page's lastmod from git and writes it to
   sitemap-lastmod.json for next-sitemap to read at build time.
 *
 * Why this exists: the release build cannot reach git. The image builds from
 * node:20-alpine, which has no git binary, and `.git` is in .dockerignore
 * anyway — so next-sitemap's own git lookup always failed there and dropped
 * the field. v0.27.1 shipped a sitemap with 18 URLs and no lastmod because of
 * it. CI runs this first, where git is present, and the resulting file travels
 * into the build context.
 *
 * Run it before `docker build`, and note the checkout must be deep:
 * actions/checkout is shallow by default, and `git log -1 -- <path>` on a
 * depth-1 clone returns the same single commit for every page — a uniform,
 * confidently wrong date, which is precisely the inaccuracy Google ignores
 * lastmod for. With fetch-depth: 0 the dates are real.
 *
 * The page→sources map lives in next-sitemap.config.js and is read from there:
 * copying it here is how the two would drift apart.
 */

const fs = require('fs');
const {PAGES, COMMON_SOURCES, gitLastmodOf, LASTMOD_FILE} = require('../next-sitemap.config.js');

const out = {};
let missing = 0;

for (const page of PAGES) {
    const lastmod = gitLastmodOf([...page.sources, ...COMMON_SOURCES]);
    if (lastmod) {
        out[page.path] = lastmod;
    } else {
        missing++;
        console.warn(`  no git date for "${page.path || '/'}" — it will ship without lastmod`);
    }
}

fs.writeFileSync(LASTMOD_FILE, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

const dates = new Set(Object.values(out));
console.log(`${LASTMOD_FILE}: ${Object.keys(out).length}/${PAGES.length} pages, ${dates.size} distinct date(s)`);

/* One date across every page is legitimate — all the copy lives in
   src/messages, so a copy edit genuinely changes all of them — but it is also
   what a shallow clone looks like, so it is worth saying out loud. */
if (dates.size === 1 && PAGES.length > 1) {
    console.warn('  all pages share one date: correct after a copy-wide change, suspicious after a shallow checkout');
}

if (missing === PAGES.length) {
    console.error('no dates resolved at all — is this a git checkout?');
    process.exit(1);
}
