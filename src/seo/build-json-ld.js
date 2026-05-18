import {getTranslations} from "next-intl/server";
import {SITE_URL} from "@/lib/site-url";

// Builds the JSON-LD object for a given locale + pagePath.
// Returns null if SEO translations cannot be loaded (graceful fallback).
export async function buildJsonLd({locale, pagePath}) {
    try {
        const globalT = await getTranslations({locale, namespace: "seo.global"});
        const pageT = await getTranslations({locale, namespace: `seo.pages.${pagePath}`});

        const domain = globalT("domain");
        const baseUrl = `https://${domain}/${locale}${pagePath === "home" ? "" : `/${pagePath.replace(".", "/")}`}`;
        const imageUrl = `${SITE_URL}/images/brand/brand_large.png`;

        let schemaType = "WebPage";
        try {
            const candidate = pageT("schemaType");
            if (candidate) schemaType = candidate;
        } catch {
            /* schemaType key missing — fall back to WebPage */
        }

        return {
            "@context": "https://schema.org",
            "@type": schemaType,
            name: pageT("title"),
            description: pageT("description"),
            url: baseUrl,
            image: imageUrl,
            publisher: {
                "@type": "Organization",
                name: globalT("siteName"),
                logo: {
                    "@type": "ImageObject",
                    url: imageUrl,
                },
            },
        };
    } catch {
        return null;
    }
}
