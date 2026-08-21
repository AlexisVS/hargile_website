const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || 'hargile.com';
const SITE_URL = /^https?:\/\//.test(RAW_SITE) ? RAW_SITE : `https://${RAW_SITE}`;

const LOCALES = ['fr', 'en'];
const DEFAULT_LOCALE = 'fr';

/* The pages actually served with a 200. Keep this list in sync with the routes
   under src/app/[locale] — a sitemap must only ever contain canonical 200 URLs.
   services/* and faq are live again since the M4 pages (2026-07-30).
   Deliberately absent:
     - portfolio / solutions/* / about-us / sitemap → 301/307 since the
       site refresh (next.config.mjs). They were still listed here, which sent
       crawlers to 8 redirects for 6 real pages.
     - audit/result → per-prospect result page, noindex.
     - banner / banner-mvp → internal tools. */
const ROUTES = 'src/app/[locale]/(context)/(client)';

/* Every page's copy lives in the message files, so they date every entry. */
const COMMON_SOURCES = ['src/messages'];

const PAGES = [
    {path: '', changefreq: 'weekly', priority: 1.0,
        sources: [`${ROUTES}/page.jsx`, `${ROUTES}/HomePageClient.jsx`, 'src/components/pages/homepage']},
    {path: 'services', changefreq: 'monthly', priority: 0.8,
        sources: [`${ROUTES}/services`, 'src/components/pages/services/v2/index', 'src/components/pages/services/v2/shared']},
    {path: 'services/applications-web', changefreq: 'monthly', priority: 0.7,
        sources: [`${ROUTES}/services/applications-web`, 'src/components/pages/services/v2/web']},
    {path: 'services/seo', changefreq: 'monthly', priority: 0.7,
        sources: [`${ROUTES}/services/seo`, 'src/components/pages/services/v2/seo']},
    {path: 'faq', changefreq: 'monthly', priority: 0.6,
        sources: [`${ROUTES}/faq`, 'src/components/pages/faq']},
    {path: 'contact', changefreq: 'monthly', priority: 0.7,
        sources: [`${ROUTES}/contact`, 'src/components/form']},
    {path: 'legal/privacy-policy', changefreq: 'yearly', priority: 0.3,
        sources: [`${ROUTES}/legal/privacy-policy`]},
];

/* lastmod is the commit date of the newest source a page is built from. The
   sitemap carried none at all, which throws away the one crawl-scheduling
   signal a sitemap can give — and the obvious shortcut, a build-time
   `new Date()`, is worse than nothing: it re-dates every page on every deploy,
   and Google only honours lastmod when it is verifiably accurate.

   Two ways in, because the release build cannot reach git. The Docker image
   builds from node:20-alpine with no git binary, and `.git` is in
   .dockerignore anyway — so v0.27.1 shipped a sitemap with no lastmod at all,
   the fallback below doing its job. CI therefore resolves the dates where git
   does exist (scripts/gen-sitemap-lastmod.cjs, run before `docker build`) and
   leaves them in LASTMOD_FILE for the build to read.

   Order: the CI file if present, then git for a local `npm run build`, then
   nothing. Never a guess — a wrong lastmod is worse than an absent one. */
const LASTMOD_FILE = 'sitemap-lastmod.json';

const cachedLastmod = (() => {
    try {
        return JSON.parse(require('fs').readFileSync(LASTMOD_FILE, 'utf8'));
    } catch {
        return null;
    }
})();

/* execFileSync, not execSync: the route paths contain (context) and [locale],
   and execSync hands its string to /bin/sh, where bare parentheses are a syntax
   error. That failed on the Linux runner for every page while passing locally
   on Windows, where the string goes to cmd.exe instead. Passing argv straight
   to git removes the shell — and with it the quoting question entirely.

   GIT_LITERAL_PATHSPECS is still needed: git itself would otherwise read
   [locale] as a glob. */
