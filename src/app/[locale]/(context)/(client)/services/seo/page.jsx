import ServiceSeoClient from "@/app/[locale]/(context)/(client)/services/seo/ServiceSeoClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'services.seo'});
}

export default async function ServiceSeoPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="services.seo"/>
            <ServiceSeoClient/>
        </>
    );
}
