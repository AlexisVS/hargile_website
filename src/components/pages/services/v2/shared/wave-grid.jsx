"use client";

import {useEffect, useRef} from "react";
import * as THREE from "three";
import {isSoftwareRenderer} from "@/lib/webgl";

/* Wave grid — the geometry and wave maths of franky-adl/3d-wave-grid
   (src/ThreeJS/Stage.js, Effects/MouseTrail.js, Camera.js), recoloured for our
   palette, in two modes off one implementation.

   `mode="still"` (the default, what /services ships) keeps the shape and drops
   the clock: one frame rendered at mount from a fixed set of seeded ripples, and
   nothing after it — no rAF loop, no pointer listeners, no camera orbit. The
   section reads as a slab of pillars caught mid-swell and lit in our blue, which
   is what it was always for: a surface for the headline to sit on, not something
   to watch. There is no per-frame cost at all, and it is inherently
   reduced-motion-safe — no motion to reduce, so no fallback branch to keep
   honest.

   `mode="live"` restores the upstream behaviour: a mouse trail feeds ripples in,
   idle ripples keep the surface alive when untouched, and the camera tilts with
   the pointer. Same geometry, same shader, same colour ramp — only the seed
   source (a fixed table vs. a ring buffer written every few pointer moves) and
   the presence of a loop differ. One component rather than a fork, because the
   shader is the bulk of the file and two copies of it would drift.

   Live still degrades to a single still frame under prefers-reduced-motion or a
   software rasteriser, so the loop is never the thing that has to be trusted.

   Geometry is the original's, not the homepage cube-grid.jsx simplification: a
   slab of tall pillars (0.8 wide, 3 high, gap 0.01, so they nearly touch) where
   only the vertices above the box centre move. The pillars *stretch* — their
   bases stay welded into one surface — which is what makes a frozen frame read
   as an opened-up floor rather than as scattered floating blocks. */

const CUBE_W = 0.8;
const CUBE_H = 3;
const GAP = 0.01;
const SPACING = CUBE_W + GAP;

/* The still composition: every ripple in the frame, as {x, z, age, strength}.
   This is the whole picture — tune here, nothing else generates shape.

   Age is what a ripple's wavefront has had time to travel (radius ≈ speed×age),
   and amplitude decays as exp(-age / fadeTime), so age doubles as a brightness
   dial: young seeds are tight, tall and bright; old ones are wide, low rings.
   Overlapping fronts at different ages are what give the surface varied heights
   everywhere instead of a few clean rings on a flat floor.

   Deliberately laid out, not random — a random seed meant some loads composed
   well and some didn't. The right half stays young and strong, since there is
   nothing behind it but grid. On the left, seeds are pushed above and below the
   copy band rather than made weak inside it: with a ~6-unit-wide lit ring per
   ripple, "weak and behind the text" still lights the text. CALM handles the
   darkness; these only have to light the frame around it. */
const STILL = [
    // Right — the bright side, nothing behind it but grid
    {x: 7.2, z: -2.6, age: 0.8, strength: 1.35},
    {x: 5.4, z: 1.9, age: 1.5, strength: 1.25},
    {x: 6.6, z: 3.1, age: 2.2, strength: 1.15},
    {x: 3.8, z: -3.2, age: 1.1, strength: 1.3},
    {x: 2.6, z: 2.7, age: 2.9, strength: 1.05},
    {x: 4.9, z: -0.4, age: 3.3, strength: 0.95},
    {x: 8.6, z: 0.6, age: 1.6, strength: 1.2},
    // Above the copy — clears the headline, lights the top edge of the frame
    {x: -2.6, z: -4.4, age: 2.3, strength: 1.0},
    {x: -6.8, z: -3.6, age: 1.9, strength: 1.05},
    {x: 0.9, z: -2.8, age: 1.9, strength: 1.1},
    // Below the copy — seeded just off the bottom edge so only the ring shows
    {x: -4.0, z: 4.6, age: 2.8, strength: 0.9},
    {x: -7.6, z: 3.4, age: 2.1, strength: 0.95},
    {x: 0.4, z: 3.6, age: 2.4, strength: 1.0},
    // Far left — old and wide, so the frame edge isn't a flat black wall
    {x: -8.4, z: -0.6, age: 3.4, strength: 0.8},
];

/* In still mode the shader loops over exactly the seeds that exist — with no
   live trail there is nothing to leave headroom for. This is a compile-time
   constant in GLSL, so generated variants must produce exactly this many seeds
   too. */
const STILL_LEN = STILL.length;

/* Live mode's ring buffer. The loop runs per vertex and again in the shadow
   pass, so this is a real cost, not just texture width — upstream's 128 doubles
   it for trail history that has already faded below visibility. */
const LIVE_LEN = 64;

