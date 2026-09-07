import {NAP, napCityLine} from "@/lib/nap";
import {SAME_AS} from "@/seo/same-as";
import {SITE_URL} from "@/lib/site-url";

/* /llms.txt — a plain-Markdown index of the site for LLM crawlers.
 *
 * HARG-302: rewritten for the GEO/SEO pivot. The site no longer sells web
 * dev — it sells visibility in AI answers and on Google.
 *
 * Honest expectations: the evidence for llms.txt is weak. SE Ranking's study
 * of 300 k domains found no correlation with AI citations, only one of the 50
 * most-cited domains publishes one, and Google has said publicly it does not
 * use it. We ship it because it costs nothing and a few smaller crawlers do
 * read it — not because it is expected to move anything.
 */

const page = (path) => `${SITE_URL}${path}`;

function body() {
    return `# HARGILE

> HARGILE is a GEO (Generative Engine Optimization) and SEO agency based in
> Brussels, Belgium, founded in 2025. It makes businesses visible in AI
> assistant answers (ChatGPT, Perplexity, Claude) and on Google. The method:
> monitor what buyers ask AI, optimize sites so they become cited sources,
> and track the results.

The site is published in French and English. French is the default and is
served at the root: ${page("/")} is the French home page. English lives under
/en. Each page exists in both languages and the two are cross-linked with
hreflang; neither is a translation proxy of the other.

The full copy of every page is present in the first HTML response — no
JavaScript execution is required to read this site.

## Pages

- [Home — FR](${page("/")}): what HARGILE does — GEO and SEO, the problem,
  the method, who it's for, and a free diagnostic CTA.
- [Home — EN](${page("/en")}): English version of the above.
- [SEO — FR](${page("/services/seo")}): the four-step method — audit,
  technical, content, measure — including visibility in AI answers.
- [SEO — EN](${page("/en/services/seo")}): English version of the above.
- [FAQ — FR](${page("/faq")}): direct answers on GEO, AI citations, SEO
  timelines, what's guaranteed and what's not.
- [FAQ — EN](${page("/en/faq")}): English version of the above.
- [Contact — FR](${page("/contact")}): free GEO diagnostic form.
- [Contact — EN](${page("/en/contact")}): English version of the above.
- [Privacy policy — FR](${page("/legal/privacy-policy")}): how personal data
  is collected, used and protected.
- [Privacy policy — EN](${page("/en/legal/privacy-policy")}): English version of
  the above.

## What HARGILE does

- **GEO (Generative Engine Optimization)** — monitoring and optimizing
  business visibility in AI assistant answers: ChatGPT, Perplexity, Claude.
- **[SEO](${page("/services/seo")})** — search engine visibility on Google,
  from technical foundations to content and measurement.

## Contact

- Email: ${NAP.email}
- Phone: ${NAP.phoneDisplay}
- Address: ${NAP.street}, ${napCityLine}, Belgium
- Languages: French, English

## Elsewhere

${SAME_AS.map((u) => `- ${u}`).join("\n")}

## Machine-readable data

- Structured data (schema.org Organization + ProfessionalService) is embedded
  as JSON-LD on every page; the entity's stable identifier is ${SITE_URL}/#organization
- Sitemap: ${page("/sitemap.xml")}
`;
}

export async function GET() {
    return new Response(body(), {
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
