# M5 — Immersive redesign concepts (services + FAQ)

Section-by-section design concepts for the six M4 pages. Copy is frozen: every
concept here rearranges geometry, scale and motion around the **exact strings
already in `src/messages/{fr,en}.json`**. One proposed messages change exists
(§2.2) and it is optional and flagged.

Read §0 first — it kills the naive way of using React Bits and defines the four
shared primitives every page below reuses.

---

## 0. Ground rules before any page

### 0.1 The React Bits problem — do not `npm i`, do not paste verbatim

Every component the brief lists that touches *text* is disqualified in its
shipped form by Non-negotiable #1:

| Component | Why it fails as-is |
|---|---|
| SplitText / BlurText | mounts per-char spans from JS; resting state is `opacity: 0`, GSAP animates *to* visible |
| ScrollReveal / ScrollFloat | same — text starts invisible, becomes visible on scroll |
| ScrollStack | cards start translated/scaled and stacked; content geometry is JS-owned |
| AnimatedList | items mount progressively; a no-JS client reads an empty list |
| CountUp | renders `0` on first paint, counts to the real number |
| TextPressure / VariableProximity | replaces the text node with a per-glyph DOM it builds at mount |

The site already solved this once. `useReveal.js` + `reveal.module.scss` encode
the rule: **the SSR HTML is the finished state; JS only subtracts.** Every
concept below is implemented in that idiom, not by importing the library.

So the answer to "which React Bits component" is, for each page: *the idea, not
the code*. Each section below names what is kept and what is stripped.

The three components that are safe to adapt closely, because they animate
**non-text decoration only**, are SpotlightCard, GlareHover (border only) and
TiltedCard. Everything else is a sketch to re-implement.

### 0.2 Four shared primitives to build once

Put these next to the existing v2 helpers so all six pages share one
implementation and one set of numbers.

1. **`useSpotlight()`** — `src/components/pages/services/v2/shared/useSpotlight.js`
   `pointermove` → rAF → writes `--sx` / `--sy` (px, element-relative) as CSS
   custom properties on the node. No React state, no re-render, one listener per
   element, removed on unmount. Paired with `spotlight.module.scss`:
   ```scss
   .spot::before {
     content: ""; position: absolute; inset: 0; pointer-events: none;
     background: radial-gradient(420px circle at var(--sx, 50%) var(--sy, 0%),
                 rgba(150, 185, 249, 0.055), transparent 68%);
     opacity: 0; transition: opacity 0.25s ease;
   }
   @media (hover: hover) and (pointer: fine) { .spot:hover::before { opacity: 1 } }
   ```
   This is SpotlightCard with the colour ramp, the border glow and the mouse-leave
   spring removed. **One spotlight on the site, one radius, one alpha.**

   > As built: the hook and this stylesheet are used by the `/services` proof
   > strip. The `/ia` bento does **not** use them — that section is a Server
   > Component and cannot call the hook, so it has its own island writing
   > `--mx`/`--my` (`ia/bento-spotlight.jsx`). It keeps the 420px radius and the
   > 68% stop; its alpha is **0.14, not 0.055**, because it is the only hover
   > accent left in those cells. One radius, two alphas — see §3.

   > 🔎 A third consumer means a decision, not a copy-paste: either it takes
   > 0.055 and this stays a one-off, or the two alphas need a reason written
   > down here.

2. **`.displayNumeral`** — a shared type token, three sizes, in
   `v2-section.module.scss`:
   ```scss
   .numXl  { font: 700 clamp(120px, 14vw, 240px)/0.82 var(--font-headings); letter-spacing: -0.04em; }
   .numLg  { font: 700 clamp(88px, 9vw, 168px)/0.85 var(--font-headings); letter-spacing: -0.03em; }
   .numOutline { color: transparent; -webkit-text-stroke: 1px rgba(150, 185, 249, 0.26); }
   .numGhost   { color: rgba(150, 185, 249, 0.07); }
   ```
   Numerals at this scale are **structure** (they hold the column, they replace a
   border), never decoration floating over copy. Always `aria-hidden="true"` —
   the reading order already has "01…04" semantics from the list markup.

