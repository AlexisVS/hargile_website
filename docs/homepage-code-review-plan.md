# Homepage (index page) code-review fixes — execution plan

> Written 2026-07-28 from a full read of the v2 index page tree. Not yet
> implemented — this is the execution plan for a future session. Findings are
> ordered by impact; each item is self-contained with file paths, the exact
> problem, and the intended fix, so no re-audit is needed before executing.
>
> Page composition: `src/app/[locale]/(context)/(client)/page.jsx` →
> `HomePageClient.jsx` → five v2 sections: `HeroV2`, `MvpPromoV2`,
> `DesignDevV2`, `RecentWorksShowcaseV2`, `ValuesV2`
> (all under `src/components/pages/homepage/v2/`).

## Context

- Branch at time of audit: `feat/perf-phase2-3` (phase-1 perf work landed in
  `f92df2a`; this plan continues that effort plus GEO alignment).
- Related docs: `docs/homepage-performance-plan.md` (Lighthouse work),
  `docs/geo-plan.md` (AI answer-engine visibility — item 1 below is a direct
  dependency of that plan's goals).

## Priority 1 — high impact

### 1.1 Below-the-fold copy ships as `opacity: 0` in SSR HTML (GEO blocker)

**Problem.** The hero h1 was already fixed (see the comment in
`src/components/pages/homepage/v2/hero/hero.jsx` ~line 132: reveals moved to
CSS keyframes so the SSR HTML paints readable text). But every other section
still serializes `opacity: 0` into the server HTML:

- `useReveal()` (`src/components/pages/homepage/v2/useReveal.js`) returns
  `initial: {opacity: 0, ...}` motion props used by every heading, lead,
  step and value card in `mvp-promo.jsx`, `design-dev.jsx`, `values.jsx`.
- `verbs-quote.jsx` (~line 45) does the same per word.
- `scrub-word.jsx` serializes ~0.16 opacity per manifesto word (dim but
  passable — lower priority than the full-zero cases).

Any client that doesn't execute JS — most AI answer-engine crawlers, exactly
what `docs/geo-plan.md` targets — reads a transparent page below the hero.

**Fix.** Replicate the hero's approach: initial state + reveal via CSS
(keyframes or `@media (prefers-reduced-motion)`-aware transitions) so SSR HTML
is fully opaque, with motion/JS only *enhancing*. Options, in order of
preference:

1. Rewrite `useReveal` to return a CSS-class-based reveal (IntersectionObserver
   or `animation-timeline` fallback) instead of motion `initial`/`whileInView`
   props. One change fixes all consumers.
2. If keeping motion: render with no `initial` and add a client-only mount
   gate so the SSR pass never carries inline `opacity:0` (verify by fetching
   the raw HTML — see verification below).

Apply the same treatment to `verbs-quote.jsx` word spans.

**Verification.** `curl` (or PowerShell `Invoke-WebRequest`) the built page
with JS disabled semantics — i.e. inspect the raw HTML response — and confirm
no `opacity:0` inline styles on h2/p/step/card copy. This is the same
raw-HTML-fetch method used for the GEO audit.

### 1.2 `priority` preload on a below-the-fold image

**Problem.** `src/components/pages/homepage/v2/recent-works-showcase/recent-works-showcase.jsx`
~line 122: `priority={i === 0}` on the first project `<Image>`. The section is
~3 viewports down; `priority` emits a `<link rel=preload>` that competes with
hero chunks/fonts during the LCP window.

**Fix.** Remove the `priority` prop (default lazy-loading is correct here).
One-line change.

✅ **DONE 2026-07-29** (shipped in v0.18.0). Confirmed live before the fix: the
`/fr` head carried `rel="preload" as="image"` for `ecoledub.webp` alongside the
two font preloads. Removed the prop; the map's now-unused `i` param went with
it. Verified absent from the built HTML afterwards.

**Verification.** Build, view page source, confirm no preload for
`/images/portfolio/ecoledub.webp`. Optionally re-run Lighthouse desktop and
compare against the numbers in `docs/homepage-performance-plan.md`.

### 1.3 `hostnameOf` can crash the entire homepage

**Problem.** Same file, ~line 13: `const hostnameOf = (url) => new URL(url).hostname...`
runs unguarded during render for the fake browser-bar chip. All current
`actionUrl` values in `src/data/portfolio-data.js` are absolute, but one
relative/empty URL added later throws during render → blank homepage.

**Fix.** Wrap in try/catch returning `""`; render the chip only when non-empty.

## Priority 2 — medium impact

### 2.1 Desktop mounts ColorBends before flipping to cubes — visible flash

> **Upgraded 2026-07-29 (observed, not inferred).** Originally written as
> "wasted bytes." Mihai reports that on a hard refresh at desktop width the
> bends gradient is **visibly rendered** before the cube grid replaces it. So
> this is not just a wasted chunk — it is a wrong-backdrop flash on every cold
> desktop load. No "confirm it's real" step needed; go straight to the fix.
> Raised to Priority 1 in practice.

**Problem.** `useHeroVariant` (`hero.jsx` ~lines 23–41) initializes to
`"bends"` and corrects to `"cubes"` in an effect after mount. That first
client render mounts `<ColorBends>` (a `dynamic(..., {ssr:false})` import in
`backdrops/hero-backdrop.jsx`), which kicks off its chunk fetch before the
variant flips. three.js itself dedupes against the module-eval warm-up of
`cube-grid` (hero-backdrop.jsx ~line 28), but the ColorBends component chunk
is wasted bytes on every desktop load.

**Fix.** Track "variant resolved" in `useHeroVariant` (e.g. initial state
`null` meaning unresolved) and have `HeroBackdrop` render `null` until
resolved. Costs one frame; nothing visible is loaded that early anyway (the
backdrops are ssr:false). Keep the SSR/first-client-render agreement — the
resolution must still happen in an effect, not during render.

**Caution.** `useBackdropReady` (`hero.jsx` ~lines 53–106) watches for the
canvas and has a `"none"` fast path + 2 s timeout; make sure an unresolved
(`null`) variant doesn't mark ready early or hang the branded loader.

**Verification.** DevTools network panel on a ≥1024 px viewport, hard reload:
no `ColorBends`/`color-bends` chunk requested. Loader still dismisses on both
desktop and a <1024 px viewport.

### 2.2 Recent-works scroll pinning ignores `prefers-reduced-motion`

**Problem.** The pinned horizontal-scroll hijack
(`recent-works-showcase.jsx`, effect at ~lines 27–98) runs regardless of
reduced-motion preference, while every other section collapses its animation.

**Fix.** In `layout()`, treat reduced motion like `< PIN_BREAKPOINT`: fall
into the non-pinned branch so users get the native horizontal-swipe layout.
Check `matchMedia("(prefers-reduced-motion: reduce)")` alongside the width
check, and re-run layout on preference change (add it to the listeners).
Verify the mobile CSS layout is acceptable at desktop widths under this mode
(check `recent-works-showcase.module.scss` — the `@media (max-width: 899px)`
styles may need a `.noPin` class equivalent rather than relying on the media
query).

### 2.3 Duplicated backdrop variant resolution (dead code drift)

**Problem.** `resolveVariant()` in `backdrops/hero-backdrop.jsx` (~lines
59–66) re-implements the `?backdrop=` URL-param parsing that `useHeroVariant`
already does, plus a `NEXT_PUBLIC_HERO_BACKDROP` env path. The hero always
passes `variant`, so this is dead in practice and will drift.

**Fix.** Make `variant` a required prop of `HeroBackdrop`; delete
`resolveVariant`. If the env-var override is worth keeping, move that read
into `useHeroVariant` so there's one owner. Grep for other `HeroBackdrop`
usages first to confirm nothing relies on the prop-less form.

## Priority 3 — polish (batch into one commit)

### 3.1 Simplify `usePortfolioData`

`src/hooks/usePortfolioData.js`: a class instantiated inside `useMemo`,
fresh closure wrappers per render, translating all 22 projects to show 3 on
the homepage. Replace with a plain `useMemo`d translated array + simple
helpers. Keep the public API (`getAllProjects`, `getLatestProjects`,
`getProjectById`) — it's used beyond the homepage (portfolio page); grep
callers before touching.

### 3.2 Locale-proof the values section split

`src/components/pages/homepage/v2/values/values.jsx` ~line 17 splits
`who_description` on `"\n\n"`; a translator dropping the blank line in one
locale silently loses the ambition paragraph. Split the message into two keys
(`who_statement`, `who_ambition`) across **all** locale files in `messages/`
(or wherever next-intl messages live — check `src/i18n` config), with the
second optional.

### 3.3 Shared `useMediaQuery` hook

Three hand-rolled matchMedia hooks are the same pattern: `useHeroVariant`
(hero.jsx), `useVerticalRail` (mvp-promo.jsx ~19–31), `usePortrait`
(hero-backdrop.jsx ~45–57). Extract `useMediaQuery(query)` into
`src/hooks/` and rebuild the three on top. Preserve each hook's
SSR-consistency behavior (all resolve in effects — keep it that way).

### 3.4 Small nits

- `values.jsx` ~line 39: `key={v.value}` uses translated text as React key →
  use the array index or add stable slugs to the message data.
- `values.jsx`: value cards restart `reveal(i)` at 0, so card 1 animates in
  sync with the heading — confirm intended; if not, offset the index.
- `recent-works-showcase.jsx` ~line 139: `aria-label={project.title}` replaces
  the visible "View more" text; use
  `` aria-label={`${project.actionText} — ${project.title}`} ``.

### 3.5 Optional cleanup — v1 homepage sections

The v1 sections (`about-us/`, `services/`, `digital-audit/`,
`trusted-brands/`, `latest-insights/`, `hero/`, `mvp-promo/`,
`quote-request/`, `Stars.jsx`, `BlurredCircles.jsx` under
`src/components/pages/homepage/`) are not imported by the v2 index page, so
they cost nothing at runtime — tree clutter only. **Grep each for imports
from other routes before deleting** (e.g. `quote-request` and
`hero/GaugeChart.jsx` / `hero/AuditMultiModal.jsx` may be used by the audit
flow — GaugeChart has uncommitted changes on the current branch, which
suggests it's live somewhere). Only delete what is provably unreferenced.
Skip this item entirely if v2 isn't considered final yet.

## Execution notes

- Suggested order: 1.2 and 1.3 first (one-liners, zero risk), then 1.1 (the
  big one — touch `useReveal` once, verify all four consuming sections), then
  2.x, then batch 3.x.
- Commit style in this repo: conventional commits with scope, e.g.
  `perf(homepage): …`, `seo(i18n): …`, `fix(homepage): …`.
- After 1.1, re-check `prefers-reduced-motion` behavior in every section —
  the current motion-based reveals collapse to fades via `useReducedMotion()`
  and a CSS rewrite must keep an equivalent.
- Full-page smoke test after each priority tier: hero loader dismisses,
  cubes/bends switch at 1024 px, recent-works pin + progress counter, values
  render in fr/en/nl locales.

---

## Prompt de reprise

Le prompt de reprise vit désormais dans **`docs/next-session-prompt.md`**
(session ciblée sur les items 2.1, 1.3 et 1.1). Source unique — ne pas en
recopier une version ici, elle dériverait.
