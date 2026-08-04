import ServiceMvpClient from "@/app/[locale]/(context)/(client)/services/mvp-30-jours/ServiceMvpClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'services.mvp'});
}

export default async function ServiceMvpPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="services.mvp"/>
            <ServiceMvpClient/>
        </>
    );
}
