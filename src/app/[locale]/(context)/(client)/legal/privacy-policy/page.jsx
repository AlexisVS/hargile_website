import PrivacyPolicyPageClient from "@/app/[locale]/(context)/(client)/legal/privacy-policy/PrivacyPocilyPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'legal.privacy'});
}

export default async function PrivacyPolicyPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="legal.privacy"/>
            <PrivacyPolicyPageClient/>
        </>
    );
}
