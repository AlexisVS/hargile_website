# Homepage wave-grid hero — plan

> Written 2026-07-31, after shipping the still wave grid on `/services`
> (see [wave-grid.md](./wave-grid.md)).
>
> **Goal.** A second homepage, side by side with the current one, whose hero
> backdrop is the wave-grid cubes as the technique is actually meant to look:
> **moving on desktop, a still frame on mobile**. One visual language on both,
> replacing today's split where desktop gets cubes and mobile gets colour bends.
>
> **Status (2026-07-31, second session).** Phases 1, 2 and 4 are shipped —
> `/preview/home-wave` renders the live grid. Phase 3 (mobile still) and Phase 5
> (decide and unify) are open, and Phase 3's loader problem is still live: see
> the warning under it.

## Where we are

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

### Phase 3 — Mobile still frame

Below 1024px, serve the exported image instead of a canvas — the same `<picture>`
approach as `/services`, so the two pages share one mechanism.

This is what unifies the design: same cubes, same colour, same composition
language on both. Desktop moves, mobile does not.

It needs its **own export**, not the services one: the homepage hero is a
different aspect and has a different quiet zone. Run
`npm run images:wavegrid` against a homepage export URL — Phase 3 will need the
`?export=` switch wired into the homepage hero too, or a small dedicated export
route.

**⚠️ Check the hero loader.** The branded loader on `/` dismisses when the
backdrop's canvas paints — `useBackdropReady` watches the subtree with a
`MutationObserver` for a `<canvas>`
([`hero.jsx:48`](../src/components/pages/homepage/v2/hero/hero.jsx)). An `<img>`
will never satisfy that, so mobile would fall through to the hard timeout and the
loader would visibly outstay the content. Either resolve readiness on the image's
`load` event, or treat the image variant as ready immediately (it is — the markup
is server-rendered).

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

### Phase 5 — Decide and unify

Once compared, either promote the wave hero to `/` and delete the `bends`/`cubes`
variants, or drop it. **Do not leave three variants alive indefinitely** — the
current split (bends on mobile, cubes on desktop) is precisely the inconsistency
this is meant to remove, and a third option makes it worse until it is resolved.

If promoted: `ColorBends` and `cube-grid.jsx` lose their only callers, and
`src/components/vendor/color-bends/` can go with them.

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
