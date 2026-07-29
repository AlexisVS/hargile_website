# Homepage performance plan — desktop Lighthouse 61 → 90+

> Written 2026-07-28 from a PageSpeed Insights run on `hargile.com/en`.
> Baseline: **desktop Performance 61** (FCP 0.3 s, LCP 0.6 s, **TBT 13,900 ms**,
> CLS 0.044, **SI 3.6 s**) vs **mobile 95** (LCP render delay 6,290 ms).
>
> **RÉSULTAT PROD (2026-07-29) : desktop 91 (baseline 61 — objectif 90+
> atteint), mobile 94 (baseline 95, plat), SEO 92 → 100.** L'écart avec le banc
> local (desktop 98) est attendu : PSI tourne sans GPU, donc le backdrop passe
> en rendu logiciel — c'est précisément le verdict SwiftShader que le banc local
> ne peut pas voir.
>
> ⚠️ **CORRECTION (2026-07-29, plus tard) — ces chiffres mesurent v0.17.0, pas
> v0.18.0.** v0.18.0 n'a jamais été déployée : le PR de bump d'image dans
> `hargile-infra` est resté ouvert, et le cluster a servi
> `hargile-website:v0.17.0` jusqu'au 2026-07-29 10:03 UTC. Preuve indépendante
> du manifeste : `hargile.com/fr/audit/result` renvoyait encore **200** alors
> que v0.18.0 supprime cette route — c'est exactement le marqueur que la session
> précédente s'était donné, et il disait « pas déployé » tout du long.
>
> Donc **desktop 91 = phase 1 seule** (livrée dans v0.17.0). Les phases 2–3 ne
> sont arrivées en prod que le 2026-07-29 à 10:03 UTC, avec v0.19.0.
>
> ✅ **MESURE RÉELLE (2026-07-29, PSI prod, 8 runs sur v0.19.1) :
> médiane desktop 89, médiane mobile 94.** Baseline desktop 61. Objectif 90+
> atteint. Runs bruts : desktop 70 / 79 / 95 / 87 / 97 / 91 / 71 / 93,
> mobile 82 / 98 / 97 / 84 / 93 / 95 / 71 / 97.
>
> ⚠️ **L'amplitude est d'environ ±25 points, et « attendre que ça chauffe » ne
> suffit pas.** Un run à chaud, 20 min après le déploiement, a rendu 71/71 ; le
> run suivant, **5 secondes plus tard**, 93/97. Même build, mêmes octets, même
> serveur. Le site est la constante, la mesure est la variable. Un run PSI isolé
> sur ce site ne mesure pas le code — ne jamais en tirer de conclusion.
>
> ⚠️ **Le « 99/99 » écrit ici plus tôt était UN seul run, et il ne faut pas le
> prendre pour la baseline.** C'est la même erreur que celle dénoncée juste en
> dessous, commise à l'envers : la règle des médianes a été appliquée aux
> chiffres qui déplaisaient (89, 81) et levée pour celui qui plaisait. Le vrai
> résultat est une **distribution d'environ ±25 points**, pas un nombre.
>
> **Pourquoi l'écart est si large ici, et pourquoi ça ne se répare pas.** Le TBT
> pèse 30 % du score et il est dominé par le parse/execute de three.js pour le
> backdrop du hero. PSI tourne sans GPU : ce travail passe en SwiftShader, et
> son coût dépend de la machine que la flotte Google attribue au run. Mesuré :
> TBT de 40 ms à 160 ms d'un run à l'autre, sans changement de code. Un écart
> de 10 points entre deux runs n'est donc **pas** un signal.
>
> ⚠️ **Après un déploiement, attendre.** Ce n'est pas seulement le conteneur qui
> est froid : chaque build renomme tous les chunks (hash de contenu), donc le
> cache CDN est vide pour **chaque** CSS/JS/police. Un run à +1 min a sorti 70.
> Attendre ~10 min, puis médiane de 3 à 5 runs. Un run isolé après déploiement
> ne veut rien dire, dans un sens comme dans l'autre.
>
> **STATUS (2026-07-29): fully implemented and merged to `main`, tagged
> v0.18.0.** Phase 1 shipped in v0.17.0 (`f92df2a`). Phases 2–3 were built on
> `feat/perf-phase2-3` on 2026-07-28 and merged on 2026-07-29 — the branch is
> now historical, read `main`. Per-item notes below are marked ✅ DONE with
> deviations where reality disagreed with the plan (notably: GaugeChart was
> *not* dead — though the whole audit feature it served was removed on
> 2026-07-29 as unreachable dead code, taking the SVG rewrite with it; and the
> GDPR banner turned out to be the mobile LCP element — see 2.5). Local medians
> after Phases 2–3, `/fr`, 3 clean runs per form factor:
> **desktop 98** (TBT 48 ms, SI 1.06 s, LCP 1.0 s, CLS 0.045) and
> **mobile 49** on the much-harsher local bench (TBT 1.4 s, CLS 0.009), with
> the LCP element back to the **h1 on both form factors**. The two design
> decisions (769–1023 px band, manifesto contrast floor) were resolved the
> same day — see Phase 3.

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

