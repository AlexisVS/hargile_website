import {getTranslations} from "next-intl/server";
import {SITE_URL} from "@/lib/site-url";
import {localeUrl} from "@/seo/locale-url";
import {NAP} from "@/lib/nap";
import {ROUTES} from "@/seo/routes";
import {SAME_AS} from "@/seo/same-as";

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

/* The four service pages carry a Service node *alongside* their WebPage node
   (see the schemaType comment below — never in its place). serviceType values
   are copied character for character from KNOWS_ABOUT: the same topic asserted
   twice is corroboration, two near-identical strings are two topics. */
const SERVICE_NODES = {
    "services.web": {serviceType: "Custom web application development"},
    "services.ia": {serviceType: "AI integration"},
    "services.seo": {serviceType: "Search engine optimization"},
    "services.mvp": {serviceType: "MVP development"},
};

/* The four offers as /services lists them, in the sales order the page renders
   (offers-index.jsx OFFERS) — position in the ItemList has to match what a
   reader sees, or the markup describes a different page. Keys index both
   ROUTES and pages.services.index.offers, so the listed name is the visible
   row title rather than a fifth restatement of it. */
const SERVICES_INDEX = ["web", "ia", "seo", "mvp"];

// Builds the JSON-LD object for a given locale + pagePath.
// Returns null if SEO translations cannot be loaded (graceful fallback).
export async function buildJsonLd({locale, pagePath}) {
    try {
        const globalT = await getTranslations({locale, namespace: "seo.global"});
        const pageT = await getTranslations({locale, namespace: `seo.pages.${pagePath}`});

        /* French unprefixed, English /en — localeUrl owns that rule. Note this
           changes each page's @id on migration day: the page entity is reissued
           under its new URL, which is the point — the 301 from the old /fr URL
           tells engines the two are the same page. */
        const pathSuffix = ROUTES[pagePath] ?? `/${pagePath.replaceAll(".", "/")}`;
        const baseUrl = localeUrl(locale, pathSuffix);
        const imageUrl = `${SITE_URL}/images/brand/brand_large.png`;

        /* Per-page type, read from the message files so it can differ per page.
           It must always be WebPage or one of its subtypes (ContactPage,
           AboutPage, CollectionPage, FAQPage…): this node is a *page*, and the
           `isPartOf` below points it at the site-level WebSite node. The home
           page used to declare `WebSite` here, which published a WebSite that
           was part of another WebSite — two competing site entities instead of
           one site plus N pages, and page properties (breadcrumb,
           datePublished) with nothing to attach to. Never put a non-page type
           here; a Service or SoftwareApplication belongs in its own node
           alongside this one, not in its place. */
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

        const pageNode = {
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

        /* A FAQPage without its questions is legal markup and a useless
           signal. mainEntity is read from the same pages.faq.items the
           visible accordion renders, so the structured data cannot drift
           from the copy — Google treats a mismatch as spam. */
        if (pagePath === "faq") {
            const faqT = await getTranslations({locale, namespace: "pages.faq"});
            pageNode.mainEntity = faqT.raw("items").map(({q, a}) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: {"@type": "Answer", text: a},
            }));
        }

        /* A CollectionPage that collects nothing is the same dead markup as a
           FAQPage without its questions: /services declared the type but never
           said what it indexed, so the hub and the four Service nodes it links
           to were four unrelated pages to a crawler. The ItemList is the join.
           Names come from the visible row titles, URLs from ROUTES — both
           already single-sourced, so this cannot drift from the page. */
        if (pagePath === "services") {
            const offersT = await getTranslations({locale, namespace: "pages.services.index.offers"});
            pageNode.mainEntity = {
                "@type": "ItemList",
                itemListOrder: "https://schema.org/ItemListOrderAscending",
                numberOfItems: SERVICES_INDEX.length,
                itemListElement: SERVICES_INDEX.map((key, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: offersT(`${key}.title`),
                    url: localeUrl(locale, ROUTES[`services.${key}`]),
                })),
            };
        }

        const extraNodes = [];
        const service = SERVICE_NODES[pagePath];
        if (service) {
            const serviceNode = {
                "@type": "Service",
                /* Locale-independent @id, like #organization: the fr and en
                   pages describe one service, not two. */
                "@id": `${SITE_URL}${ROUTES[pagePath]}#service`,
                name: pageT("title"),
                description: pageT("description"),
                url: baseUrl,
                serviceType: service.serviceType,
                provider: {"@id": `${SITE_URL}/#organization`},
                areaServed: {"@type": "Country", name: "Belgium"},
                /* No offers/price: the site publishes no amounts — same
                   doctrine as the absent priceRange on the Organization. */
            };
            pageNode.mainEntity = {"@id": serviceNode["@id"]};
            extraNodes.push(serviceNode);
        }

        /* Existing pages keep the flat single-node shape byte for byte;
           only pages with a companion node switch to @graph (the validator
           recurses into both). */
        return extraNodes.length
            ? {"@context": "https://schema.org", "@graph": [pageNode, ...extraNodes]}
            : {"@context": "https://schema.org", ...pageNode};
    } catch {
        return null;
    }
}
