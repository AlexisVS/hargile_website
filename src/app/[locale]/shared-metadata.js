// src/app/[locale]/shared-metadata.js
import {SITE_URL} from '@/lib/site-url';
import {localeUrl} from '@/seo/locale-url';

export function generateSharedMetadata(params, translations) {
    const {locale} = params;
    const isDefault = locale === 'fr'; // French is the default

    // Base URL with locale: French unprefixed, English /en (localeUrl).
    const baseUrl = localeUrl(locale);

    /* OG image — the existing lockup, still correct as a brand mark. */
    const imageUrl = `${SITE_URL}/images/brand/og-hargile-tech-studio.png`;

    return {
        metadataBase: new URL(SITE_URL),
        /* HARG-302: fallback titles/descriptions reflect the GEO/SEO pivot.
           Per-page metadata from generate-page-metadata.js overrides these on
           every routed page; these only fire if a page ships without its own. */
        title: {
            default: isDefault
                ? 'HARGILE — Visible dans les IA et sur Google'
                : 'HARGILE — Visible in AI and on Google',
        },
        description: isDefault
            ? 'GEO et SEO pour entreprises en Belgique. Soyez nommé par ChatGPT, Perplexity et les moteurs de réponse IA.'
            : 'GEO and SEO for businesses in Belgium. Get named by ChatGPT, Perplexity and AI answer engines.',
        applicationName: 'HARGILE',
        // Alternative languages
        alternates: {
            canonical: baseUrl,
            languages: {
                'fr': localeUrl('fr'),
                'en': localeUrl('en'),
            },
        },
        // OpenGraph metadata
        openGraph: {
            type: 'website',
            locale: locale,
            url: baseUrl,
            siteName: 'HARGILE',
            title: isDefault
                ? 'HARGILE — Visible dans les IA et sur Google'
                : 'HARGILE — Visible in AI and on Google',
            description: isDefault
                ? 'GEO et SEO pour entreprises en Belgique. Soyez nommé par ChatGPT, Perplexity et les moteurs de réponse IA.'
                : 'GEO and SEO for businesses in Belgium. Get named by ChatGPT, Perplexity and AI answer engines.',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: 'HARGILE',
                },
            ],
        },
        // Twitter card metadata
        twitter: {
            card: 'summary_large_image',
            title: isDefault
                ? 'HARGILE — Visible dans les IA et sur Google'
                : 'HARGILE — Visible in AI and on Google',
            description: isDefault
                ? 'GEO et SEO pour entreprises en Belgique. Soyez nommé par ChatGPT, Perplexity et les moteurs de réponse IA.'
                : 'GEO and SEO for businesses in Belgium. Get named by ChatGPT, Perplexity and AI answer engines.',
            images: [imageUrl],
            // No creator/site — see the note in src/seo/generate-page-metadata.js.
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
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-icon.png',
        },
    };
}
