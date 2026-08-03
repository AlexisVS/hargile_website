# Service detail heroes — putting the grid under `/services/*`

> Written 2026-08-03. Mihai's ask: the four service detail pages should get
> heroes closer to `/services` and `/faq` — **with the cubes** — each page
> running its **own** composition, while everything that makes them a family
> stays shared. Copy must stay readable; the rest is open.
>
> Settled the same day: **no eyebrows**; **four clearly different
> compositions, none of them lit behind the copy**; **right column empty for
> now**. See "Decisions" below — each one changes the work, not just the look.
>
> Read [wave-grid.md](./wave-grid.md) first, and
> [faq-hero-plan.md](./faq-hero-plan.md) second — this is the same migration
> the `/faq` hero already went through, times four. That plan closed with
> "`inner-hero.jsx` … matching it to the poster heroes is a separate question".
> This is that question.

## The headline finding: the code is small, the images are not

`PosterHero` + `WaveGridBackdrop` already do everything the detail pages need,
and `WaveGridBackdrop` already takes a `composition` prop (that is how `/faq`
runs `wave-70` against `/services`' `wave-7`). So the wiring per page is:

```jsx
<PosterHero
    title={t("title")}
    answer={t("answer")}
    backdrop={<WaveGridBackdrop composition="wave-NN"/>}
/>
```

Four of those, plus imports. **That is the entire code change.**

What actually costs: **twelve exports** (4 compositions × 3 aspect frames), run
one at a time at 60–90 s each — call it 25–40 minutes of wall clock — plus 24
committed image files (~150–250 kB total). Browsing compositions to pick four
you like is on top of that, and is the part that needs Mihai's eyes.

| | today (`InnerHero`) | after (`PosterHero`) |
| --- | --- | --- |
| height | content-sized | `min-height: 100svh`, copy centred |
| title | `clamp(38px, 4.6vw, 68px)` | `clamp(44px, 7.2vw, 112px)` |
| backdrop | none | the grid, per-page composition |
| eyebrow | `t("eyebrow")` | **none** — settled, and it is what buys `.tight` |
| aside slot | none | **none for now** — settled |
| answer | first content after H1 | unchanged — do not move it |

## The one hard constraint

**The quiet zone is a function of where the copy sits, not of which page it is
on.** `CALM` (wave-grid.jsx), `CALM_PHONE` / `CALM_TABLET` and the `RELIEF_*`
values are all tuned to the poster hero's copy geometry: 100svh box, `.tight`
top offset, `var(--container-max)` measure, 860px stack point, answer capped at
62ch.

Keep that geometry byte for byte and **no quiet zone is derived, no export
route is added, and the existing `services*` export targets write every frame**
— exactly what `/faq` proved. Change it (shorter hero, eyebrow back in, a
different measure, a two-column split) and each change has to be re-verified by
rendering, and a re-derived quiet zone is the single most expensive mistake in
this codebase's history (see wave-grid.md, "Adding a frame for a new aspect
band", step 4).

So the plan's bet is: **differentiate by composition, not by geometry.** Same
box on all six pages, four different seed tables inside it.

## Decisions — settled by Mihai, 2026-08-03

**1. No eyebrow.** ✅ Dropped on all four pages, as on both hub pages. This is
also what buys the geometry: `PosterHero` ties `.tight` (top padding, negative
navbar margin, 100svh, centring) to the *absence* of the prop, so dropping it
is what makes the four pages inherit the shared quiet zone for free. The
service name survives in every H1 (`Des applications web sur mesure…`, `L'IA là
où elle change le résultat.`) and in the breadcrumb.

⚠️ Keep the `hero.eyebrow` keys in `fr.json` / `en.json` — precedent from
`/services`: a layout call is not a copy deletion, and deleting the strings
makes a reversal a two-file translation change.

**2. Four compositions, clearly different from each other — and none of them
lit behind the copy.** ✅ Both halves of that are constraints on step 3, and
the second one outranks the first: a composition that is distinctive *because*
its lit mass sits in the middle of the frame is disqualified, not a candidate.

Two things to know before browsing:

- The generator already forbids seeds inside the quiet ellipse, and the shader
  damps the ellipse on top of that — so "light behind the copy" is not a seed
  landing there, it is a **ring arriving from a seed outside it**. Each ripple
  lights a band ~6 world units across against a visible frame ~16 wide, so a
  seed just outside the rim throws its front straight through the copy. Judge
  the frame, never the seed list.
- Below 860px the quiet band covers most of a one-column screen, so
  **compositions differentiate on the wide frame and mostly converge on phone
  and tablet** (faq-hero-plan.md, "What flipping compositions at the narrow
  frames taught"). Four distinct wide frames and four near-identical phone
  frames is the honest ceiling — don't spend an afternoon chasing phone
  variety that the layout cannot express.

If a composition is right everywhere except that it lights the copy, the lever
is **the quiet zone, not the seeds** (see the note under `CALM`) — but changing
`CALM` changes `/services` and `/faq` too, so it means re-exporting all six
pages. Prefer picking a different number.

**3. Right column empty for now.** ✅ Ships with no `aside`. The answer keeps
its 62ch cap, so it still sits in the left half of the measure and the quiet
zone still covers it — **verify by rendering at 1440, do not assume**: the
`.body` grid is `auto-fit`, so with one child the column is the full container
width and only the 62ch cap keeps the text out of the lit half.

Deferred, not rejected — if the right side reads as empty at 1440, the next
pass is a chapter index like `FaqIndex`: three in-page anchors per page
(`#made-in-house`, `#cases`, `#faq`…), one shared component driven by a
per-page table, plus `id`s on the existing body sections. That is the version
that adds navigational and SEO value; page-specific fact lists were considered
and are the most work for the least reuse.

## Steps

### 1. Swap the hero on the four clients — 4 files ✅ Done

`ServiceWebClient.jsx`, `ServiceIaClient.jsx`, `ServiceSeoClient.jsx`,
`ServiceMvpClient.jsx`: replace `InnerHero` with `PosterHero` + a
`WaveGridBackdrop` with the page's composition, and **pass no `eyebrow` and no
`aside`** (decisions 1 and 3). Put the *why* on the call site the way
`/services` and `/faq` do — a reader landing on one client file should not have
to diff four.

At this point every page renders with `wave-7` names it does not have yet; wire
step 3's names as they land, or point all four at `wave-7` temporarily so the
page is never broken while browsing.

### 2. Does `inner-hero` survive? ✅ Deleted

After step 1 nothing imported it. Mihai took the honest default on 2026-08-03:
`inner-hero.jsx` and `inner-hero.module.scss` are gone. An unused component with
a stale header comment ("shared by the M4 pages") is how the next reader gets
misled.

What survives is prose: `faq-hero-plan.md` and `m5-immersive-design-concepts.md`
still describe it as the detail pages' hero. Left as written — they are dated
records of what was true then, and this plan is the thing that supersedes them.

### 3. Pick four compositions — the part that needs eyes

```
npm run dev
# browse on /services, NOT on a detail page — the quiet zone is what makes a
# composition look the way it does, and after step 1 they are identical.
http://localhost:3000/services?wave=1   →  ← wave N → random picker, top right
```

Note the numbers. Compare **live against live** or **export against export**,
never one against the other — an encoded export reads punchier and that has
already produced one wrong conclusion.

Two filters, in this order (decision 2):

1. **Reject anything lit behind the copy.** Read the answer paragraph on the
   candidate at 1440 before liking it for any other reason. A ring crossing the
   copy band disqualifies the number — go to the next one rather than reaching
   for `CALM`, which is shared with `/services` and `/faq` and would cost six
   re-exports.
2. **Then pick for difference** — where the lit mass sits, how tight or wide
   the rings are. Judge on the wide frame; phone and tablet will look like each
   other whatever you choose.

`wave-7` (services) and `wave-70` (faq) are taken. Pick four that read as
siblings of those, not as a different site.

**What was actually done, 2026-08-03.** 24 numbers browsed live at 1440x900 on
`/services` (3, 11, 19, 23, 41, 55, 68, 84, 97, 113, 128, 142, 156, 171, 188,
203, 219, 234, 251, 266, 280, 297, 312, 330), screenshotted, then filter 1 was
run as a **measurement rather than an opinion**: mean greyscale luminance of two
crops off the 1440x900 shot — the headline band (96,345 → 976,445) and the
answer block (96,515 → 696,665). The copy is white text and identical on every
candidate, so it adds a constant and only the ranking means anything.

`wave-7` reads **88.9 / 42.2** and is the pass mark, because it is what
`/services` already ships and Mihai has accepted. Six candidates came in at or
below it on both crops: 142 (83.3/35.9 — cleanest of all 24), 312 (87.9/36.0),
97 (87.4/40.8), 203 (89.3/34.1), 330 (89.8/34.4), 188 (89.8/36.5). Filter 2
picked four of those six for difference; 203 and 330 lost to 142 because all
three are the same top-right-mass family.

⚠️ One trap in reproducing this: `sharp(src).extract(rect).stats()` returns the
stats of the **whole input image**, silently ignoring the crop — every candidate
comes back with an identical number and the ranking is meaningless. Materialise
the crop through `.toBuffer()` and re-open it.

### 4. Export — 12 runs, strictly one at a time

```
node scripts/export-wave-grid.mjs --page=services        NN   # wide     → wave-NN
node scripts/export-wave-grid.mjs --page=services-phone  NN   # ≤640     → wave-NN-phone
node scripts/export-wave-grid.mjs --page=services-tablet NN   # 641–860  → wave-NN-tablet
```

…for each of the four numbers. **No `TARGETS` entry, no `--page=ia`, no export
route.** The script drives `/services` for every one of these and that is
correct: a composition depends only on the quiet zone and the requested aspect,
both of which are shared. This was already proved for `/faq`.

⚠️ **Never run two at once.** Concurrent exports fight over the shared
`agent-browser` daemon session and the symptom is a hang, not an error
(wave-grid.md, "Exports that hang are an agent-browser session collision").
Expect 60–90 s each with no output until it finishes.

Commit the `.avif` and `.webp`. Nothing regenerates them at build time.

### 5. Point each page at its composition

One name per page → three frames derived by `framesOf`. All three files must
exist before a page points at the name, or that viewport band 404s its
backdrop.

| page | composition | what the light does on the wide frame |
| --- | --- | --- |
| `/services` | `wave-7` (unchanged — do not touch) | mass upper-right, second mass lower-left |
| `/faq` | `wave-70` (unchanged) | — |
| `/services/applications-web` | `wave-142` | terraced block into the top-right corner, rest near-black |
| `/services/ia` | `wave-312` | a vertical column right of centre, full height |
| `/services/seo` | `wave-188` | diagonal staircase upper-left → centre-right, lit block low right |
| `/services/mvp-30-jours` | `wave-97` | soft mass entering top-centre, dark sweep bottom-left |

Settled 2026-08-03. Ordered so no two adjacent pages in the nav repeat a
family, and so the flagship offer (applications-web) takes the highest-contrast
frame.

### 6. Verify — measured, not assumed

- `img.currentSrc` at **390 / 640 / 641 / 860 / 861 / 1440** on all four pages:
  each must serve its own composition and switch at the same three edges as
  `/services`. An off-by-one here leaves one pixel column of viewport serving
  the wrong frame and nothing else will tell you.
- Screenshot each detail page beside `/services` at 390 and 1440: the
  `.container` box, not the `h1`. `.title` is `width: fit-content`, so a longer
  headline is legitimately a wider box that starts higher — that is not drift.
- Read the answer paragraph at every width on every page. It sits on damped
  pillars or the plan has failed; that is the one requirement Mihai stated.
- `/services` and `/faq` unchanged: `git status public/images/wave-grid/` shows
  **added** files only, never modified ones.
- `npm run build`; lint at its baseline of 2.
- One Lighthouse pass on a detail page — the grid becomes the LCP element on
  four routes that previously had no hero image at all.

## Traps, all previously paid for

- **Don't re-derive the quiet zone.** Same layout, same numbers. Every time one
  has been re-derived from another frame's extents here, the output was a black
  column.
- **Don't move the answer paragraph.** It stays the first content after the H1;
  it is the extraction unit AI answer engines lift (geo-plan.md, Phase 2).
  Reordering the hero would be an SEO change wearing a design change's clothes.
- **Don't add a `--page=` target per service page.** The composition is a
  property of the quiet zone, not of the route.
- **Four pages gain image weight.** ~10–22 kB AVIF each, no three.js — the
  canvas only loads behind `?wave=` or `?export=`.
- **`?wave=` and `?bg=` now answer on eight routes.** Harmless, but every
  detail page inherits the picker widget. Nothing to do; don't be surprised.
- **The heroes become 100svh.** On a detail page that pushes the first body
  section fully below the fold — intended on a hub page, a taste call here.
  Shortening the box changes the aspect and therefore what `cover` crops, so it
  is a verify-by-rendering change, not a free one.

## Out of scope unless asked

- `/services` and `/faq` themselves — both settled.
- The body sections of the detail pages (`UseCases`, `WeekTimeline`, `Process`,
  `MadeInHouse`, `MiniFaq`, `CtaBand`).
- Live mode (`mode="live"`). What ships is a still image on every page and this
  plan does not change that.
- Per-page colour ramps. `COLORS` is deliberately shared site-wide; a per-page
  ramp would take one hero off brand while the others stayed on it.
