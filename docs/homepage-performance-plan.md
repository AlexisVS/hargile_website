# Homepage performance plan — desktop Lighthouse 61 → 90+

> Written 2026-07-28 from a PageSpeed Insights run on `hargile.com/en`.
> Not yet implemented — this is the execution plan for a later session.
>
> Baseline: **desktop Performance 61** (FCP 0.3 s, LCP 0.6 s, **TBT 13,900 ms**,
> CLS 0.044, **SI 3.6 s**) vs **mobile 95** (LCP render delay 6,290 ms).

## Why desktop scores worse than mobile

Two metrics account for the whole gap.

**TBT 13,900 ms — 0 of 30 points.** Lighthouse runs headless Chrome with no GPU,
so WebGL falls back to SwiftShader, a CPU software rasterizer. The desktop hero
backdrop (`cube-grid.jsx`: 676-instance `InstancedMesh`, a 48-iteration
`texelFetch` loop **per vertex**, `antialias: true`, DPR 2) then renders every
frame on the main thread for the entire trace. That is the 27.5 s of "Other"
main-thread work in the report. A real GPU never sees this — but neither does
Lighthouse, nor any user without hardware acceleration (VMs, remote desktop,
blocklisted drivers). Mobile scores better only because it gets the cheaper
`ColorBends` fragment shader instead.

**Speed Index 3.6 s — 1 of 10 points.** The branded loader is an opaque
`#080c16` overlay present in the SSR HTML, and it is dismissed only once the
526 KB three.js chunk has downloaded *after* hydration and painted a canvas,
plus 900 ms of ring animation and a 500 ms fade (4 s safety cap). Worst case the
screen is a flat colour for 5.4 s, which is exactly what Speed Index measures.

Mobile's weak spot is different: **LCP render delay 6,290 ms**. The `motion.h1`
serialises its `initial` state into the SSR HTML as
`style="opacity:0;transform:translateY(16px)"`, and Chrome will not record an LCP
candidate for a fully transparent element — so LCP waits for hydration plus the
Framer Motion mount animation.

Secondary findings: no font preloads (2.6 s critical chain on mobile), no
browserslist anywhere (14 KiB gz of core-js polyfills), the entire i18n bundle
(58–65 KB) inlined into every page's HTML, and a dependency-array bug that
rebuilds the ColorBends WebGL context mid-hydration on phones.

**Targets:** desktop 61 → 90+, mobile 95 → ~98, with the loader concept and the
sober one-shot reveals intact.

---

## Phase 1 — the score movers

### 1.1 Gate the WebGL backdrops · desktop TBT 13.9 s → <1 s

New util **`src/lib/webgl.js`** exporting `isSoftwareRenderer(gl)`: read
`WEBGL_debug_renderer_info` → `UNMASKED_RENDERER_WEBGL` (fall back to
`gl.getParameter(gl.RENDERER)`), test against
`/swiftshader|llvmpipe|softpipe|software/i`, return `false` when unknown. Take an
existing context via `renderer.getContext()` — do not create a throwaway one.

**`src/components/pages/homepage/v2/hero/backdrops/cube-grid.jsx`**

- After renderer creation (~line 96): `const staticOnly = reduced ||
  isSoftwareRenderer(renderer.getContext())`. Reuse the existing `reduced` branch
  (lines 381–385) — render one frame, never start `loop()`. Under `staticOnly`
  also skip the `pointermove`/`mouseleave` listeners and the idle ripple ticker
  (they exist only to feed the loop), and switch the IntersectionObserver's
  early-return (line 397) from `reduced` to `staticOnly`. Set `setPixelRatio(1)`
  in this mode so the single software frame is cheap.
- DPR cap 2 → 1.5 (line 96) for everyone else: visually negligible on 0.4-unit
  cubes, ~44 % fewer fragments.
- Add a `visibilitychange` pause composing with the existing
  IntersectionObserver — track `intersecting` in a local boolean so the two gates
  combine, and resume only when visible **and** intersecting. Remove the listener
  in the cleanup block (lines 409–422).

**`src/components/vendor/color-bends/ColorBends.jsx`** — this file is vendored
from React Bits and its header (lines 3–7) currently claims it is unmodified for
upstream re-sync. Update that header to list each divergence below.

- Same `staticOnly` check — software renderer **or** `prefers-reduced-motion`,
  which this component currently does not honour at all: render one frame at
  DPR 1, never schedule `rafRef`.
- Cap `loop()` (lines 217–235) to 30 fps: accumulate delta, skip
  `renderer.render` until ≥ 1/30 s. Imperceptible on an ambient gradient at
  `speed 0.18`, halves real-user cost.
