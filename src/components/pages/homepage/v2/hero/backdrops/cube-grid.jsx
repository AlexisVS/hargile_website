"use client";

import {useEffect, useRef} from "react";
import * as THREE from "three";

/* Cube grid with wave propagation on pointer move.
   After the Codrops article "Building an Interactive Wave Propagation Cube Grid
   with Three.js" (2026-07-09): one InstancedMesh instead of N draw calls, and a
   trail of recent pointer hits streamed to the GPU as a DataTexture. Each cube
   sums a gaussian ripple per trail point, so waves expand outward and decay.

   On top of the trail, a cursor swell rides directly under the pointer: a soft
   mound that lifts nearby cubes, smoothed on the CPU so it trails the mouse
   like a hull through calm water. The trail ripples are its wake — slow,
   small, long-lived.

   Simplified against the article: no shadows, no chromatic aberration — this is
   a backdrop behind copy, so it stays cheap and never fights the headline. */

const GRID = 26;      // cubes per side
const SPACING = 0.62;
const TRAIL = 48;     // trail points held on the GPU

/* Cursor swell — the "boat hull": a soft mound that rides directly under the
   pointer, on top of the wake the trail ripples leave behind it. Vertical only —
   a sideways push read as cubes fleeing the pointer rather than water rising. */
const CURSOR_FALLOFF = 0.55; // gaussian k on squared distance; sigma ≈ 0.95 world units — a mound ~5 cubes wide
const CURSOR_BULGE = 0.08;   // peak Y lift under the cursor — a low rise; ripple crests stack on top of it, so this stays modest

const WAVE_CHUNK = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uTrail;
    uniform float uTrailCount;
    uniform float uWaveSpeed;
    uniform float uWaveFreq;
    uniform float uWaveAmp;
    uniform vec2 uCursor;          // smoothed world xz of the pointer
    uniform float uCursorStrength; // 0..1 enter/leave envelope, smoothed on the CPU
    varying float vWave;

    // trail texel: xy = world xz, z = spawn time, w = strength
    float waveAt(vec2 cell) {
        float total = 0.0;
        float weightSum = 0.0;

        for (int i = 0; i < ${TRAIL}; i++) {
            if (float(i) >= uTrailCount) break;

            vec4 p = texelFetch(uTrail, ivec2(i, 0), 0);
            float age = uTime - p.z;
            if (age < 0.0 || age > 3.5) continue;

            float dist = distance(cell, p.xy);
            // Distance from the expanding wavefront.
            float rel = dist - age * uWaveSpeed;

            // Gaussian envelope centred on the front — soft enough to read as a
            // swell, narrow enough that only a ring of cubes moves at once.
            float env = exp(-rel * rel * 0.7);
            // Fade with age, and with distance from the impact. The distance term
            // keeps each swell tight to the pointer — only nearby cubes move; the
            // age term lets it die gently, like calm water, not snap off.
            // The ramp is the anti-bounce: without it a ripple is born at full
            // height, so slow hovering — which spawns one every few pixels —
            // replays that pop over and over. Grown in over half a second,
            // consecutive spawns blend into one continuous surface, and even a
            // fast sweep blooms gradually instead of erupting.
            float ramp = smoothstep(0.0, 0.5, age);
            float fade = ramp * exp(-age * 0.9) * exp(-dist * 0.5) * p.w;

            total += env * fade * cos(uWaveFreq * rel);
            weightSum += env * fade;
        }

        // Average rather than sum, so overlapping ripples stay controlled.
        return weightSum > 0.001 ? (total / max(weightSum, 0.35)) * uWaveAmp : 0.0;
    }
