import ServiceIaClient from "@/app/[locale]/(context)/(client)/services/ia/ServiceIaClient";
import IaOffreSection from "@/components/pages/services/v2/ia/ia-offre-section";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'services.ia'});
}

export default async function ServiceIaPage({params}) {
    /* The hero stays a client component (WebGL backdrop); the body below is a
       Server Component, so it is mounted here rather than inside
       ServiceIaClient — everything it renders ships in the initial HTML. */
    const {locale} = await params;

    return (
        <>
            <JsonLdForPage params={params} pagePath="services.ia"/>
            <ServiceIaClient/>
            <IaOffreSection locale={locale}/>
            {/* Same closing band as the four other service pages, mounted at
                page level for the same reason they do it. */}
            <CtaBand/>
        </>
    );
}
