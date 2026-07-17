"use client";

import {useEffect, useRef} from "react";
import * as THREE from "three";

/* Cube grid with wave propagation on pointer move.
   After the Codrops article "Building an Interactive Wave Propagation Cube Grid
   with Three.js" (2026-07-09): one InstancedMesh instead of N draw calls, and a
   trail of recent pointer hits streamed to the GPU as a DataTexture. Each cube
   sums a gaussian ripple per trail point, so waves expand outward and decay.

   Simplified against the article: no shadows, no chromatic aberration — this is
   a backdrop behind copy, so it stays cheap and never fights the headline. */

const GRID = 26;      // cubes per side
const SPACING = 0.62;
const TRAIL = 48;     // trail points held on the GPU

const WAVE_CHUNK = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uTrail;
    uniform float uTrailCount;
    uniform float uWaveSpeed;
    uniform float uWaveFreq;
    uniform float uWaveAmp;
    varying float vWave;

    // trail texel: xy = world xz, z = spawn time, w = strength
    float waveAt(vec2 cell) {
        float total = 0.0;
        float weightSum = 0.0;

        for (int i = 0; i < ${TRAIL}; i++) {
            if (float(i) >= uTrailCount) break;

            vec4 p = texelFetch(uTrail, ivec2(i, 0), 0);
            float age = uTime - p.z;
            if (age < 0.0 || age > 4.0) continue;

            float dist = distance(cell, p.xy);
            // Distance from the expanding wavefront.
            float rel = dist - age * uWaveSpeed;

            // Gaussian envelope centred on the front.
            float env = exp(-rel * rel * 1.1);
            // Fade with age, and with distance from the impact.
            float fade = exp(-age * 0.85) * exp(-dist * 0.16) * p.w;

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
        const camera = new THREE.PerspectiveCamera(
            34,
            mount.clientWidth / mount.clientHeight,
            0.1,
            120,
        );
        camera.position.set(0, 9.5, 12);
        camera.lookAt(0, 0, 0);

        scene.add(new THREE.AmbientLight(0x8098c0, 1.4));
        const key = new THREE.DirectionalLight(0x96b9f9, 2.2);
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
            uWaveSpeed: {value: 3.2},
            uWaveFreq: {value: 2.4},
            uWaveAmp: {value: 1.15},
        };

        // --- Instanced cubes ---
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color("#16213e"),
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
                     vec2 cell = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
                     float w = waveAt(cell);
                     vWave = w;
                     transformed.y += w;`,
                );

            shader.fragmentShader = shader.fragmentShader
                .replace("#include <common>", `#include <common>\nvarying float vWave;\nuniform vec3 uHighlight;`)
                .replace(
                    "#include <dithering_fragment>",
                    `#include <dithering_fragment>
                     // Crests glow toward the brand blue.
                     float lift = smoothstep(0.05, 0.9, vWave);
                     gl_FragColor.rgb = mix(gl_FragColor.rgb, uHighlight, lift * 0.85);`,
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

        const onPointerMove = (e) => {
            const r = mount.getBoundingClientRect();
            ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
            raycaster.setFromCamera(ndc, camera);
            if (!raycaster.ray.intersectPlane(plane, hit)) return;

            // Strength scales with pointer speed — slow drags ripple less.
            let strength = 1;
            if (lastHit) {
                const d = Math.hypot(hit.x - lastHit.x, hit.z - lastHit.z);
                if (d < 0.12) return; // ignore jitter
                strength = Math.min(d * 1.6, 1.4);
            }
            lastHit = {x: hit.x, z: hit.z};
            lastMove = clock.getElapsedTime();
            pushTrail(hit.x, hit.z, strength);
        };
        // The canvas is pointer-events:none, so listen on the window.
        window.addEventListener("pointermove", onPointerMove);

        // Idle: seed random ripples so the grid is never dead (also covers touch).
        let nextIdle = 0;
        const idleTick = (t) => {
            if (t - lastMove < 3) return;
            if (t < nextIdle) return;
            const span = GRID * SPACING * 0.42;
            pushTrail((Math.random() * 2 - 1) * span, (Math.random() * 2 - 1) * span, 1);
            nextIdle = t + 0.9 + Math.random() * 1.4;
        };

        let frame = null;

        const render = () => {
            const t = clock.getElapsedTime();
            uniforms.uTime.value = t;
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