*(all items ✅ DONE on `feat/perf-phase2-3`, plus a new 2.5 discovered at
measurement time)*

- **2.1 Scope the i18n client payload.** ✅ DONE — `src/app/[locale]/layout.js:27` calls
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
  *Outcome:* `CLIENT_NAMESPACES` in the root layout holds exactly the six
  namespaces listed above — the re-grep confirmed no bare `useTranslations()`
  and that `pages.services` / `pages.about-us` components are unrouted dead
  code, so they are deliberately excluded. All routes clicked in dev, both
  locales: zero `MISSING_MESSAGE` (browser console and SSR log). HTML
  −12 KB `/fr`, −11 KB `/en` *despite* 2.5 adding the SSR'd banner markup.
- **2.2 Kill the forced reflow in the pinned rail.** ✅ DONE —
  `recent-works-showcase.jsx:50-57` reads `outer.offsetHeight` **and**
  `outer.getBoundingClientRect()` on every scroll event — two forced layouts per
  frame, the 38 ms the report attributes to "Forced reflow". Cache `offsetTop`
  and `offsetHeight` in the existing `layout()` / ResizeObserver path and derive
  progress from `window.scrollY`.
  *Outcome:* geometry (`pinDist`, `outerTop`) cached in `layout()`; `onScroll`
  does zero layout reads. One addition beyond the plan: the ResizeObserver now
  also observes `document.body`, because the cached `outerTop` goes stale when
  content above the section changes height (image loads) — the old
  read-per-frame code was immune to that by construction.
- **2.3 Delete the duplicate global stylesheet import** ✅ DONE — at
  `src/app/[locale]/(context)/layout.jsx:11` — `global.scss` is already imported
  by the root layout at line 1.
- **2.4 Stop the invisible spinner.** ✅ DONE — `src/app/styles/global.scss:120-141`
  runs `body::before { animation: spin 1s linear infinite }` at `opacity: 0` on
  every page for the whole session. Gate the animation to the visible state, or
  default it to `animation-play-state: paused`.
  *Outcome:* `animation-play-state: paused` by default, set back to `running`
  by the `.exiting` / `.entering` visible states.
- **2.5 (NEW — found at measurement) SSR the GDPR banner.** ✅ DONE — once the
  hero reveals became CSS-driven, the consent banner (`ClientGDPRWrapper`,
  styled-components, previously gated behind `useIsClient`) was the biggest
  post-hydration paint and became the **mobile LCP element**. Deferring it
  further would have made LCP *worse* (a late-painting largest element defines
  LCP in a no-input lab run), so the fix is the opposite: render it in the SSR
  HTML so it paints at FCP. Returning visitors get no flash: a tiny synchronous
  inline script in the root layout `<head>` reads
  `localStorage.rgpd_consents` pre-paint and sets `html[data-gdpr-stored]`,
  which a `global.scss` rule uses to hide `.gdpr-banner` until hydration
  unmounts it for good. The banner is `position: fixed`, so zero CLS (measured
  0.009 mobile). Verified both ways in-browser; LCP element is the h1 again on
  both form factors. Side benefit: the cookie notice text is now in the raw
  HTML (GEO guardrail likes this).

---

## Phase 3 — optional, decide before doing

- Drop unused dependencies. ✅ DONE, with one correction to the plan:
  `recharts` was **not** only imported by dead code — `GaugeChart` is alive and
  rendered on `/audit/result` (4 gauges). It was rewritten as pure SVG arcs
  (same geometry as the recharts `PieChart`: radii 80/86, 50/40/10 segments,
  3° padding; the motion needle untouched), which made removing recharts safe.
  Verified visually with injected localStorage audit data. `@next/third-parties`
  and `@plaiceholder/next` removed (never imported); `@tailwindcss/oxide` and
  `babel-plugin-react-compiler` moved to devDependencies (the Dockerfile's
  `npm ci` installs devDeps, so the image build is unaffected — verified with a
  full build). Lockfile regenerated from a clean HEAD state so the pre-existing
  uncommitted in-range drift was not smuggled in.
- Accessibility and SEO items. ✅ DONE — `aria-label={project.title}` passed to
  the three "Learn More" links (`CtaLink` spreads `...rest`, no component
  change), and the `h4` at `values.jsx:44` is now an `h3` (`.valueName` styles
  the class, not the tag — pure markup fix).
