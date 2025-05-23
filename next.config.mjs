import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Removed 'domains' property as it's deprecated
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_SITE_URL,
                port: '',
                pathname: '/images/**',
            },
            // If you need to allow all paths on your domain, add this pattern
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_SITE_URL,
                port: '',
                pathname: '/**', // This covers all paths
            },
        ],
    },
    experimental: {
        reactCompiler: true,
    },
};

export default withNextIntl(nextConfig);
