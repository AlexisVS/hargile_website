import ServiceWebClient from "@/app/[locale]/(context)/(client)/services/applications-web/ServiceWebClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'services.web'});
}

export default async function ServiceWebPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="services.web"/>
            <ServiceWebClient/>
        </>
    );
}