- Add IntersectionObserver + `visibilitychange` pause/resume on `rafRef`, same
  compose-two-gates pattern as CubeGrid.
- **Bug fix:** change the mount effect's dependency array (line 250) to `[]`
  (with an eslint-disable). Every prop listed there is already synced by the
  uniform-only effect at lines 252–304. Today, `usePortrait` in
  `hero-backdrop.jsx:32-44` flips `scale` from 1 to 1.7 after mount on phones,
  which tears down and rebuilds the entire WebGL context — a second context
  creation and shader compile in the middle of hydration.

This also improves `/contact`, which mounts ColorBends via `contact-form.jsx`.

### 1.2 CSS-only hero reveals · mobile LCP render delay 6.3 s → ~0

**`hero.jsx`** + **`hero.module.scss`**

- Convert all four `reveal()` elements — eyebrow (139), h1 (143), paragraph
  (147), ctaRow (151) — from `motion.*` to plain elements and delete the
  `reveal()` helper (lines 124–128). Convert **all four**, not just the h1: if
  only the headline became CSS-driven it would animate at t≈0 while its siblings
  waited for hydration, visibly breaking the 0.09 s stagger.
- In SCSS add `@keyframes heroReveal { from { opacity: 0; transform:
  translateY(16px); } to { opacity: 1; transform: none; } }` and apply
  `animation: heroReveal .5s ease-out both` with delays `0 / .09s / .18s / .27s`.
  Under `@media (prefers-reduced-motion: reduce)` swap in an opacity-only
  keyframe — that replicates the current `reducedMotion` branch of `reveal()`.
- Net effect: the animation starts at first style resolution instead of after
  hydration, the SSR HTML no longer ships `opacity:0`, and LCP records roughly
  one frame after FCP. Identical visual, much earlier.
- Leave the rail (lines 171–209) and the floating-cards visual (211–225) as
  `motion` components — decorative, never LCP candidates.

### 1.3 Loader: keep the concept, cut the dead time · desktop SI 3.6 s → ~2.2 s

The canvas-paint dismissal signal stays — the loader is an intentional design
element, not a timer. Three changes, only one of which is visible:

- **Warm the backdrop chunk early.** In `hero-backdrop.jsx`, below the two
  `dynamic()` declarations (lines 16–17), add a module-scope client-only
  `import()` of whichever variant matches `matchMedia("(min-width: 1024px)")`.
  The three.js chunk then starts downloading at bundle evaluation instead of
  after mount plus the `useHeroVariant` effect, and Turbopack dedupes it against
  the later `dynamic()` load. This also stops desktop from fetching the
  ColorBends chunk it never mounts. Leave `useHeroVariant`'s effect-based flip
  alone — changing its initial state would cause a hydration mismatch on the
  `sectionSharp` class and the rail markup.
- **Credit ring time already elapsed.** In `hero-loading-provider.jsx` the ring
  starts drawing at mount (CSS) but the dismiss effect (lines 50–54) always waits
  the full `RING_MS` *after* `heroReady`. Record the mount time in a ref and wait
  `max(0, RING_MS - elapsed) + FADE_MS` instead. On any load slower than 900 ms —
  i.e. every cold load — this removes up to 900 ms of dead overlay with **zero**
  visual change, because the ring has already finished drawing.
- **Tighten the constants.** `SAFETY_MS` 4000 → 2500 and `FADE_MS` 500 → 300
  (provider lines 25 and 29); the canvas-watch timeout in `hero.jsx:95`
  3000 → 2000. *Visible change: the fade-out is 200 ms snappier, and on a device
  where WebGL never reports a canvas the overlay gives up at 2.5 s instead of
  4 s. The ring's own draw speed is untouched.*

Interaction with 1.1 is already resolved: the static-frame path still appends a
`<canvas>` and paints once, so `useBackdropReady`'s MutationObserver and two-rAF
wait fire normally under software GL and reduced motion.

### 1.4 Add a browserslist · −14 KiB gz of executed JS

There is no `browserslist` field in `package.json` and no `.browserslistrc`, so
Next emits a 112 KB core-js polyfill bundle. Add:

```json
"browserslist": ["chrome >= 111", "edge >= 111", "firefox >= 128", "safari >= 16.4"]
```

This drops the inlined transforms Lighthouse flags (`Array.prototype.at`,
`Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimStart`, …) and also
tightens autoprefixer's output, since it currently runs against a wide default.

### 1.5 Preload the latin font files · kills the 2.6 s mobile font chain

The `@font-face` rules live in `src/app/styles/sass/_font-family.scss:5-39` and
reach the browser only through a render-blocking CSS chunk, so discovery costs
three sequential round trips. `font-display: swap` is already set; what is
missing is preload. In the hand-written head of `src/app/[locale]/layout.js`
(lines 31–44) add two links:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous"
      href="/fonts/outfit/Outfit-VF-latin.woff2" />
