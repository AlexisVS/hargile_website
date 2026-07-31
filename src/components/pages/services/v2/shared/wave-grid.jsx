"use client";

import {useEffect, useRef} from "react";
import * as THREE from "three";
import {isSoftwareRenderer} from "@/lib/webgl";

/* Wave grid — a single composed still frame, built on the geometry and wave
   maths of franky-adl/3d-wave-grid (src/ThreeJS/Stage.js, Effects/MouseTrail.js,
   Camera.js), recoloured for our palette.

   The upstream project is an interactive toy: a mouse trail feeds ripples into a
   grid every frame forever. We keep its shape and drop its clock. One frame is
   rendered at mount from a fixed set of seeded ripples, and nothing runs after
   that — no rAF loop, no pointer listeners, no camera orbit. The section reads
   as a slab of pillars caught mid-swell and lit in our blue, which is what it
   was always for: a surface for the headline to sit on, not something to watch.

   That buys a lot beyond the look. There is no per-frame cost at all, so the
   phone-vs-desktop split is now purely about composition rather than budget, and
   the whole thing is inherently reduced-motion-safe — there is no motion to
   reduce, so no fallback branch to keep honest.

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

/* The shader loops over exactly the seeds that exist — with no live trail there
   is nothing to leave headroom for. This is a compile-time constant in GLSL, so
   generated variants must produce exactly this many seeds too. */
const TRAIL_LEN = STILL.length;

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
    for (let guard = 0; guard < 4000 && out.length < TRAIL_LEN; guard++) {
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
    while (out.length < TRAIL_LEN) out.push(STILL[out.length]);
    return out;
};

