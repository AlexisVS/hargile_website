# GEO 1.1 — Organization entity, execution plan

> Written 2026-07-29. Expands `docs/geo-plan.md` §1.1 into something executable
> in one session. **Not started.**
>
> Why this one first: it is the best effort-to-impact ratio in phase 1 (ENG-74
> calls M3 "meilleur rapport effet/coût"), it is self-contained in this repo,
> and the data mostly already exists on the site — it just isn't in the schema.
>
> **Q1, Q2 and Q3 are resolved** (2026-07-29), and the Google Business Profile
> confirms the address from outside the repo. Two one-line answers remain — Q4
> (foundingDate) and Q5 (areaServed) — neither of which blocks starting.

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

## Questions — three resolved, two open

### ✅ Q1 — Business address — **RESOLVED 2026-07-29: Rue Sterckx**

`address` = **Rue Sterckx 5, bt. 28 · 1060 Saint-Gilles · BE**.

Context: the team are **employees of SMART**; HARGILE is a practice, not a
registered company. schema.org `Organization` does not require legal
personality — it describes the thing a client deals with, so the address is
where you actually work from. Rue Coenraets 72 is Productions Associées ASBL's
registered address and stays out of the schema.

**Correction to an earlier claim in this plan:** the two addresses in the `/fr`
HTML were called a NAP conflict. Re-reading the string, the privacy policy says
*"Responsable du traitement : HARGILE (activité menée via SMART) — Productions
Associées ASBL, Rue Coenraets 72…"* — it already attributes that address to the
ASBL rather than to HARGILE. It is a legal disclosure, not a contradiction.
**No copy change is needed.** What matters instead: the schema declares only
Sterckx, and the off-site listings (Google Business Profile, directories) agree
with it. That cross-source agreement is the actual M3 work.

### ✅ Q2 — BCE number — **RESOLVED 2026-07-29: privacy policy yes, schema no**

**Keep it in the privacy policy.** GDPR Art. 13 requires identifying the data
controller; naming Productions Associées ASBL with its address and BCE is
exactly that number doing its job. Nothing to change there.

**Never put it in the schema.** `identifier`/`vatID` on `#organization` asserts
"HARGILE *is* the entity registered as 0896.755.397". It is not — the ASBL is.
Anyone resolving that number lands on a different organisation, and that is far
harder to undo than to avoid.

HARGILE has no company number of its own, so **omit the identifier entirely** —
the correct outcome, not a gap.

Also skip `parentOrganization` / `memberOf` pointing at the ASBL. Semantically
tempting, but it models a corporate hierarchy, and "employees of a cooperative"
is not one. A simple entity beats a clever one.

**Open, and not a repo question:** whether SMART or the HARGILE team is the data
controller for the site's data — it depends on who determines purposes and
means. Worth confirming with SMART's legal support, who exist for this.

### ✅ Q1b — Google Business Profile — **CONFIRMED 2026-07-29**

The GBP exists and is an independent source agreeing with the footer:

> **HARGILE Tech Studio** — Développeur de logiciels à Saint-Gilles
> Rue Sterckx 5, 1060 Saint-Gilles · 4,8 ★ · 18 avis

This settles Q1 from outside the repo, which is the point: cross-source
agreement is what engines check. But it exposes two mismatches to fix **in the
schema**, not on GBP.

**1. The name — the important one.** Schema publishes `name: "HARGILE"`. GBP
says **HARGILE Tech Studio**, and so do the GitHub org (`HARGILE-tech-studio`)
and Instagram (`hargile_tech_studio`). The bare "HARGILE" is the outlier across
your own properties, and the name is the primary key entities are matched on.

Fix — keep the site's brand as the primary and declare the variant:

```js
name: globalT("siteName"),          // "HARGILE"
alternateName: "HARGILE Tech Studio",
```

That is precisely what `alternateName` is for; both strings then resolve to one
entity instead of competing.

**2. The box number.** Footer says "Rue Sterckx 5, **bt. 28**"; GBP says "Rue
Sterckx 5". Minor — Google normalises box numbers — but pick one and use it in
both. Adding "bt. 28" to the GBP address line is the easier direction, since the
footer and schema should stay identical to each other.

**Also useful from GBP:** the category "Développeur de logiciels" corroborates
the `ProfessionalService` type and feeds `knowsAbout`.

⚠️ **The 18 reviews are real corroboration — and must never be copied into the
schema.** Self-asserted `aggregateRating` on your own Organization is exactly
the pattern Google penalises. Reviews count because they live on GBP, not
because you restate them. (Already in "out of scope"; restated because the
temptation is obvious.)

*Optional:* the Google Maps place URL is a legitimate `sameAs` entry.

### Q3 — Is `@hargile_agency` alive? — **evidence says no**

Traced 2026-07-29. Introduced in `a1acc40` (2025-05-06, AlexisVS, "Add SEO
metadata and dependency updates") — a generic SEO scaffold, and the account was
seemingly never created. Both `x.com/hargile_agency` and
`twitter.com/hargile_agency` return **404**. (Caveat: X blocks non-browser user
agents, so 404 is strong evidence rather than proof — confirm in a browser.)

It ships live today in `twitter:site` and `twitter:creator`, and it lives in
**two** places: `seo.global.twitterHandle` in both message files, and a
hardcoded `'@hargile_agency'` in `shared-metadata.js:69-70`.

**Recommendation: delete from both**, unless someone claims the handle. A
published social handle resolving to nothing is a claim that fails
verification — the opposite of what corroboration is for. Keep `twitter:card`,
`twitter:title` and `twitter:description`: those drive link previews and are
doing real work. If the handle is later claimed, it also goes into `SAME_AS`.

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
  alternateName: "HARGILE Tech Studio",              // matches GBP/GitHub/Instagram
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
  // NO identifier/vatID — see Q2. HARGILE has no company number of its own.
  knowsAbout: [/* from the hero capability cards — keep them in sync */],
  // foundingDate: Q4
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
5. Confirm the schema carries **no** `identifier`/`vatID`/`taxID` — see Q2.
   Grep the built HTML for `0896` and expect zero hits inside the JSON-LD.
6. **No privacy-policy change.** An earlier draft asked for one; Q1 established
   that the policy already attributes Rue Coenraets to Productions Associées
   ASBL, so it is a correct legal disclosure. Leave it alone.

The follow-on that actually matters is off-site, not here: Google Business
Profile and any directory listing must show **Rue Sterckx**, matching the schema
and the footer. Cross-source agreement is what engines check, and it belongs to
M3 / phase 3.

## Out of scope, deliberately

- `LocalBusiness` opening hours / geo coordinates — needs a real decision about
  whether you receive clients at an address.
- `Service` nodes and `FAQPage` — phase 2, once `/services` and an FAQ exist.
  Today `/fr/services` is a 308 and `/fr/about-us` a 307.
- Reviews / `aggregateRating` — must never be self-asserted.

## Effort

Half a day. Q1 and Q2 are settled; Q3–Q5 are one-line answers that do not block
starting. Includes the NAP module and verification.
