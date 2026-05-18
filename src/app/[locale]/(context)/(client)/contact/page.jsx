import ContactPageClient from "@/app/[locale]/(context)/(client)/contact/ContactPageClient";
import {generatePageMetadata} from "@/seo/generate-page-metadata";
import JsonLdForPage from "@/components/seo/JsonLdForPage";

export async function generateMetadata({params}) {
    return generatePageMetadata({params, pagePath: 'contact'});
}

export default async function ContactPage({params}) {
    return (
        <>
            <JsonLdForPage params={params} pagePath="contact"/>
            <ContactPageClient/>
        </>
    );
}
