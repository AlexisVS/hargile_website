import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const siteHostname = (process.env.NEXT_PUBLIC_SITE_URL || 'hargile.be')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
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
           destination rather than 404. next-intl prefixes every route with the
           locale, so each source is declared twice: `/:locale(en|fr)/path` for
           the prefixed URLs, plus the bare `/path` that next-intl resolves to
           the default locale. `permanent: true` = 301. */
        const gone = [
            // about-us may be restored later, so keep it temporary (307): a 301
            // gets cached hard by browsers and would keep sending visitors to /
            // even after the page comes back. The rest are gone for good (301).
            {path: 'about-us', to: '/', permanent: false},
            {path: 'services', to: '/', permanent: true},
            {path: 'sitemap', to: '/', permanent: true},
            {path: 'solutions/agves', to: '/', permanent: true},
            {path: 'solutions/i-go', to: '/', permanent: true},
            {path: 'solutions/multipass', to: '/', permanent: true},
            // The portfolio now lives on its own subdomain — send visitors there.
            {path: 'portfolio', to: 'https://portfolio.hargile.be/', permanent: true},
        ];

        return gone.flatMap(({path, to, permanent}) => [
            {source: `/:locale(en|fr)/${path}`, destination: to, permanent},
            {source: `/${path}`, destination: to, permanent},
        ]);
    },
};

export default withNextIntl(nextConfig);
