# /faq hero — matching the /services poster hero

> Written 2026-08-03 for the next session. Mihai's ask: make the `/faq` hero
> match `/services` **positioning, size and design**, with **no eyebrow**.
>
> Read [wave-grid.md](./wave-grid.md) first if the backdrop is in scope — in
> particular "Adding a frame for a new aspect band", which is the method this
> plan assumes.

## The headline finding: this is small

**`PosterHero` is already shared by both pages.**
[`poster-hero.jsx`](../src/components/pages/services/v2/shared/poster-hero.jsx)
is imported by `ServicesIndexClient` *and* `FaqPageClient`. Same component, same
stylesheet, same `min-height: 100svh`, same 860px one-column breakpoint.

So "match positioning, size and design" is not a rebuild. Three things differ
today, and only three:

| | `/services` | `/faq` |
| --- | --- | --- |
| eyebrow | **none** — dropped deliberately | `t("hero.eyebrow")` |
| top spacing | `.tight` (follows from no eyebrow) | the taller default |
| backdrop | `<WaveGridBackdrop/>` | **nothing** |
| aside | `<HeroStats/>` | `<FaqIndex/>` |

The aside difference is content, not layout — both land in the same right-hand
slot of the same two-column band. It stays as it is.

**And the eyebrow already carries the spacing with it.** `PosterHero` applies
`.tight` whenever `eyebrow` is absent, because the marker rule was part of what
held the headline down from the navbar. So dropping the prop fixes the size and
positioning in the same move — there is no separate spacing task.

## Steps

### 1. Drop the eyebrow — 1 line

In [`FaqPageClient.jsx`](../src/app/[locale]/(context)/(client)/faq/FaqPageClient.jsx),
remove the `eyebrow={t("hero.eyebrow")}` prop.

⚠️ **Leave the `hero.eyebrow` key in `fr.json` / `en.json`.** That is the
precedent `/services` set, and the reason is on its call site: this is a layout
call, not a copy deletion. Deleting the string makes it a translation change that
has to be reversed in two files if the decision flips.

Copy the `/services` comment across too, adapted — a reader landing on
`FaqPageClient` should not have to diff two files to learn why one hub page has
an eyebrow prop and the other doesn't. Note the reason differs: on `/services`
the eyebrow said "Services" directly above the headline and labelled the page
twice. On `/faq` the reason is consistency with its sibling.

### 2. Give it the wave grid — 1 line, 0 exports

Add `backdrop={<WaveGridBackdrop/>}` and the import.

**No new images are needed, and this is the part worth checking before assuming
otherwise.** The quiet zone is tuned to where the copy sits, and once the eyebrow
is gone the two heroes have *identical* copy geometry: same component, same
`100svh` box, same measure, same `.tight` offset, same 860px stack point. So
`wave-7.*`, `wave-7-phone.*` and `wave-7-tablet.*` apply unchanged.

This is the one case where the standing warning — "a composition is not portable
between pages" — does not apply, because the thing that makes it non-portable is
a difference in quiet zone, and here there is none. **Verify rather than trust
it:** load `/faq` at 390, 768 and 1440 and confirm the dark band lands on the
headline and answer exactly as it does on `/services`.

### 3. Decide whether `/faq` should look *identical* or merely *matched*

This is Mihai's call and the only real design decision in the plan.

- **(A) Reuse `wave-7.*` as-is.** Zero exports. The two hub pages become visually
  continuous — the literal reading of "match the services page".
- **(B) A different variant at the same three frames.** Same visual language,
  distinguishable pages. Costs three exports and three filenames
  (`wave-N-faq*`), and needs three `TARGETS` entries.

⚠️ If (B): the export script can still drive `/services`. The composition depends
only on the quiet zone and the requested aspect, both of which are identical on
`/faq` once step 1 lands — so `/services?wave=N&export=...` renders exactly what
`/faq` will show. A `/faq` export route is **not** needed. Do not add one on the
assumption that it is.

Recommendation: start with (A), look at the two pages back to back, and only
spend the exports if they read as *repetitive* rather than as *a pair*.

### 4. Verify

- `img.currentSrc` at 390 / 640 / 641 / 860 / 861 / 1440 on `/faq` — same three
  bands as `/services`. If they differ, the two pages have drifted and the cause
  is in `wave-grid-backdrop.jsx`, which both now share.
- Screenshot `/faq` and `/services` at 390 and 768 and compare the headline
  position directly. The point of the exercise is that they line up.
- `npm run build`.

## Traps, all previously paid for

- **Don't re-derive the quiet zone for `/faq`.** It is the same layout. Every
  time a quiet zone has been re-derived from a different frame's numbers in this
  codebase, the result was a black column.
- **Don't touch the answer paragraph.** It stays the first content in the DOM
  after the H1 — it is the extraction unit AI answer engines lift
  ([geo-plan.md](./geo-plan.md), Phase 2). Reordering the hero would be an SEO
  change wearing a design change's clothes.
- **`/faq` gains image weight it did not have.** Three AVIFs at 10–21 kB, plus a
  `<picture>`. No three.js — `WaveGridBackdrop` only loads it behind `?wave=` or
  `?export=`, exactly as on `/services`. Worth one Lighthouse pass anyway, since
  `/faq` previously had no hero image at all and the grid becomes its LCP
  candidate.
- **The `?bg=` and `?wave=` switches come along for free** and will now answer on
  `/faq` too, since it is the same component. That is fine, but it means `/faq`
  inherits the picker widget under `?wave=N`. Nothing to do; just don't be
  surprised.

## Out of scope unless asked

- The FAQ accordion, `FaqGroups`, `CtaBand`.
- `/services` itself — it is settled as of `575f033` and should not move.
- `inner-hero.jsx` (the service *detail* pages). Different, narrower hero;
  matching it to the poster heroes is a separate question.
