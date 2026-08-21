import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const siteHostname = (process.env.NEXT_PUBLIC_SITE_URL || 'hargile.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        /* Inlined at build time, so the same literal ends up in the SSR HTML and
           in the client bundle — no hydration mismatch, and no `new Date()`
           during render. The footer copyright used to be seeded with a hardcoded
           2025 and only corrected in an effect, which meant the *raw* HTML said
           2025 forever. AI crawlers do not execute JavaScript, so that stale
           year was the freshness signal they read. Now every build refreshes it. */
        NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
    },
    compiler: {
        styledComponents: true,
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: siteHostname,
                port: '',
                pathname: '/images/**',
            },
            {
                protocol: 'https',
                hostname: siteHostname,
                port: '',
                pathname: '/**',
            },
        ],
    },
    reactCompiler: true,
    cacheComponents: true,
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
    async headers() {
        /* Next static pages ship `Cache-Control: s-maxage=31536000` (one year).
           With no CDN in front today that's inert, but it's a trap: add a CDN
           later and deploys stop propagating without a purge. Cap page freshness
           to a few minutes and let the browser revalidate via ETag, while
           `stale-while-revalidate` keeps perf. Assets under /_next/static stay
           immutable — the matcher excludes them. */
        return [
            {
                source: '/((?!_next/static|_next/image|api/).*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
                    },
                ],
            },
        ];
    },
    async redirects() {
        /* Pages removed in the site refresh (feature/site-refresh). Their URLs
           are still indexed / bookmarked, so 301 them to the closest surviving
           destination rather than 404. Each source is declared twice: the bare
           `/path` (the unprefixed French namespace, and any legacy unprefixed
           link) and `/:locale(en|fr)/path` for old prefixed URLs. These run
           BEFORE src/proxy.js, so /fr/services 301s straight to `/` in one hop
           instead of chaining through the /fr → / redirect. `permanent: true`
           = 301. */
        const gone = [
            // about-us may be restored later, so keep it temporary (307): a 301
            // gets cached hard by browsers and would keep sending visitors to /
            // even after the page comes back. The rest are gone for good (301).
            {path: 'about-us', to: '/', permanent: false},
            // 'services' left this list on 2026-07-30: the M4 pages live at
            // /services and /services/* again. Visitors who cached the old 301
            // eat that cost — accepted, the traffic was near zero.
            {path: 'sitemap', to: '/', permanent: true},
            // The AI and MVP offer pages were retired: 301 both to the services
            // index, the closest surviving destination, rather than 404.
            {path: 'services/ia', to: '/services', permanent: true},
            {path: 'services/mvp-30-jours', to: '/services', permanent: true},
            {path: 'solutions/agves', to: '/', permanent: true},
            {path: 'solutions/i-go', to: '/', permanent: true},
            {path: 'solutions/multipass', to: '/', permanent: true},
            // The portfolio now lives on its own subdomain — send visitors there.
            {path: 'portfolio', to: 'https://portfolio.hargile.com/', permanent: true},
        ];

        return gone.flatMap(({path, to, permanent}) => [
            {source: `/:locale(en|fr)/${path}`, destination: to, permanent},
            {source: `/${path}`, destination: to, permanent},
        ]);
    },
};

export default withNextIntl(nextConfig);
