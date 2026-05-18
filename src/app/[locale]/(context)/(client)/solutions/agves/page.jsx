import AGVESPageClient from "@/app/[locale]/(context)/(client)/solutions/agves/AGVESPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'solutions.agves'});
}

export default async function AgvesPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="solutions.agves"/>
            <AGVESPageClient/>
        </>
    );
}
