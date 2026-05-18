import JsonLd from "@/components/seo/JsonLd";
import {buildJsonLd} from "@/seo/build-json-ld";

// Server Component — looks up the locale + page-specific JSON-LD and
// renders it as an inline <script type="application/ld+json"> tag.
// Render at the top of each page.jsx alongside the page's client component.
export default async function JsonLdForPage({params, pagePath}) {
    const {locale} = await params;
    const data = await buildJsonLd({locale, pagePath});
    if (!data) return null;
    return <JsonLd data={data} />;
}
