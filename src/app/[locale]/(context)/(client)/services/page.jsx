import ServicesPageClient from "@/app/[locale]/(context)/(client)/services/ServicePAgeClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'services'});
}


export default async function ServicesPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="services"/>
            <ServicesPageClient/>
        </>
    );
}
