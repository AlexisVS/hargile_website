# /faq hero — matching the /services poster hero

> Written 2026-08-03 for the next session. Mihai's ask: make the `/faq` hero
> match `/services` **positioning, size and design**, with **no eyebrow**.
>
> Read [wave-grid.md](./wave-grid.md) first if the backdrop is in scope — in
> particular "Adding a frame for a new aspect band", which is the method this
> plan assumes.

## ✅ EXÉCUTÉ le 2026-08-03 — steps 1, 2 and 4; step 3 taken as **(B)**

Steps 1 and 2 are two props on `FaqPageClient`, plus the comments that went stale
with them. The plan's central bet paid: the layout is shared, so the quiet zone,
the band edges and the relief all carry over and **no new quiet zone was
derived**.

**Step 3 went to (B) on Mihai's call — `/faq` runs its own composition,
`wave-70`, against `/services`' `wave-7`.** He picked it off the `?wave=` switch.

### What (B) actually cost, against what this plan predicted

The plan said (B) costs "three exports and three filenames (`wave-N-faq*`), and
needs three `TARGETS` entries". **The `TARGETS` part was wrong.** The export
script already parameterises on the variant — `wave-${v}`, `wave-${v}-phone`,
`wave-${v}-tablet` — and those names describe the *composition*, not the page. So
the existing `services*` targets wrote all three frames of variant 70 with no
script change at all:

```
node scripts/export-wave-grid.mjs --page=services 70          # wave-70        22 kB
node scripts/export-wave-grid.mjs --page=services-phone 70    # wave-70-phone   9 kB
node scripts/export-wave-grid.mjs --page=services-tablet 70   # wave-70-tablet 12 kB
```

⚠️ Run them **one at a time** — concurrent exports collide on the browser daemon.
And note the script still drives `/services` for a `/faq` image, which is correct
for exactly the reason the plan gave: the composition depends only on the quiet
zone and the requested aspect, and both are identical. **No `/faq` export route
was added.**

The wiring is a `composition` prop on `WaveGridBackdrop`, defaulting to
`wave-7`. **One name, three frames derived** (`framesOf`), because that is how
the export names its output — listing the three separately would let a
half-finished re-export ship two frames of one composition and one of another.

### Measured, not assumed

Both pages probed at 390 / 640 / 641 / 860 / 861 / 1440:

- **Each page serves its own composition and they switch frames at the same
  edges** — `/faq` gets `wave-70-phone` to 640, `wave-70-tablet` to 860,
  `wave-70` above; `/services` the `wave-7` set at the same boundaries.
- **`/services` is unchanged**, and `git status public/` proves it: the six
  `wave-70*` files are added, no existing export is modified.
- **The hero box is identical between the pages**: same section height, same
  `padding-top`, same `min-height`, same container left edge and width, and the
  copy block's vertical centre matches to the pixel (459/459 at 390, 486/486 at
  768, 500/500 at 1440).
- ⚠️ **The `h1`'s own `top` and `width` still differ, and that is correct.**
  `.title` is `width: fit-content` (the gradient has to map onto glyphs, not an
  empty box) and `.hero.tight` is `justify-content: center`, so a longer headline
  is a wider box that starts higher. `/faq` runs two lines against `/services`'
  one. **Do not "fix" this by measuring the h1** — measure `.container`, which is
  what the two pages actually share. It nearly got read as drift.
- Build OK, lint at its baseline of 2.

The `images:wavegrid` byte-identity control was **not** run, deliberately: it
guards changes to `wave-grid.jsx`, and this change did not touch it.

### ⚠️ What flipping compositions at the narrow frames taught

An intermediate reading — "wave 70 is flat at tablet and phone" — was **wrong**,
and the way it was wrong is worth keeping. Seven compositions were rendered at
390 and 768 (7, 12, 19, 23, 41, 58, 70) and they are all similarly calm there:
below 860px the quiet band covers most of a one-column screen, so the seed table
has very little room left to differentiate. **Compositions are chosen on the wide
frame; the narrow frames mostly follow.**

The false reading came from comparing 70's *live canvas* against wave-7's
*encoded export*, which sits slightly punchier. **Compare like with like** — live
against live, or export against export.

Two things left for Mihai's eyes, neither touched:

- The `01/02/03` numerals of `FaqIndex` sit over the lit mass on the wide frame,
  which is the weakest contrast on the page. If it bothers him the lever is the
  **quiet zone**, not the seeds — see the note under `CALM`.
- At 390px the third `FaqIndex` row sits under the cookie banner. That is the
  banner overlaying a full-height hero, it clears on dismissal, and it predates
  this change.

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

> ✅ **Settled: (B).** Mihai chose a distinct composition, `wave-70`. The costing
> below overstated it — see the EXECUTED section: no `TARGETS` entries and no
> `-faq` filenames were needed. Kept as written for the reasoning.

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
