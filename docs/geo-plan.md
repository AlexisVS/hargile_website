# GEO plan — getting HARGILE cited by AI answer engines

> Written 2026-07-28 from a codebase audit, a raw-HTML fetch of `hargile.com`
> (no JS executed — exactly what AI crawlers see), and current GEO research.
> Not yet implemented — this is the execution plan.
>
> GEO (Generative Engine Optimization) = being retrieved, cited and
> recommended by ChatGPT, Perplexity, Google AI Overviews, Claude and Copilot
> when someone asks e.g. *"best web agency in Brussels"*, *"agence web pour
> PME"*, *"how much does a custom web app cost in Belgium"*, *"who can build
> an MVP in 30 days"*. AI referrals are still small (~0.9 % of web referral
> traffic, March 2026, but 5× year-over-year) — the value is being **the**
> recommended answer on high-intent commercial queries, not raw volume.

## Reconciliation with ENG-74

This doc is the implementation/file-level companion to **ENG-74** (Charles's
5-milestone plan). Same diagnosis, reached independently. Milestone ↔ phase map:

| ENG-74 | This doc |
| --- | --- |
| **M1** Diagnostic & baseline (20 prompts, 5 engines, bot logs) | Phase 4 — run it *first*, before shipping content |
| **M2** Crawler access (robots allow-list, WAF test, sitemap, IndexNow) | Phase 1.3–1.4 |
| **M3** Coherent entity (one canonical description everywhere, one GitHub org) | Phase 1.1 + Phase 3 |
| **M4** Content surface (service pages, FAQ, `/realisations/`) | Phase 2 |
| **M5** Structure, freshness & re-measure (schema, visible dates, footer year) | Phase 1.5 + Phase 2 principle + Phase 4 |

Three findings adopted from ENG-74, folded into the phases below:

- **Entity coherence is its own lever (M3).** Beyond enriching the schema (1.1),
  write one canonical 2-3 sentence factual description (legal name, city, year,
  headcount, tech, client sectors) and publish it *verbatim* on site, LinkedIn,
  Clutch, GitHub, Google Business Profile and directories. Consolidate to a
  single active GitHub org (archive/redirect the other). The engine won't cite
  an entity it can't build stably.
- ~~**Footer year is stale (2025).**~~ ✅ Réglé, non encore taggué. La cause exacte
  méritait d'être notée : le `useState` était **seedé** à 2025 et corrigé dans
  un effet, donc seul un navigateur voyait la bonne année. Le HTML brut — la
  seule chose que lisent les crawlers IA, aucun n'exécutant de JS — annonçait
  2025 indéfiniment. Le seed vient maintenant de `NEXT_PUBLIC_BUILD_YEAR`,
  inliné au build par `next.config.mjs`.
- **40-60 word standalone answer rule (M4).** Stronger than "first two
  sentences": every new page opens with a self-contained 40-60 word answer to
  its target question, *before any visual element*, and carries no unverifiable
  claim at the top. This is the extraction unit an engine lifts.

---

## Baseline — what AI engines see today

**Verified working (do not break):**

