import {generatePageMetadata} from "@/seo/generate-page-metadata"
import HtmlSitemap from "@/components/SEO/HTMLSitemap";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'sitemap'})
}

export default function SitemapPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="sitemap"/>
            <HtmlSitemap/>
        </>
    );
}
