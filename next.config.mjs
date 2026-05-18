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
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
};

export default withNextIntl(nextConfig);
