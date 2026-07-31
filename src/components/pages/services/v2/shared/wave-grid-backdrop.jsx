"use client";

import dynamic from "next/dynamic";
import {useEffect, useState, useSyncExternalStore} from "react";
import styles from "./wave-grid-backdrop.module.scss";

/* Backdrop for the services hero.

   What ships is a still image, not WebGL. The grid was always a single frame
   that never changes, and three.js costs ~150KB gzipped plus the main-thread
   work of parsing it, building 2304 instances, compiling two shader programs
   and running a shadow pass — against roughly 20KB for an AVIF of the exact
   same pixels. For a frame that never moves, the canvas earns nothing.

   The three.js path is still here, because that is what produces the image:
   scripts/export-wave-grid.mjs drives it through ?export= and captures the
   canvas. ?wave=N also still renders it live, which is how compositions get
   chosen. Neither loads for a real visitor — the dynamic import only runs when
   one of those params is present.

   object-fit: cover is doing more work than it looks. The live camera holds
   horizontal world coverage fixed above 1.6:1 and closes the vertical angle as
   the viewport widens (see fovForAspect); below that it holds vertical extent
   and shows less horizontally. Those are exactly cover's two behaviours against
   a fixed-ratio image, which is why a single 1.6:1 export reframes correctly
   across every aspect instead of needing a per-breakpoint set. */
const WaveGrid = dynamic(() => import("./wave-grid"), {ssr: false});

const IMAGE_DIR = "/images/wave-grid";

/* Which exported composition ships. Change this to switch the hero's look —
   the file has to exist in public/images/wave-grid, so export it first. */
const DEFAULT_IMAGE = "curated";

/* Matches the hero's own one-column breakpoint, so the reframed grid and the
   stacked copy layout always change together. Only consulted by the live WebGL
   path now; the image handles every viewport through cover. */
const useCompact = () => {
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

/* URL switches, all authoring-only and all absent in normal use:

     /services                   → the exported still (no JS, no three.js)
     /services?bg=wave-7         → a different exported still, to compare
     /services?wave=7            → composition 7 rendered live, for picking
     /services?export=2560x1600  → live render at fixed size, for the script

   Not useSearchParams: that would opt the whole route into dynamic rendering to
   support debug flags. useSyncExternalStore rather than read-in-effect because
   that is what this is — external state sampled once — and it takes a server
   snapshot, so hydration is correct rather than a mismatch React has to patch.
   subscribe is a no-op: the URL cannot change here without a full navigation. */
const subscribeToUrl = () => () => {};
const readParams = () => window.location.search;
const readParamsOnServer = () => "";

const useUrlSwitches = (search) => {
    const params = new URLSearchParams(search);

    const rawWave = params.get("wave");
    const wave = rawWave === null ? Number.NaN : Number.parseInt(rawWave, 10);

    const rawExport = params.get("export");
    const m = rawExport ? /^(\d{2,5})x(\d{2,5})$/.exec(rawExport) : null;

    const rawBg = params.get("bg");

    return {
        variant: Number.isFinite(wave) ? wave : null,
        exportSize: m ? {w: Number(m[1]), h: Number(m[2])} : null,
        // Filename-safe only — this value reaches a src attribute.
        image: rawBg && /^[a-z0-9-]{1,40}$/i.test(rawBg) ? rawBg : DEFAULT_IMAGE,
    };
};

/* Plain <a> on purpose: each step rebuilds the WebGL scene from scratch anyway,
   so a client-side transition would save nothing and would risk leaving the old
   canvas mounted.

   Random is a button, not a link, because picking the number during render would
   make this component impure — the React Compiler rejects it, and rightly: the
   href would differ between renders. Choosing it in the click handler keeps the
   randomness an effect of the interaction. */
const VariantPicker = ({variant}) => {
    const roll = () => {
        window.location.search = `?wave=${Math.floor(Math.random() * 1000)}`;
    };

    return (
        <div className={styles.picker}>
            <a href={`?wave=${variant - 1}`} aria-label="Previous composition">←</a>
            <span>wave {variant}</span>
            <a href={`?wave=${variant + 1}`} aria-label="Next composition">→</a>
            <button type="button" onClick={roll}>random</button>
        </div>
    );
};

const WaveGridBackdrop = () => {
    const compact = useCompact();
    const search = useSyncExternalStore(subscribeToUrl, readParams, readParamsOnServer);
    const {variant, exportSize, image} = useUrlSwitches(search);

    const live = variant !== null || exportSize !== null;

    return (
        <>
            <div className={styles.backdrop} aria-hidden="true">
                {live ? (
                    <WaveGrid compact={compact} variant={variant} exportSize={exportSize}/>
                ) : (
                    <picture>
                        {/* AVIF first, WebP fallback. The fallback is required, not
                            belt-and-braces: browserslist allows edge >= 111 and Edge
                            only shipped AVIF in 121. */}
                        <source srcSet={`${IMAGE_DIR}/${image}.avif`} type="image/avif"/>
                        <img
                            className={styles.still}
                            src={`${IMAGE_DIR}/${image}.webp`}
                            alt=""
                            /* Intrinsic size of the export. Present so the element
                               reserves its box before the bytes arrive rather than
                               shifting the section — it is absolutely positioned, so
                               this is about decode sizing, not layout. */
                            width={2560}
                            height={1600}
                            decoding="async"
                            /* This is the largest thing in the viewport and very likely
                               the LCP element. Left to lazy defaults it would arrive
                               after the copy, which is the pop-in the canvas already
                               had and the whole point of moving to an image. */
                            fetchPriority="high"
                        />
                    </picture>
                )}
            </div>
            {/* Outside the aria-hidden layer so it stays reachable, and only when
                a ?wave= param asked for it. */}
            {variant !== null ? <VariantPicker variant={variant}/> : null}
        </>
    );
};

export default WaveGridBackdrop;
