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
const PAGES = [
    {path: '', changefreq: 'weekly', priority: 1.0},
    {path: 'services', changefreq: 'monthly', priority: 0.8},
    {path: 'services/applications-web', changefreq: 'monthly', priority: 0.7},
    {path: 'services/ia', changefreq: 'monthly', priority: 0.7},
    {path: 'services/seo', changefreq: 'monthly', priority: 0.7},
    {path: 'services/mvp-30-jours', changefreq: 'monthly', priority: 0.7},
    {path: 'faq', changefreq: 'monthly', priority: 0.6},
    {path: 'contact', changefreq: 'monthly', priority: 0.7},
    {path: 'legal/privacy-policy', changefreq: 'yearly', priority: 0.3},
];

/* French — the default locale — is unprefixed, English keeps /en. This mirrors
   src/seo/locale-url.js (this file is CommonJS and cannot import it): change
   the two together. The French home is `${SITE_URL}/`, never the bare origin. */
const url = (locale, path) => {
    const suffix = `${locale === DEFAULT_LOCALE ? '' : `/${locale}`}${path ? `/${path}` : ''}`;
    return suffix ? `${SITE_URL}${suffix}` : `${SITE_URL}/`;
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
        PAGES.flatMap((page) =>
            LOCALES.map((locale) => ({
                loc: url(locale, page.path),
                changefreq: page.changefreq,
                priority: page.priority,
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
            })),
        ),
};
