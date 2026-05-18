// Server Component — renders a JSON-LD <script> tag inline.
// Doc: https://nextjs.org/docs/app/getting-started/metadata-and-og-images#json-ld
export default function JsonLd({data}) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
        />
    );
}
