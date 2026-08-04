import FaqPageClient from "@/app/[locale]/(context)/(client)/faq/FaqPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'faq'});
}

export default async function FaqPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="faq"/>
            <FaqPageClient/>
        </>
    );
}
