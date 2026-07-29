# GEO 1.1 — Organization entity, execution plan

> Written 2026-07-29. Expands `docs/geo-plan.md` §1.1 into something executable
> in one session. **Not started.**
>
> Why this one first: it is the best effort-to-impact ratio in phase 1 (ENG-74
> calls M3 "meilleur rapport effet/coût"), it is self-contained in this repo,
> and the data mostly already exists on the site — it just isn't in the schema.
>
> ⛔ **Blocked on five answers from Mihai** (below). Three of them cannot be
> guessed, and one of them is actively dangerous to guess wrong.

## What ships today — verified in production 2026-07-29

The `#organization` node in `src/seo/build-json-ld.js:35-47` carries exactly
four things:

```json
{"@type": "Organization", "@id": "…/#organization",
 "name": "…", "url": "…", "logo": {…}, "sameAs": [3 profiles]}
```

No `address`, no `telephone`, no `email`, no `contactPoint`, no `areaServed`,
no `knowsAbout`, no `foundingDate`, no `ProfessionalService` type. Confirmed by
grepping the live `/fr` HTML: the only entity fields present are `@type` and
`sameAs`.

Meanwhile the site already publishes all of it in plain text:

| datum | where it lives now |
|---|---|
| Rue Sterckx 5, bt. 28 · 1060 Saint-Gilles · Belgique | `fr.json` `footer.address.line1-3` |
| +32 477 04 50 80 (`tel:+32477045080`) | **hardcoded** in `navbar.jsx:145-146` |
| contact@hargile.com | `Footer.jsx:87`, `navbar.jsx:142` |
| LinkedIn / Instagram / GitHub | `SAME_AS` in `build-json-ld.js:7-11` |

The whole point of this item is that engines cross-check the NAP they read in
the copy against the NAP in the structured data. Right now there is nothing to
cross-check against.

## ⛔ Answer these first

### Q1 — Which address is the business address? *(blocking)*

The site publishes **two different ones, on the same page**:

- **Rue Sterckx 5, bt. 28 · 1060 Saint-Gilles** — the footer, presented as
  HARGILE's address.
- **Rue Coenraets 72 · 1060 Bruxelles** — the privacy policy, as
  "Productions Associées ASBL", because *"HARGILE exerçant son activité via
  SMART"*.

Both are in the `/fr` HTML right now. That is a NAP conflict a crawler can see
without leaving the page, and it is the single biggest thing undermining entity
confidence — worse than the missing schema.

Which one goes in `address`? (Usual answer: the place you actually work from,
i.e. Sterckx — but this is a real-world question, not a code one.)

### Q2 — The BCE number *(blocking, and do not guess)*

The privacy policy carries **BCE 0896.755.397**, which belongs to **Productions
Associées ASBL**, not to HARGILE.

**Do not put it on the HARGILE entity as `vatID`/`taxID`/`identifier`.** A
company number is the strongest cross-checkable identifier there is; attaching
someone else's would tie your entity to a different organisation in every
system that reads it, and it is far harder to undo than to avoid.

Question: does HARGILE have its own BCE/VAT number? If yes it is a high-value
field. If no — if HARGILE is a trading name operating under SMART — then we
omit the identifier entirely and that is the correct outcome, not a gap.

### Q3 — Is `@hargile_agency` alive?

`seo.global.twitterHandle` ships `@hargile_agency` in both locales, but X is not
in `SAME_AS`. Either it is live and belongs in `sameAs`, or it is dead and the
handle should be deleted from `src/messages/*.json`. A handle pointing at
nothing is a broken corroboration signal.

### Q4 — `foundingDate`?

Year is enough (`"2023"`). Omit if uncertain — a wrong date is worse than none.

### Q5 — `areaServed`

`"BE"`, Benelux, or EU? Should reflect where you actually take clients, and it
should not contradict what the copy says.

## The drift problem — fix it while we're here

The NAP currently has **three independent sources**: `fr.json`/`en.json` for the
address, a hardcoded string in `navbar.jsx` for the phone, and (after this work)
a third copy in the JSON-LD builder. Three copies of a value whose *entire
purpose is to be identical everywhere* will drift, and drift here is exactly the
failure mode this item exists to prevent.

**Proposal:** one module, e.g. `src/lib/nap.js`, exporting the canonical
address / phone / email, consumed by the footer, the navbar and
`build-json-ld.js`. Locale-independent (a street address is not translated;
only "Belgique"/"Belgium" is, and that can stay in messages).

This is a small refactor and it is what makes the item durable rather than a
one-off edit.

## The change

`src/seo/build-json-ld.js`, extending the existing `organization` object.
**Keep `@id` exactly as it is** (`${SITE_URL}/#organization`) — that identifier
is what merges the fr and en pages into one entity for Google. Changing it
creates a second entity and discards whatever trust the current one has.

```js
const organization = {
  "@type": ["Organization", "ProfessionalService"],  // LocalBusiness subtype
  "@id": `${SITE_URL}/#organization`,                // UNCHANGED
  name, url, logo, sameAs,                           // as today
  description: globalT("defaultDescription"),        // already translated
  address: {
    "@type": "PostalAddress",
    streetAddress: NAP.street,
    postalCode: NAP.postalCode,
    addressLocality: NAP.locality,
    addressRegion: "Brussels",
    addressCountry: "BE",
  },
  email: NAP.email,
  telephone: NAP.phone,                              // E.164: +32477045080
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: NAP.email,
    telephone: NAP.phone,
    availableLanguage: ["fr", "en"],
  },
  areaServed: /* Q5 */,
  knowsAbout: [/* from the hero capability cards — keep them in sync */],
  // foundingDate: Q4 · identifier/vatID: only if Q2 says HARGILE has its own
};
```

`knowsAbout` should mirror what the homepage actually sells (the three hero
capability cards: web development, AI solutions, SEO — plus the MVP-in-a-month
offer). Claims in schema that the copy doesn't support are the thing engines
punish.

**Scope guard:** touch the `organization` node and the NAP module only. Do not
restructure the page-level nodes, do not touch `schemaType`, do not add
`Service` or `FAQPage` nodes — those belong to phase 2, when the pages that
justify them exist.

## Verification

1. `npm run build && npm run start`, then read the JSON-LD out of the raw HTML
   for `/fr` **and** `/en` — this must survive the no-JS path like everything
   else GEO-related.
2. **Google Rich Results Test** and the **schema.org validator** on both
   locales. Zero errors; warnings are acceptable if understood.
3. Confirm `@id` is byte-identical to what production serves today.
4. **NAP consistency check** — the address, phone and email in the rendered
   footer/navbar must match the schema character for character. That is the
   whole point; a mismatch here is a worse outcome than not shipping.
5. Whatever Q1 resolves to, make the privacy-policy address stop reading as a
   second HARGILE address — even a clarifying clause ("entité juridique :
   Productions Associées ASBL") is enough. Two addresses on one page is the
   defect.

## Out of scope, deliberately

- `LocalBusiness` opening hours / geo coordinates — needs a real decision about
  whether you receive clients at an address.
- `Service` nodes and `FAQPage` — phase 2, once `/services` and an FAQ exist.
  Today `/fr/services` is a 308 and `/fr/about-us` a 307.
- Reviews / `aggregateRating` — must never be self-asserted.

## Effort

Half a day once Q1–Q5 are answered, including the NAP module and verification.
The answers are the long pole, not the code.
