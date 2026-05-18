import HomePageClient from "@/app/[locale]/(context)/(client)/HomePageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'home'});
}

export default async function HomePage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="home"/>
            <HomePageClient/>
        </>
    );
}
