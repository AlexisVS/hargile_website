import AboutUsPageClient from "@/app/[locale]/(context)/(client)/about-us/AboutUsPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'about-us'});
}

export default async function AboutUsPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="about-us"/>
            <AboutUsPageClient/>
        </>
    );
}
