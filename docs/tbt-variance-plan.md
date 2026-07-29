# TBT variance plan — make the homepage score reproducible

> Written 2026-07-29, after v0.19.1 shipped. **Nothing here is implemented.**
> The goal is not a higher score — the median already clears the 90+ target.
> The goal is a score that means something, so a future change can be judged.
>
> Status: **root cause not yet identified.** Two confident diagnoses were made
> during the session that produced this document and both were wrong (see "Wrong
> turns" at the end). Phase 0 is measurement, deliberately, and no code changes
> until it produces a named culprit.

## The problem

The same bytes score anywhere from 65 to 97 on PageSpeed Insights. The decisive
observation: a run returning **71/71**, and the very next run **five seconds
later** returning **93/97** — no deploy, no cache change, nothing in between.

Raw PSI runs on v0.19.1 (2026-07-29):

| | runs | median |
|---|---|---|
| desktop | 70, 79, 95, 87, 97, 91, 71, 93 | **89** |
| mobile | 82, 98, 97, 84, 93, 95, 71, 97 | **94** |

### What is stable, and what is not

Everything except TBT is rock solid across every run:

| metric | range observed | verdict |
|---|---|---|
| FCP | 0.3 – 0.9 s | stable, excellent |
| LCP | 0.5 – 1.4 s | stable, excellent |
| CLS | 0.017 – 0.018 | stable, excellent |
| Server response | 10 ms | stable, excellent |
| **TBT** | **40 ms – 1,530 ms** | **38× swing on identical bytes** |

TBT is 30 % of the Lighthouse score. At 1,530 ms it earns **zero of its 30
points**, which caps the run at ~70 however good the rest is. That single metric
is the entire story.

### The slow-run trace (desktop, 2026-07-29 15:20)

Worth keeping, because it is the only detailed capture of a bad run so far.
Note this is the **desktop** preset, which applies **no CPU throttling** (mobile
is 4×) — so these are unthrottled numbers.

- TBT 1,530 ms · main-thread work 3.5 s · **6 long tasks**
- Script evaluation **1,459 ms**, script parse & compile 336 ms
- "Other" **1,489 ms** — unattributed, and nearly as large as script evaluation

Per-chunk, and this is the interesting part:

| chunk | total CPU | script evaluation | parse |
|---|---|---|---|
| `0b0qcemtzkmuy.js` | 1,409 ms | **1,254 ms** | 27 ms |
| `1kx5eddlm_z9t.js` | 1,215 ms | **18 ms** | 5 ms |

The second chunk burns 1,215 ms of CPU while evaluating 18 ms of JavaScript.
That ~1,190 ms is work *triggered by* the chunk but running outside its JS —
which, with the 1,489 ms of "Other", points at something that is not script
execution at all.

## Already ruled out — do not re-investigate

- **It is not the WebGL animation loop.** Both backdrops already detect software
  rasterisers and render a single static frame with no loop and no pointer feed:
  `cube-grid.jsx:102` and `ColorBends.jsx:206`, sharing `isSoftwareRenderer()`
  from `src/lib/webgl.js`. This was phase 1.1 of the perf plan. The loop never
  starts on PSI.
- **It is not a cold container.** During a slow-scoring window the origin was
  measured live at 67–140 ms TTFB, including cache-busted requests and the
  uncacheable `/api/health`. A later PSI report agreed: "Server responds quickly
  (observed 10 ms)".
- **It is not a cold CDN.** That *is* real for the first ~2 minutes after a
  deploy (every build re-hashes chunk filenames, so the edge is empty) — a run
  at +1 min returned desktop 70. But the swings persist long after warm-up.
- **It is not v0.19.1.** The swings predate it; both fixes in that release only
  remove work (two fewer font requests, fewer synchronous layouts).
- **It is not the font subsets.** Fixed and verified in v0.19.1 — no `-ext.woff2`
  is requested any more, and those nodes are gone from the dependency tree.

## Hypotheses, ranked

Not mutually exclusive; both H1 and H2 could contribute.

### H1 — SwiftShader shader compilation (fits the trace best)

The static-frame gate stops the *loop*, but it still creates the WebGL context,
**compiles the GLSL**, and draws one frame. SwiftShader JIT-compiles shaders to
CPU code through LLVM: expensive, one-time, and highly sensitive to how much CPU
the machine gives it. That profile — large CPU, negligible script evaluation,
large "Other" — matches `1kx5eddlm_z9t.js` exactly.

**Confirm or refute:** in a slow-run trace, look for a long task inside GPU/GL
work or shader compilation rather than script evaluation. Map
`1kx5eddlm_z9t.js` to a module via the build manifest to see whether it is the
three.js/backdrop chunk.

**If confirmed, the fix is small:** on a software renderer, do not create the
context at all — bail before compiling and let the CSS background stand.
`cube-grid.jsx:94` already has that path for the no-WebGL case, with the comment
"the CSS orb/dot-grid backdrop still stands on its own". This is a strictly
better gate than the current one, and it helps real low-end devices too.

### H2 — hydration cost (fits `0b0qcemtzkmuy.js`)

1,254 ms of script evaluation in the React chunk is hydration. The **entire
homepage is client components** — `HomePageClient`, `hero`, `mvp-promo`,
`design-dev`, `values`, `recent-works` all carry `"use client"` — so the whole
tree hydrates on every load. This is what "Reduce unused JavaScript — 201 KiB"
has been pointing at all along.

**Confirm or refute:** compare script-evaluation totals between a fast and a
slow run. If evaluation is ~100 ms on fast runs and ~1,250 ms on slow ones, the
work is the same and only the CPU differs — meaning hydration is a *fixed*
liability that a slow machine amplifies, not itself the variance source.

**If confirmed, the fix is large:** move sections that don't need interactivity
to server components and cut what ships to the client. Note `values.jsx` already
dropped motion in v0.19.0 and now only needs `useReveal`'s IntersectionObserver.

### H3 — PSI fleet contention (irreducible)

Google's shared infrastructure varies. Some of the spread is simply not ours.
This is the null hypothesis, and it can only be accepted once H1 and H2 are
measured — not assumed because it is convenient.

## Phase 0 — measure, change nothing

1. Run Lighthouse against production repeatedly (desktop preset, `/fr`), keeping
   the full JSON trace for each run, until at least one clearly fast (TBT under
   ~100 ms) and one clearly slow (TBT over ~800 ms) run are captured.
2. Diff the two traces. The question is single and specific: **does the delta sit
   in script evaluation, or in GPU/"Other"?** That alone separates H2 from H1.
3. Map the heavy chunk hashes to modules via `.next` build output, so
   `0b0qcemtzkmuy.js` and `1kx5eddlm_z9t.js` stop being opaque.
4. Record both traces in `../lh-reports/` alongside the existing ones.

Close the QA browser first — an open tab with a live WebGL canvas costs ~5
desktop points of TBT noise (measured 93 contaminated vs 98 clean, same build).

## Phase 1 — fixes, gated on Phase 0

Do not start these before Phase 0 names a culprit.

- **If H1**: skip WebGL entirely on software renderers. Small, contained, and
  independently justified.
- **If H2**: scope a client-JS reduction as its own plan. This is a refactor,
  not a tweak, and deserves its own document.
- **If H3**: stop. Record the median and the spread, and rely on field data.

## Definition of done

Not "the score is 99". The target is **reproducibility**:

- 5 consecutive PSI runs on unchanged bytes land within **10 points** of each
  other, and
- TBT stays under 200 ms on every one of them.

If that proves unreachable because the residual is H3, the plan ends by saying
so in writing rather than by chasing it further.

## What actually matters, and should be checked first

**Lighthouse lab scores are not what Google ranks on.** Ranking uses Core Web
Vitals *field data* — real Chrome users, 28-day rolling, on real hardware with
real GPUs. That is the "Discover what your real users are experiencing" panel at
the top of the PSI report.

**Check it before spending a day here.** If the field data is green, the lab
number swinging between 65 and 97 is a diagnostic curiosity, and the correct
decision is to stop. Real visitors have GPUs and never touch the SwiftShader
path that dominates these traces.

## Wrong turns taken (recorded so they are not repeated)

Three confident diagnoses during 2026-07-29, all wrong, all stated before
checking:

1. **"The server is slow"** — a 2,489 ms TTFB in a PSI report was read as an
   infrastructure problem. The origin was serving in 72–224 ms at that moment.
   It was a container ~1 minute old.
2. **"The score is 99/99"** — recorded in the perf plan from a *single* run, in
   the same commit that criticised judging on single runs. The medians rule was
   applied to the numbers that displeased and waived for the one that pleased.
3. **"Continuous WebGL is burning CPU every frame"** — offered as the mechanism,
   and a software-renderer gate proposed as the fix. That gate had already been
   built in phase 1.1 and was sitting in the file being discussed.

The pattern is the same each time: a plausible mechanism asserted before the
code or the measurement was checked. Phase 0 exists to break it.
