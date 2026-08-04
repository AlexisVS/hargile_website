"use client";

import dynamic from "next/dynamic";
import {useEffect, useState, useSyncExternalStore} from "react";
import {useWaveFrame} from "./wave-frame";
import styles from "./wave-grid-backdrop.module.scss";

/* Backdrop for the poster hero — all six M4 pages mount it: /services, /faq and
   the four service detail pages under /services/*.

   The six share the LAYOUT and differ in the COMPOSITION, and the distinction
   is the whole reason this file serves them all. Once /faq dropped its eyebrow
   the heroes had identical copy geometry — same component, same 100svh box,
   same measure, same 860px stack point — so the quiet zones, the band edges and
   the relief below are correct for every one of them and are shared. The detail
   pages joined that geometry rather than getting their own. What is NOT shared
   is which seed table gets rendered inside it, passed as `composition`: one
   number per page, six distinct frames.

   ⚠️ That sharing is a property of the layout, not a general licence. The
   homepage keeps its own everything because its quiet zone is somewhere else
   entirely — a composition is only portable between pages whose copy sits in
   the same place, which here means "pages using poster-hero with no eyebrow and
   no geometry overrides", and nothing else on the site qualifies.

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

/* Which exported composition ships, and at which frame.

   Three files, not one, for the reason the homepage found: `object-fit: cover`
   reproduces the camera's own reframing over a modest range of aspects, but this
   hero is 100svh so its aspect IS the viewport's — measured from 0.462 on a
   phone to 1.6 on a desktop, a 3.5x spread. One 1.6:1 frame cropped across that
   showed a phone roughly its middle 29%, about four enormous pillars.

   A composition is ONE name and the three frames are derived from it, because
   that is exactly how export-wave-grid.mjs names what it writes: `wave-70`,
   `wave-70-phone`, `wave-70-tablet`. Listing the three separately would let a
   half-finished re-export ship as two frames of one composition and one of
   another — the failure the suffix-last naming exists to make visible.

   ⚠️ The three frames of a composition are NOT interchangeable and none is a
   fallback for another: each is laid out for its own aspect. Re-export all three
   when a page changes composition. See docs/wave-grid.md, "Adding a frame for a
   new aspect band".

   Every page picked its number off the ?wave= switch — /services runs 7, /faq
   runs 70, and the four detail pages run their own. ⚠️ Those numbers are the
   only thing that differs between the pages' backdrops: the quiet zone, the
   frames and the band edges are shared, because the six heroes have identical
   copy geometry (see the header comment). */
const DEFAULT_COMPOSITION = "wave-7";

const framesOf = (composition) => ({
    wide: composition,
    phone: `${composition}-phone`,
    tablet: `${composition}-tablet`,
});

/* Band edges, and they are NOT the homepage's.

   860 is this hero's own one-column breakpoint — the width where the copy stops
   being a left-hand column and spans the full measure, which is exactly when the
   quiet ellipse stops being the right shape and has to become a band. It is also
   where wave-grid-backdrop.module.scss drops the horizontal mask, so the frame
   and its treatment change together.

   640 splits the one-column range in two, because the aspects inside it are not
   one frame's worth: measured, this hero runs 0.462 at 390x844 and 1.229 at
   860x700. */
const PHONE_MAX = 640;
const TABLET_MAX = 860;

/* Matches the hero's own one-column breakpoint, so the reframed grid and the
   stacked copy layout always change together. Only consulted by the live WebGL
   path now; the image handles every viewport through cover. */
