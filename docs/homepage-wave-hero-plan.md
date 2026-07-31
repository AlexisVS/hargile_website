# Homepage wave-grid hero — plan

> Written 2026-07-31, after shipping the still wave grid on `/services`
> (see [wave-grid.md](./wave-grid.md)).
>
> **Goal.** A second homepage, side by side with the current one, whose hero
> backdrop is the wave-grid cubes as the technique is actually meant to look:
> **moving on desktop, a still frame on mobile**. One visual language on both,
> replacing today's split where desktop gets cubes and mobile gets colour bends.

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

### Phase 1 — Restore a live mode on the wave grid

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

### Phase 2 — A `wave` variant on the homepage backdrop

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

### Phase 4 — The second homepage route

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
