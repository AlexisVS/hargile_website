import {getTranslations} from "next-intl/server";
import {SITE_URL} from "@/lib/site-url";
import {NAP} from "@/lib/nap";
import {ROUTES} from "@/seo/routes";

/* Profiles Google uses to tie the site to a known entity (Knowledge Panel).
   Kept in sync with the footer / navbar links. */
const SAME_AS = [
    "https://www.linkedin.com/company/hargile",
    "https://www.instagram.com/hargile_tech_studio/",
    "https://github.com/HARGILE-tech-studio",
];

/* Topics the homepage actually sells — the three hero capability cards plus the
   MVP-in-a-month offer. Deliberately not read from the message files: these are
   stable topic names for a knowledge graph, not marketing copy that gets
   reworded. If the hero cards change what they promise, change these too;
   a claim the copy doesn't support is the thing engines discount. */
const KNOWS_ABOUT = [
    "Web development",
    "Custom web application development",
    "AI integration",
    "Search engine optimization",
    "MVP development",
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
            /* ProfessionalService is a LocalBusiness subtype — it corroborates the
               "Développeur de logiciels" category on the Google Business Profile. */
            "@type": ["Organization", "ProfessionalService"],
            "@id": `${SITE_URL}/#organization`,
            name: globalT("siteName"),
            /* The GBP, the GitHub org and Instagram all say "Tech Studio"; the bare
               "HARGILE" is the outlier across our own properties. alternateName
               resolves both strings to this one entity instead of two competing ones. */
            alternateName: "HARGILE Tech Studio",
            description: globalT("defaultDescription"),
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: imageUrl,
                width: 1200,
                height: 630,
            },
            /* Same asset as the logo, but a distinct property: Google reads `logo`
               as the mark and `image` as what represents the entity in a knowledge
               panel. Recommended once the type includes a LocalBusiness subtype.
               Deliberately no `priceRange` — the site publishes no prices, and
               inventing a "€€" would be a claim nothing on the site supports. */
            image: imageUrl,
            /* NAP mirrors the footer and navbar character for character — engines
               cross-check the copy against the structured data, so a mismatch here
               is worse than an absent field. Single source: @/lib/nap. */
            address: {
                "@type": "PostalAddress",
                streetAddress: NAP.street,
                postalCode: NAP.postalCode,
                addressLocality: NAP.locality,
                addressRegion: NAP.region,
                addressCountry: NAP.countryCode,
            },
            email: NAP.email,
            telephone: NAP.phone,
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: NAP.email,
                telephone: NAP.phone,
                availableLanguage: ["fr", "en"],
            },
            areaServed: {"@type": "Country", "name": "Belgium"},
            foundingDate: "2025",
            knowsAbout: KNOWS_ABOUT,
            sameAs: SAME_AS,
            /* No identifier / vatID / taxID, deliberately. HARGILE has no company
               number of its own — 0896.755.397 belongs to Productions Associées
               ASBL, and asserting it here would point this entity at a different
               organisation. No self-asserted aggregateRating either. */
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
