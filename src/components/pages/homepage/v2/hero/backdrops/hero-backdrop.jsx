"use client";

import dynamic from "next/dynamic";
import {useEffect, useState, useSyncExternalStore} from "react";
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

/* Desktop only: warm the wave chunk at module evaluation rather than after
   mount — the three.js download is what the branded loader spends most of its
   life waiting on, and Turbopack dedupes this against the dynamic() load above.

   Deliberately NOT done below the breakpoint, and the reason is stronger now
   than it was: there is no canvas down there at all, only the still image, so
   prefetching three.js on a phone would download ~150 kB to render nothing.
   Even when mobile did mount a canvas, the earlier fetch pulled the three.js
   parse/execute forward into the hydration window and measured as +1.7 s of
   mobile TBT.

   This used to warm ./cube-grid. It warms the wave grid now because that is
   what the homepage actually renders — the two share the three.js chunk, so the
   expensive half was covered either way, but warming the module the page is
   about to import saves a round trip and no longer fetches a variant nothing
   uses. (A ?backdrop= override can still load the others later; that's the
   debug path, not the cold-load path.) */
if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
    import("@/components/pages/services/v2/shared/wave-grid");
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

/* The exported still, for viewports that don't get the canvas. Its own file, not
   the /services one: that image was composed against a different quiet ellipse
   and a different hero aspect, so reusing it would put the dark band in the wrong
   place. Produced by `npm run images:wavegrid:home` — see the export switch
   below. */
const IMAGE_DIR = "/images/wave-grid";
const HOME_IMAGE = "home";

/* Authoring switches on the wave variant, all absent in normal use:

     /preview/home-wave                    → canvas above 1024px, still below
     /preview/home-wave?wave=7             → composition 7, live, for picking
     /preview/home-wave?export=2560x1600   → fixed-size render, for the script

   Wired into this component rather than into a dedicated export route on
   purpose. The exported image has to be the composition the live canvas draws,
   and the only way to guarantee that is for both to come out of the same call
   site with the same HOME_CALM — a second mounting of WaveGrid somewhere else is
   exactly how the two would quietly drift apart.

   Not useSearchParams: that would opt the whole homepage into dynamic rendering
   to support debug flags. useSyncExternalStore because that is what this is —
   external state sampled once — and it takes a server snapshot, so hydration is
   correct rather than a mismatch React has to patch. subscribe is a no-op: the
   URL cannot change here without a full navigation. */
const subscribeToUrl = () => () => {};
const readParams = () => window.location.search;
const readParamsOnServer = () => "";

const useWaveSwitches = () => {
    const search = useSyncExternalStore(subscribeToUrl, readParams, readParamsOnServer);
    const params = new URLSearchParams(search);

    const rawWave = params.get("wave");
    const wave = rawWave === null ? Number.NaN : Number.parseInt(rawWave, 10);

    const rawExport = params.get("export");
    const m = rawExport ? /^(\d{2,5})x(\d{2,5})$/.exec(rawExport) : null;

    return {
        variant: Number.isFinite(wave) ? wave : null,
        exportSize: m ? {w: Number(m[1]), h: Number(m[2])} : null,
    };
};

/* Which side of the wave grid's canvas/image split we're on. Three states, not
   two: null means *unresolved*, and the wave branch renders nothing until the
   effect lands. Defaulting to either side instead would mount the wrong one for
   a beat — on phones that means paying for the three.js parse we are trying to
   avoid, which is the entire point of the still.

   1024 matches useHeroVariant's own breakpoint in hero.jsx, so the backdrop and
   the hero's layout decision change together. */
const useWaveWide = () => {
    const [wide, setWide] = useState(null);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const sync = () => setWide(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return wide;
};

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

/* WaveGrid's `compact` profile is deliberately never used here. It reframes the
   grid for a narrow canvas, and on this page there is no narrow canvas: below
   1024px the still image is served instead, and an export always uses the full
   profile by design. Passing it would only affect the authoring paths, where it
   would misrepresent what actually ships. */

/* The wave backdrop: a canvas on desktop, the exported still below 1024px.

   This is the split /services already ships, arrived at for the same reason — a
   surface that never moves costs ~20 kB of AVIF against ~150 kB of three.js plus
   the main-thread work of parsing it, building the instances and compiling two
   shader programs. On the homepage the trade is even clearer, because the phone
   is exactly where that work lands in the hydration window.

   What it buys beyond the bytes is the thing this whole exercise was for: the
   same cubes, the same colour, the same composition language on both viewports.
   Desktop moves, mobile does not — instead of today's split where desktop gets
   cubes and mobile gets colour bends, which are not the same design at all. */
const WaveBackdrop = () => {
    const {variant: wave, exportSize} = useWaveSwitches();
    const wide = useWaveWide();

    /* Both authoring switches force a *still* canvas at any width: an export
       must capture one frame, and browsing compositions with ?wave=N is
       browsing seeded still frames — live mode ignores the seed table entirely
       and fills its trail from the pointer instead. */
    const authored = exportSize !== null || wave !== null;

    if (authored) {
        return (
            <WaveGrid
                mode="still"
                variant={wave}
                exportSize={exportSize}
                calm={HOME_CALM}
            />
        );
    }

    // Unresolved viewport — render neither rather than guessing. See useWaveWide.
    if (wide === null) return null;

    if (wide) return <WaveGrid mode="live" calm={HOME_CALM}/>;

    return (
        <picture>
            {/* AVIF first, WebP fallback. The fallback is required, not
                belt-and-braces: browserslist allows edge >= 111 and Edge only
                shipped AVIF in 121. */}
            <source srcSet={`${IMAGE_DIR}/${HOME_IMAGE}.avif`} type="image/avif"/>
            <img
                className={styles.waveStill}
                src={`${IMAGE_DIR}/${HOME_IMAGE}.webp`}
                alt=""
                /* Intrinsic size of the export — the element is absolutely
                   positioned, so this is about decode sizing, not layout. */
                width={2560}
                height={1600}
                decoding="async"
                /* Largest thing in the viewport and very likely the LCP element.
                   Left to lazy defaults it arrives after the copy, which is the
                   pop-in the canvas already had. */
                fetchPriority="high"
            />
        </picture>
    );
};

const HeroBackdrop = ({variant}) => {
    const portrait = usePortrait();

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
            {variant === "wave" && <WaveBackdrop/>}
        </div>
    );
};

export default HeroBackdrop;