`;

const CubeGrid = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        } catch {
            return; // No WebGL — the CSS orb/dot-grid backdrop still stands on its own.
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        /* Depth cue, and the thing that stops the grid from ending on a hard line:
           far cubes dissolve into the page's black instead of staying crisp right up
           to where the canvas is cropped. Phong respects fog natively, and the wave
           chunk injected below leaves the fog chunks alone. Near/far are tuned to the
           camera at z=12 — it starts biting just past the middle of the grid.
           Matched to the page background ($background-dark) — the renderer is
           alpha, so any mismatch shows as a halo where cubes fade. */
        scene.fog = new THREE.Fog(0x080c16, 14, 34);

        const camera = new THREE.PerspectiveCamera(
            34,
            mount.clientWidth / mount.clientHeight,
            0.1,
            120,
        );
        camera.position.set(0, 9.5, 12);
        camera.lookAt(0, 0, 0);

        // Mostly ambient: the grid should read as one even colour from every
        // angle — a strong key light left the off-side faces near-black, which
        // muted the hover colour on half the board. The faint directional that
        // remains only keeps the cubes from going completely flat.
        scene.add(new THREE.AmbientLight(0x7d9bd8, 2.1));
        const key = new THREE.DirectionalLight(0x96b9f9, 0.6);
        key.position.set(4, 10, 6);
        scene.add(key);

        // --- Trail texture: {x, z, spawnTime, strength} per texel ---
        const trailData = new Float32Array(TRAIL * 4);
        const trailTex = new THREE.DataTexture(trailData, TRAIL, 1, THREE.RGBAFormat, THREE.FloatType);
        trailTex.minFilter = trailTex.magFilter = THREE.NearestFilter;
        trailTex.needsUpdate = true;

        let trailHead = 0;
        let trailCount = 0;

        const uniforms = {
            uTime: {value: 0},
            uTrail: {value: trailTex},
            uTrailCount: {value: 0},
            // Slow front and long wavelength: a pass should read as a swell rolling
            // out, boat-wake pace. Amp is left alone — the colour lift in the
            // fragment shader tests vWave against fixed heights, so lowering it
            // would quietly stop the cubes turning blue.
            uWaveSpeed: {value: 1.7},
            uWaveFreq: {value: 1.6},
            uWaveAmp: {value: 1.15},
            uCursor: {value: new THREE.Vector2()},
            uCursorStrength: {value: 0},
        };

        // --- Instanced cubes ---
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const material = new THREE.MeshPhongMaterial({
            // Bluer than the old #16213e, still dark enough that the headline
            // and capability copy sit on it comfortably.
            color: new THREE.Color("#1c2b58"),
            shininess: 60,
            specular: new THREE.Color("#2563eb"),
            transparent: true,
            opacity: 0.95,
        });

        // Inject the wave into the stock Phong shader.
        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, uniforms);
            shader.uniforms.uHighlight = {value: new THREE.Color("#96b9f9")};

            shader.vertexShader = shader.vertexShader
                .replace("#include <common>", `#include <common>\n${WAVE_CHUNK}`)
                .replace(
                    "#include <begin_vertex>",
                    `#include <begin_vertex>
                     // Instance origin in world space — the cell this cube stands on.
                     // Instance matrices are translation-only, so local offsets to
                     // 'transformed' below are world-space offsets.
                     vec2 cell = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);

                     // Cursor swell: a gaussian bulge, vertical only.
                     vec2 cdiff = cell - uCursor;
                     float cg = exp(-dot(cdiff, cdiff) * ${CURSOR_FALLOFF.toFixed(4)}) * uCursorStrength;
                     float bulge = cg * ${CURSOR_BULGE.toFixed(4)};

                     // Ripples are masked out under the cursor: a spawn always
                     // begins life at the pointer, and at slow hover that birth
                     // frame replays under you as a visible re-bounce. Like water
                     // under a hull — only the mound exists here; the wake fades
                     // in as it travels clear of the cursor zone.
                     float w = waveAt(cell) * (1.0 - 0.85 * cg);

                     vWave = w + bulge;
                     transformed.y += w + bulge;`,
                );

            shader.fragmentShader = shader.fragmentShader
                .replace("#include <common>", `#include <common>\nvarying float vWave;\nuniform vec3 uHighlight;`)
                .replace(
                    "#include <dithering_fragment>",
                    `#include <dithering_fragment>
                     // Crests glow toward the brand blue. The upper edge is tuned
                     // to the current low crest heights — at the old 0.9 the small
                     // waves never got past a faint tint.
                     float lift = smoothstep(0.03, 0.45, vWave);
                     gl_FragColor.rgb = mix(gl_FragColor.rgb, uHighlight, lift * 0.85);

                     // Fog alone only tints a distant cube toward the fog colour — on an
                     // alpha renderer that leaves it a solid black silhouette over the
                     // page rather than gone. Fade alpha on the same curve so far cubes
                     // actually recede. Runs after <fog_fragment>, which is why the fog
                     // colour is already applied above.
                     gl_FragColor.a *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);`,
                );
        };

        const mesh = new THREE.InstancedMesh(geometry, material, GRID * GRID);
        const dummy = new THREE.Object3D();
        let i = 0;
        const half = (GRID - 1) / 2;
        for (let x = 0; x < GRID; x++) {
            for (let z = 0; z < GRID; z++) {
                dummy.position.set((x - half) * SPACING, 0, (z - half) * SPACING);
                dummy.updateMatrix();
                mesh.setMatrixAt(i++, dummy.matrix);
            }
        }
        mesh.instanceMatrix.needsUpdate = true;
        scene.add(mesh);

        const clock = new THREE.Clock();

        const pushTrail = (x, z, strength) => {
            const o = trailHead * 4;
            trailData[o] = x;
            trailData[o + 1] = z;
            trailData[o + 2] = clock.getElapsedTime();
            trailData[o + 3] = strength;
            trailTex.needsUpdate = true;
            trailHead = (trailHead + 1) % TRAIL;
            trailCount = Math.min(trailCount + 1, TRAIL);
            uniforms.uTrailCount.value = trailCount;
        };

        // --- Pointer → grid plane raycast ---
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const ndc = new THREE.Vector2();
        const hit = new THREE.Vector3();
        let lastHit = null;
        let lastMove = 0;
        let lastRipple = 0;

        // Cursor-swell targets, chased with smoothing in render() so the mound
        // follows the pointer with a slight fluid lag instead of snapping.
        const cursorTarget = new THREE.Vector2();
        let cursorTargetStrength = 0;
        let lastT = 0;

        const onPointerMove = (e) => {
            const r = mount.getBoundingClientRect();
            // Only react while the pointer is actually over the grid. The listener has
            // to be on window (the canvas is pointer-events:none), so without this the
            // grid ripples from mouse movement anywhere on the page — including well
            // past it, where it reads as the cubes moving on their own.
            if (
                e.clientX < r.left ||
                e.clientX > r.right ||
                e.clientY < r.top ||
                e.clientY > r.bottom
            ) {
                // Drop the anchor on the way out, or re-entering somewhere else would
                // measure the jump across the gap as one huge delta and fire a
                // max-strength ripple. The swell eases out in render().
                lastHit = null;
                cursorTargetStrength = 0;
                return;
            }

            ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            if (!raycaster.ray.intersectPlane(plane, hit)) return;

            // The swell tracks every in-bounds move — only the ripple pushes below
            // are throttled. Touch has no hover, so the mound stays dormant there
            // and ripples remain a touch drag's whole response.
            if (e.pointerType !== "touch") {
                cursorTarget.set(hit.x, hit.z);
                cursorTargetStrength = 1;
            }
            // Set here rather than with the ripple push: hovering should suppress
            // idle ripples even while the throttles are skipping pushes.
            lastMove = clock.getElapsedTime();

            // Strength scales with pointer speed — slow drags ripple less.
            if (!lastHit) {
                // First sample after entering: no previous point to measure speed
                // against, so just anchor here and let the next move do the work.
                // Firing at full strength on entry made every pass over the section
                // announce itself with a slam.
                lastHit = {x: hit.x, z: hit.z};
                return;
            }

            const now = clock.getElapsedTime();

            const d = Math.hypot(hit.x - lastHit.x, hit.z - lastHit.z);
            if (d < 0.3) return; // ignore jitter and slow drift — the mound covers it

            // Dense enough that a sweep reads as one continuous wake — at wide
            // spacing the throttled ripples showed up as separate blips. The low
            // strength cap below is what keeps this from thrashing.
            if (now - lastRipple < 0.1) return;

            // Strength is purely proportional to movement — no floor. A crawl
            // produces near-nothing (the cursor mound is the slow-hover response;
            // a floored ripple here is what kept re-bouncing under the pointer),
            // and the cap keeps a fast flick from slamming the grid.
            const strength = Math.min(d * 0.5, 0.42);

            lastRipple = now;
            lastHit = {x: hit.x, z: hit.z};
            pushTrail(hit.x, hit.z, strength);
        };
        // The canvas is pointer-events:none, so this has to be on window rather than
        // the mount — onPointerMove bounds-checks against the mount to compensate.
        window.addEventListener("pointermove", onPointerMove);

        // Leaving the viewport entirely never fires an out-of-bounds pointermove,
        // so without this the swell would sit frozen at the exit point.
        const onDocLeave = () => {
            lastHit = null;
            cursorTargetStrength = 0;
        };
        document.addEventListener("mouseleave", onDocLeave);

        // Idle: an occasional ripple so the grid isn't dead when untouched (this is
        // also all a touch device ever gets). Deliberately sparse and weak — at one
        // full-strength hit every second or two it stopped reading as a response to
        // the pointer and just became ambient noise competing with the copy.
        let nextIdle = 0;
        const idleTick = (t) => {
            if (t - lastMove < 8) return;
            if (t < nextIdle) return;
            // Strength compensates for the steeper distance falloff — these land away
            // from centre, so at the old 0.45 they'd barely register now. Still well
            // under a pointer ripple.
            const span = GRID * SPACING * 0.42;
            pushTrail((Math.random() * 2 - 1) * span, (Math.random() * 2 - 1) * span, 0.75);
            nextIdle = t + 5 + Math.random() * 5;
        };

        let frame = null;

        const render = () => {
            const t = clock.getElapsedTime();
            uniforms.uTime.value = t;

            // Frame-rate-independent damping toward the pointer. Clamp dt: the loop
            // is gated by the IntersectionObserver, so the first frame after
            // re-entry can carry a huge gap.
            const dt = Math.min(t - lastT, 0.1);
            lastT = t;

            const s = uniforms.uCursorStrength.value;
            // Position tracks the pointer directly — any smoothing here read as
            // input lag. Only the strength envelope below is eased, so entering
            // and leaving the grid still fade rather than pop.
            uniforms.uCursor.value.copy(cursorTarget);
            const k = cursorTargetStrength > s ? 7 : 3;
            uniforms.uCursorStrength.value = s + (cursorTargetStrength - s) * (1 - Math.exp(-k * dt));

            idleTick(t);
            renderer.render(scene, camera);
        };

        const loop = () => {
            render();
            frame = requestAnimationFrame(loop);
        };

        if (reduced) {
            render(); // Static grid — the shape without the motion.
        } else {
            loop();
        }

        const onResize = () => {
            if (!mount.clientWidth || !mount.clientHeight) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener("resize", onResize);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (reduced) return;
                if (entry.isIntersecting && !frame) {
                    loop();
                } else if (!entry.isIntersecting && frame) {
                    cancelAnimationFrame(frame);
                    frame = null;
                }
            },
            {threshold: 0},
        );
        observer.observe(mount);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("mouseleave", onDocLeave);
            geometry.dispose();
            material.dispose();
            trailTex.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} style={{position: "absolute", inset: 0}}/>;
};

export default CubeGrid;
