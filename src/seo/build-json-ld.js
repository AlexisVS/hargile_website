import {getTranslations} from "next-intl/server";
import {SITE_URL} from "@/lib/site-url";
import {ROUTES} from "@/seo/routes";

/* Profiles Google uses to tie the site to a known entity (Knowledge Panel).
   Kept in sync with the footer / navbar links. */
const SAME_AS = [
    "https://www.linkedin.com/company/hargile",
    "https://www.instagram.com/hargile_tech_studio/",
    "https://github.com/HARGILE-tech-studio",
];

// Builds the JSON-LD object for a given locale + pagePath.
// Returns null if SEO translations cannot be loaded (graceful fallback).
export async function buildJsonLd({locale, pagePath}) {
    try {
        const globalT = await getTranslations({locale, namespace: "seo.global"});
        const pageT = await getTranslations({locale, namespace: `seo.pages.${pagePath}`});

        const pathSuffix = ROUTES[pagePath] ?? `/${pagePath.replaceAll(".", "/")}`;
        const baseUrl = `${SITE_URL}/${locale}${pathSuffix}`;
        const imageUrl = `${SITE_URL}/images/brand/brand_large.png`;

        let schemaType = "WebPage";
        try {
            const candidate = pageT("schemaType");
            if (candidate) schemaType = candidate;
        } catch {
            /* schemaType key missing — fall back to WebPage */
        }

        /* One Organization node with a stable @id, referenced by every page.
           The @id is what lets Google merge the fr and en pages into a single
           entity instead of reading them as two unrelated companies. */
        const organization = {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: globalT("siteName"),
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: imageUrl,
                width: 1200,
                height: 630,
            },
            sameAs: SAME_AS,
        };

        return {
            "@context": "https://schema.org",
            "@type": schemaType,
            "@id": `${baseUrl}#page`,
            name: pageT("title"),
            description: pageT("description"),
            url: baseUrl,
            image: imageUrl,
            inLanguage: locale,
            isPartOf: {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: globalT("siteName"),
                publisher: {"@id": `${SITE_URL}/#organization`},
            },
            publisher: organization,
        };
    } catch {
        return null;
    }
}