- The raw HTML **does** contain the copy. Fetching `hargile.com` without JS
  returns the h1 ("We develop custom web applications for SMEs"), the service
  blurbs, the MVP-in-30-days offer, the values, the case-study names and the
  full footer NAP (Rue Sterckx 5, bt. 28, 1060 Saint-Gilles ·
  contact@hargile.com · +32 477 04 50 80). App Router SSRs `"use client"`
  components, so the client-heavy architecture is *not* the blocker it looks
  like. This matters because **no major AI crawler executes JavaScript**
  (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Meta-ExternalAgent all
  read the first HTML response only; Gemini is the lone exception via
  Googlebot's rendering service).
- `robots.txt` allows `*` — every AI crawler is permitted. No Cloudflare-style
  default blocking in the way. (Il est généré par `next-sitemap.config.js`.
  `src/app/robots.js` a existé et **n'a jamais rien servi** — un fichier de
  `public/` masque une route App Router du même chemin ; la route est
  supprimée.) Confirmé le 2026-07-29 en envoyant les vrais user-agents :
  bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot et
  meta-externalagent reçoivent tous un 200 et le même texte.
- JSON-LD on every page (`src/seo/build-json-ld.js` → Organization + per-page
  type), per-page metadata (`src/seo/generate-page-metadata.js`), sitemap with
  correct hreflang (`next-sitemap.config.js`).

**The actual gaps, in order of impact:**

1. **Only 3 indexable URLs** — `/`, `/contact`, `/legal/privacy-policy`.
   `/services`, `/about-us`, `/solutions/*` all 301/307 to `/`
   (`next.config.mjs:58-82`). AI engines cite *specific pages that answer
   specific questions*; a one-page site can only ever be cited for one thing.
   This is the dominant gap — everything else is tuning.
2. **No answer-shaped content** — no FAQ, no case-study pages, no articles,
   no page that opens with a direct answer to a question a prospect asks an AI.
3. **Thin entity data** — the Organization schema has name/logo/sameAs but no
   address, phone, email, founding info, areaServed or service list, and there
   is no LocalBusiness/ProfessionalService type. The About page (the classic
   entity page) is a 307 to `/`.
4. **Off-site corroboration unknown/thin** — LLMs recommend agencies from
   directories, reviews and roundups where brands appear *alongside
   competitors* (Sortlist, Clutch, Google Business Profile), and they check
   agreement across independent sources before naming a brand.
5. **Bing status unverified** — ChatGPT Search retrieves from the **Bing
   index**; a page Bing hasn't indexed cannot appear in a ChatGPT answer,
   regardless of Google rankings.
6. **Config hygiene** — `src/i18n/routing.js` says `defaultLocale: 'en'`
   (and the root really serves English), but the sitemap and
   `shared-metadata.js` declare `fr` as x-default. Conflicting signals.
   **Resolved:** default is `fr` (decision 2026-07-28) — see §1.2.
7. ~~`llms.txt` missing~~ — ✅ livré (non encore taggué), avec les mêmes attentes
   nulles qu'annoncé (SE Ranking, 300 k domaines : **aucune corrélation**
   avec les citations IA ; 1 seul des 50 domaines les plus cités en publie
   un ; Google déclare ne pas s'en servir). Fait parce que c'est trivial, pas
   parce que ça change quelque chose.

---

## Phase 1 — Technical floor (this repo, ~1 day)

### 1.1 Enrich the Organization entity · `src/seo/build-json-ld.js`

> 📄 **Execution plan: `docs/geo-entity-plan.md`** (written 2026-07-29) — scoped
> to one session, with the exact diff shape and verification. It is **blocked on
> five answers**, two of which this section did not anticipate: the site
> publishes **two different addresses** (footer = Rue Sterckx 5, Saint-Gilles;
> privacy policy = Rue Coenraets 72, Bruxelles, "via SMART"), both in the same
> HTML; and **BCE 0896.755.397 belongs to Productions Associées ASBL, not to
> HARGILE** — it must not be attached to this entity as an identifier.

Extend the existing `#organization` node (keep the `@id` stable):

- `@type: ["Organization", "ProfessionalService"]` — the second type is a
  LocalBusiness subtype and unlocks local/entity fields.
- `address`: `PostalAddress` — streetAddress "Rue Sterckx 5, bt. 28",
  postalCode "1060", addressLocality "Saint-Gilles", addressRegion
  "Brussels", addressCountry "BE" (matches the footer verbatim — NAP
  consistency is the point).
- `email: "contact@hargile.com"`, `telephone: "+32 477 04 50 80"`,
  `contactPoint` with `availableLanguage: ["fr", "en"]`.
- `areaServed: "BE"` (or Benelux/EU if that's the real market),
  `knowsAbout: ["custom web development", "AI solutions", "SEO",
  "MVP development"]`, `slogan`, short `description` per locale.
- `foundingDate` if the team confirms it.
- Verify the X/Twitter situation: messages ship
  `seo.global.twitterHandle: @hargile_agency` but X is not in `sameAs`. If
  the account is dead, delete the handle from `src/messages/*.json`; if
  alive, add it to `SAME_AS`.

### 1.2 Resolve the default-locale contradiction — ⚠️ SCOPED, DEFERRED

> 📄 **Cadrage : `docs/geo-default-locale-plan.md`** (2026-07-29). Lire ça avant
> de toucher quoi que ce soit ici : la description ci-dessous est **fausse sur
> un point décisif**. `localePrefix` n'est lu que par `createNavigation` et par
> le middleware de next-intl, **qui n'est pas utilisé** — le routage de locale
> est fait à la main dans `src/proxy.js`. Poser `as-needed` ferait générer des
> `href` non préfixés que `proxy.js` redirigerait aussitôt : une redirection de
> plus à chaque navigation interne, pour en supprimer une sur l'apex.
> Ce n'est pas un flip de config, c'est une réécriture de `proxy.js` plus six
> fichiers de construction d'URL, dans un seul déploiement.
> **Décision : reporter, et le faire en même temps que la phase 2**, quand
> l'espace d'URL change de toute façon — une seule vague de réindexation.
>
> La partie « decision » ci-dessous est en revanche déjà appliquée :
> `defaultLocale: 'fr'` est posé et cohérent partout. Il ne reste que la
> suppression du préfixe, qui est l'opération risquée.

**DECISION (2026-07-28): `fr` is the default locale.** Rationale: HARGILE's
clients are almost all French-speaking, so French is the primary market and
should be the canonical/x-default surface. This is also what the sitemap and
metadata builders already declare — only `routing.js` was out of step.

Action: set `defaultLocale: 'fr'` in `src/i18n/routing.js`;
`next-sitemap.config.js` (`DEFAULT_LOCALE: 'fr'`) and the x-default in
`shared-metadata.js` / `generate-page-metadata.js` already match — verify, no
change expected.

Behavioural implication to verify (this is *not* zero-churn): today the bare
root serves English (`html lang="en"`). With `fr` as default and next-intl's
`localePrefix` in as-needed mode, `/` will serve French and English moves to
`/en`. Confirm `localePrefix` behaviour, check for hardcoded `/`→en
assumptions in links/redirects, and make sure the canonical of `/` points to
the French URL. Sanity-check the homepage still renders and the loader/hero
mount correctly under the flipped default before shipping.

### 1.3 Bing Webmaster Tools + IndexNow — 🟡 code livré, manuel en attente

> 📄 **Mode d'emploi : `docs/geo-bing-indexnow-runbook.md`** (2026-07-29).

Tout le code est livré (non encore taggué) : clé IndexNow dans `public/`, script de
soumission `npm run seo:indexnow`, `robots.txt` ramené à une seule source qui
sert réellement. Vérifié au passage — **aucun crawler IA n'est bloqué** :
bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot et
meta-externalagent reçoivent tous un 200 et exactement le même texte qu'un
curl normal. Le point « WAF test » d'ENG-74 M2 est donc répondu.

Reste **la partie navigateur, qui n'appartient qu'à Mihai** : vérifier la
propriété dans Bing Webmaster Tools (import Search Console = un clic),
soumettre `sitemap.xml`, inspecter les 6 URLs, puis lancer `npm run
seo:indexnow` une fois le déploiement confirmé. Le livrable est de **savoir**
si Bing indexe ce site — personne ne l'a jamais regardé, et sans index Bing il
n'y a pas de citation ChatGPT possible.

### 1.4 llms.txt — ✅ LIVRÉ (non encore taggué)

Servi à `/llms.txt`, généré par `src/app/llms.txt/route.js` — une route et non
un fichier statique, pour que le NAP et les profils viennent de `@/lib/nap` et
`@/seo/same-as` au lieu d'une quatrième copie littérale de l'adresse.
Attentes toujours nulles : c'est fait, ça ne mérite plus de temps.

### 1.5 Guardrail — keep copy in the first HTML response

Add to the release checklist (and to Phase 2 page reviews):
`curl -s https://hargile.com/en | grep "<h1"` -style spot checks — every new
page's headline and body must be present without JS. Concretely: never load
text content via `next/dynamic({ssr: false})` or behind a mount effect;
that's fine for the WebGL backdrops, never for copy. The perf plan's §1.2
(CSS-only hero reveals) also removes the `opacity:0` inline state from the
SSR HTML — do it; it helps both scores.

---

## Phase 2 — Build the citable surface (the core work, iterative)

The principle everywhere: **one page = one question answered**. Question as
h2, direct answer in the first two sentences, self-contained sections an
assistant can lift whole, specifics (numbers, prices, durations, names) over
adjectives, visible "Last updated" dates, `dateModified` in schema. Perplexity
explicitly weights content updated within the last year.

### 2.1 Reopen `/services` as real pages

One route per offer, both locales — the four the homepage already sells:

- `/services/web-development` — custom web apps for SMEs
- `/services/ai-solutions`
- `/services/seo` ("your visibility, automated")
- `/services/mvp` — the 30-days / fixed-price offer is the single most
  citable claim on the site; give it its own URL with scope, process,
  price anchor, timeline, FAQ.

Each page: `Service` JSON-LD (provider → `#organization`, areaServed,
offers), a 4-6 question FAQ block with `FAQPage` JSON-LD, and answer-first
copy. Mechanics: remove the 301s in `next.config.mjs`, add routes under
`src/app/[locale]/(context)/(client)/services/`, register paths in
`src/seo/routes.js`, add entries + hreflang to `PAGES` in
`next-sitemap.config.js`, add `seo.pages.services.*` metadata per page in
`src/messages/{en,fr}.json`. Extend `build-json-ld.js` to compose
Service/FAQPage from message keys.

### 2.2 Reinstate `/about-us` — the entity page

Company story, founding year, team (named people = E-E-A-T), the
Saint-Gilles address, how the studio works, the SMART/Productions Associées
legal frame if they're comfortable stating it. `AboutPage` schema already
exists in messages — route it. This is the page AI engines use to
disambiguate *who HARGILE is* (the unique brand name is an asset: no
competition for the entity).

### 2.3 Case-study pages

The three projects already named on the homepage — Ecole du Bonheur,
La Marquisette, VENIZI — each get a page: client, problem, what was built,
stack, measurable outcome (numbers make citations). `Article` or
`CreativeWork` schema with author + dates. Replaces the current external
`portfolio.hargile.com` 301 as the canonical proof-of-work surface (keep the
external portfolio, but the *citable* versions live on hargile.com).

### 2.4 FAQ page targeting real AI prompts

`/faq` (or FAQ sections distributed on service pages — pick one, avoid
duplicating the same Q/A markup on multiple URLs). Source questions from
what prospects actually ask: cost of a custom web app in Belgium, build vs
no-code, timeline for an MVP, what happens after delivery ("your code, your
data"), maintenance. French versions matter as much as English — French AI
query space is far less competitive.

### 2.5 Ongoing content (decide capacity honestly)

1-2 answer-shaped articles per month beats a launch burst that goes stale:
comparisons ("custom development vs WordPress for SMEs"), process
explainers, and — the strongest citation magnet available here —
**original data from the `/audit` tool**: aggregate anonymized stats
("we audited N Belgian SME sites; X % fail Core Web Vitals") is exactly the
kind of proprietary statistic LLMs cite. Refresh existing pages quarterly
and bump the visible + schema dates.

---

## Phase 3 — Off-site corroboration (not code, ongoing)

AI engines favor earned, third-party evidence over anything on your own
domain, and they recommend agencies from lists where brands appear alongside
competitors. In rough order of leverage for a Belgian studio:

1. **Sortlist** (Belgian, dominant for "agence web Bruxelles"-type queries),
   **Clutch**, **DesignRush**, **GoodFirms** — complete profiles, identical
   NAP + description everywhere.
2. **Google Business Profile** for the Saint-Gilles address + client reviews
   (Google reviews feed both AI Overviews and local answers). Ask the three
   case-study clients first.
3. **LinkedIn company page** completeness (it's already in `sameAs`);
   GitHub org profile README for `HARGILE-tech-studio`.
4. **Wikidata** entity for HARGILE (free, factual, feeds knowledge graphs).
   Wikipedia only if real press coverage exists — don't force it.
5. Local tech/business press and podcasts when there's something to say
   (the audit-data report from §2.5 is the natural hook).
6. Every new verified profile gets appended to `SAME_AS` in
   `build-json-ld.js`.

---

## Phase 4 — Measure and iterate

- **Prompt panel, monthly:** ~10 fixed queries (fr + en: "meilleure agence
  web Bruxelles", "agence pour développer une app sur mesure PME", "MVP in
  30 days fixed price", "custom web app development Belgium", …) run across
  ChatGPT, Perplexity, Gemini/AI Overviews and Copilot. Log: mentioned? /
  cited? / which URL? Run a baseline **before** shipping Phase 2 so there's
  a before/after.
- **GA4:** channel group for AI referrals (`chatgpt.com`, `perplexity.ai`,
  `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`).
- **Bot traffic:** watch server/Vercel logs for GPTBot, OAI-SearchBot,
  ClaudeBot, PerplexityBot user agents — crawl activity is the leading
  indicator that pages are being ingested.
- **Bing WMT:** index coverage + queries, same cadence as Search Console.

## Verification (per shipped page)

1. `curl` the production URL — headline and body text present in raw HTML.
2. Validate every JSON-LD block (Rich Results Test / schema.org validator) —
   especially the first FAQPage and Service blocks.
3. `site:hargile.com` on Bing after submission; URL inspection for stragglers.
4. Sitemap regenerated with the new routes + hreflang (`npm run build` runs
   `next-sitemap` postbuild); confirm no redirect entries leak in.
5. Prompt panel re-run ~4-6 weeks after each content wave (AI indexes lag).

## Sources

- [Search Engine Land — Mastering GEO in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [SearchOptimo — Do AI crawlers render JavaScript?](https://searchoptimo.com/blog/do-ai-crawlers-render-javascript) · [Lantern — AI crawlers do not render JS](https://www.asklantern.com/blogs/ai-crawlers-do-not-render-javascript)
- [Parse — Bing rankings drive ChatGPT visibility](https://parse.gl/blog/bing-rankings-chatgpt-visibility) · [Subscribe PR — Bing as the gateway to ChatGPT/Copilot](https://subscribepr.com/blog/how-to-get-indexed-on-bing/)
- [OrganiKPI — llms.txt adoption data](https://organikpi.com/blog/distribution/llms-txt-adoption-impact/) · [AISEOUSA — does llms.txt work (SE Ranking study)](https://aiseousa.com/blog/what-is-llms-txt-does-it-work)
- [AIOSEO — How to get cited by AI search tools](https://aioseo.com/how-to-get-cited-by-ai-search-tools/) · [Growth Marketing Pro — LLM brand recommendations & directories](https://www.growthmarketingpro.com/best-llm-optimization-agencies/)