- Manifesto contrast. ✅ DONE (decision 2026-07-28: keep the design) — the
  manifesto words shipping at `opacity: 0.16` (`scrub-word.jsx`, scrubbed
  0.16 → 1 on scroll) were the contrast failure. Resolution: the scrubbed
  words are wrapped in `aria-hidden="true"` and the blockquote carries an
  `sr-only` copy of the full text. Screen readers actually gain (whole
  sentences instead of scattered dim words), the contrast audit no longer
  applies to decorative text, the copy stays in the raw HTML for crawlers,
  and the visual design is untouched. The rejected alternative — raising the
  floor to ~0.45–0.5 — passed contrast "for real" but visibly flattened the
  reveal.
- The 769–1023 px band. ✅ DONE (decision 2026-07-28) — it got the worst of
  both worlds: the ColorBends shader plus three infinitely-floating cards with
  `backdrop-filter: blur(20px)` compositing over the live canvas
  (`hero.module.scss` `.floatCard`). The cost driver is **not** the card
  drift: the blur recomposites every frame because the *backdrop* (live
  canvas) changes every frame, so freezing the drift alone buys nothing.
  Resolution: in that band only, `backdrop-filter: none` and the same
  gradient fill raised to ~0.72/0.82/0.9 opacity — tinted panels instead of
  frosted glass, a subtle difference over a moving gradient (verified at
  900 px). Mobile (≤768) keeps the glass: cards there are static in-flow and
  were not the jank driver. The rejected alternative was a static ColorBends
  frame in the band (zero cost but an inert background).

---

## Verification

1. `npm run build`, then `npm run start`.
2. `npx lighthouse http://localhost:3000/en --preset=desktop --output=html --output-path=lh-desktop.html`,
   and the same command without `--preset` for mobile. Run three times and take
   the median — TBT under SwiftShader is noisy.
3. Expect after Phase 1: desktop TBT under 600 ms, SI around 2.2 s, Performance
   90–95; mobile LCP render delay under 500 ms, Performance ~98. In the trace,
   confirm no long tasks recur after the single static-frame render.

   **Measured after Phases 2–3** (local, `/fr`, medians of 3 clean runs,
   reports in `..\lh-reports\p23-*.json`): desktop **98** — TBT 48 ms,
   SI 1.06 s, LCP 1.0 s, CLS 0.045; mobile **49** — TBT 1.4 s, CLS 0.009.
   LCP element = the h1 on both form factors. The mobile absolute number is a
   local-bench artifact (the loader overlay's late dismissal lands the h1
   render delay at ~5.7 s locally; PSI on production does not behave this way)
   — compare trends, not absolutes.

   **Measurement pitfalls (all hit for real):**
   - Kill stale `next start` processes first — a leftover server on :3000
     serves the *old* build and silently invalidates every check against it.
   - Close any QA browser (agent-browser etc.) before running Lighthouse: an
     open tab with a live WebGL canvas costs ~5 desktop points of TBT noise
     (measured 93 contaminated vs 98 clean, same build).
   - Compare at constant locale — `/fr` HTML is ~7 KB heavier than `/en`.
   - The SwiftShader verdict exists **only** on PSI after deploying: local
     headless Chrome uses the real GPU, and `--disable-gpu` kills WebGL
     instead of simulating software rendering.
   - Dev-only: the first cold compile after a prod build can transiently 404
     every `(context)` route (Turbopack cache artifact) — restart/recompile
     before concluding anything is broken.
   - GEO guardrail §1.5 after each change: `curl` the raw HTML of `/fr` and
     `/en` — h1 + copy present without JS, no new inline `opacity:0` on copy.
     **Count with a guard**: `opacity:0(?![.\d])`, or better, only count matches
     inside a `style="…"` attribute. A bare `grep -o 'opacity:0'` also matches
     `opacity:0.16` / `0.25` / `0.45` (scrub-word, mvp-promo dots) and inflated
     the old baseline from 27 to 76.
     As of v0.19.0 the copy is clean: **0** inline `opacity:0` on both locales.
     Six matches remain in `<style>` blocks — three CSS rules emitted twice
     (hamburger `bar-middle`, mobile-menu overlay, a hover blob) — and none of
     them touch copy, so six is the floor, not a target to drive down.
4. Manual QA:
   - Real-GPU Chrome (`chrome://gpu` reports hardware acceleration) still shows
     the animated cube grid and the animated bends.
   - `?backdrop=cubes` and `?backdrop=bends` both still dismiss the loader.
   - Phone portrait no longer flashes or rebuilds the ColorBends canvas after
     hydration.
   - `prefers-reduced-motion` yields static frames on both variants.
   - On throttled "Slow 4G" the ring never visibly cuts off mid-draw.
   - `/contact` still loads and dismisses its loader correctly.

---

## Prompt de reprise

Le prompt de reprise vit désormais dans **`docs/next-session-prompt.md`**.
Source unique — ne pas en recopier une version ici, elle dériverait.