const useCompact = () => {
    const [compact, setCompact] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${TABLET_MAX}px)`);
        const sync = () => setCompact(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return compact;
};

/* The one-column quiet zones — bands, not the ellipse.

   CALM (wave-grid.jsx) is tuned to a paragraph sitting in the LEFT column of a
   two-column hero, so its centre is off to one side. Below 860px this hero has
   one full-width column: eyebrow, headline, paragraph and the stats row all run
   down the middle with nothing beside them, so there is no side for the light to
   arrive from and it has to come from above and below instead.

   The numbers are the homepage's, and deliberately so. Both heroes are the same
   shape below their one-column breakpoint — a single centred column on a 100svh
   box — and the grid is meant to read as the same object on both pages. Derived
   the same way, from each frame's own world extents: below REF_ASPECT the
   vertical FOV is pinned at 40°, so visible height is 0.728·R and width is that
   times the aspect. At radius 22 / 0.46:1 that is x ±3.70, z ±8.00; at radius
   18 / 0.8:1 it is x ±5.24, z ±6.55. Both rx values sit past their frame edge so
   the damping never shows a rim.

   depth 0.7 rather than CALM's 0.8: below 860px the layer already drops to
   --grid-opacity 0.6 with no mask (wave-grid-backdrop.module.scss), so the same
   damp lands on an already-quieter surface. */
const CALM_PHONE = {cx: 0, cz: 0.2, rx: 5.4, rz: 4.6, depth: 0.7};
const CALM_TABLET = {cx: 0, cz: 0.2, rx: 7.0, rz: 3.8, depth: 0.7};

/* Relief per frame, also the homepage's values and for the same reason.

   radius is the dial: 22 puts about eight pillars across a phone, 18 about
   eleven at tablet, against fifteen on the wide frame. The count rising with the
   frame is intentional — the screen grows, the count grows with it, and the
   pillars stay roughly the size they are on a phone.

   ⚠️ Two traps recorded on the homepage's copies of these, both found by
   rendering: the frustum maths consistently over-predict the pillar count (count
   them on the export instead), and pushing `view.mx` toward -1 to "make it read
   3D" goes the wrong way, because the extra pillar side it reveals is side
   facing away from the key light. Do not re-derive either here. */
const RELIEF_PHONE = {radius: 22, maxHeight: 1.05, view: {mx: -0.2, my: 0.95}};
const RELIEF_TABLET = {radius: 18, maxHeight: 1.05, view: {mx: -0.2, my: 0.95}};

const CALM_FOR = {phone: CALM_PHONE, tablet: CALM_TABLET, wide: null};
const RELIEF_FOR = {phone: RELIEF_PHONE, tablet: RELIEF_TABLET, wide: null};

/* URL switches, all authoring-only and all absent in normal use:

     /services                   → the exported still (no JS, no three.js)
     /services?bg=wave-7         → a different exported still, to compare
     /services?wave=7            → composition 7 rendered live, for picking
     /services?export=2560x1600  → live render at fixed size, for the script

   They answer on the other five routes too, since it is the same component —
   harmless, and the export script has no reason to use them: every page renders
   the same frame for a given aspect, so /services stays the one surface the
   script drives. Browse compositions there for the same reason.

   Not useSearchParams: that would opt the whole route into dynamic rendering to
   support debug flags. useSyncExternalStore rather than read-in-effect because
   that is what this is — external state sampled once — and it takes a server
   snapshot, so hydration is correct rather than a mismatch React has to patch.
   subscribe is a no-op: the URL cannot change here without a full navigation. */
const subscribeToUrl = () => () => {};
const readParams = () => window.location.search;
const readParamsOnServer = () => "";

const useUrlSwitches = (search, composition) => {
    const params = new URLSearchParams(search);

    const rawWave = params.get("wave");
    const wave = rawWave === null ? Number.NaN : Number.parseInt(rawWave, 10);

    const rawExport = params.get("export");
    const m = rawExport ? /^(\d{2,5})x(\d{2,5})$/.exec(rawExport) : null;

    const rawBg = params.get("bg");

    // Filename-safe only — this value reaches a src attribute.
    const pinned = Boolean(rawBg) && /^[a-z0-9-]{1,40}$/i.test(rawBg);

    return {
        variant: Number.isFinite(wave) ? wave : null,
        exportSize: m ? {w: Number(m[1]), h: Number(m[2])} : null,
        /* ?bg= names one file outright, so it replaces the wide frame rather
           than the composition — the per-frame sources are dropped below when
           it is set, which is what makes it show that one file everywhere. */
        image: pinned ? rawBg : framesOf(composition).wide,
        frames: framesOf(composition),
        /* Whether ?bg= asked for one specific file. The per-frame <source>
           elements are dropped when it did, so the compare switch shows the file
           you named at every width instead of quietly swapping in a phone
           render below 640px. */
        pinned,
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

const WaveGridBackdrop = ({composition = DEFAULT_COMPOSITION}) => {
    const compact = useCompact();
    const search = useSyncExternalStore(subscribeToUrl, readParams, readParamsOnServer);
    const {variant, exportSize, image, frames, pinned} = useUrlSwitches(search, composition);
    const frame = useWaveFrame({exportSize, phoneMax: PHONE_MAX, tabletMax: TABLET_MAX});

    const live = variant !== null || exportSize !== null;

    // Unresolved frame — render nothing rather than guessing. See wave-frame.js.
    if (live && frame === null) return null;

    return (
        <>
            <div className={styles.backdrop} aria-hidden="true">
                {live ? (
                    <WaveGrid
                        compact={compact}
                        variant={variant}
                        exportSize={exportSize}
                        calm={CALM_FOR[frame]}
                        relief={RELIEF_FOR[frame]}
                    />
                ) : (
                    <picture>
                        {/* The two one-column frames, phone first — <picture> takes
                            the first matching <source>, so the wide one below would
                            otherwise win everywhere.

                            Skipped entirely when ?bg= pins an image: that switch
                            exists to compare one specific file, and silently serving
                            a different one at narrow widths would defeat it. Compare
                            phone framing with ?wave=N at phone width instead. */}
                        {pinned ? null : (
                            <>
                                <source
                                    media={`(max-width: ${PHONE_MAX}px)`}
                                    srcSet={`${IMAGE_DIR}/${frames.phone}.avif`}
                                    type="image/avif"
                                />
                                <source
                                    media={`(max-width: ${PHONE_MAX}px)`}
                                    srcSet={`${IMAGE_DIR}/${frames.phone}.webp`}
                                    type="image/webp"
                                />
                                <source
                                    media={`(max-width: ${TABLET_MAX}px)`}
                                    srcSet={`${IMAGE_DIR}/${frames.tablet}.avif`}
                                    type="image/avif"
                                />
                                <source
                                    media={`(max-width: ${TABLET_MAX}px)`}
                                    srcSet={`${IMAGE_DIR}/${frames.tablet}.webp`}
                                    type="image/webp"
                                />
                            </>
                        )}
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
