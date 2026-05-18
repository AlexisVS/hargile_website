const RAW_SITE = process.env.NEXT_PUBLIC_SITE_URL || 'hargile.be';
const SITE_URL = /^https?:\/\//.test(RAW_SITE) ? RAW_SITE : `https://${RAW_SITE}`;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: SITE_URL,
    generateRobotsTxt: true,
    alternateRefs: [
        {
            href: `${SITE_URL}/en`,
            hreflang: 'en',
        },
        {
            href: `${SITE_URL}/fr`,
            hreflang: 'fr',
        },
    ],
    additionalPaths: async (config) => {
        const locales = ['en', 'fr'];

        const routes = [
            {path: '', changefreq: 'weekly', priority: 1.0}, // Homepage
            {path: 'services', changefreq: 'weekly', priority: 0.8},
            {path: 'portfolio', changefreq: 'weekly', priority: 0.8},
            {path: 'about-us', changefreq: 'monthly', priority: 0.7},
            {path: 'contact', changefreq: 'monthly', priority: 0.7},
            {path: 'solutions/agves', changefreq: 'monthly', priority: 0.7},
            {path: 'solutions/i-go', changefreq: 'monthly', priority: 0.7},
            {path: 'solutions/multipass', changefreq: 'monthly', priority: 0.7},
            // Add more routes as needed
        ];

        // Generate all localized routes
        const localizedRoutes = [];

        locales.forEach(locale => {
            routes.forEach(route => {
                localizedRoutes.push({
                    loc: `/${locale}${route.path ? '/' + route.path : ''}`,
                    changefreq: route.changefreq,
                    priority: route.priority,
                    // You can also add lastmod if needed
                    // lastmod: new Date().toISOString()
                });
            });
        });

        return localizedRoutes;
    },
    // Exclude paths
    exclude: [
        '/api/*',
        '/*/audit/result',
    ],
}
