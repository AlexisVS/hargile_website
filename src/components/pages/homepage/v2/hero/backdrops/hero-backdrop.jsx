"use client";

import dynamic from "next/dynamic";
import styles from "../hero.module.scss";

/* Hero backdrop switcher — lets us compare WebGL treatments without touching hero.jsx.
   Set NEXT_PUBLIC_HERO_BACKDROP to one of the VARIANTS keys, or append
   ?backdrop=<key> to the URL to preview a variant on the fly. */

export const VARIANTS = ["bends", "waves", "cubes", "particles", "none"];

const DEFAULT_VARIANT = "bends";

// Three.js is client-only and ~150KB — keep every variant out of the initial bundle.
const ColorBends = dynamic(() => import("@/components/vendor/color-bends/ColorBends"), {ssr: false});
const WaveGrid = dynamic(() => import("./wave-grid"), {ssr: false});

// Brand blues, dark → light, for the bend gradient.
const BEND_COLORS = ["#0a0a12", "#1e3a8a", "#2563eb", "#96b9f9"];

const resolveVariant = () => {
    if (typeof window !== "undefined") {
        const q = new URLSearchParams(window.location.search).get("backdrop");
        if (q && VARIANTS.includes(q)) return q;
    }
    const env = process.env.NEXT_PUBLIC_HERO_BACKDROP;
    return VARIANTS.includes(env) ? env : DEFAULT_VARIANT;
};

const HeroBackdrop = () => {
    const variant = resolveVariant();

    if (variant === "none") return null;

    return (
        <div className={styles.backdrop} aria-hidden="true">
            {variant === "bends" && (
                <ColorBends
                    colors={BEND_COLORS}
                    rotation={72}
                    speed={0.18}
                    frequency={1.1}
                    noise={0.12}
                    bandWidth={0.5}
                    iterations={1}
                    intensity={1.25}
                    mouseInfluence={0.35}
                    parallax={0.3}
                />
            )}
            {variant === "waves" && <WaveGrid/>}
        </div>
    );
};

export default HeroBackdrop;
