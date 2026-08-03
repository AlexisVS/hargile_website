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
| route | `/services` | **`/`** — the hero's only backdrop |
| desktop | **the still image** | **live canvas**, ≥1024px |
| mobile | the still image | **the still image**, <1024px |
| image | `curated.{avif,webp}` | three: `home-phone.*` ≤640, `home-tablet.*` 641–1023, `home.*` past that |
| pointed at by | `DEFAULT_IMAGE` in [`wave-grid-backdrop.jsx`][wgb] | `HOME_IMAGE` / `PHONE_IMAGE` / `TABLET_IMAGE` in [`hero-backdrop.jsx`][hb] |
| quiet ellipse | `CALM` in [`wave-grid.jsx`][wg] | `HOME_CALM`, `HOME_CALM_PHONE`, `HOME_CALM_TABLET` in [`hero-backdrop.jsx`][hb] |
| export command | `npm run images:wavegrid` | `npm run images:wavegrid:home`, `…:phone`, `…:tablet` |

`/services` is still everywhere because its grid never moves at all. The homepage
moves on desktop and freezes on mobile — same grid, same colour, same
composition language on both, which is the split the homepage wave hero exists to
introduce.

[hb]: ../src/components/pages/homepage/v2/hero/backdrops/hero-backdrop.jsx

## The homepage ships three frames, and none is a fallback for another

`/services` has `curated.*`. The homepage has three, each composed at the aspect
it is served at:

| file | served | export aspect | pillars across |
| --- | --- | --- | --- |
| `home-phone.*` | ≤640px | 1170x2532 (0.46) | ~8 |
| `home-tablet.*` | 641–1023px | 1600x2000 (0.80) | ~11 |
| `home.*` | past 1024px, if the canvas can't run | 2560x1600 (1.60) | ~15 |

**None of them is a crop of another, and that is the whole point.** `object-fit:
cover` reproduces the camera's own reframing over a modest range of aspects, but
not across a 3.5× spread: at 390x844 it keeps roughly the middle 29% of the wide
frame, so a phone was being shown a slice of a composition laid out for a frame
it never sees.

The pillar counts rise with the frame deliberately — the screen grows, the count
grows with it, and the pillars themselves stay roughly the size they are on a
phone. See the ⚠️ below on why that is a taste decision rather than a derived
one.

`home-phone.*` was unshipped for two sessions because the only render was a black
column; both causes were framing and both are fixed. See phase 7 in
[homepage-wave-hero-plan.md](./homepage-wave-hero-plan.md) for the diagnosis.

`home-tablet.*` came later, and the band it fills is worth knowing about because
it is the one nobody looks at: 641–1023px is a tablet or a half-screen desktop
window, and it used to borrow `home.*`. That is a two-column composition cropped
into a nearly-square window — its quiet zone runs down the left while the hero
there has *already stacked into one full-width column*, so the copy sat half over
dark and half over lit.

⚠️ **Extending `home-phone.*` upward instead does not work, and it was measured
rather than assumed.** At 0.8:1 `cover` keeps only the middle ~40% of the 0.46:1
phone render — and that middle is exactly its quiet band. All of its light lives
in the top and bottom thirds and gets cropped away, leaving a dead plate. A tall
composition cannot be re-used at a squarer aspect, in either direction.

⚠️ **The phone frame is deliberately coarser than the wide one — about eight
pillars across against fifteen.** That is a decision, not drift: at phone size,
matching the wide frame's density makes a busy mosaic that competes with the
copy. The phone still decorates and suggests depth; it does not reproduce the
desktop grid. `radius` in `HOME_RELIEF_PHONE` is the dial, and the count is
counted off the exported image — every value derived from the frustum maths has
been wrong.

## ⚠️ Exports that "hang" are an agent-browser session collision

Not the page, not the code. agent-browser keeps one daemon per session name, and
two processes on `default` at once fight over it — sometimes with a real error,
sometimes by `open` never returning. Once wedged, every capture hangs until the
orphaned headless Chromes are killed:

```
agent-browser close --all
# if that is not enough, kill chrome.exe processes whose command line contains
# agent-browser-chrome- (a temp profile dir; never your own browser)
```

The script now uses its own `wave-export` session, so it cannot collide with
hand-run `agent-browser`. **Two exports at once still would — run them one after
the other.**

It also no longer hangs *silently*. Every `agent-browser` call is bounded at 120 s
(`COMMAND_TIMEOUT`); a whole capture takes about thirty, so the timeout only ever
fires on this wedge, and when it does it prints the two cleanup commands above.
Before that, `execFile` had no timeout at all: a wedged daemon left the script
sitting there having printed its header and nothing else, which reads as "the
export is slow" — the AVIF encode genuinely is — or as "the page is broken", and
both send you looking in the wrong place.

