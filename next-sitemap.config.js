const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || 'hargile.com';
const SITE_URL = /^https?:\/\//.test(RAW_SITE) ? RAW_SITE : `https://${RAW_SITE}`;

const LOCALES = ['fr', 'en'];
const DEFAULT_LOCALE = 'fr';

/* The pages actually served with a 200. Keep this list in sync with the routes
   under src/app/[locale] — a sitemap must only ever contain canonical 200 URLs.
   Deliberately absent:
     - services / portfolio / solutions/* / about-us / sitemap → 301/307 since the
       site refresh (next.config.mjs). They were still listed here, which sent
       crawlers to 8 redirects for 6 real pages.
     - audit/result → per-prospect result page, noindex.
     - banner / banner-mvp → internal tools. */
const PAGES = [
    {path: '', changefreq: 'weekly', priority: 1.0},
    {path: 'contact', changefreq: 'monthly', priority: 0.7},
    {path: 'legal/privacy-policy', changefreq: 'yearly', priority: 0.3},
];

const url = (locale, path) => `${SITE_URL}/${locale}${path ? `/${path}` : ''}`;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: SITE_URL,
    generateRobotsTxt: true,
    generateIndexSitemap: false,

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
