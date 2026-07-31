"use client";

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import styles from "../hero.module.scss";

/* Hero backdrop switcher — lets us compare WebGL treatments without touching hero.jsx.
   `variant` is required and has a single owner: useHeroVariant in hero.jsx, which
   also parses ?backdrop=<key>. It passes null until it has resolved the viewport
   (see the note there) and this renders nothing in the meantime. */

export const VARIANTS = ["bends", "cubes", "wave", "none"];

// Three.js is client-only and ~150KB — keep every variant out of the initial bundle.
const ColorBends = dynamic(() => import("@/components/vendor/color-bends/ColorBends"), {ssr: false});
const CubeGrid = dynamic(() => import("./cube-grid"), {ssr: false});
// The /services wave grid, in its live mode. Shared rather than reimplemented:
// the two pages are meant to end up with one visual language, and a second copy
// of that shader is how they'd stop having one.
const WaveGrid = dynamic(() => import("@/components/pages/services/v2/shared/wave-grid"), {ssr: false});

/* Desktop only: warm the cube-grid chunk at module evaluation rather than
   after mount + the useHeroVariant effect — the three.js download is what the
   branded loader spends most of its life waiting on, and Turbopack dedupes
   this against the dynamic() load above. Deliberately NOT done for the mobile
   ColorBends variant: under a throttled CPU the earlier fetch pulls the
   three.js parse/execute forward into the hydration window, which measured as
   +1.7 s of mobile TBT — the lazy mount path keeps that work after TTI.
   (A ?backdrop= override can still load the other variant later; that's the
   debug path, not the cold-load path.)

   Not repeated for the wave chunk, and it doesn't need to be: what the loader
   waits on is three.js itself, and the two backdrops share that chunk — warming
   cube-grid warms the expensive half of wave too. Adding a second prefetch would
   only fetch the shader module, and would do it on every homepage load for a
   variant almost none of them use. */
if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
    import("./cube-grid");
}

/* The homepage's own quiet zone — deliberately NOT the /services ellipse.

   That one is tuned to a single answer paragraph sitting in the left column of a
   two-column hero (x -6.1…-0.1, z 0.3…2.1). This hero puts eyebrow, a large
   headline, a paragraph and a CTA row down the same side, so the region to keep
   dark is much taller: roughly the full vertical middle of the frame, against a
   visible extent of about z ±3.9. Hence rz 3.0 rather than 1.9, and a centre
   near the vertical middle rather than below it.

   Shallower, though — depth 0.55 against the services 0.8. The .sectionSharp
   mask (hero.module.scss) already fades the whole canvas out across the copy
   side; stacking a full-depth damp under it flattened the left half to a dead
   plate. The two are doing one job between them.

   Module-level so the reference is stable: WaveGrid rebuilds its scene when this
   changes, and an inline literal would be a new object on every render. */
const HOME_CALM = {cx: -3.6, cz: 0.2, rx: 5.2, rz: 3.0, depth: 0.55};

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

/* The wave grid's own breakpoint, matching the one /services uses (860px) rather
   than the hero's 1024 — it switches the grid to a narrower, pinned-FOV framing
   so phone pillars stay the same size as desktop ones, which is a question about
   the canvas, not about the copy layout. */
const useCompactGrid = () => {
    const [compact, setCompact] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 860px)");
        const sync = () => setCompact(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return compact;
};

const HeroBackdrop = ({variant}) => {
    const portrait = usePortrait();
    const compactGrid = useCompactGrid();

    // null = not resolved yet; "none" = deliberately no backdrop. Nothing to draw either way.
    if (!variant || variant === "none") return null;

    return (
        <div className={styles.backdrop} aria-hidden="true">
            {variant === "bends" && (
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
            {variant === "cubes" && <CubeGrid/>}
            {variant === "wave" && (
                <WaveGrid mode="live" compact={compactGrid} calm={HOME_CALM}/>
            )}
        </div>
    );
};

export default HeroBackdrop;
