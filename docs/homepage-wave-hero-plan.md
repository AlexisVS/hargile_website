# Homepage wave-grid hero — plan

> Written 2026-07-31, after shipping the still wave grid on `/services`
> (see [wave-grid.md](./wave-grid.md)).
>
> **Goal.** A second homepage, side by side with the current one, whose hero
> backdrop is the wave-grid cubes as the technique is actually meant to look:
> **moving on desktop, a still frame on mobile**. One visual language on both,
> replacing today's split where desktop gets cubes and mobile gets colour bends.
>
> **Status (2026-08-03, fourth session).** Phases 1–7 shipped — phase 7 closed
> when the phone still was finally rendered, looked at and served. Mihai picked the
> wave hero, so `/` serves it at every width — live canvas on desktop, exported
> still below 1024px, capability rail instead of glass cards on both — and phase
> 6 then removed everything the comparison had needed: the `bends` and `cubes`
> variants, the variant switcher, and the hero's glass-card branch. **The hero
> now has exactly one backdrop and one layout.** `/preview/home-wave` survives,
> but as the export script's target rather than as a preview — see phase 6.
>
> For the day-to-day loop — browsing compositions, exporting either page's image,
> moving a quiet zone — see [wave-grid.md](./wave-grid.md); it now covers both
> pages side by side.

## Where we are

> **Superseded — this describes the starting point, not the code.** Phase 6
> removed the switcher this section is about: there is no `backdrop` prop, no
> `?backdrop=`, and no `VARIANTS` any more. Kept because it is what the plan was
> written against; the line reference below no longer resolves.

The homepage hero already has everything needed to host a second backdrop:

- `HeroV2` takes a `backdrop` prop and honours `?backdrop=<key>`
  ([`hero.jsx:118`](../src/components/pages/homepage/v2/hero/hero.jsx))
- `HeroBackdrop` is already a switcher — `VARIANTS = ["bends", "cubes", "none"]`
  ([`hero-backdrop.jsx`](../src/components/pages/homepage/v2/hero/backdrops/hero-backdrop.jsx))
- `HomePageClient` renders `<HeroV2/>` with no props, so a second page is a thin
  wrapper, not a fork

So this is mostly **one new variant plus one new route**, not a rebuild.

## ⚠️ The animated wave grid no longer exists in code

> **Superseded — it exists again.** `wave-grid.jsx` now takes `mode="live"`, and
> the table below is what it was rebuilt from. Kept because the table is still
> the reference for what every constant is for and why it is not the upstream
> value, and because the two rows marked ⚠️ are the trap that outlives the
> rebuild. The section reads as history from here.

This is the first thing to know, because it changes the size of Phase 1.

During the session that built `/services`, the grid was animated first and then
deliberately rewritten as a single still frame. **The animated version was never
committed** — `git log` on `wave-grid.jsx` shows exactly one commit, the still
one. It is not recoverable from history; it has to be rebuilt.

The tuning is not lost, though. These values were arrived at by iteration and are
recorded here precisely so Phase 1 does not start from the upstream defaults
again:

| Constant | Use | Upstream | Ours | Why |
| --- | --- | --- | --- | --- |
| `WAVE.speed` | wavefront expansion | 6.0 | **2.2** | 6.0 crosses the frame in well under a second — constant motion in the reader's periphery |
| `WAVE.fadeTime` | ripple lifetime | 2.0 | **3.0** | must rise with the speed drop: fade is on *age*, so a slower front covers less ground before dying |
| `WAVE.amplitude` | rise | 0.4 | **0.4** | ⚠️ **not** the still frame's 1.0 |
| `WAVE.maxHeight` | rise clamp | 0.4 | **0.45** | ⚠️ **not** the still frame's 0.8 |
| `TRAIL_SPACING` | min gap between pointer ripples | 0.1 | **0.35** | at 0.1 one brisk sweep dumps dozens of overlapping fronts and the grid boils |
| `IDLE_INTERVAL` | ambient ripple cadence | 1.5 | **4.0** | at 1.5 with a 3 s fade the grid never rests |
| `IDLE_SPREAD` | ambient ripple placement | grid-relative | **5.0 world units** | the camera is zoomed well inside the grid; a grid-relative spread spawns most ripples off-screen where they die before arriving |
| `MAX_TRAIL` | pointer trail length | 128 | **64** | loop runs per-vertex, and again in the shadow pass |
| camera lerp | tilt easing | 0.04/frame | **0.04** | unchanged |

