"use client";

import {useEffect, useRef} from "react";
import * as THREE from "three";

/* Animated wireframe wave field.
   A plane is displaced in the vertex shader by layered sines; the fragment shader
   tints crests brighter and fades the edges so the grid dissolves into the page.
   Uses the `three` already in the bundle (see components/earth) — no new deps. */

const VERTEX_SHADER = /* glsl */ `
    uniform float uTime;
    varying float vElevation;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 pos = position;

        // Non-harmonic ratios read as organic rather than obviously looping.
        float e = sin(pos.x * 0.55 + uTime * 0.55) * 0.55;
        e += sin(pos.y * 0.42 - uTime * 0.38) * 0.42;
        e += sin((pos.x + pos.y) * 0.32 + uTime * 0.26) * 0.30;
        e += sin(pos.x * 0.9 - pos.y * 0.7 + uTime * 0.7) * 0.14;

        pos.z += e;
        vElevation = e;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const FRAGMENT_SHADER = /* glsl */ `
    uniform vec3 uColorLow;
    uniform vec3 uColorHigh;
    uniform float uOpacity;
    varying float vElevation;
    varying vec2 vUv;

    void main() {
        float t = smoothstep(-1.0, 1.2, vElevation);
        vec3 color = mix(uColorLow, uColorHigh, t);

        // Fade every edge so the plane has no hard border.
        float fadeY = smoothstep(0.0, 0.42, vUv.y) * smoothstep(1.0, 0.72, vUv.y);
        float fadeX = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);

        gl_FragColor = vec4(color, uOpacity * fadeY * fadeX * (0.35 + t * 0.65));
    }
`;

const WaveGrid = () => {
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
            38,
            mount.clientWidth / mount.clientHeight,
            0.1,
            100,
        );
        camera.position.set(0, -7.5, 5.2);
        camera.lookAt(0, 1.5, 0);

        // Segment count drives cost; small screens get a coarser grid.
        const dense = window.innerWidth > 900;
        const geometry = new THREE.PlaneGeometry(26, 22, dense ? 110 : 60, dense ? 90 : 50);

        const uniforms = {
            uTime: {value: 0},
            uColorLow: {value: new THREE.Color("#2563eb")},
            uColorHigh: {value: new THREE.Color("#96b9f9")},
            uOpacity: {value: 0.5},
        };

        const material = new THREE.ShaderMaterial({
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            uniforms,
            wireframe: true,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const clock = new THREE.Clock();
        let frame = null;

        const render = () => {
            uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        };

        const loop = () => {
            render();
            frame = requestAnimationFrame(loop);
        };

        if (reduced) {
            render(); // One static frame — the shape without the motion.
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

        // Stop drawing when the hero is off-screen — no GPU burn while scrolled away.
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
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} style={{position: "absolute", inset: 0}}/>;
};

export default WaveGrid;