/* ---- Variant generator (?wave=N on /services) ----------------------------
   Composing these by hand is slow and I can't see the result, so this makes
   alternatives browsable: ?wave=12 renders composition 12, deterministically,
   forever. Pick one you like and it gets baked into STILL above as the default.

   Deliberately not free random. Three rules keep every variant plausible rather
   than needing to be sifted from junk:
     - nothing inside the quiet ellipse, so the copy stays dark by construction
       as well as by damping;
     - the right half runs younger and stronger (age is a brightness dial via
       exp(-age / fadeTime)), preserving the light gradient toward the copy;
     - seeds may sit slightly outside the frame, so some rings enter from
       off-screen rather than every ripple showing its own centre.

   mulberry32: a small well-distributed 32-bit PRNG. Seeded explicitly because
   Math.random would make a variant unreproducible the moment you reload. */
const mulberry32 = (a) => () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildSeeds = (variant) => {
    // Spread the input: adjacent variant numbers should look unrelated, and raw
    // small integers feed a poorly-mixed initial state.
    const rnd = mulberry32(Math.imul(variant | 0, 2654435761) ^ 0x9e3779b9);
    const out = [];

    // Bounded rather than while(true): a rejection loop that can't fill its quota
    // would otherwise hang the mount.
    for (let guard = 0; guard < 4000 && out.length < STILL_LEN; guard++) {
        const x = -9.5 + rnd() * 19;
        const z = -5.2 + rnd() * 10.4;

        // Outside the quiet ellipse, at the same rim the shader eases out to —
        // a seed inside it would be damped to nothing and waste one of the 14.
        if (Math.hypot((x - CALM.cx) / CALM.rx, (z - CALM.cz) / CALM.rz) < RIM_OUT) continue;
        // Thin out the left half so the composition keeps leaning right.
        if (x < 0 && rnd() < 0.4) continue;

        const rightness = (x + 9.5) / 19; // 0 at far left, 1 at far right
        out.push({
            x: Number(x.toFixed(2)),
            z: Number(z.toFixed(2)),
            age: Number((0.8 + rnd() * 2.4 + (1 - rightness) * 0.9).toFixed(2)),
            strength: Number((0.75 + rnd() * 0.35 + rightness * 0.2).toFixed(2)),
        });
    }

    // Short only if the rejection loop ran out — pad from the curated set so the
    // texture is always fully populated and the shader never reads stale texels.
    while (out.length < STILL_LEN) out.push(STILL[out.length]);
    return out;
};

const WAVE = {
    /* Shape of each ripple — shared by both modes.

       speed is well under upstream's 6.0, which crosses the frame in under a
       second and leaves constant motion in the reader's periphery. fadeTime has
       to rise with it: the fade is on age, so a slower front covers far less
       ground before it dies. The two are a pair — change one and the ripple
       either dies before it has travelled or outlives the frame.

       In still mode speed only matters as the multiplier that turns a seed's
       age into its radius. */
    speed: 2.2,
    frequency: 1.2,
    width: 3.0,
    jitter: 0.2,
    fadeTime: 3.0,
};

/* Rise, per mode — the one constant that must NOT be shared.

   Moving, a low swell is legible because the eye tracks change. Frozen, the same
   heights read as an almost-flat floor with a faint tint, so the still frame
   needs roughly double: 0.8 of a 3-unit pillar is a third of its height, enough
   that the frame reads as pillars standing at visibly different heights without
   turning the grid into spikes.

   Copying the still values into the live path is the mistake to avoid — it looks
   spiky and over-lit, because the emissive lift in the fragment shader keys off
   height and every passing ripple then peaks it. */
const RISE = {
    still: {amplitude: 1.0, maxHeight: 0.8},
    live: {amplitude: 0.4, maxHeight: 0.45},
};

/* Live-mode pointer trail.

   spacing is the minimum world-space gap between consecutive ripples: at
   upstream's 0.1 a single brisk sweep dumps dozens of overlapping fronts and the
   whole grid boils. idleAfter/idleEvery keep the surface alive when nothing is
   moving — at upstream's 1.5s cadence against our 3s fade the grid never rests,
   so ambient ripples come four seconds apart instead.

   idleSpread is in world units, not grid cells. The camera is zoomed well inside
   the slab (RADIUS 14 against a 40² grid), so a grid-relative spread spawns most
   ambient ripples off-screen, where they fade before their front ever arrives. */
const TRAIL = {
    spacing: 0.35,
    idleAfter: 3.0,
    idleEvery: 4.0,
    idleSpread: 5.0,
    idleStrength: 0.9,
    // Ripples die at fadeTime × 4 (exp(-4) ≈ 1.8%), past which a front is still
    // expanding through the grid while contributing nothing but weight to the
    // normalising sum.
    maxAge: 4,
};

/* The quiet zone: an ellipse in world xz where the wave is damped, so the copy
   column sits on dark pillars while the light stays around it.

   Steering the seeds alone cannot do this. Each ripple's window is
   exp(-relDist² / width²) at width 3.0 — a lit band roughly 6 world units
   across, against a visible frame only ~16 wide. Any seed placed to light one
   corner throws a broad ring through the middle on its way there, which is why
   the "old and weak" left-hand seeds still lit the paragraph. Damping the region
   directly is deterministic; nudging seed positions is guesswork.

   Coordinates are world units on the ground plane: x is screen-horizontal, z is
   screen-vertical (down), origin at frame centre. At the desktop framing the
   visible area is about x ±8.2, z ±3.9, and the answer paragraph lands near
   x -6.1…-0.1, z 0.3…2.1 — hence a centre just left and below middle. */
