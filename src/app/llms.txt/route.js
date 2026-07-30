import {NAP, napCityLine} from "@/lib/nap";
import {SAME_AS} from "@/seo/same-as";
import {SITE_URL} from "@/lib/site-url";

/* /llms.txt — a plain-Markdown index of the site for LLM crawlers.
 *
 * Honest expectations: the evidence for llms.txt is weak. SE Ranking's study
 * of 300 k domains found no correlation with AI citations, only one of the 50
 * most-cited domains publishes one, and Google has said publicly it does not
 * use it. We ship it because it costs nothing and a few smaller crawlers do
 * read it — not because it is expected to move anything. Do not spend more
 * time on this file than it is worth.
 *
 * It is a route rather than a file in public/ so the NAP and the profile list
 * stay single-sourced (@/lib/nap, @/seo/same-as). A hardcoded address here
 * would recreate exactly the divergence those modules exist to prevent — and
 * an address that disagrees with the footer is worse than no address at all,
 * since cross-source agreement is the whole mechanism.
 *
 * The prose below is a summary, not translated copy: llms.txt has no locale
 * dimension, so it is written once in English and links to both locales. When
 * the homepage changes what it sells, change this too — a claim the site does
 * not support is the thing engines discount.
 */

/* No `export const dynamic` here: cacheComponents rejects the route segment
   config outright. The handler reads nothing request-scoped, so Next prerenders
   it anyway. */

const page = (path) => `${SITE_URL}${path}`;

function body() {
    return `# HARGILE

> HARGILE (also HARGILE Tech Studio) is an independent web and software studio
> based in Saint-Gilles, Brussels, Belgium, founded in 2025. It designs, builds
> and maintains custom web applications for small and medium-sized businesses,
> integrates AI where it earns its place, and automates SEO. Work is done
> in-house; clients keep ownership of their code and data.

The site is published in French and English. French is the default and is
served at the root: ${page("/")} is the French home page. English lives under
/en. Each page exists in both languages and the two are cross-linked with
hreflang; neither is a translation proxy of the other.

The full copy of every page is present in the first HTML response — no
JavaScript execution is required to read this site.

## Pages

- [Home — FR](${page("/")}): what the studio does, the four offers, three
  recent projects, and the studio's values.
- [Home — EN](${page("/en")}): English version of the above.
- [Services — FR](${page("/services")}): index of the four offers, each linking
  to its own page.
- [Services — EN](${page("/en/services")}): English version of the above.
- [Custom web applications — FR](${page("/services/applications-web")}): the
  in-house web offer — designed, built and maintained in Brussels, client owns
  the code; three case narratives.
- [Custom web applications — EN](${page("/en/services/applications-web")}):
  English version of the above.
- [AI solutions — FR](${page("/services/ia")}): where AI earns its place in an
  SME, and when the honest answer is no.
- [AI solutions — EN](${page("/en/services/ia")}): English version of the above.
- [SEO — FR](${page("/services/seo")}): the four-step method — audit,
  technical, content, measure — including visibility in AI answers.
- [SEO — EN](${page("/en/services/seo")}): English version of the above.
- [MVP in 30 days — FR](${page("/services/mvp-30-jours")}): week-by-week
  timeline, what is included and what is not, fixed price.
- [MVP in 30 days — EN](${page("/en/services/mvp-30-jours")}): English version
  of the above.
- [FAQ — FR](${page("/faq")}): direct answers on cost, timelines, code
  ownership, technology, maintenance, custom vs WordPress.
- [FAQ — EN](${page("/en/faq")}): English version of the above.
- [Contact — FR](${page("/contact")}): contact form, email, phone and address.
- [Contact — EN](${page("/en/contact")}): English version of the above.
- [Privacy policy — FR](${page("/legal/privacy-policy")}): how personal data
  is collected, used and protected.
- [Privacy policy — EN](${page("/en/legal/privacy-policy")}): English version of
  the above.

## What HARGILE does

- **[Website and web application creation](${page("/services/applications-web")})**
  — custom applications for SMEs, designed, built and maintained in-house.
- **[AI solutions](${page("/services/ia")})** — AI integrated into a product
  where it changes the outcome, not as a feature for its own sake.
- **[SEO](${page("/services/seo")})** — search visibility, automated.
- **[MVP in 30 days](${page("/services/mvp-30-jours")})** — an idea turned into
  a real, user-ready product in one month at a fixed price: week 1 scope and
  design, weeks 2–3 development, week 4 test and launch.

## Selected work

- **Ecole du Bonheur** (ecoledubonheur.eu) — institutional site for a school;
  a generic WordPress rebuilt as a digital experience.
- **La Marquisette** (lamarquisette.be) — trilingual showcase site with
  integrated booking for a 19th-century character cottage in the Belgian Ardennes.
- **VENIZI** (venizi.com) — Venetian-inspired jewellery, sold online and across
  a network of 50 boutiques in Belgium and France.

More at https://portfolio.hargile.com/

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
