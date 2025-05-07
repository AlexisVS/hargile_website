import {getTranslations} from 'next-intl/server';

/**
 * Generate metadata for specific page with optimized SEO descriptions
 * Maintains the same function signature and approach while enhancing descriptions
 *
 * @param {Object} params - Parameters object
 * @param pagePath dot notations
 * @param {Object} params.params - Next.js params object containing locale
 * @param {string} params.pagePath - Path identifier for the page
 * @returns {Object} - Metadata object for Next.js
 */
export async function generatePageMetadata({params, pagePath}) {
    const {locale} = await params || {locale: 'en'};

    try {
        // Load global translations
        const globalT = await getTranslations({
            locale,
            namespace: 'seo.global'
        });

        // Load page-specific translations
        const pageT = await getTranslations({
            locale,
            namespace: `seo.pages.${pagePath}`
        });

        // Base URL configuration
        const domain = globalT('domain');
        const baseUrl = `https://${domain}/${locale}${pagePath === 'home' ? '' : `/${pagePath.replace('.', '/')}`}`;
        const imageUrl = `https://${domain}/images/brand/brand_large.png`;

        // Enhanced metadata with optimized descriptions
        return {
            metadataBase: new URL(`https://${domain}`),
            title: pageT('title'),
            description: pageT('description'),
            applicationName: globalT('siteName'),

            alternates: {
                canonical: baseUrl,
                languages: {
                    'fr': `https://${domain}/fr${pagePath === 'home' ? '' : `/${pagePath.replace('.', '/')}`}`,
                    'en': `https://${domain}/en${pagePath === 'home' ? '' : `/${pagePath.replace('.', '/')}`}`,
                },
            },

            openGraph: {
                type: 'website',
                locale: locale,
                url: baseUrl,
                siteName: globalT('siteName'),
                title: pageT('og.title'),
                description: pageT('og.description'),
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: pageT('og.imageAlt'),
                    },
                ],
            },

            twitter: {
                card: 'summary_large_image',
                title: pageT('og.title'),
                description: pageT('og.description'),
                images: [imageUrl],
                creator: globalT('twitterHandle'),
                site: globalT('twitterHandle'),
            },

            robots: {
                index: true,
                follow: true,
                nocache: false,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },

            other: {
                'script:ld+json': {
                    '@context': 'https://schema.org',
                    '@type': pageT('schemaType') || 'WebPage',
                    name: pageT('title'),
                    description: pageT('description'),
                    url: baseUrl,
                    image: imageUrl,
                    publisher: {
                        '@type': 'Organization',
                        name: globalT('siteName'),
                        logo: {
                            '@type': 'ImageObject',
                            url: `https://${domain}/images/brand/brand_large.png`
                        }
                    }
                },
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);

        // Fallback metadata if translations fail to load
        return {
            title: 'HARGILE',
            description: locale === 'fr'
                ? 'Agence digitale spécialisée dans le développement web, les solutions IA et les stratégies marketing pour transformer votre présence en ligne et booster votre croissance.'
                : 'Digital agency specializing in web development, AI solutions, and marketing strategies to transform your online presence and boost your business growth.'
        };
    }
}