const gitLastmodOf = (sources) => {
    try {
        const out = require('child_process')
            .execFileSync('git', ['log', '-1', '--format=%cI', '--', ...sources], {
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore'],
                env: {...process.env, GIT_LITERAL_PATHSPECS: '1'},
            })
            .trim();
        return out || undefined;
    } catch {
        return undefined;
    }
};

const lastmodOf = (page) =>
    cachedLastmod?.[page.path] ??
    gitLastmodOf([...page.sources, ...COMMON_SOURCES]);

/* French — the default locale — is unprefixed, English keeps /en. This mirrors
   src/seo/locale-url.js (this file is CommonJS and cannot import it): change
   the two together.

   The French home is the bare origin, with no trailing slash. It used to end in
   one, and that put the home page into the sitemap under two different strings
   at once: next-sitemap normalises <loc> to `https://hargile.com` but passes
   alternateRefs through untouched, so the entry declared
   `<loc>https://hargile.com</loc>` against `hreflang="fr" href="https://hargile.com/"`.
   A self-referencing hreflang that does not match its own <loc> is not a valid
   annotation, and Google can drop the whole cluster over it. No slash is also
   what Next.js already emits for the canonical and the HTML hreflang, so this
   is the form the rest of the site agrees on. */
const url = (locale, path) => {
    const suffix = `${locale === DEFAULT_LOCALE ? '' : `/${locale}`}${path ? `/${path}` : ''}`;
    return `${SITE_URL}${suffix}`;
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: SITE_URL,
    generateRobotsTxt: true,
    generateIndexSitemap: false,

    /* robots.txt is generated HERE and nowhere else. There used to be a
       src/app/robots.js declaring these same rules, but a file in public/ wins
       over an App Router route at the same path — next-sitemap writes
       public/robots.txt on postbuild, so the route never served a single byte
       and its Disallow lines never shipped. Verified against production. One
       source, and it is the one that wins.

       Everything stays allowed on purpose: every AI crawler (GPTBot,
       OAI-SearchBot, ClaudeBot, PerplexityBot, Meta-ExternalAgent…) is welcome.
       Only the non-page surfaces are excluded. */
    robotsTxtOptions: {
        policies: [
            {userAgent: '*', allow: '/', disallow: ['/api/', '/admin/']},
        ],
    },

    /* Everything is declared explicitly in additionalPaths below. Auto-discovery
       from the build output is what pulled robots.txt, manifest.webmanifest and
       the banner tools into the sitemap. */
    exclude: ['/*'],

    additionalPaths: async () =>
        PAGES.flatMap((page) => {
            const lastmod = lastmodOf(page);
            return LOCALES.map((locale) => ({
                loc: url(locale, page.path),
                changefreq: page.changefreq,
                priority: page.priority,
                ...(lastmod ? {lastmod} : {}),
                /* hrefIsAbsolute is what fixes the broken alternates: without it
                   next-sitemap appends the page path behind the href, which
                   produced /en/en, /fr/en/contact… — every one a 404. */
                alternateRefs: [
                    ...LOCALES.map((l) => ({
                        href: url(l, page.path),
                        hreflang: l,
                        hrefIsAbsolute: true,
                    })),
                    {
                        href: url(DEFAULT_LOCALE, page.path),
                        hreflang: 'x-default',
                        hrefIsAbsolute: true,
                    },
                ],
            }));
        }),
};

/* Attached after the assignment above, not before — `module.exports = {…}`
   replaces the whole object and would drop anything set earlier.
   scripts/gen-sitemap-lastmod.cjs reads these so the page→sources map has one
   home; duplicating it in the workflow is how it would silently drift. */
module.exports.PAGES = PAGES;
module.exports.COMMON_SOURCES = COMMON_SOURCES;
module.exports.gitLastmodOf = gitLastmodOf;
module.exports.LASTMOD_FILE = LASTMOD_FILE;