3. **`useScrollFill(ref, offset)`** — extract the exact pattern already living in
   `homepage/v2/mvp-promo/mvp-promo.jsx:38-41` and
   `services/v2/mvp/week-timeline.jsx:23-30`: `useScroll` → `useSpring(90/24/0.4)`
   → a `staticFull` motion value when `useReducedMotion()`. Three sections below
   need it; it should not be written a third time.

4. **`useCountUpFromRendered(ref, to)`** — the CountUp exception. SSR prints the
   final number. On mount, *only if the node is still off-screen*, it writes the
   start value and counts up on first intersection. Same "park what nobody can
   see" logic as `useReveal`. Never used on a number inside a sentence — only on
   a standalone display numeral.

### 0.3 The motion budget

Per page: the existing hero CSS reveal + the existing `useReveal` stagger +
**exactly one signature moment**. Hover states don't count against the budget
(they're user-driven and instantaneous). Nothing else animates. If a section
below doesn't have a motion spec, it means it doesn't move.

### 0.4 Reduced motion, once for all pages

`prefers-reduced-motion: reduce` → every scroll-linked value is pinned to its
completed state (`staticFull` pattern), every draw-on hairline starts at full
extent, every stagger becomes a plain fade (`v2RevealFade`, already written),
every count-up shows the final number. No page below restates this; it is
assumed and must be implemented.

---

## 1. `/services` — the index

**Diagnosis.** `offers-index.module.scss` is a 3-column grid with `align-items:
start` and identical padding on four rows. Everything is aligned to the same
three x-positions and the same top edge. That is the table feeling — and it is
fixed by breaking the vertical anchors, not by adding effects.

### 1.1 Hero — keep

`InnerHero` is correct: asymmetric split, answer paragraph first in the DOM after
the H1, gradient ramp on a short title ("Ce que nous livrons." / "What we
deliver."). No change. The page's weight belongs to the offers.

### 1.2 Offers — **signature moment: the numeral takeover**

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   ┌──┐   Applications web sur mesure                    ↗     │  ← row is the link
│   │01│   Conçues, codées et maintenues chez nous.             │
│   └──┘                                                        │
│    ▲                          Sites et applications web       │  ← deliverables
│  ghost numeral,               Refontes et migrations          │    align-self: end,
│  clamp(120,14vw,240)          Design in-house                 │    pushed down + right
│  behind the title, clipped                                    │
├───────────────────────────────────────────────────────────────┤
│              ┌──┐  Solutions IA                         ↗     │  ← next row indents
│              │02│  Intégrée là où elle change...              │    further right
```

Layout changes to `offers-index.module.scss`:

- Row becomes `position: relative; overflow: hidden` and the whole `<article>`
  wraps in the link (currently only `CtaLink` is clickable — this is also a
  usability win). `CtaLink` collapses to a chevron glyph at the row's right edge.
- The numeral moves from a 15px gutter label to `.numXl .numGhost`, absolutely
  positioned at `left: -0.06em; top: 50%; translateY(-50%)`, **behind** the
  title (`z-index: 0`, title `z-index: 1`), clipped by the row. It stops being a
  column and becomes the row's ground.
- Kill the third grid column. Title + promise form one block; `deliverables`
  move to a right column with `align-self: end` and a `padding-bottom` so its
  last baseline sits ~12px below the row's bottom padding line. Three elements,
  three different vertical anchors.
- Progressive indent: row *n* gets `padding-left: calc(n * clamp(0px, 1.6vw, 34px))`.
  Four rows drift right as you descend. The top hairlines stay full-bleed, so the
  drift is legible against them.

Hover / focus-visible (desktop, `@media (hover: hover)`):

| what | from → to | duration / easing |
|---|---|---|
| ghost numeral | `translateY(-50%)` → `translateY(calc(-50% - 8px))`, opacity .07 → .12 | 380ms `cubic-bezier(.16,1,.3,1)` |
| title | `translateX(0)` → `translateX(10px)`, `#ededed` → `#b8cdfb` | 320ms same |
| underline hairline | `scaleX(0)` → `scaleX(1)`, origin left, 1px `#96b9f9` at .5 alpha | 420ms same |
| chevron | opacity .45 → 1, `translateX(0 → 5px)` | 260ms |
| spotlight | `useSpotlight()` overlay, opacity 0 → 1 | 250ms |

All transform/opacity. The row "leans in" as one object — that is the physical
hover the brief asks for, with no library.

**Motion spec (entry).** Unchanged: `useReveal(i)`, one-shot, 0.5s / 16px /
0.09s stagger. Do not add a second entry animation on top.

**React Bits:** SpotlightCard — kept: the pointer-tracked radial. Stripped: the
colour, the animated border gradient, the glow, the card fill, the leave-spring.

### 1.3 The kinetic strip — optional, and this is the only place it may exist

Between offers and proof, one full-bleed line running the four offer names
(pulled from the same `t()` keys, so no new copy), separated by a small diamond,
in Outfit 700 `clamp(56px, 9vw, 140px)`, **outline only**
(`-webkit-text-stroke: 1px rgba(255,255,255,.13)`, transparent fill) so it reads
as texture rather than shouting a second headline.

> ⚠️ **Non-negotiable flag.** ScrollVelocity as shipped is an infinite RAF
> marquee — that is the "infinite looping ambient animation" the site rule bans.
> It is only admissible re-implemented as **scroll-linked**: `translateX` mapped
> from the section's `scrollYProgress` over a −14% → +4% range of the strip's own
> width, via `useScrollFill`. The user drives it; it is motionless when they are.
> The duplicated copies must be `aria-hidden="true"`; the four names already
> exist as real `<h2>`s in the rows above.

Recommendation: ship it **or** the numeral takeover, not both, if you want the
page to have one clear moment. My preference is the numerals — they carry the
content. The strip is a transition device; treat it as a later A/B, and if it
ever ships, it is the site's only marquee, forever.

### 1.4 Proof strip — static asymmetry + tilt

- Three cards keep their hairline and aspect ratio; the **grid gains a static
  vertical offset**: `translateY(0 / 44px / 14px)` baked into the layout (not
  animated). Alignment is broken at rest, so nothing has to move to feel alive.
- Hover: TiltedCard stripped to `perspective: 900px`, `rotateX/rotateY` clamped
  to **±4°** from pointer position (reuse `useSpotlight`'s pointer vars — same
  hook, second consumer), plus `img { scale: 1.04 }`. No glare layer, no shadow
  bloom, no z-lift. 200ms `ease-out`, returns on leave.
- Under `(hover: none)` the tilt is not registered at all.

### 1.5 CTA band — keep

It is the landing. One change permitted: the `<h2>` takes the identity gradient
ramp. Nothing moves.

### 1.6 Mobile (< 768px)

- Rows: single column (already at 720px). Ghost numeral leaves the background,
  becomes a `.numLg`-scaled-down (64px) outline glyph *above* the title, static.
  Progressive indent → 0. Hover states not registered; the chevron is always at
  full opacity.
- `deliverables` return to normal flow under the promise.
- Proof: cards stack, `translateY` offsets → 0, tilt off.
- Kinetic strip (if shipped): `clamp(40px, 12vw, 64px)`, still scroll-linked
  (works fine on touch, since it reads `scrollYProgress`, not pointer).

---

## 2. `/services/applications-web`

### 2.1 Hero — keep

### 2.2 "Tout se passe chez nous" — the descending staircase

Three equal columns is the same table problem. Fix without motion:

- The `<h2>` scales up hard: `clamp(44px, 6.5vw, 96px)`, `max-width: 12ch`,
  `text-wrap: balance`. Scale contrast against 15px column text is the visual —
  one big statement, then quiet detail. Locale-safe: no dependence on where the
  line breaks.
- Columns stagger downward: `translateY(0 / 56px / 112px)`, and the hairline
  between columns runs **only its own column's height**, so the separators form a
  descending edge rather than a grid.
- The `ownership` strip ("your code, your data") adopts the pull-quote treatment
  — left accent hairline, no frame, larger text. Reusing an existing treatment,
  not inventing a seventh. This shipped, and `web/made-in-house.module.scss` is
  now where that treatment lives: it used to be `ia/honesty.module.scss`, which
  no longer exists (see §3 below).

> 📝 **Optional messages change, flagged.** A stronger version sets the last two
> words of the H2 at 1.6× the first part ("Tout se passe / **chez nous**").
> Achieving that needs the string split into two keys (`title.lead` +
> `title.accent`) in both locales. Same words, different structure — but it *is*
> a messages edit, and it needs an FR/EN split that reads naturally in both.
> Skippable; the plain large H2 above already delivers the scale contrast.

### 2.3 Case studies — **signature moment: the sticky diptych**

```
     scrolls ──────────────────────►          sticky ──────┐
┌──────────────────────────────┐  ┌──────────────────────┐ │
│ Retail                       │  │                      │ │
│ École du Bonheur             │  │   [image 1]          │ │ top: 18vh
│ one factual sentence…        │  │   crossfades to      │ │ height: 62vh
│ Voir le site →               │  │   [image 2] as the   │ │
├──────────────────────────────┤  │   copy block crosses │ │
│ Horeca                       │  │   viewport centre    │ │
│ La Marquisette               │  │                      │ │
│ …                            │  │  ▏ progress rule ▕   │ │
├──────────────────────────────┤  └──────────────────────┘ │
│ VENIZI …                     │                           │
└──────────────────────────────┘ ──────────────────────────┘
```

The alternating image/text layout becomes a single column of copy blocks
scrolling past one sticky media panel. The three project images are stacked
absolutely inside the panel and **crossfade** as each copy block reaches the
viewport middle. A 1px vertical rule at the panel's left edge fills with the
section's scroll progress (`useScrollFill`) — same spine language as the MVP
timeline, rotated.

**Motion spec.** Trigger: `useScroll({target: sectionRef, offset: ["start 0.7",
"end 0.6"]})`. The active index is derived from progress thresholds (0 / .38 /
.72), each image `opacity` transitions 320ms `ease-out`. Sticky is pure CSS.
Reduced motion: progress pinned to 1 → last image shown, rule full; or simpler
and better, drop the sticky entirely under reduced motion and stack the three
images inline with their copy.

> ⚠️ **Non-negotiable check.** Images 2 and 3 sit at `opacity: 0` while inactive
> — that is a resting-invisible state, which #1 forbids for *copy*. It is
> admissible here only because (a) the animated element is an image whose `alt`
> duplicates the client name already printed as a visible `<h3>` right beside it,
> and (b) it must be implemented **subtract-style**: SSR renders all three at
> `opacity: 1` stacked (z-order shows #1), and JS adds the class that makes the
> inactive ones transparent. No text is ever involved. Do not extend this
> exception to anything with words in it.

**React Bits:** ScrollStack — kept: one media well, content advancing through it.
Stripped: the 3D stack, the scale/rotate cascade, the card shadows, the pin-based
layout maths (CSS `position: sticky` does it for free).

### 2.4 Mini-FAQ + CTA band — keep, unchanged

### 2.5 Mobile (< 860px)

Sticky diptych un-sticks entirely: each case reverts to image-above-copy, stacked
— which is what `case-studies.module.scss` already does at that breakpoint. The
crossfade JS must be disabled by a media query check, not just visually hidden.
Staircase offsets → 0. H2 drops to `clamp(32px, 8vw, 44px)`.

---

## 3. `/services/ia`

> ✅ **This section shipped, 2026-08-04, commit `07cc388` — and it is the one
> page where the concept below is no longer the source of truth.** The five body
> sections were replaced by a single Server Component,
> `services/v2/ia/ia-offre-section.jsx`, and `ia/use-cases.*` and `ia/honesty.*`
> were deleted. What changed against the concept, and why:
>
> | §3 proposed | what shipped | why |
> |---|---|---|
> | 12 columns, 7/5 spans, gapped tiles | 6 columns, 4/2 — 2/4, **glued**: `gap: 0`, shared hairlines, square corners | Mihai rejected the radius, then the gaps — "cards have to be glued together". One figure cut into cells, not four widgets. |
> | numerals `01`–`04` on each tile | no numerals | asked for, explicitly |
> | `outcome` gets an accent left hairline | no rule; signal/result split by weight and brightness (300 @ 52% vs 400 @ 86%) | asked for. The accent moved to the "result" label at rest and the title + spotlight on hover. |
> | `useSpotlight()` + `spotlight.module.scss` | its own island, `bento-spotlight.jsx`, writing `--mx`/`--my` | the section is a Server Component, so it cannot call the hook. Same 420px radius and 68% stop; **the alpha is 0.14, not §0.2's 0.055** — the deliberate exception to "one alpha", because it is the only hover accent left in these cells. |
> | §3.3 as a full-bleed signature moment | a plain two-column block inside the section, no draw-on hairline, no 72vh | never built. The page's motion budget went unspent rather than being moved. |
> | §3.4 "Mini-FAQ + CTA — keep" | both absorbed into the one section; the FAQ is now single-open, matching `/faq` | `shared/mini-faq`, `shared/sibling-offers` and `shared/cta-band` still exist — the other three detail pages use them. |
>
> One messages change came with it: `useCases.*.signal` / `.outcome` carried
> their "Le signal :" / "Le résultat :" prefix inline; the prefix is now its own
> key (`signalLabel` / `resultLabel`) so it can be a styled span. Copy otherwise
> frozen, as §0 requires.
>
> §§3.1–3.5 below are kept as written — they are the reasoning that got there,
> and §§3.2/3.5 still describe the bento's intent correctly even where the
> numbers moved.

### 3.1 Hero — keep

### 3.2 Use cases — the asymmetric bento

The 2×2 grid becomes a 12-column composition with unequal spans and one shared
row rhythm:

```
┌─────────────────────────────┬───────────────────┐
│ 01 Automatisation           │ 02 Contenu        │
│ (7 cols, taller)            │ (5 cols)          │
│                             ├───────────────────┤
│                             │ 03 Support        │
├─────────────────────────────┤ (5 cols)          │
│ 04 Données (7 cols)         │                   │
└─────────────────────────────┴───────────────────┘
```

Each tile: hairline border, `useSpotlight()` overlay (the *same* hook and radius
as `/services`), title → `#b8cdfb` and border `.09 → .16` on hover, 200ms. The
`signal` line keeps its muted treatment; the `outcome` line gets the accent left
hairline so the two paragraphs stop looking interchangeable.

**React Bits:** MagicBento — kept: unequal spans, pointer spotlight. Stripped:
the particle field, the glowing animated border, the multi-hue palette, the
click-ripple, the tilt. What remains is a bento made of hairlines.

No entry motion beyond the existing `useReveal` stagger — the page's motion
budget is spent on §3.3.

### 3.3 Honesty — **signature moment: the page's one big statement**

> ❌ **Not built.** The counter-argument shipped as an ordinary block inside
> `ia-offre-section.jsx` — title left, answer right, no rule, no full-bleed, no
> draw-on. `ia/honesty.*` is deleted; the copy still comes from
> `pages.services.detail.ia.honesty`. The section below is still the best
> argument on file for giving this block the viewport, if it is ever revisited.

"Et quand l'IA n'est pas la réponse ?" is this page's differentiator, and it is
currently a small pull-quote. Give it the viewport:

- Full-bleed section, ~72vh, no container box. The question set at
  `clamp(40px, 7vw, 112px)` in the identity gradient ramp, `max-width: 14ch`,
  anchored left.
- The answer paragraph stays small (17px, `rgba(237,237,237,.68)`), placed far
  right and low — a deliberate diagonal across an otherwise empty field. It is
  still second in the DOM, directly after the H2. Empty space is the effect.
- The single accent hairline runs the full section height at the left edge.

**Motion spec.** Trigger: `IntersectionObserver` at 0.25, once. The left hairline
draws `scaleY(0) → scaleY(1)`, `transform-origin: top`, 700ms
`cubic-bezier(.16,1,.3,1)` — the same draw-on gesture as the hero loader's ring,
which is already the site's vocabulary. Nothing else moves; the text is at rest,
visible, from the server HTML. Reduced motion: hairline starts at full height.

### 3.4 Mini-FAQ + CTA — keep

### 3.5 Mobile (< 860px)

Bento → single column, order automation / content / support / data, tiles at
natural height, spotlight not registered. Honesty: section height → auto with
generous padding, question `clamp(30px, 8vw, 46px)`, answer moves directly under
it (the diagonal doesn't survive one column and shouldn't be faked), hairline
stays at the left edge and still draws.

> Shipped: single column and no spotlight, as above, at 768px rather than 860px —
> the cells stay glued, each keeping the bottom rule that separates it from the
> next. The Honesty half is moot, per §3.3.

---

## 4. `/services/seo`

### 4.1 Hero — keep

### 4.2 Process — outline numerals as structure

Deliberately **no motion here**. Four columns, restructured:

- The numeral moves to the top of each column at `.numLg .numOutline`
  (`clamp(88px, 9vw, 168px)`, transparent fill, 1px accent stroke). At that size
  it *is* the column's header rule — the existing 15px `.num` label disappears.
- Each column's top hairline is offset `0 / 24 / 48 / 72px`, so the four tops
  form a descending edge. Static asymmetry.
- Step title and text unchanged.

> A horizontal scroll-filled rail was the obvious move here and is rejected on
> purpose: the homepage `mvp-promo` section is already a scroll-linked horizontal
> three-step rail, and `/services/mvp-30-jours` is a vertical one. A third would
> read as a house tic rather than a device.

### 4.3 Meta-proof — **signature moment: the checklist that ticks itself**

"Cette page est la démonstration." is the smartest idea on the site: the page
proves its own method. Make the *checking* visible.

- Each point in `metaProof.points` gets a 12px hairline square marker at its
  left, with an inner accent square at `scale(0)`.
- As the frame enters the viewport, the inner squares fill one after another —
  `scale(0) → scale(1)`, 300ms `cubic-bezier(.16,1,.3,1)`, **90ms stagger**,
  reading top to bottom like an audit running.
- The frame's own border draws in first: `scaleX` on the top edge, 500ms, then
  markers begin. One-shot, `IntersectionObserver` at 0.3.
- Markers are `aria-hidden="true"` pseudo-elements. **Zero copy is animated** —
  every point is fully visible, at full opacity, from the server HTML. Reduced
  motion: markers rendered filled, border at full extent, no stagger.

This is the cleanest signature in the set: it says something true about the page,
it costs two transforms, and it touches no text node.

### 4.4 Proof case + mini-FAQ + CTA — keep

### 4.5 Mobile (< 768px)

Columns stack; numerals drop to 64px and switch from outline to **solid**
`rgba(150,185,249,.4)` (1px strokes at small sizes hint badly on low-DPI
Android). Staircase offsets → 0. The checklist keeps its stagger unchanged — it
is the page's moment and it works in one column.

---

## 5. `/services/mvp-30-jours` — keep, amplify

The scroll-linked spine in `week-timeline.jsx` is right: one gesture for the
whole month, user-driven, never looping. It stays. Three amplifications, all
reusing code that already exists in the repo.

### 5.1 The dots ignite — reuse `mvp-promo`'s own pattern

Currently `.dot` is static while the spine fills past it. Drive it from the same
`fill` motion value, exactly as `homepage/v2/mvp-promo/mvp-promo.jsx:38-41`
already does:

```js
const ignite     = useTransform(fill, [at, at + 0.12], [0, 1]);
const dotOpacity = useTransform(ignite, [0, 1], [0.25, 1]);
const dotScale   = useTransform(ignite, [0, 1], [0.6, 1]);
```

with `at` = the week's index threshold (0 / .34 / .68). The week's `label`
("Semaine 1") takes `weekOpacity` 0.45 → 1 — that is a *muted-to-full* range, not
0 → 1, so the label is never invisible and #1 holds. Copy body text is untouched.
This is the single best value-per-line change on the page: the month lights up as
you read it.

### 5.2 Week numerals as ground

Each week block gets `01`, `02–03`, `04` at `.numXl .numGhost`, absolutely
positioned left of the spine, bleeding under the copy, `aria-hidden`. Static.
Same language as `/services` rows and `/seo` columns — the numeral system is what
makes the four pages feel like one family instead of four layouts.

### 5.3 The `30` — the one legitimate CountUp

A standalone display numeral `30` at `clamp(140px, 18vw, 280px)` anchors the
timeline section's left edge, next to the H2 that already reads "Les 30 jours,
semaine par semaine."

- `aria-hidden="true"`, **no unit word** — so nothing is added to the copy, in
  either locale.
- Uses `useCountUpFromRendered` (§0.2): SSR prints `30`; JS counts 0 → 30 in
  900ms `ease-out` **only** if the node was parked off-screen on first pass.
  Reduced motion: no count.

> ⚠️ React Bits' `CountUp` mounts at the start value and would ship `0` in the
> server HTML — a factual error for a crawler reading the page, not just a motion
> violation. Must be the local hook.

### 5.4 Included / excluded — make the contrast physical

Two equal columns understate the point. The "out" column sits **40px lower**, its
items at `opacity: .55` with no marker; the "in" column items get a 1px accent
left hairline. Same words, opposite weight. No motion.

### 5.5 Fixed price — keep

The frame treatment is right for a claim with no number in it.

### 5.6 Mobile (< 768px)

Spine moves to `left: 12px`; week numerals drop to 64px ghost behind the label;
the `30` becomes a 72px inline numeral sitting above the H2; included/excluded
stack with the 40px offset removed (the accent hairline alone carries the
contrast); dot ignition unchanged — it is scroll-driven and works on touch.

---

## 6. `/faq` — quiet on purpose

Last priority, and the right answer is restraint: this page's job is answering,
and it is the FAQPage JSON-LD source (`build-json-ld.js` reads
`pages.faq.items`). Nothing here may put the copy at risk.

### 6.1 Hero — keep

### 6.2 Groups — **signature moment: the group heading that holds**

Each group `<h2>` ("Projet & délais", "Budget & propriété", "Technique &
maintenance") becomes `position: sticky; top: 96px` inside its own section, so it
holds while its accordion scrolls under it and is pushed out by the next group's
heading. The page gains a sense of chapters with **zero JavaScript, zero DOM
duplication, and zero risk to #1 or #2.**

- The sticky heading sits on a solid `#080c16` band with a bottom hairline. Not
  `backdrop-filter` — that is glassmorphism, and it costs a compositor layer on
  every scroll frame.
- A rejected alternative: a fixed left rail listing the three groups with an
  active-tick that slides. It works, but it duplicates the three group titles in
  the DOM purely for decoration. The sticky h2 gets the same effect from the
  markup that is already there. Choose the one with nothing added.

### 6.3 Accordion — one micro-interaction

`faq-accordion.jsx` stays exactly as it is: `grid-template-rows` collapse,
answers always in the HTML, `aria-hidden` mirroring `aria-expanded`. Non-negotiable
#2 is already satisfied and must not be touched.

Add only: opening a question draws a 1px accent hairline under it
(`scaleX(0 → 1)`, origin left, 300ms) alongside the existing plus→× rotation.
That is the whole motion budget for the page.

> ⚠️ **AnimatedList is rejected outright.** It mounts list items progressively —
> a crawler with no JS would read an empty FAQ, on the one page whose entire
> purpose is being read by crawlers.

### 6.4 "Il manque la vôtre ?" block — keep

The four offer links stay as ghost `CtaLink`s.

### 6.5 Mobile (< 768px)

Sticky `top` → 64px (shorter navbar). If the group title wraps to two lines at
360px it eats too much viewport — cap it: below 480px the heading un-sticks
(`position: static`) rather than shrinking the type. Chapters are a desktop
affordance; on mobile the accordion is already a compact index.

---

## 7. Non-negotiable audit — every risk in this document

| # | Rule | Where it's at risk | Resolution |
|---|---|---|---|
| 1 | Copy in SSR HTML, visible with JS off | Any verbatim React Bits text component | §0.1 — none are imported; every idea is re-implemented in the `useReveal` subtract idiom |
| 1 | ” | `/web` case-study image crossfade (§2.3) | Only images, never text; `alt` duplicates a visible `<h3>`; SSR renders all three opaque and JS subtracts |
| 1 | ” | MVP `30` count-up (§5.3) | `useCountUpFromRendered` — SSR prints the final value |
| 1 | ” | MVP week labels at `weekOpacity` | Range is .45 → 1, never 0 — the label is always readable |
| 2 | FAQ answers stay in the DOM | `/faq` and both mini-FAQs | `faq-accordion.jsx` untouched; AnimatedList rejected |
| 3 | Answer paragraph first | All six heroes | `InnerHero` unchanged on every page; no concept reorders it |
| 4 | Reduced motion settles finished | Every signature | §0.4, and each section's spec restates its own end state |
| 5 | transform/opacity only, 60fps | Spotlight, tilt, sticky crossfade | Spotlight writes CSS vars via rAF (no React re-render); tilt is a single `transform`; sticky + opacity are compositor-only; outline numerals paint once |
| — | No looping ambient motion | The kinetic strip (§1.3) | Admissible **only** scroll-linked, and only once on the whole site — or dropped |
| 6 | Two locales, no length dependency | `/web` H2 (§2.2), kinetic strip, all numerals | Numerals are locale-invariant; the H2 relies on `text-wrap: balance` + `ch` measure, not a break point; the strip's translate range is relative to its own measured width |
| 7 | Mobile collapse stated | — | Every page has a §.x Mobile clause |

## 8. Suggested build order

1. §0.2 primitives (`useSpotlight`, numeral tokens, `useScrollFill` extraction) —
   nothing else lands cleanly before these exist.
2. `/services` §1.2 offers — the numeral system debuts here and the other three
   pages quote it.
3. `/seo` §4.3 checklist — smallest signature, highest ratio, validates the
   one-shot marker pattern.
4. `/mvp` §5.1–5.3 amplifications — all reuse existing repo code.
5. `/ia` §3.2–3.3 — bento + the big statement.
6. `/web` §2.3 sticky diptych — the most JS of the set, do it once the idiom is settled.
7. `/faq` §6.2 — pure CSS, ten minutes, do it whenever.
