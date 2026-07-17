"use client";

import dynamic from "next/dynamic";
import styles from "../hero.module.scss";

/* Hero backdrop switcher — lets us compare WebGL treatments without touching hero.jsx.
   Pass `variant`, or leave it out and it reads ?backdrop=<key> from the URL, then
   NEXT_PUBLIC_HERO_BACKDROP, then falls back to DEFAULT_VARIANT. */

export const VARIANTS = ["bends", "cubes", "none"];

const DEFAULT_VARIANT = "bends";

// Three.js is client-only and ~150KB — keep every variant out of the initial bundle.
const ColorBends = dynamic(() => import("@/components/vendor/color-bends/ColorBends"), {ssr: false});
const CubeGrid = dynamic(() => import("./cube-grid"), {ssr: false});

// The actual brand blues, dark → light: page background, then #2563eb (the hero
// orb) and #96b9f9 (the accent used across the site). The first two stops sit
// near the background so the bands stay dark overall and the brand blues land
// where the light concentrates — on the crest of a band — rather than as a wash.
const BEND_COLORS = ["#07070f", "#101c3a", "#2563eb", "#96b9f9"];

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

    if (active === "none") return null;

    return (
        <div className={styles.backdrop} aria-hidden="true">
            {active === "bends" && (
                <ColorBends
                    className=""
                    colors={BEND_COLORS}
                    rotation={72}
                    speed={0.18}
                    frequency={1.1}
                    noise={0.1}
                    bandWidth={0.34}
                    iterations={1}
                    intensity={1.05}
                    mouseInfluence={0.35}
                    parallax={0.3}
                />
            )}
            {active === "cubes" && <CubeGrid/>}
        </div>
    );
};

export default HeroBackdrop;
