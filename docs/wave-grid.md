# Wave grid — the /services hero backdrop

> Written 2026-07-31. Covers what shipped in `feat(services): wave-grid still on
> the hero, with its export pipeline`, and how to make new compositions.
>
> **Amended the same day.** `wave-grid.jsx` also has a `mode="live"` now, used by
> the homepage wave hero. Everything below is about the still mode `/services`
> ships and is unaffected by it — see [Live mode](#live-mode) at the end, and
> [homepage-wave-hero-plan.md](./homepage-wave-hero-plan.md) for the why.

## What it is

A slab of tall pillars, lit in our blue, sitting behind the `/services` hero
headline. Ported from [franky-adl/3d-wave-grid][repo] — the same author and
technique as the Codrops article the homepage's `cube-grid.jsx` came from, but
that one is a heavy simplification and this is the original.

[repo]: https://github.com/franky-adl/3d-wave-grid

| | homepage `cube-grid.jsx` | `/services` wave grid |
| --- | --- | --- |
| geometry | 0.4 cubes, whole cube translates | **0.8 × 3 pillars**, only the top half stretches |
| grid | 26² spaced apart | 48² with a 0.01 gap — one solid floor |
| camera | 3/4 view, fixed | near-overhead, small fixed tilt |
| shadows | none | real, cast from the displaced silhouette |
| motion | live, pointer-driven | **none — a single still frame** (`mode="live"` exists, but not here) |

Only the top half of each box moves, so pillars *stretch* rather than float:
their bases stay welded into one surface. That, plus the near-overhead camera,
is what makes a frozen frame read as an opened-up floor rather than as scattered
blocks.

## What actually ships is an image

`/services` serves a `<picture>`, not a canvas. three.js is only loaded for the
two authoring paths below.

| | gzipped |
| --- | --- |
| three.js (before tree-shaking) | 184 kB — realistically ~150 kB shipped |
| `curated.avif` @ 2560×1600 | **24 kB** |
| `curated.webp` (fallback) | 44 kB |

Roughly **6× smaller**, and that is only the download. The image also skips the
JS parse/compile, building 2304 instances, compiling two shader programs and a
shadow pass — all main-thread work. It paints with the rest of the page instead
of popping in after hydration.

The grid was always a single frame that never changes, so the canvas was earning
nothing at runtime.

**The WebP fallback is required, not belt-and-braces.** Our browserslist allows
`edge >= 111`, and Edge only shipped AVIF in 121.

### Why one image covers every viewport

`object-fit: cover` is doing more work here than it looks.

The live camera locks horizontal world coverage above 1.6:1 and closes the
vertical angle as the viewport widens (`fovForAspect`). Below 1.6:1 it holds
vertical extent and shows less horizontally. Those are precisely `cover`'s two
behaviours against a fixed-ratio image — fill the width and crop top/bottom, or
fill the height and crop the sides.

So the export is made at exactly 1.6:1 (`REF_ASPECT`), and the crop *reproduces*
the camera rather than approximating it. No per-breakpoint image set is needed,
including portrait.

## Two pages, two images

The grid is on two heroes and **each needs its own export**. They are not
interchangeable: the quiet ellipse is tuned per layout (`/services` has one
paragraph in a left column, the homepage has eyebrow + headline + paragraph +
CTA down the same side), so an image made for one puts its dark band in the
wrong place on the other.

| | `/services` | homepage wave hero |
| --- | --- | --- |
| route | `/services` | **`/`** — it is the homepage default now (`/preview/home-wave` still works, and is identical) |
| desktop | **the still image** | **live canvas**, ≥1024px |
| mobile | the still image | **the still image**, <1024px |
| image | `curated.{avif,webp}` | `home.{avif,webp}` |
| pointed at by | `DEFAULT_IMAGE` in [`wave-grid-backdrop.jsx`][wgb] | `HOME_IMAGE` in [`hero-backdrop.jsx`][hb] |
| quiet ellipse | `CALM` in [`wave-grid.jsx`][wg] | `HOME_CALM` in [`hero-backdrop.jsx`][hb] |
| export command | `npm run images:wavegrid` | `npm run images:wavegrid:home` |

`/services` is still everywhere because its grid never moves at all. The homepage
moves on desktop and freezes on mobile — same cubes, same colour, same
composition language on both, which is the split the homepage wave hero exists to
introduce.

[hb]: ../src/components/pages/homepage/v2/hero/backdrops/hero-backdrop.jsx

## URL switches

All authoring-only. Absent the params, none of this costs anything — no picker,
no generated seeds, and on `/services` no three.js at all.

| URL | What it does |
| --- | --- |
| `/services` | the exported still (no JS) |
| `/services?bg=wave-7` | a different exported still, to compare |
| `/services?wave=7` | composition 7 rendered **live** in WebGL, with a picker |
| `/services?export=2560x1600` | live render at fixed size — what the script drives |
| `/preview/home-wave` | canvas on desktop, `home.{avif,webp}` below 1024px |
| `/preview/home-wave?wave=7` | composition 7 as a **still** frame, for picking |
| `/preview/home-wave?export=2560x1600` | fixed-size render — what the script drives |
| `/?backdrop=wave` | the same hero on the real homepage, for an A/B |

Two differences on the homepage worth knowing:

- **`?wave=N` renders a still, not a live grid.** Browsing compositions means
  browsing seed tables, and live mode ignores the seed table entirely — it fills
  its trail from the pointer. A live `?wave=7` would show you nothing about
  composition 7.
- **No picker widget.** Type the number in the URL; the seed array is printed to
  the console exactly as on `/services`.

Read via `useSyncExternalStore`, not `useSearchParams`: the latter would opt the
whole route into dynamic rendering just to support debug flags.

**The homepage export goes through the live hero, not a dedicated export page.**
That is deliberate. The exported image has to be the composition the live canvas
draws, and the only way to guarantee it is for both to come out of the same call
site with the same `HOME_CALM`. A second mounting of `WaveGrid` somewhere else is
exactly how the two would quietly drift apart.

## Making a new composition

The same four steps for either page. Where they differ, both are given.

### 1. Browse

```
npm run dev

# /services
open http://localhost:3000/services?wave=1

# homepage hero
open http://localhost:3000/preview/home-wave?wave=1
```

On `/services` a picker appears top-right: `← wave 1 → random`. On the homepage
there is no picker — edit the number in the URL. Every number is deterministic —
`?wave=34` renders the identical composition forever, on any machine — so note
the ones you like and come back to them.

**A composition is not portable between the pages.** The same `?wave=34` renders
different-looking frames on each, because the quiet ellipse it is damped against
differs. Always browse on the page you are exporting for.

The generator is constrained, not free random ([`wave-grid.jsx`][wg],
`buildSeeds`). Three rules keep every variant plausible:

- nothing inside the quiet ellipse, so the copy stays dark by construction;
- the right half runs younger and stronger (`age` is a brightness dial via
  `exp(-age / fadeTime)`), preserving the light gradient toward the copy;
- seeds may sit slightly outside the frame, so some rings enter from off-screen
  rather than every ripple showing its own centre.

It only varies **where the light falls**. Colour, pillar size, camera angle and
the quiet zone are fixed across every variant.

[wg]: ../src/components/pages/services/v2/shared/wave-grid.jsx

### 2. Export

With the dev server still running, in another terminal:

```
# /services
npm run images:wavegrid                 # the curated composition  → curated.*
npm run images:wavegrid 7 32            # variants 7 and 32        → wave-7.*, wave-32.*

# homepage hero
npm run images:wavegrid:home            # the curated composition  → home.*
npm run images:wavegrid:home 7 32       # variants 7 and 32        → home-wave-7.*, home-wave-32.*
```

Output lands in `public/images/wave-grid/`. The two targets write under different
names on purpose, so exporting one can never overwrite the other's shipped
image — the thing that would otherwise happen the first time someone forgets the
flag.

(`images:wavegrid:home` is just `node scripts/export-wave-grid.mjs --page=home`;
add a `--page` entry to `TARGETS` in that script if the grid ever lands on a
third page.)

**Expect 60–90 s per variant** and no output until each one finishes — most of it
is AVIF encoding at effort 6, which trades CPU for those small files. It is not
hung. Run it in the background if that matters.

Requires `agent-browser` (`npm i -g agent-browser`). A headless browser is
unavoidable for WebGL, and this keeps a ~300 MB Puppeteer download out of the
project's dependencies for a script that runs a handful of times a year.

### 3. Ship it

Point the page's constant at the filename you kept:

- `/services` → `DEFAULT_IMAGE` in [`wave-grid-backdrop.jsx`][wgb]
- homepage → `HOME_IMAGE` in [`hero-backdrop.jsx`][hb]

Commit the `.avif` and `.webp` — they are build outputs, but they are the shipped
asset, and nothing regenerates them at build time.

[wgb]: ../src/components/pages/services/v2/shared/wave-grid-backdrop.jsx

### 4. Keep it permanently

To make a generated composition the new default rather than one of many, copy
the seed array the browser console prints under `?wave=N` into the `STILL`
constant. Generated variants are reproducible from the number alone, so this is
optional — but it makes the composition legible in the source instead of hidden
behind a PRNG.

⚠️ **`STILL` is shared by both pages.** Editing it changes the `/services` frame
too, and that frame is the shipped image there — so re-export *both* afterwards
and check `git status`. If the two pages ever want genuinely different seed
tables, that is the point at which `STILL` has to become per-page, not a value to
edit back and forth.

### Changing the quiet zone instead

If the problem is *where* the dark band sits rather than where the light falls,
the ellipse is the dial, not the seeds — see the note under `CALM` on why
steering seeds cannot do this job. `CALM` (services) and `HOME_CALM` (homepage)
are independent, so either can move alone. Re-export the page you changed.

## The tuning dials

Everything below is in [`wave-grid.jsx`][wg].

| Constant | Does what |
| --- | --- |
| `STILL` | the curated composition — every ripple, as `{x, z, age, strength}` |
| `WAVE.amplitude` / `.maxHeight` | how far pillars rise. **Roughly double the interactive values** — frozen, a low swell reads as an almost-flat floor with a faint tint |
| `WAVE.width` | how wide each ripple's lit band is (~6 world units at 3.0) |
| `CALM` | the quiet zone ellipse: centre, radii, damping depth |
| `RIM_IN` / `RIM_OUT` | where damping stops being flat and eases out |
| `RADIUS` | camera distance — the honest dial for pillar size, scales linearly |
| `COLOR_BASE/MID/HIGH` | the ramp. `MID` is `$accent-mihai` and owns most of the visible range |
| `PROFILES` | grid extent and FOV, desktop vs phone |

Layer opacity and the horizontal falloff live in
[`wave-grid-backdrop.module.scss`][scss] as `--grid-opacity` and `mask-image`.

[scss]: ../src/components/pages/services/v2/shared/wave-grid-backdrop.module.scss

## Things that cost time, so they are written down

**The lit colour is `$accent-mihai`, not `$primary`.** `$primary` (`#2563eb`) was
the first choice and read as a blue panel rather than as ours. `#96b9f9` is where
the headline gradient resolves. By usage it is already the de facto primary:
**77 occurrences across `src` against 10 for `#2563eb`**, three of which are the
token definition itself. `$primary` survives mostly as `--color-primary`,
consumed in five places. Renaming the token is a separate, deliberate change —
not done here.

**Copy legibility is geometry, not a CSS scrim.** Seed placement alone cannot
keep the paragraph dark: each ripple's lit band is ~6 world units wide against a
~16-unit frame, so a seed placed to light one corner throws a broad ring through
the middle on its way there. Hence `CALM`.

**The quiet zone's flat core must cover the copy box outright.** A first attempt
sized the ellipse to the copy but left a narrow flat core, so the paragraph's
outer corners sat mid-ramp and distant rings still lit them. Measured across 120
generated compositions, worst-case brightness behind the copy went from **0.65 to
0.20** (the damping floor) purely by widening `RIM_IN`/`RIM_OUT`. Widening the
seed *rejection* radius did almost nothing (0.645 → 0.622) — it was the wrong
lever.

**The upstream camera comments are wrong.** `Camera.js` claims ±14°/±22°;
`Math.PI * 0.03` is 5.4° and `Math.PI * 0.05` is 9°. Trusting the comments and
adding a resting tilt on top produced a view more oblique than the original ever
reaches, which let the grid's outer edge into frame.

**A wide hero opens the horizontal frustum enormously.** At 2.7:1, a 40° vertical
FOV is nearly 100° horizontally — which both shrinks the pillars and throws the
frustum sideways past the grid edge. That is what `fovForAspect` exists for, and
why `onResize` recomputes the FOV rather than only the aspect.

**Fog reads as the grid running out.** It was added for depth, but fog toward the
page black darkens whatever is furthest from the camera — in a wide frame, the
left and right extremes. Removed; shadows carry the depth. The original has none.

**The hero slides under the navbar.** The dark band above it was never the bar
itself (it is transparent at scroll 0) — it was the in-flow `Spacer` the navbar
renders to reserve its height. Cancelled with a negative margin, as the homepage
hero already does.

**`preserveDrawingBuffer` is required to export.** WebGL discards the buffer
after compositing, and since the scene renders once and never again, `toDataURL`
would otherwise return a blank image. It is gated on `?export=` — preserving the
buffer costs memory and blocks driver fast paths that a live page should not pay.

**The export script must not go through a shell on Windows.** npm installs global
CLIs as a `.cmd` shim; `execFile` cannot run a batch file, and routing through
`cmd.exe` means Node cannot safely quote a URL containing `&`, so
`?export=…&wave=N` gets truncated. The script finds the shim on `PATH` and hands
its `.js` entry straight to `node`.

## Live mode

`/services` never uses it, and nothing above changes. It is documented here
because it lives in the same file, and because the one-file decision is the part
that needs defending.

`mode="live"` (default `"still"`) turns the component back into the interactive
toy upstream wrote: a pointer trail feeding ripples in, ambient ripples when
untouched, a camera that tilts with the pointer, and a rAF loop gated by an
`IntersectionObserver` **and** `visibilitychange` — either alone leaks frames, a
hidden tab keeps intersecting and a scrolled-past section keeps a visible tab.
It degrades to a single still frame under `prefers-reduced-motion` and on a
software rasteriser, so the loop is never the thing that has to be trusted.

**One component, not a fork.** Geometry, shader, colour ramp, quiet zone and
camera orbit are identical between the two; only the seed source and the presence
of a loop differ. The shader is the bulk of the file, and two copies of it would
have drifted within a month.

The trick that keeps it one path: the texel is `{x, z, spawnTime, strength}` and
the shader computes `age = uTime - spawn`. **Still mode is a stopped clock** —
`uTime` stays 0 and each seed's spawn is stored as minus its age, so the
expression is the authored age unchanged. The still frame is literally the live
surface with the clock stopped, which is also why the export can never drift from
what the live path draws.

Two things genuinely differ, and both are load-bearing:

| | still | live |
| --- | --- | --- |
| amplitude / maxHeight | 1.0 / 0.8 | **0.4 / 0.45** |
| speed / fadeTime | 2.2 / 3.0 | **1.4 / 4.5** |
| birth ramp | 0 (seeds are authored at an age) | **0.55 s** |
| grid | 48² = 2304 | 40² = 1600 |
| DPR | 2 | 1.5 |
| shadow map | 1024 | 512 |
| trail length | 14 seeds, fixed | 64, a ring buffer |

**The rise is the trap.** The still frame uses roughly double because frozen, a
low swell reads as an almost-flat floor with a faint tint — the eye needs change
to read a small height difference. Copy the still values into the live path and
it looks spiky and over-lit, because the emissive lift in the fragment shader
keys off height and every passing ripple then peaks it.

**The still frame's speed and fadeTime are not tunable.** The `STILL`
composition's ages were chosen against speed 2.2 (radius ≈ speed × age) and fade
3.0 — those two numbers are what that composition *means*, and changing either
re-renders the shipped image. They sit in `MODE.still` next to the live pair for
exactly that reason: so a live retune cannot reach them by accident. The check is
cheap and exact — re-run `npm run images:wavegrid` and confirm `git status` comes
back clean.

**The birth ramp is what makes the pointer wake continuous.** `exp(-age /
fadeTime)` is 1.0 at age 0, so without it a ripple is born at full height: every
spawn pops, and a moving pointer replays that pop once per spawn, which reads as
the surface *stepping* after the cursor rather than following it. Growing each
one in over half a second blends consecutive spawns into one wake — and that in
turn is what lets the trail be dense (spacing 0.2, near upstream's 0.1) without
the grid boiling. The tempting fix, thinning the trail, makes it worse: what you
get is not a calmer wake but a coarser stepped one. Calm comes from the ramp and
a low per-ripple strength, not from firing fewer.

Still mode passes ramp 0, guarded in GLSL as `smoothstep(0.0, max(uRamp,
0.0001), age)` — every authored seed is at age ≥ 0.8, so it evaluates to exactly
1.0 and the still frame is untouched (verified by re-export).

The perf column is the other one. The still frame chose DPR 2 and a 1024 shadow
map *because* it renders exactly once; both are wrong for something drawn sixty
times a second. Measured on `/preview/home-wave`: median 16.7 ms, p95 17.0 ms
over 180 frames, shadows on.

## Shadow map type: leave it alone

`renderer.shadowMap.type` is deliberately **not set**. It used to be
`PCFSoftShadowMap`, which as of three r184 is deprecated —
`WebGLShadowMap.render()` warns and immediately reassigns itself to
`PCFShadowMap`, *once per rendered frame*. On a still frame that is one warning;
on the live grid it was sixty a second.

Two things worth knowing before anyone "fixes" this back:

- **Nothing about the output changed by dropping it.** The reassignment happened
  before the first shadow pass, and therefore before any material was compiled
  with a `SHADOWMAP_TYPE_*` define — so what shipped was always PCF. Proven by
  re-export: byte-identical.
- **`key.shadow.radius = 4` is still doing its job.** The softening is a PCF
  feature, not a PCFSoft one — three's PCF path is a 5-tap Vogel disk with
  `radius = shadowRadius * texelSize.x`. Dropping the radius *would* change the
  look; dropping the type did not.

## Known gaps

- **Not verified on a real phone.** Both pages' image paths have been checked in
  a browser at 390×844, which removes the perf question, but the composition at a
  real portrait aspect on real hardware has still only been reasoned about.
- **The offers index butts hard onto the grid.** Its `border-top` lands on lit
  pixels at the bottom edge — deliberate, so the grid does not visibly end, but
  worth a look.
- **The exported images are build artefacts in git.** They must be re-exported
  whenever the composition changes, and there are two of them now. That is what
  the script is for, but nothing enforces it. The cheap check after touching
  anything in `wave-grid.jsx`: re-run both exports and confirm `git status` is
  clean — if a file changed, either the change was unintended or the image needs
  committing.
- **`bends` and `cubes` still exist behind `?backdrop=`.** The homepage default
  is `wave` at every width now, so no visitor reaches them — but they are two
  unused WebGL backdrops plus a vendored library (`src/components/vendor/color-bends/`)
  and the `.floatCard` styles, kept alive only as comparison tools. Deleting them
  is the last piece of Phase 5 in
  [homepage-wave-hero-plan.md](./homepage-wave-hero-plan.md).
