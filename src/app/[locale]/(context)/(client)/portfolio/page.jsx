import PortfolioPageClient from "@/app/[locale]/(context)/(client)/portfolio/PortfolioPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'portfolio'});
}

export default async function PortfolioPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="portfolio"/>
            <PortfolioPageClient/>
        </>
    );
}