<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous"
      href="/fonts/manrope/Manrope-VF-latin.woff2" />
```

Do **not** preload the `-ext` variants — they are `unicode-range`-subset and
would download bytes the page never paints. The fonts are same-origin, so
`preconnect` would be a no-op; preload is the correct fix.

---

## Phase 2 — payload and jank

- **2.1 Scope the i18n client payload.** `src/app/[locale]/layout.js:27` calls
  `getMessages()` and line 47 hands the **entire** locale file (en 58 KB /
  fr 65 KB, 618 strings for every page on the site) to
  `NextIntlClientProvider` — roughly a third of the 147 KB homepage HTML. Both
  nested layouts are `"use client"`, so the root layout is the only place that
  can scope. Use `pick` from `lodash` (it supports deep paths and rebuilds the
  nesting): `messages={pick(messages, CLIENT_NAMESPACES)}` with `components`,
  `pages.homepage`, `pages.portfolio`, `pages.contact`, `pages.audit-results`,
  `pages.privacy-policy` — plus `pages.services` and `pages.about-us` if their
  components turn out to be routed. Server-side `getTranslations` is unaffected.
  Before shipping, re-grep for `useTranslations(` (including the bare form) and
  click through every route in dev, where next-intl throws loud `MISSING_MESSAGE`
  errors. The failure mode in prod is a silently missing string, which is why
  this is Phase 2 rather than Phase 1.
- **2.2 Kill the forced reflow in the pinned rail.**
  `recent-works-showcase.jsx:50-57` reads `outer.offsetHeight` **and**
  `outer.getBoundingClientRect()` on every scroll event — two forced layouts per
  frame, the 38 ms the report attributes to "Forced reflow". Cache `offsetTop`
  and `offsetHeight` in the existing `layout()` / ResizeObserver path and derive
  progress from `window.scrollY`.
- **2.3 Delete the duplicate global stylesheet import** at
  `src/app/[locale]/(context)/layout.jsx:11` — `global.scss` is already imported
  by the root layout at line 1.
- **2.4 Stop the invisible spinner.** `src/app/styles/global.scss:120-141` runs
  `body::before { animation: spin 1s linear infinite }` at `opacity: 0` on every
  page for the whole session. Gate the animation to the visible state, or default
  it to `animation-play-state: paused`.

---

## Phase 3 — optional, decide before doing

- Drop unused dependencies: `recharts` (only the dead `GaugeChart` imports it),
  `@next/third-parties` and `@plaiceholder/next` (installed, never imported);
  move `@tailwindcss/oxide` and `babel-plugin-react-compiler` to devDependencies.
- Accessibility and SEO items from the same report: pass
  `aria-label={project.title}` to the three identical "Learn More" links
  (`recent-works-showcase.jsx:124-132` — `CtaLink` spreads `...rest`, so this
  needs no component change), and change the `h4` at `values.jsx:44` to `h3`
  (document order is currently h2, h3, h2, h4; `.valueName` styles the class, not
  the tag, so it is a pure markup fix). The manifesto words shipping at
  `opacity: 0.16` are the contrast failure — raising the floor changes the scroll
  scrub design, so that is a separate decision.
- The 769–1023 px band gets the worst of both worlds: the ColorBends shader plus
  three infinitely-floating cards with `backdrop-filter: blur(20px)` compositing
  over the live canvas (`hero.module.scss:443-513`). Candidate for a cheaper
  treatment at that width, with a visible tradeoff.

---

## Verification

1. `npm run build`, then `npm run start`.
2. `npx lighthouse http://localhost:3000/en --preset=desktop --output=html --output-path=lh-desktop.html`,
   and the same command without `--preset` for mobile. Run three times and take
   the median — TBT under SwiftShader is noisy.
3. Expect after Phase 1: desktop TBT under 600 ms, SI around 2.2 s, Performance
   90–95; mobile LCP render delay under 500 ms, Performance ~98. In the trace,
   confirm no long tasks recur after the single static-frame render.
4. Manual QA:
   - Real-GPU Chrome (`chrome://gpu` reports hardware acceleration) still shows
     the animated cube grid and the animated bends.
   - `?backdrop=cubes` and `?backdrop=bends` both still dismiss the loader.
   - Phone portrait no longer flashes or rebuilds the ColorBends canvas after
     hydration.
   - `prefers-reduced-motion` yields static frames on both variants.
   - On throttled "Slow 4G" the ring never visibly cuts off mid-draw.
   - `/contact` still loads and dismisses its loader correctly.