const CALM = {cx: -3.1, cz: 1.2, rx: 4.4, rz: 1.9, depth: 0.8};

/* Where the damping stops being flat and starts easing out, as a fraction of the
   ellipse radius. The core has to be wide enough to cover the copy box outright:
   at a narrower rim the paragraph's outer corners sat mid-ramp and were only
   partly damped, which let distant rings light them — measured across 120
   generated variants, worst-case brightness behind the copy fell from 0.65 to
   the 0.20 damping floor purely by widening this. Shared with the generator
   below so seed rejection and shader falloff can't drift apart. */
const RIM_IN = 0.8;
const RIM_OUT = 1.35;

/* Two profiles, about framing. grid is how far the slab extends (margin so its
   outer edge can never enter frame), fov is null for "derive from aspect".

   For a still frame there is no budget argument left, so both can be generous.
   A loop is a different question — see LIVE_GRID. */
const PROFILES = {
    full: {grid: 48, fov: null, calm: CALM},
    /* Portrait aspects fall below REF_ASPECT, where the lock below is a no-op and
       the 40° default would render a mosaic of ~12 tiny rows. Pinning the angle
       keeps phone pillars the same size as desktop ones. 28 rows is all the
       extent that narrow a frame can show.

       No quiet zone: the copy is one full-width column here rather than sitting
       in the left half, so there is no region to carve out — an ellipse would
       just dim the middle of everything. The layer's lower opacity does that job
       on phones instead. */
    compact: {grid: 28, fov: 30, calm: {...CALM, depth: 0}},
};

/* Live mode caps the slab at 40² = 1600 pillars rather than 48² = 2304. Every
   one of them runs the trail loop in the vertex shader and again in the shadow
   pass, sixty times a second — a 30% instance cut is the cheapest frame-time
   dial there is, and at RADIUS 14 the 40² slab's outer edge is still ~16 world
   units out against a visible half-width of ~8. Nothing that was in frame
   leaves it. The compact profile is already below this, so the cap is a floor
   only for the full one. */
const LIVE_GRID = 40;

/* Camera: the original orbits above the grid and lets the pointer nudge it off
   vertical. We keep the geometry of that and pick one fixed spot on it.

   The rest pose is dead overhead, where pillars show only their tops and height
   differences survive as colour alone — fine when they are moving, flat when
   they are not. So the still sits at a small fixed offset instead, chosen from
   inside the original's own tilt range (Math.PI * 0.03 is 5.4°, Math.PI * 0.05
   is 9°; the upstream comments claiming ±14°/±22° are wrong). Staying inside
   that range is what keeps the frustum pointed down into the grid rather than
   out across it toward the boundary. */
const RADIUS = 14;
const ALPHA_RANGE = Math.PI * 0.03;
const BETA_RANGE = Math.PI * 0.05;
const STILL_VIEW = {mx: -0.55, my: 0.65}; // normalised within the ranges above

/* Live mode keeps that same vantage as its rest pose and lets the pointer swing
   it, rather than resting dead overhead the way upstream does. Overhead is where
   pillars show only their tops and height differences survive as colour alone —
   tolerable while everything is moving, but it is also what the frame settles
   back to the moment the pointer leaves, and settling into the flat pose is the
   worst of both. The swing is a fraction of the ranges so the tilt reads as the
   surface responding, not as the camera being dragged.

   The chase is a fixed fraction per frame, as upstream: at 60fps it is a ~0.4 s
   settle, and it is deliberately not made frame-rate-independent because the
   gate below stops the loop entirely rather than letting it run slow. */
const LIVE_SWING = 0.45;
const LIVE_LERP = 0.04;

/* Vertical FOV is only the whole story at the demo's roughly-16:9 full-screen
   box. A hero is much wider than it is tall, and horizontal coverage grows with
   aspect — at 2.7:1 a 40° vertical FOV opens to nearly 100° horizontally, which
   both shrinks the pillars and throws the frustum far enough sideways to clear
   the grid edge. Past the reference aspect, hold horizontal coverage fixed and
   let the vertical FOV close instead. */
const REF_ASPECT = 1.6;
const REF_FOV = 40;

const fovForAspect = (aspect) => {
    if (!aspect || aspect <= REF_ASPECT) return REF_FOV;
    const refHalfWidth = Math.tan((REF_FOV / 2) * (Math.PI / 180)) * REF_ASPECT;
    return (2 * Math.atan(refHalfWidth / aspect) * 180) / Math.PI;
};

