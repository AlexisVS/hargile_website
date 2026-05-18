import MultipassPageClient from "@/app/[locale]/(context)/(client)/solutions/multipass/MultipassPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'solutions.multipass'});
}

export default async function MultipassPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="solutions.multipass"/>
            <MultipassPageClient/>
        </>
    );
}
