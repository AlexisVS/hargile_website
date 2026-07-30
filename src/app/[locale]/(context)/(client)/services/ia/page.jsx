import ServiceIaClient from "@/app/[locale]/(context)/(client)/services/ia/ServiceIaClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'services.ia'});
}

export default async function ServiceIaPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="services.ia"/>
            <ServiceIaClient/>
        </>
    );
}