## URL switches

All authoring-only. Absent the params, none of this costs anything — no picker,
no generated seeds, and on `/services` no three.js at all.

| URL | What it does |
| --- | --- |
| `/services` | the exported still (no JS) |
| `/services?bg=wave-7` | a different exported still, to compare |
| `/services?wave=7` | composition 7 rendered **live** in WebGL, with a picker |
| `/services?export=2560x1600` | live render at fixed size — what the script drives |
| `/` | canvas ≥1024px, `home-tablet.*` 641–1023, `home-phone.*` ≤640 |
| `/?wave=7` | composition 7 as a **still** frame, for picking — **in whichever of the three frames the window's width selects** |
| `/preview/home-wave?export=2560x1600` | fixed-size render — what the script drives |
| `/preview/home-wave?export=1600x2000` | the tablet frame, from its aspect alone |

Two notes on that last row:

- **`/preview/home-wave` renders the same hero as `/`**, from the same component.
  It exists only because the export script cannot drive `/` — `agent-browser
  open` never returns there. Do not delete it as a duplicate; see phase 6 in
  [homepage-wave-hero-plan.md](./homepage-wave-hero-plan.md).
- The `?backdrop=<key>` switch, for comparing the wave grid against the cube grid
  and the colour bends, is gone. The wave grid won and became the hero's only
  backdrop, so there is nothing left to switch to.

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
open http://localhost:3000/?wave=1
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
npm run images:wavegrid:phone           # the SAME hero at 1170x2532 → home-phone.*
npm run images:wavegrid:tablet          # the SAME hero at 1600x2000 → home-tablet.*
```

All three homepage targets are the same route and the same composition switch —
only the requested aspect differs. `hero-backdrop.jsx` maps that aspect onto one
of three frames (`frameForAspect`), which is the same rule a browser window at
that shape follows, so `?wave=N` at phone or tablet width previews exactly what
the matching export writes. A dedicated flag could disagree with the preview; an
aspect cannot.

⚠️ **Re-run all three whenever the composition changes**, and run them one after
the other, never at once — see the session note above.

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
times a second. Measured on the homepage hero: median 16.7 ms, p95 17.0 ms
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

- **Not verified on real hardware.** The homepage's three frames have each been
  rendered, looked at, and checked resolving at their own breakpoints — but in a
  desktop browser at simulated sizes, never on a real phone or tablet.
- **`/services` still has only the wide frame.** It serves `curated.*` at every
  width, so on a phone `cover` keeps its middle ~29% and shows about four
  enormous pillars. The homepage now has the machinery to fix this (three
  targets, an aspect-derived frame, per-frame quiet zones) and `/services` has
  none of it — it would need its own `compact`/phone quiet zone and export
  targets, which is real work, not a config change.
- **The export depends on the exporting machine having a GPU.** Checked during
  the phone export: headless Chrome reported `ANGLE (NVIDIA GeForce GTX 1650,
  D3D11)`, so `isSoftwareRenderer` is false and the shadow pass runs. On a
  machine without one it would fall back to SwiftShader, `shadows` would be
  false, and the export would silently come out flatter than the committed
  images. Nothing checks for this.
- **The offers index butts hard onto the grid.** Its `border-top` lands on lit
  pixels at the bottom edge — deliberate, so the grid does not visibly end, but
  worth a look.
- **The exported images are build artefacts in git.** They must be re-exported
  whenever the composition changes, and there are **four** of them now
  (`curated`, `home`, `home-phone`, `home-tablet`). That is what the script is
  for, but nothing enforces it, and the count is the problem: forgetting one
  leaves a single breakpoint band showing a stale composition, which is exactly
  the kind of thing nobody notices. The cheap check after touching anything in
  `wave-grid.jsx`: re-run all four exports and confirm `git status` is clean — if
  a file changed, either the change was unintended or the image needs committing.
- **There is no second backdrop to fall back to any more.** `bends` and `cubes`
  were deleted once the wave grid became the default at every width (phase 6 in
  [homepage-wave-hero-plan.md](./homepage-wave-hero-plan.md)), along with
  the `?backdrop=` switch and the `.floatCard` hero styles. If a change to
  `wave-grid.jsx` breaks the homepage hero, the homepage has no backdrop —
  `git show 09ddb03` is the archive, not the codebase.
  Two things did **not** go, both for reasons that are easy to miss:
  `src/components/vendor/color-bends/` is still live on `/contact`, and
  `/preview/home-wave` is still what the export script drives.