> **Six of these rows are no longer what live mode runs.** The table is what the
> rebuild started from, and it was right to start there. Then the pace was judged
> too busy on desktop, so the live mode was slowed as a set — the values are
> listed under [Pacing](#pacing) below. The table stays because it is still the
> record of *why* each constant is not the upstream one, and because the ⚠️ rows
> are unchanged and are still the trap.

**The amplitude difference is the trap.** The still frame uses roughly double,
because frozen, a low swell reads as an almost-flat floor with a faint tint —
the eye needs change to read a small height difference. Copying the still values
into the animated path will look wrong (spiky, over-lit).

Other behaviour to rebuild: pointer→plane raycast with a bounds check against the
mount (the canvas is `pointer-events: none`, so the listener lives on `window`),
ripple strength proportional to pointer speed, idle ripples after 3 s of no
movement, trail expiry at `fadeTime × 4`, and the run gate — an
`IntersectionObserver` **and** `visibilitychange`, since either alone leaks
frames.

## Phases

### ✅ Phase 1 — Restore a live mode on the wave grid

Extend `wave-grid.jsx` with a `mode` of `"still"` (default, what `/services`
uses) or `"live"`. **One component, not a fork**: geometry, shader, colour ramp
and camera are identical, and only the seed source and the loop differ. Forking
would duplicate a ~400-line shader file and guarantee the two drift.

`"live"` adds: the mouse trail, the rAF loop, idle ripples, the run gate, and the
camera tilt follow. `"still"` keeps today's behaviour untouched.

**Perf profile must differ from the still one.** The still frame chose DPR 2 and
shadows on because it renders exactly once — both are wrong for a loop:

| | still | live (proposed) |
| --- | --- | --- |
| grid | 48² = 2304 | **40² = 1600** |
| DPR | 2 | **1.5** |
| shadows | on | **on, 512 map** — or off if it does not hold 60fps |
| `MAX_TRAIL` | 14 seeds | 64 |

The shadow pass is a second full render of every pillar. It is what makes a dark
near-overhead field legible, so try to keep it — but it is the first thing to cut
if the frame budget does not hold. Measure before deciding.

**Exit criteria:** `/services?wave=1` still renders identically (regression
check), and a live mode runs at 60fps on desktop.

**Done.** Both criteria met, and the regression check turned out to be provable
rather than eyeballed: re-running `npm run images:wavegrid` after the refactor
produced a **byte-identical** `curated.avif`/`curated.webp` (same MD5, clean
`git status`). The still path renders exactly the same pixels. Frame times on
`/preview/home-wave`: median 16.7 ms, p95 17.0 ms, max 17.6 ms over 180 frames —
a locked 60 with no dropped frames, shadows kept on at a 512 map.

Two implementation notes worth keeping:

- **The two modes share one texture layout by making the still frame a stopped
  clock.** The texel is `{x, z, spawnTime, strength}` and the shader computes
  `age = uTime - spawn`. Still mode pins `uTime` to 0 and stores each seed's
  spawn as *minus* its age, so the expression is the authored age unchanged. No
  second code path, and the still frame is literally the live surface frozen.
- **Two values in the table above were unrecoverable and are new**, not restored:
  ripple strength (`min(0.35 + d × 0.55, 1.2)`, `d` = distance since the last
  ripple, which the 0.35 spacing gate turns into a rate) and the camera swing
  (`LIVE_SWING` 0.45 of the tilt ranges, *around* `STILL_VIEW` rather than around
  dead overhead — the rest pose has to be the good one, since that is where it
  settles the moment the pointer leaves). Tune these first if the motion feels
  wrong; everything else in the table is the recovered tuning.

#### Pacing

The recovered tuning ran correctly but read as busy on desktop — ripples
arriving on top of each other rather than a surface swelling. Live mode was
slowed as a set (still mode is untouched, and provably so: the re-export stayed
byte-identical after every one of these):

| Constant | Was | Now | Why |
| --- | --- | --- | --- |
| `speed` | 2.2 | **1.4** | the front now takes ~11 s to cross the visible frame rather than ~7 |
| `fadeTime` | 3.0 | **4.5** | a pair with speed — drop one without the other and every ripple dies before it has travelled |
| `TRAIL.spacing` | 0.35 | **0.7** | half as many ripples per pointer sweep |
| `TRAIL.minGap` | — | **0.55 s** | **new.** Distance alone still let a fast flick fire several ripples inside a hundred ms: far apart in space, stacked in time. This is the floor in time |
| `TRAIL.idleEvery` | 4.0 | **7.0** | each ambient ripple visibly settles before the next arrives — the eye gets somewhere quiet to return to |
| `TRAIL.idleAfter` | 3.0 | **4.0** | longer before the grid decides you have stopped |
| `TRAIL.idleStrength` | 0.9 | **0.75** | — |
| pointer strength | `min(0.35 + d×0.55, 1.2)` | **`min(0.25 + d×0.4, 0.9)`** | capped below 1.0, so a pointer ripple is a swell and not an event |
| `LIVE_LERP` | 0.04 | **0.025** | ~1.5 s camera settle: the tilt keeps drifting after you stop, which reads as weight rather than as a cursor-follow |

**Then the pointer response was found to stagger** — the wake stepping from one
ripple to the next instead of following the cursor. Throttling the trail was the
wrong lever for calm, and this is the correction:

| Constant | Was | Now | Why |
| --- | --- | --- | --- |
| `MODE.live.ramp` | — | **0.55 s** | **the actual fix.** `exp(-age/fadeTime)` is 1.0 at age 0, so every ripple was *born at full height* — each spawn popped, and a moving pointer replayed that pop once per spawn. Grown in instead, consecutive spawns blend into one wake |
| `TRAIL.spacing` | 0.7 | **0.2** | upstream is 0.1; a dense trail is what makes a wake read as one surface deforming |
| `TRAIL.minGap` | 0.55 s | **0.05 s** | now a rate cap (~20/s, so a flick can't outrun the ring buffer), not a thinning device |
| pointer strength | `min(0.25 + d×0.4, 0.9)` | **`min(0.18 + d×0.3, 0.6)`** | with the trail dense, how hard the surface reacts is set by how many ripples overlap, not by any one — so each is a nudge |

**The two questions in `TRAIL` pull opposite ways, and that is the lesson.**
Following the pointer wants *density*; ambient cadence wants *sparseness*. Tuning
the first as if it were the second is what produced the stagger. The lever that
buys calm without costing continuity is the birth ramp plus low per-ripple
strength — dense and gentle, not sparse and strong. The ambient dials
(`idleEvery` 7 s, `idleAfter` 4 s) were right and are unchanged.

`cube-grid.jsx` found the ramp independently and calls it the same thing — "the
anti-bounce". Worth reading its comment before touching either.

**`speed`/`fadeTime` had to be split per mode to do this.** They used to be
shared in `WAVE`; they now live in `MODE.still` / `MODE.live` alongside amplitude
and maxHeight. The still values are not a starting point to tune from — the STILL
composition's ages were chosen against speed 2.2 (radius ≈ speed × age) and fade
3.0, so changing either re-renders the shipped `/services` image.

### ✅ Phase 2 — A `wave` variant on the homepage backdrop

Add `"wave"` to `VARIANTS` in `hero-backdrop.jsx` and mount the wave grid in
`live` mode behind it. `?backdrop=wave` then works on the existing homepage
immediately — useful for comparison before any new route exists.

Two homepage-specific pieces of work:

**A new quiet zone.** `CALM` is an ellipse tuned to the `/services` copy box
(left column, `x -6.1…-0.1`, `z 0.3…2.1`). The homepage hero has a different
layout — headline plus three floating cards — so it needs its own ellipse, or
none. Do not reuse the services values.

**Prefetch stays desktop-only.** `hero-backdrop.jsx` warms the cube-grid chunk at
module evaluation on desktop only, because doing it on mobile measured **+1.7 s
of TBT** — it pulls the three.js parse into the hydration window. Same rule for
the wave chunk.

**Done.** `VARIANTS` is now `["bends", "cubes", "wave", "none"]`.

- The quiet zone is `HOME_CALM = {cx: -3.6, cz: 0.2, rx: 5.2, rz: 3.0, depth:
  0.55}` — taller than the services ellipse (rz 3.0 vs 1.9) because the copy here
  is eyebrow + big headline + paragraph + CTA down the same side, and *shallower*
  (0.55 vs 0.8) because the `.sectionSharp` mask already fades the canvas across
  that side; at full depth the two stacked and flattened the left half to a dead
  plate. Passed as a prop, and it must stay a module constant — `WaveGrid` takes
  it as an effect dependency and rebuilds the whole scene when it changes.
- **No second prefetch, deliberately.** What the loader waits on is three.js, and
  both backdrops share that chunk — warming `cube-grid` already warms the
  expensive half of `wave`. A second prefetch would fetch only the shader module,
  on every homepage load, for a variant almost none of them use.
- `hero.jsx` now keys the sharp treatment off a `SHARP = ["cubes", "wave"]` list
  rather than `variant === "cubes"`, so wave gets both the crisp mask *and* the
  capability rail instead of the floating glass cards. Cards on a lattice read as
  a second grid fighting the first, whichever lattice it is.
- **`.sectionWave` takes `.sectionSharp` but drops its two vertical moves** —
  `top: 40px; bottom: -40px` and the `to bottom` mask layer. Both are cube-grid's
  and neither transfers: cube-grid is separated cubes *with fog*, so it has a far
  edge that genuinely recedes and the drop plus roll-off read as a board sitting
  in space. The wave grid is a solid, fog-free floor of near-touching pillars —
  the same two treatments read as the floor being sliced off under the navbar and
  dissolving at the bottom. `/services` reached this independently and removed
  its vertical fade entirely (see the comment in
  `wave-grid-backdrop.module.scss`); this is that decision applied on this page.
  The horizontal ramp is re-declared rather than overridden, because `mask-image`
  is a shorthand for the whole layer list.

### ✅ Phase 3 — Mobile still frame

Below 1024px, serve the exported image instead of a canvas — the same `<picture>`
approach as `/services`, so the two pages share one mechanism.

This is what unifies the design: same cubes, same colour, same composition
language on both. Desktop moves, mobile does not.

It needs its **own export**, not the services one: the homepage hero is a
different aspect and has a different quiet zone. That means the `?export=` switch
has to reach the homepage hero — either wired into it, or via a small dedicated
export route. *(Wired in; see below for why the dedicated route was the wrong
half of that choice.)*

**⚠️ Check the hero loader.** The branded loader on `/` dismisses when the
backdrop's canvas paints — `useBackdropReady` watches the subtree with a
`MutationObserver` for a `<canvas>`
([`hero.jsx:48`](../src/components/pages/homepage/v2/hero/hero.jsx)). An `<img>`
will never satisfy that, so mobile would fall through to the hard timeout and the
loader would visibly outstay the content. Either resolve readiness on the image's
`load` event, or treat the image variant as ready immediately (it is — the markup
is server-rendered).

**Done.**

- **`<picture>` below 1024px**, canvas at or above it. The breakpoint matches
  `useHeroVariant`'s own, so the backdrop and the hero's layout decision change
  together. `useWaveWide` returns three states, not two — `null` means
  *unresolved* and the wave branch renders nothing until the effect lands.
  Defaulting to either side would mount the wrong one for a beat, and on a phone
  that means paying for the three.js parse the still exists to avoid.
- **Its own export**, as the plan required: `home.{avif,webp}`, 22 kB AVIF.
  `curated.*` is untouched — the two targets write under different names so one
  can never overwrite the other.
- **The export runs through the live hero**, via `?export=` wired into
  `hero-backdrop.jsx`, rather than a dedicated export route. The exported image
  has to be the composition the live canvas draws, and one call site with one
  `HOME_CALM` is the only way to guarantee that. A second `WaveGrid` mount is
  precisely how the two would drift.
- **`?wave=N` on the homepage renders a *still*, not a live grid** — live mode
  ignores the seed table entirely and fills its trail from the pointer, so a live
  `?wave=7` would show nothing about composition 7.
- **The loader bug was real and is fixed.** `useBackdropReady` now queries
  `canvas, img`. The image branch waits on `complete` / `load` / `error` rather
  than resolving on appearance — "treat it as ready immediately" was the wrong
  half of the choice, because the markup being server-rendered says nothing about
  whether 22 kB of AVIF has decoded. Verified at 390×844: image served, no canvas
  mounted, loader gone.
- **`compact` is deliberately never passed** on this page. It reframes the grid
  for a narrow canvas, and there is no narrow canvas here — below 1024px the
  image is served, and an export always uses the full profile by design.

### ✅ Phase 4 — The second homepage route

A thin route rendering the existing sections with the hero forced:

```jsx
<HeroV2 backdrop="wave" label="…"/>
```

Everything below the hero is unchanged, so this is a wrapper around
`HomePageClient`, not a copy. If `HomePageClient` needs to take a `backdrop`
prop to allow that, add one — it currently takes none.

**Route naming** — pick one:

| Option | Pros | Cons |
| --- | --- | --- |
| `?backdrop=wave` on `/` | zero new routes, works from Phase 2 | not a clean link to send round |
| `/[locale]/home-wave` | clean URL for colleagues | a real route to keep out of SEO |
| `/[locale]/preview/home-wave` | signals intent, groups future previews | slightly more scaffolding |

Recommend **`/[locale]/preview/home-wave`** if this will be shown outside the
team, `?backdrop=wave` if it is just us.

**Must be excluded from SEO surfaces** if it becomes a real route: `sitemap.js`,
`llms.txt`, the metadata validator matrix (all three were touched together in
`77e05c2`), and `robots`. A preview route that indexes is a duplicate-content
problem on the homepage itself.

**Done** — `/[locale]/preview/home-wave` was the option taken. Both forms work:
the route for sending round, `?backdrop=wave` on `/` for a quick A/B without
navigating away.

`HomePageClient` now takes an optional `backdrop` prop and passes it to `HeroV2`;
nothing below the hero varies, so the preview is that one prop rather than a
second copy of the page.

**The SEO exclusion needed no work, and that is worth knowing rather than
rediscovering.** All three surfaces enumerate their pages explicitly —
`next-sitemap.config.js` `PAGES`, `scripts/validate-json-ld.mjs` `SITE_PATHS`,
`llms.txt` — rather than discovering routes from the build output, so an
undeclared route is already absent from all of them. Verified: `postbuild`
regenerated the sitemap with the route live and `public/sitemap-0.xml` came back
unchanged. The page still declares `robots: {index: false, follow: false}` and
deliberately carries no `JsonLdForPage` and no `generatePageMetadata` — both
would assert it is canonical, and it is a duplicate of `/` by construction.

### ✅ Phase 5 — Decide and unify

Once compared, either promote the wave hero to `/` and delete the `bends`/`cubes`
variants, or drop it. **Do not leave three variants alive indefinitely** — the
old split (bends on mobile, cubes on desktop) is precisely the inconsistency
this is meant to remove, and a third option makes it worse until it is resolved.

**Done.** Mihai picked the wave hero after comparing. `/` serves it at every
width — no viewport branch at all.

Two consequences of dropping the viewport branch, both load-bearing:

- **The capability rail became the treatment at every width.** That was the
  actual styling complaint: below 1024px the hero rendered `.floatCard` glass
  panels — 20px `backdrop-filter`, a border, a gradient fill — while desktop
  rendered the hairline spine with no fill at all. Two unrelated objects either
  side of a breakpoint, same page, same content. Now there is one.
- **The rail is server-rendered, so its reveals had to leave Framer Motion.**
  It was desktop-only before, mounting after hydration, which is why its
  `initial={{opacity: 0}}` never reached the SSR HTML. As the default it would
  have — reintroducing exactly the defect the h1 and the glass cards were each
  fixed for: capability copy invisible to anything that doesn't run JS. The
  reveals are CSS keyframes now (`railDraw`, `capItemIn`, `capDotIn`), with the
  per-row stagger passed as a `--cap-delay` custom property so the markup stays a
  plain `<ul>`. Verified in the served HTML: rail copy present, no inline
  `opacity: 0`.

The desktop prefetch was also repointed from `./cube-grid` to the wave grid — and
it stays desktop-only for a stronger reason than before: below 1024px there is no
canvas at all now, so prefetching three.js on a phone would download ~150 kB to
render nothing.

### ✅ Phase 6 — Delete the comparison scaffolding

Mihai left the keep-or-delete call to the assistant. **Deleted.** The comparison
had already happened and been decided; what remained was two WebGL backdrops and
a second hero layout that no visitor could reach, which is the exact shape of the
problem this whole plan existed to remove. `git show 09ddb03` is a better archive
than a dead import.

Two things the earlier framing of this decision got wrong, both found in the code
rather than in the docs:

- **`src/components/vendor/color-bends/` does NOT go.** Phase 5's note above and
  the next-session prompt both listed it as removable with the `bends` variant.
  It is live on `/contact` (`contact-form.jsx`, behind `BendsBackdrop`) and was
  never only a hero variant. Only the hero's `bends` branch was removed.
- **The hero itself collapsed, and that was the bulk of the win.** With `bends`
  and `cubes` gone, `isSharp(variant)` is always true, so the glass-card branch
  — `.visual`, `.floatCard`, three `floatA/B/C` drift keyframes, `.cardDot` /
  `.cardTitle` / `.cardText` — was unreachable markup and ~240 lines of dead
  stylesheet. `.sectionSharp` and `.sectionWave` collapsed into `.backdrop` for
  the same reason: three cascading rules where only the last was ever applied.

What went, in full: `cube-grid.jsx`; the `bends`/`cubes` branches, `BEND_COLORS`
and `usePortrait` in `hero-backdrop.jsx`; `VARIANTS`, `DEFAULT_VARIANT`,
`useHeroVariant`, `SHARP`/`isSharp`, the `backdrop` and `label` props and the
glass-card branch in `hero.jsx`; `.sectionSharp`, `.sectionWave`, `.variantTag`
and the whole card block in `hero.module.scss`; and the `backdrop` prop on
`HomePageClient`.

### ⚠️ `/preview/home-wave` was deleted, then put back — read this before deleting it again

It looked like the obvious next casualty. Its stated purpose was comparison, the
comparison was over, and it now renders exactly what `/` renders — a noindex
duplicate by construction. So it went, and `scripts/export-wave-grid.mjs` had its
`home` target repointed at `/` to compensate.

**That did not work, and the repoint was reverted.** Driving `/` left
`agent-browser open` waiting indefinitely — two attempts, five minutes each, no
image written — where the preview route captures in about half a minute. Worse,
the first hang wedged the browser session, after which even the known-good
`/services` capture hung until the orphaned headless Chrome processes were killed;
that is what made this take a while to see clearly.

The cause was **not** pinned down. The most likely candidate is the branded
loader overlay, which `HeroLoadingProvider` mounts on `/` and `/contact` only and
which the preview route therefore never shows — it is the one behavioural
difference between the two pages. But that is a hypothesis, not a finding.

So the route stays, re-justified: **it is the export surface, not a preview.**
It is load-bearing for `npm run images:wavegrid:home`, which is how the
sub-1024px hero image is made and which the still-image loop still needs. Both
the route and the script's `TARGETS` carry a note saying so.

Verified, not assumed:

- `npm run images:wavegrid` reproduces `curated.avif`/`curated.webp` byte-for-byte
  (`git status --short public/` empty). This also closes the one-command check
  that had been outstanding since `capture()`'s signature changed.
- `npm run images:wavegrid:home` reproduces `home.avif`/`home.webp` byte-for-byte
  through the restored route.
- `next build` passes; `next-sitemap` regenerates unchanged.
- **Lint dropped from the baseline of 4 errors to 2.** Two of the four were
  `react-hooks/set-state-in-effect` in `hero.jsx`, in the variant-resolution
  effects that no longer exist. **The baseline is 2 now** — the remaining two are
  in `mvp-studio.jsx` and `Footer.jsx` and are untouched by this work.

### ✅ Phase 7 — Steering the composition instead of shuffling seeds

Mihai's call, and the right one: `?wave=N` is a *rejection sampler* that already
knows about the quiet ellipse, so flipping through seeds only ever explores
inside constraints someone else authored. The seed table's own comment says the
same thing — "deliberately laid out, not random". So this phase moves the
constraints, not the dice.

**Landed and verified:**

- **`HOME_CALM.depth` 0.55 → 0.8.** At 0.55, ripples crossed the copy from the
  eyebrow down through the CTA row, which is the one thing the quiet zone exists
  to prevent. The old reasoning — that the `.backdrop` mask already fades the
  copy side, so a full damp under it would flatten the left half to a dead plate
  — is recorded on the constant, along with the fallback (0.65–0.7) if it now
  reads flat. Confirmed in the exported image: copy side dark, accent blue right.
- **A `relief` prop on `WaveGrid`** — `{amplitude, maxHeight, view, radius}`,
  shallow-merged over the mode's own tuning. `/services` passes nothing and its
  export stays byte-identical, which is what makes the default safe.
- **The export script gets its own agent-browser session.** See below; this was
  the session's biggest time sink and it was never a code bug.

**Reverted, and worth knowing why:**

- **A per-page `colors` prop.** It was added, used to give the homepage a more
  saturated mid (#4d84f0), and removed the same day at Mihai's instruction. The
  lit tone is `$accent-mihai` (#96b9f9, `_theme.scss`) — the brand accent the
  eyebrows, the rail dots and the /services copy already use. Pushing the
  homepage cubes off it made that hero the only surface on the site lit in a
  colour nothing else uses. **Both heroes share `COLORS`; that is the intent, not
  an oversight.** The prop went with the override rather than being left as a
  knob with no caller — the same rule phase 6 applied to the backdrop variants.

**Closed 2026-08-03 — the phone image ships.**

The first `home-phone` render came out as a black column with about six enormous
pillars, and both causes were framing, not seeds:

1. **`fovForAspect` only closes the FOV, never opens it.** Past the 1.6:1
   reference it holds horizontal coverage and narrows vertically; *below* it the
   vertical stays at 40° and horizontal coverage just collapses with the aspect.
   At a phone's 0.46:1 that leaves world x ±2.3 against the wide frame's ±8.2 —
   a narrow slot through the grid.
2. **`HOME_CALM_PHONE` was sized from the wide frame's world extents.** `rx 3.4`
   against a visible half-width of 2.3 damped the screen edge to edge.

Fixed by adding `radius` to `relief` and re-deriving the quiet zone as a
**horizontal band** rather than an ellipse — on a phone the copy spans nearly the
full width, so there is no side for the light to arrive from and it has to come
from above and below instead.

**Verified — and `radius` turned out to be a taste dial, not a fidelity one.**

The maths were wrong first: `radius: 26` predicted ~11 pillars across and
rendered nine. It was then raised to **34** (~12 across) to match the wide
frame's fifteen, on the reasoning that both heroes should read as the same
object. **Mihai rejected that on sight** — at phone size a dozen-plus pillars is
a busy mosaic competing with the copy. The phone frame's job is to decorate and
suggest depth, not to reproduce the desktop grid.

Settled at **22, about eight pillars across**: big enough to read as objects,
few enough to stay out of the way. His words for it: "a nice mix of big cubes and
readability".

Two things to carry forward:

- Count pillars on the exported image; every estimate derived from the frustum
  (26 → 11, 30 → 13, 34 → 14) has been wrong.
- Judge the count against the *phone* frame, not against `home.*`. Matching the
  wide frame's density is what produced the rejected version.

The quiet band itself needed no change: the render shows it spanning the full
width across the vertical middle with light arriving top and bottom, which is
what `HOME_CALM_PHONE` was re-derived to do. `home-phone.{avif,webp}` (13 kB /
24 kB) is committed and both `<source>` elements are live.

**`view` was tried as the "make it 3D" dial and rejected.** With big pillars, the
obvious move is to push `mx` toward its −1 limit so more pillar *side* shows.
Rendered, it goes the wrong way: sides face away from the key light, so the extra
side area is dark area — the frame dims and the lit tops carrying the accent
colour shrink. `{mx: -0.2, my: 0.95}` at `maxHeight` 1.05 beat `{mx: -0.9}` at
1.35 outright. Depth comes from pillars being large enough to have visible edges,
not from rotating further off vertical.

### 🔧 The export script and agent-browser sessions

Most of a session was lost to exports that "hung" with no output. It was never
the page and never the code: **agent-browser keeps one daemon per session name,
and two processes on `default` at once fight over it.** Sometimes that surfaces
honestly —

```
A daemon for session 'default' started concurrently with different daemon
configuration. Retry the command so agent-browser can restart it with the
requested configuration.
```

— and the rest of the time `open` simply never returns. Worse, once wedged it
stays wedged: even a known-good `/services` capture hangs until the orphaned
headless Chrome processes (temp `agent-browser-chrome-*` profile) are killed.

`scripts/export-wave-grid.mjs` now runs in its own `wave-export` session and
tears down with `close` rather than `close --all`, so it can no longer collide
with hand-run `agent-browser` — nor kill someone else's session on exit. **Two
exports at once would still collide with each other; run them in sequence.**

## Open questions

1. **Does the wave grid work at all behind the homepage hero's layout?** The
   services hero is one headline over a wide empty right side. The homepage has
   floating cards and a CTA — much more competing detail. This may need a much
   stronger quiet zone, or lower layer opacity.
2. **Is a moving backdrop even the right call for the homepage?** The `/services`
   grid ended up still partly because motion behind copy pulls the eye every time
   it passes. The homepage carries more copy, not less.
3. **Does the still-vs-moving split read as inconsistent** to a visitor who sees
   both? Nobody sees desktop and mobile side by side, so probably not — but worth
   deciding deliberately rather than by default.

## Not in scope

- Renaming `$primary` to `#96b9f9`. Real (77 uses vs 10) but a separate,
  site-wide change — see [wave-grid.md](./wave-grid.md).
- Touching `/faq`, which shares `poster-hero.jsx` and is deliberately unchanged.
