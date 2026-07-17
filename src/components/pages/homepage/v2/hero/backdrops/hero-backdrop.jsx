"use client";

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import styles from "../hero.module.scss";

/* Hero backdrop switcher — lets us compare WebGL treatments without touching hero.jsx.
   Pass `variant`, or leave it out and it reads ?backdrop=<key> from the URL, then
   NEXT_PUBLIC_HERO_BACKDROP, then falls back to DEFAULT_VARIANT. */

export const VARIANTS = ["bends", "cubes", "none"];

const DEFAULT_VARIANT = "bends";

// Three.js is client-only and ~150KB — keep every variant out of the initial bundle.
const ColorBends = dynamic(() => import("@/components/vendor/color-bends/ColorBends"), {ssr: false});
const CubeGrid = dynamic(() => import("./cube-grid"), {ssr: false});

// The shader SUMS the stops (sumCol += uColors[i] * w) rather than interpolating
// between them, so every stop adds light on every band. A near-black stop just
// burns a slot; two brand blues is what reads as blue instead of washing toward
// white. Keep this list short and bright — that's what gives the React Bits demo
// its glow, not the hue itself.
const BEND_COLORS = ["#2563eb", "#96b9f9"];

/* The shader only aspect-corrects x (q.x *= canvas.x / canvas.y) and leaves y alone,
   so in portrait — where that ratio drops below 1 — x is squeezed and the bands come
   out stretched tall. It's vendored to stay re-syncable, so we compensate via props
   rather than patching the GLSL: lay the bands toward horizontal so they run along
   the screen's long axis, and scale up so fewer, larger bands are on screen at once,
   which makes the remaining distortion far less legible. */
const usePortrait = () => {
    const [portrait, setPortrait] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px) and (orientation: portrait)");
        const sync = () => setPortrait(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return portrait;
};

const resolveVariant = () => {
    if (typeof window !== "undefined") {
        const q = new URLSearchParams(window.location.search).get("backdrop");
        if (q && VARIANTS.includes(q)) return q;
    }
    const env = process.env.NEXT_PUBLIC_HERO_BACKDROP;
    return VARIANTS.includes(env) ? env : DEFAULT_VARIANT;
};

const HeroBackdrop = ({variant}) => {
    const active = variant ?? resolveVariant();
    const portrait = usePortrait();

    if (active === "none") return null;

    return (
        <div className={styles.backdrop} aria-hidden="true">
            {active === "bends" && (
                <ColorBends
                    className=""
                    colors={BEND_COLORS}
                    // Near-vertical bands stack the portrait stretch along the tall axis;
                    // laying them down runs them across the screen's width instead.
                    rotation={portrait ? 20 : 72}
                    // Fewer, larger bands on a small screen — reads as intent rather than
                    // as a desktop composition squeezed into a phone.
                    scale={portrait ? 1.7 : 1}
                    speed={0.18}
                    frequency={1.0}
                    // Applied after intensity and symmetric around zero, so in the troughs it
                    // only ever adds light — it sets a grey floor that stops the blacks from
                    // bottoming out. Kept just high enough to break gradient banding.
                    noise={0.025}
                    // bandWidth and intensity are pulled in opposite directions on purpose:
                    // bandWidth (w = 1 - exp(-bw / exp(bw * m))) steepens the falloff, so the
                    // troughs drop toward black faster than the crests lose brightness;
                    // intensity (a flat col *= uIntensity) then scales the whole thing back so
                    // the crests don't clip. Net is deeper blacks with the blue intact — which
                    // neither gives alone, since intensity on its own just dims everything
                    // equally. Adjust them as a pair.
                    bandWidth={1.35}
                    iterations={1}
                    intensity={0.72}
                    mouseInfluence={0.35}
                    parallax={0.3}
                />
            )}
            {active === "cubes" && <CubeGrid/>}
        </div>
    );
};

export default HeroBackdrop;