const WAVE = {
    /* Amplitude and maxHeight are both well above the interactive version's
       0.4/0.45. Moving, a low swell is legible because the eye tracks change;
       frozen, the same heights read as an almost-flat floor with a faint tint.
       0.8 of a 3-unit pillar is a third of its height — enough that the frame
       reads as pillars standing at visibly different heights, which is the
       "opened up" part, without turning the grid into spikes. */
    amplitude: 1.0,
    maxHeight: 0.8,
    // Shape of each ripple. Unchanged from the interactive tuning — speed only
    // matters here as the multiplier that turns a seed's age into its radius.
    speed: 2.2,
    frequency: 1.2,
    width: 3.0,
    jitter: 0.2,
    fadeTime: 3.0,
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

/* Two profiles, now purely about framing — with one frame there is no budget
   argument left. grid is how far the slab extends (margin so its outer edge can
   never enter frame), fov is null for "derive from aspect". */
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
   silhouette has to match, or pillars cast the shadow of their rest pose. */
const patchVertexShader = (vertexShader) =>
    vertexShader
        .replace(
            "#include <common>",
            `#include <common>
             varying float vHeight;
             uniform sampler2D uTrailTexture;
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

                 // seed texel: r = world x, g = world z, b = age, a = strength
                 for (int i = 0; i < ${TRAIL_LEN}; i++) {
                     vec4 td = texelFetch(uTrailTexture, ivec2(i, 0), 0);

                     float dist = length(worldXZ - td.rg);
                     float relDist = dist - uWaveSpeed * td.b;

                     float window = exp(-(relDist * relDist) / (uWaveWidth * uWaveWidth));
                     float fade = exp(-td.b / uFadeTime);
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
   pay for a feature only the export uses. */
const WaveGrid = ({compact = false, variant = null, exportSize = null}) => {
    const mountRef = useRef(null);

    // Rebuilds on breakpoint or variant change — grid extent, FOV and the seed
    // texture are all baked in at construction, and there is no loop that could
    // pick up a change in place.
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Exports always use the desktop composition: the image is served to
        // every viewport and object-fit: cover does the reframing, so baking the
        // phone profile's narrower field of view into it would double-crop.
        const profile = compact && !exportSize ? PROFILES.compact : PROFILES.full;
        const GRID = profile.grid;

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
        const shadows = !isSoftwareRenderer(renderer.getContext());

        /* DPR 2 rather than the 1.5 the animated version used. Fill rate is
           irrelevant for a single frame, and a still image is where aliasing on
           thousands of hard pillar edges is actually noticeable.

           An export sets its pixel count outright, so DPR is pinned to 1 and the
           dimensions carry the resolution — otherwise the output size would
           depend on whatever screen happened to run the script. updateStyle is
           false for the same reason: the canvas element's CSS size is irrelevant
           when the pixels are being read rather than displayed. */
        renderer.setPixelRatio(exportSize ? 1 : Math.min(window.devicePixelRatio, shadows ? 2 : 1));
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
        // default up parallel to the view direction. Called once — this is a fixed
        // vantage point, not a follow.
        const alpha = STILL_VIEW.my * ALPHA_RANGE;
        const beta = STILL_VIEW.mx * BETA_RANGE;
        camera.position.set(
            -RADIUS * Math.cos(alpha) * Math.sin(beta),
            RADIUS * Math.cos(alpha) * Math.cos(beta),
            RADIUS * Math.sin(alpha),
        );
        camera.up.set(0, 0, -1);
        camera.lookAt(0, 0, 0);
        scene.add(camera);

        // Cooler and dimmer than the original's white 0.5 / 4.0 pair: the floor has
        // to sit far enough back that body copy reads over it, and any warmth in
        // the key light turns the dark navy grey rather than blue.
        scene.add(new THREE.AmbientLight(0x7d9bd8, 0.85));

        const key = new THREE.DirectionalLight(0xcfe0ff, 2.0);
        key.position.set(-20, 10, 6);
        if (shadows) {
            key.castShadow = true;
            key.shadow.mapSize.set(1024, 1024);
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

        // --- Seed texture: {x, z, age, strength} per texel, written once ---
        // null variant = the curated composition; a number = generated (?wave=N).
        const seeds = variant === null ? STILL : buildSeeds(variant);
        const seedData = new Float32Array(TRAIL_LEN * 4);
        seeds.forEach((p, i) => {
            const o = i * 4;
            seedData[o] = p.x;
            seedData[o + 1] = p.z;
            seedData[o + 2] = p.age;
            seedData[o + 3] = p.strength;
        });
        const seedTexture = new THREE.DataTexture(
            seedData, TRAIL_LEN, 1, THREE.RGBAFormat, THREE.FloatType,
        );
        seedTexture.minFilter = seedTexture.magFilter = THREE.NearestFilter;
        seedTexture.needsUpdate = true;

        /* Printed so a variant you like can be copied straight into STILL — the
           whole point of browsing them is being able to keep one. Only ever runs
           with ?wave= in the URL, so normal loads stay silent. */
        if (variant !== null) {
            console.log(`wave-grid variant ${variant}\n${JSON.stringify(seeds, null, 4)}`);
        }

        // Shared by reference into both shaders, so the depth pass displaces
        // identically to the visible one.
        const uniforms = {
            uTrailTexture: {value: seedTexture},
            uFadeTime: {value: WAVE.fadeTime},
            uWaveSpeed: {value: WAVE.speed},
            uWaveFreq: {value: WAVE.frequency},
            uWaveWidth: {value: WAVE.width},
            uAmplitude: {value: WAVE.amplitude},
            uJitter: {value: WAVE.jitter},
            uMaxHeight: {value: WAVE.maxHeight},
            uCalmCenter: {value: new THREE.Vector2(profile.calm.cx, profile.calm.cz)},
            uCalmRadius: {value: new THREE.Vector2(profile.calm.rx, profile.calm.rz)},
            uCalmDepth: {value: profile.calm.depth},
        };

        // --- Instanced pillars ---
        const geometry = new THREE.BoxGeometry(CUBE_W, CUBE_H, CUBE_W);
        const material = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 40});

        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, uniforms);
            shader.uniforms.uColorBase = {value: new THREE.Color(COLOR_BASE)};
            shader.uniforms.uColorMid = {value: new THREE.Color(COLOR_MID)};
            shader.uniforms.uColorHigh = {value: new THREE.Color(COLOR_HIGH)};

            shader.vertexShader = patchVertexShader(shader.vertexShader);

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
                shader.vertexShader = patchVertexShader(shader.vertexShader);
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

        // The whole render budget, spent once.
        renderer.render(scene, camera);

        /* Re-render on resize — the only thing that can invalidate the frame. The
           FOV is recomputed rather than just the aspect: the lock is a function of
           aspect, so keeping its mount-time value would let a resize toward wide
           re-open the horizontal frustum and bring the grid edge into view. */
        const onResize = () => {
            // An export is pinned to its requested dimensions — resizing the
            // window mid-capture must not change what gets written to disk.
            if (exportSize) return;
            if (!mount.clientWidth || !mount.clientHeight) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.fov = fovFor(camera.aspect);
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.render(scene, camera);
        };
        window.addEventListener("resize", onResize);

        return () => {
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
    }, [compact, variant, exportSize]);

    return <div ref={mountRef} style={{position: "absolute", inset: 0}}/>;
};

export default WaveGrid;