const COLOR_BASE = "#0e1730"; // floor at rest — above the page black, so pillars still have form
const COLOR_MID = "#96b9f9";  // $accent-mihai — the dominant lit tone
const COLOR_HIGH = "#dce7fd"; // crest highlight, same ramp as the h1 gradient

/* Shared by the visible material and the shadow depth material: the displaced
   silhouette has to match, or pillars cast the shadow of their rest pose.

   trailLen is baked in rather than passed as a uniform because a GLSL loop bound
   must be a compile-time constant — which is also why the two modes compile two
   different programs rather than one sized for the worst case. */
const patchVertexShader = (vertexShader, trailLen) =>
    vertexShader
        .replace(
            "#include <common>",
            `#include <common>
             varying float vHeight;
             uniform sampler2D uTrailTexture;
             uniform float uTrailCount;
             uniform float uTime;
             uniform float uWaveSpeed;
             uniform float uWaveFreq;
             uniform float uWaveWidth;
             uniform float uFadeTime;
             uniform float uAmplitude;
             uniform float uJitter;
             uniform float uMaxHeight;
             uniform vec2 uCalmCenter;
             uniform vec2 uCalmRadius;
             uniform float uCalmDepth;

             vec2 hash2(vec2 p) {
                 p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
                 return fract(sin(p) * 43758.5453123) - 0.5;
             }`,
        )
        .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>

             vHeight = 0.0;

             // Only the top half of the box moves, so the pillar stretches instead
             // of floating: the bottom ring stays at its rest Y and the grid keeps
             // reading as one continuous floor.
             if (position.y > 0.0) {
                 // Instance matrices here are translation-only, so column 3 is the
                 // cell's world xz — the original carries the same value in an
                 // aOffset attribute, but this needs no extra buffer.
                 vec2 cell = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
                 // Per-cell jitter breaks the wavefront off the grid axes; without
                 // it every ripple freezes as clean concentric squares, which on a
                 // still frame is far more obvious than it is in motion.
                 vec2 worldXZ = cell + hash2(cell) * uJitter;

                 float waveHeight = 0.0;
                 float totalWeight = 0.0;

                 // seed texel: r = world x, g = world z, b = spawn time, a = strength
                 for (int i = 0; i < ${trailLen}; i++) {
                     // Live mode's ring buffer fills over time, and an unwritten
                     // texel is a full-strength ripple sitting at the origin.
                     // Still mode pins this to its seed count, so the guard is
                     // free there.
                     if (float(i) >= uTrailCount) break;

                     vec4 td = texelFetch(uTrailTexture, ivec2(i, 0), 0);

                     // Still mode has no clock: uTime stays 0 and a seed's spawn
                     // time is simply minus its age, so this expression is the
                     // authored age unchanged.
                     float age = uTime - td.b;
                     if (age < 0.0 || age > uFadeTime * ${TRAIL.maxAge.toFixed(1)}) continue;

                     float dist = length(worldXZ - td.rg);
                     float relDist = dist - uWaveSpeed * age;

                     float window = exp(-(relDist * relDist) / (uWaveWidth * uWaveWidth));
                     float fade = exp(-age / uFadeTime);
                     float atten = 1.0 / (1.0 + dist * 0.1);
                     float weight = fade * window * atten * td.a;

                     waveHeight += weight * cos(uWaveFreq * relDist);
                     totalWeight += weight;
                 }

                 // Floored at 1.0 rather than at the true sum: dividing by a small
                 // total would renormalise a single faint ripple back up to full
                 // height, so overlapping seeds average but a lone one stays weak.
                 // This is what keeps the left side quiet.
                 waveHeight /= max(totalWeight, 1.0);

                 float displacement = clamp(waveHeight * uAmplitude, -uMaxHeight, uMaxHeight);

                 /* Quiet zone. Normalised elliptical distance, so one expression
                    handles a wide-and-short region without a second radius test.
                    Flat inside RIM_IN and eased out to RIM_OUT rather than
                    falling off from the centre — the copy needs an evenly dark
                    bed, not a gradient, and a soft rim is what stops the damping
                    from reading as a hole cut in the surface.

                    Applied to displacement, not to colour, so the pillars sit
                    physically low as well as dark: the colour ramp keys off
                    height, so they follow, and the shadow pass sees the same
                    silhouette instead of shadowing pillars that look flat. */
                 float calmDist = length((worldXZ - uCalmCenter) / uCalmRadius);
                 displacement *= mix(1.0 - uCalmDepth, 1.0,
                     smoothstep(${RIM_IN}, ${RIM_OUT}, calmDist));

                 transformed.y += displacement;
                 vHeight = displacement;
             }`,
        );

/* exportSize turns this into a render target for scripts/export-wave-grid.mjs
   rather than a backdrop: fixed dimensions instead of the mount's, and a
   preserved drawing buffer so toDataURL still has pixels to read when the script
   asks for them. WebGL discards the buffer after compositing by default, and
   since we render exactly once and never again, by the time anything reads the
   canvas it would otherwise be blank. Off by default — preserving the buffer
   costs memory and blocks some driver fast paths, which a live page shouldn't
   pay for a feature only the export uses.

   `calm` overrides the quiet ellipse. The default is tuned to the /services copy
   box; any other layout needs its own, and the values are not transferable —
   see CALM. Pass `{depth: 0}` for none at all. It must be a stable reference (a
   module constant, not an inline literal): it is an effect dependency, and the
   effect tears down and rebuilds the entire scene.

   `mode` is "still" or "live". An export is always still: the whole point is a
   single frame, and a live composition would capture whichever moment the
   script happened to ask on. */
const WaveGrid = ({
    compact = false,
    variant = null,
    exportSize = null,
    mode = "still",
    calm = null,
}) => {
    const mountRef = useRef(null);

    // Rebuilds on breakpoint, variant or mode change — grid extent, FOV, the
    // shader's loop bound and the seed texture are all baked in at construction.
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Exports always use the desktop composition: the image is served to
        // every viewport and object-fit: cover does the reframing, so baking the
        // phone profile's narrower field of view into it would double-crop.
        const profile = compact && !exportSize ? PROFILES.compact : PROFILES.full;
        const quiet = calm ?? profile.calm;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: exportSize !== null,
            });
        } catch {
            return; // No WebGL — the hero stands on its own, the layer just stays empty.
        }

        /* Shadows are what give a dark, near-overhead pillar field its form: with
           nothing moving, they and the colour ramp are the only cues that pillars
           stand at different heights. Worth a second render of the scene when
           there is exactly one frame to pay for — except on a software rasteriser
           (Lighthouse, VMs, blocklisted drivers), where that frame is drawn on the
           CPU and the depth pass doubles a cost already measured in seconds. */
        const software = isSoftwareRenderer(renderer.getContext());
        const shadows = !software;

        /* Whether anything actually moves. Live mode degrades to the still frame
           under prefers-reduced-motion and on a software rasteriser — the same
           two cases cube-grid.jsx collapses, and for the same reason: a loop the
           CPU is drawing is the desktop TBT problem, and a backdrop is never
           worth an accessibility exception. Everything downstream keys off this
           rather than off `mode`, so the fallback is one branch and not a
           scattering of them. */
        const animate = mode === "live" && !exportSize && !software
            && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* The slab, and how many seeds the shader loops over. Both are baked into
           the compiled program (the loop bound literally so), which is why a mode
           change tears the whole scene down and rebuilds it. */
        const GRID = animate ? Math.min(profile.grid, LIVE_GRID) : profile.grid;
        const trailLen = animate ? LIVE_LEN : STILL_LEN;

        /* Still gets DPR 2: fill rate is irrelevant for a single frame, and a
           still image is where aliasing on thousands of hard pillar edges is
           actually noticeable. A loop pays that cost sixty times a second for a
           difference nobody can see while it moves, so live caps at 1.5 —
           ~44% fewer fragments than 2.

           An export sets its pixel count outright, so DPR is pinned to 1 and the
           dimensions carry the resolution — otherwise the output size would
           depend on whatever screen happened to run the script. updateStyle is
           false for the same reason: the canvas element's CSS size is irrelevant
           when the pixels are being read rather than displayed. */
        const maxDpr = exportSize ? 1 : animate ? 1.5 : shadows ? 2 : 1;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
        if (exportSize) {
            renderer.setSize(exportSize.w, exportSize.h, false);
        } else {
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        }
        if (shadows) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        /* No fog, as in the original. Fog toward the page black darkens whatever
           is furthest from the camera — in a wide frame, the left and right
           extremes — which reads as the grid running out well before its actual
           edge does. Depth comes from the shadows instead. */

        const aspect = exportSize
            ? exportSize.w / exportSize.h
            : mount.clientWidth / mount.clientHeight;
        const fovFor = (a) => profile.fov ?? fovForAspect(a);

        const camera = new THREE.PerspectiveCamera(fovFor(aspect), aspect, 0.1, 200);

        // Orbit from the original's Camera.js: start at (0, r, 0), rotate about X
        // by alpha then about Z by beta. up is -z because straight-down leaves the
        // default up parallel to the view direction. Still mode calls this once —
        // a fixed vantage point, not a follow; live re-aims it every frame.
        camera.up.set(0, 0, -1);
        const aimCamera = (mx, my) => {
            const alpha = my * ALPHA_RANGE;
            const beta = mx * BETA_RANGE;
            camera.position.set(
                -RADIUS * Math.cos(alpha) * Math.sin(beta),
                RADIUS * Math.cos(alpha) * Math.cos(beta),
                RADIUS * Math.sin(alpha),
            );
            camera.lookAt(0, 0, 0);
        };
        aimCamera(STILL_VIEW.mx, STILL_VIEW.my);
        scene.add(camera);

        // Cooler and dimmer than the original's white 0.5 / 4.0 pair: the floor has
        // to sit far enough back that body copy reads over it, and any warmth in
        // the key light turns the dark navy grey rather than blue.
        scene.add(new THREE.AmbientLight(0x7d9bd8, 0.85));

        const key = new THREE.DirectionalLight(0xcfe0ff, 2.0);
        key.position.set(-20, 10, 6);
        if (shadows) {
            key.castShadow = true;
            // 512 while it moves. The map is re-rendered every frame from a full
            // second pass over all 1600 pillars, and softening (radius 4) blurs
            // most of the resolution difference away anyway — on a still frame,
            // where it is drawn once and stared at, the full map is worth it.
            const shadowMap = animate ? 512 : 1024;
            key.shadow.mapSize.set(shadowMap, shadowMap);
            key.shadow.radius = 4;
            key.shadow.camera.near = 0.1;
            key.shadow.camera.far = 60;
            // ±12 rather than the original's ±22: we only ever see the middle of
            // the grid, so a tighter frustum spends the same 1024 map on far fewer
            // world units and the contact shadows stay crisp.
            key.shadow.camera.left = -12;
            key.shadow.camera.right = 12;
            key.shadow.camera.top = 12;
            key.shadow.camera.bottom = -12;
            key.shadow.bias = -0.0005;
        }
        scene.add(key);

        // Fill on the off side, so the faces the key misses go blue rather than
        // black. In $accent-mihai, not $primary — a royal-blue fill tinted every
        // shadowed face, which was half of why the grid read as the wrong blue.
        const fill = new THREE.DirectionalLight(0x96b9f9, 0.7);
        fill.position.set(10, 5, -3);
        scene.add(fill);

        /* --- Seed texture: {x, z, spawn time, strength} per texel ---

           Still mode writes it once from the composition and never touches it
           again. Live mode uses it as a ring buffer, overwriting the oldest
           entry as new ripples arrive. Same layout, same shader, so the still
           frame is simply the live surface with the clock stopped.

           uTime is 0 in still mode, so a seed's spawn time is minus its age (see
           the shader's `age` line). Signed, not absolute: an "age" is how long
           ago it happened, and a clock that never advances makes that a negative
           timestamp. */
        const seedData = new Float32Array(trailLen * 4);
        const seedTexture = new THREE.DataTexture(
            seedData, trailLen, 1, THREE.RGBAFormat, THREE.FloatType,
        );
        seedTexture.minFilter = seedTexture.magFilter = THREE.NearestFilter;
        seedTexture.needsUpdate = true;

        let trailHead = 0;
        let trailCount = 0;

        const pushSeed = (x, z, spawn, strength) => {
            const o = trailHead * 4;
            seedData[o] = x;
            seedData[o + 1] = z;
            seedData[o + 2] = spawn;
            seedData[o + 3] = strength;
            seedTexture.needsUpdate = true;
            trailHead = (trailHead + 1) % trailLen;
            trailCount = Math.min(trailCount + 1, trailLen);
            uniforms.uTrailCount.value = trailCount;
        };

        // null variant = the curated composition; a number = generated (?wave=N).
        const seeds = variant === null ? STILL : buildSeeds(variant);

        const rise = animate ? RISE.live : RISE.still;

        // Shared by reference into both shaders, so the depth pass displaces
        // identically to the visible one.
        const uniforms = {
            uTrailTexture: {value: seedTexture},
            uTrailCount: {value: 0},
            uTime: {value: 0},
            uFadeTime: {value: WAVE.fadeTime},
            uWaveSpeed: {value: WAVE.speed},
            uWaveFreq: {value: WAVE.frequency},
            uWaveWidth: {value: WAVE.width},
            uAmplitude: {value: rise.amplitude},
            uJitter: {value: WAVE.jitter},
            uMaxHeight: {value: rise.maxHeight},
            uCalmCenter: {value: new THREE.Vector2(quiet.cx, quiet.cz)},
            uCalmRadius: {value: new THREE.Vector2(quiet.rx, quiet.rz)},
            uCalmDepth: {value: quiet.depth},
        };

        // Live mode's buffer starts empty and fills from the pointer; the still
        // one is the composition, written now and never again. The reduced-motion
        // and software fallbacks land here too — which is the point: they get the
        // authored frame, not a frozen arbitrary moment of the live one.
        if (!animate) seeds.forEach((p) => pushSeed(p.x, p.z, -p.age, p.strength));

        /* Printed so a variant you like can be copied straight into STILL — the
           whole point of browsing them is being able to keep one. Only ever runs
           with ?wave= in the URL, so normal loads stay silent. */
        if (variant !== null) {
            console.log(`wave-grid variant ${variant}\n${JSON.stringify(seeds, null, 4)}`);
        }

        // --- Instanced pillars ---
        const geometry = new THREE.BoxGeometry(CUBE_W, CUBE_H, CUBE_W);
        const material = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 40});

        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, uniforms);
            shader.uniforms.uColorBase = {value: new THREE.Color(COLOR_BASE)};
            shader.uniforms.uColorMid = {value: new THREE.Color(COLOR_MID)};
            shader.uniforms.uColorHigh = {value: new THREE.Color(COLOR_HIGH)};

            shader.vertexShader = patchVertexShader(shader.vertexShader, trailLen);

            shader.fragmentShader = shader.fragmentShader
                .replace(
                    "#include <common>",
                    `#include <common>
                     varying float vHeight;
                     uniform vec3 uColorBase;
                     uniform vec3 uColorMid;
                     uniform vec3 uColorHigh;
                     uniform float uMaxHeight;`,
                )
                .replace(
                    "#include <color_fragment>",
                    `#include <color_fragment>
                     // Two stops, not one. The first reaches $accent-mihai early
                     // (0.45) so the brand tone owns most of the wave's visible
                     // range rather than only its peak; the second lifts the last
                     // 40% toward the paler crest. A single base→crest mix would
                     // spend nearly all its range in the muddy blue-grey between.
                     float t = clamp(vHeight / uMaxHeight, 0.0, 1.0);
                     vec3 wave = mix(uColorBase, uColorMid, smoothstep(0.0, 0.45, t));
                     wave = mix(wave, uColorHigh, smoothstep(0.6, 1.0, t));
                     diffuseColor.rgb = wave;`,
                )
                .replace(
                    "#include <dithering_fragment>",
                    `#include <dithering_fragment>
                     // Added after lighting, so raised pillars emit instead of
                     // merely being a paler diffuse — this is what makes the frame
                     // look lit rather than tinted. In uColorMid, not uColorHigh:
                     // adding the pale crest colour on top of an already-pale crest
                     // just clips toward white and loses the hue.
                     float t2 = clamp(vHeight / uMaxHeight, 0.0, 1.0);
                     gl_FragColor.rgb += uColorMid * t2 * t2 * 0.3;`,
                );
        };

        /* Shadows come off the displaced silhouette only if the depth pass runs
           the same displacement — MeshDepthMaterial otherwise draws the rest pose,
           and every pillar would cast the shadow of a flat floor. Built only when
           shadows are on, so we never compile a second program for a pass that
           never runs. */
        let depthMaterial = null;
        if (shadows) {
            depthMaterial = new THREE.MeshDepthMaterial();
            depthMaterial.onBeforeCompile = (shader) => {
                Object.assign(shader.uniforms, uniforms);
                shader.vertexShader = patchVertexShader(shader.vertexShader, trailLen);
            };
        }

        const mesh = new THREE.InstancedMesh(geometry, material, GRID * GRID);
        if (depthMaterial) mesh.customDepthMaterial = depthMaterial;
        mesh.castShadow = shadows;
        mesh.receiveShadow = shadows;

        const dummy = new THREE.Object3D();
        const offset = ((GRID - 1) * SPACING) / 2;
        for (let i = 0; i < GRID; i++) {
            for (let j = 0; j < GRID; j++) {
                dummy.position.set(i * SPACING - offset, 0, j * SPACING - offset);
                dummy.updateMatrix();
                mesh.setMatrixAt(i * GRID + j, dummy.matrix);
            }
        }
        mesh.instanceMatrix.needsUpdate = true;
        scene.add(mesh);

        /* ---- Live mode: the pointer feed, the loop, and the gate over it ----
           None of this is constructed in still mode: the listeners would feed a
           texture nothing ever re-reads, and the observers would gate a loop that
           does not exist. */

        // Timer, not Clock — Clock is deprecated as of three r183 and warns on
        // construction. Timer only advances when update() is called, which is
        // once per rendered frame, so elapsed freezes while the loop is gated off
        // instead of running on wall time and ageing the whole trail out.
        const timer = new THREE.Timer();

        // Pointer → ground plane. The wave is computed on world xz and the camera
        // is tilted with up = -z, so screen position maps to the plane through the
        // projection, not by any shortcut.
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const ndc = new THREE.Vector2();
        const hit = new THREE.Vector3();

        let lastSeed = null;   // world xz of the last ripple, for the spacing test
        let lastMove = 0;      // when the pointer was last in bounds, for the idle gate
        let nextIdle = TRAIL.idleEvery;
        // Camera tilt: a target the pointer sets and a current the loop chases.
        const view = {mx: STILL_VIEW.mx, my: STILL_VIEW.my};
        const viewTarget = {mx: STILL_VIEW.mx, my: STILL_VIEW.my};

        const onPointerMove = (e) => {
            const r = mount.getBoundingClientRect();
            /* The canvas is pointer-events: none, so the listener has to live on
               window — which means it fires for movement anywhere on the page.
               Without this bounds test the grid ripples from a pointer that is
               nowhere near it, which reads as the surface moving on its own. */
            if (
                e.clientX < r.left || e.clientX > r.right ||
                e.clientY < r.top || e.clientY > r.bottom
            ) {
                // Drop the anchor on the way out. Re-entering elsewhere would
                // otherwise measure the jump across the gap as one huge delta and
                // fire a max-strength ripple.
                lastSeed = null;
                viewTarget.mx = STILL_VIEW.mx;
                viewTarget.my = STILL_VIEW.my;
                return;
            }

            const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
            const ny = -((e.clientY - r.top) / r.height) * 2 + 1;

            // Around the rest pose, not from zero — see LIVE_SWING.
            viewTarget.mx = STILL_VIEW.mx + nx * LIVE_SWING;
            viewTarget.my = STILL_VIEW.my + ny * LIVE_SWING;

            ndc.set(nx, ny);
            raycaster.setFromCamera(ndc, camera);
            if (!raycaster.ray.intersectPlane(plane, hit)) return;

            const now = timer.getElapsed();
            lastMove = now;

            if (!lastSeed) {
                // First sample after entering: nothing to measure speed against,
                // so anchor here and let the next move do the work. Firing at full
                // strength on entry made every pass over the section announce
                // itself with a slam.
                lastSeed = {x: hit.x, z: hit.z};
                return;
            }

            const d = Math.hypot(hit.x - lastSeed.x, hit.z - lastSeed.z);
            if (d < TRAIL.spacing) return;

            /* Strength proportional to pointer speed — d is distance since the
               last ripple, and the spacing test above makes that a rate. A crawl
               produces almost nothing; the cap stops a fast flick from slamming
               the whole grid at once. */
            const strength = Math.min(0.35 + d * 0.55, 1.2);
            lastSeed = {x: hit.x, z: hit.z};
            pushSeed(hit.x, hit.z, now, strength);
        };

        // Leaving the viewport entirely never fires an out-of-bounds pointermove,
        // so without this the tilt would sit frozen at the exit point.
        const onDocLeave = () => {
            lastSeed = null;
            viewTarget.mx = STILL_VIEW.mx;
            viewTarget.my = STILL_VIEW.my;
        };

        /* Ambient ripples, so the grid isn't dead when untouched — and on touch,
           where there is no hover, this is the entire response. Placed in world
           units near the centre because that is the only part of the slab the
           camera can see; a grid-relative spread would spawn most of them
           off-screen, where they fade before their front arrives. */
        const idleTick = (t) => {
            if (t - lastMove < TRAIL.idleAfter) return;
            if (t < nextIdle) return;
            pushSeed(
                (Math.random() * 2 - 1) * TRAIL.idleSpread,
                (Math.random() * 2 - 1) * TRAIL.idleSpread,
                t,
                TRAIL.idleStrength,
            );
            nextIdle = t + TRAIL.idleEvery;
        };

        let frame = null;

        const render = () => {
            timer.update();
            const t = timer.getElapsed();
            uniforms.uTime.value = t;

            idleTick(t);

            view.mx += (viewTarget.mx - view.mx) * LIVE_LERP;
            view.my += (viewTarget.my - view.my) * LIVE_LERP;
            aimCamera(view.mx, view.my);

            renderer.render(scene, camera);
        };

        const loop = () => {
            render();
            frame = requestAnimationFrame(loop);
        };

        if (animate) {
            window.addEventListener("pointermove", onPointerMove);
            document.addEventListener("mouseleave", onDocLeave);
            loop();
        } else {
            // The whole render budget, spent once.
            renderer.render(scene, camera);
        }

        /* Re-render on resize. In still mode this is the only thing that can
           invalidate the frame; in live mode the loop redraws anyway, so the
           render() call at the end is the still path's alone.

           The FOV is recomputed rather than just the aspect: the lock is a
           function of aspect, so keeping its mount-time value would let a resize
           toward wide re-open the horizontal frustum and bring the grid edge
           into view. */
        const onResize = () => {
            // An export is pinned to its requested dimensions — resizing the
            // window mid-capture must not change what gets written to disk.
            if (exportSize) return;
            if (!mount.clientWidth || !mount.clientHeight) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.fov = fovFor(camera.aspect);
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            if (!animate) renderer.render(scene, camera);
        };
        window.addEventListener("resize", onResize);

        /* Two gates over one loop: run only while the hero intersects the
           viewport AND the tab is visible. Either alone leaks frames — a hidden
           tab keeps intersecting, and a scrolled-past section keeps a visible
           tab. */
        let intersecting = true;
        const syncRunning = () => {
            if (!animate) return;
            const shouldRun = intersecting && !document.hidden;
            if (shouldRun && !frame) {
                loop();
            } else if (!shouldRun && frame) {
                cancelAnimationFrame(frame);
                frame = null;
            }
        };

        const observer = animate
            ? new IntersectionObserver(([entry]) => {
                intersecting = entry.isIntersecting;
                syncRunning();
            }, {threshold: 0})
            : null;
        observer?.observe(mount);

        const onVisibility = () => syncRunning();
        if (animate) document.addEventListener("visibilitychange", onVisibility);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            observer?.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("mouseleave", onDocLeave);
            window.removeEventListener("resize", onResize);
            geometry.dispose();
            material.dispose();
            depthMaterial?.dispose(); // only built when shadows are on
            seedTexture.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, [compact, variant, exportSize, mode, calm]);

    return <div ref={mountRef} style={{position: "absolute", inset: 0}}/>;
};

export default WaveGrid;
