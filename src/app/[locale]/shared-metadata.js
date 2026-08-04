// src/app/[locale]/shared-metadata.js
import {SITE_URL} from '@/lib/site-url';
import {localeUrl} from '@/seo/locale-url';

export function generateSharedMetadata(params, translations) {
    const {locale} = params;
    const isDefault = locale === 'fr'; // French is the default

    // Base URL with locale: French unprefixed, English /en (localeUrl).
    const baseUrl = localeUrl(locale);

    /* Default image path (absolute URL required for OG/Twitter).

       og-hargile-tech-studio.png is Logo_signature_mail.png — the dark-background
       TECH STUDIO lockup — letterboxed onto its own background at exactly
       1200×630. The source is 2000×600 (3.33:1) and every OG slot is 1.91:1, so
       posting it raw would let Twitter's summary_large_image centre-crop it: at
       that ratio the crop keeps only the middle ~57% of the width, losing the
       blue H on the left and "STUDIO" on the right. Padding first means no
       platform has to crop, and the width/height declared below are true rather
       than the aspirational 1200×630 the old 1754×815 asset claimed. */
    const imageUrl = `${SITE_URL}/images/brand/og-hargile-tech-studio.png`;

    return {
        metadataBase: new URL(SITE_URL),
        /* No `template` here. It appended ' | HARGILE - Innovation digitale' (+32
           chars) to page titles that already contain HARGILE, pushing every page
           past the ~60 chars Google displays — /fr/contact rendered at 91 chars.
           Page titles in seo.pages.* are self-sufficient; `default` still covers
           any page that ships without one. */
        title: {
            default: isDefault
                ? 'HARGILE - Innovation digitale au service de votre entreprise'
                : 'HARGILE - Digital Innovation for Your Business',
        },
        description: isDefault
            ? 'Agence digitale spécialisée dans le développement web, les solutions IA et les stratégies marketing'
            : 'Digital agency specializing in web development, AI solutions, and marketing strategies',
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
                ? 'HARGILE - Innovation digitale au service de votre entreprise'
                : 'HARGILE - Digital Innovation for Your Business',
            description: isDefault
                ? 'Agence digitale spécialisée dans le développement web, les solutions IA et les stratégies marketing'
                : 'Digital agency specializing in web development, AI solutions, and marketing strategies',
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
                ? 'HARGILE - Innovation digitale au service de votre entreprise'
                : 'HARGILE - Digital Innovation for Your Business',
            description: isDefault
                ? 'Agence digitale spécialisée dans le développement web, les solutions IA et les stratégies marketing'
                : 'Digital agency specializing in web development, AI solutions, and marketing strategies',
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
