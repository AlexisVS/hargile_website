"use client";

import dynamic from "next/dynamic";
import {useEffect, useState, useSyncExternalStore} from "react";
import {useWaveFrame} from "@/components/pages/services/v2/shared/wave-frame";
import styles from "./contact-backdrop.module.scss";

/* The cube grid behind the contact form, replacing the ColorBends canvas.

   Same grid, same export pipeline and the same three aspect frames as the M4
   heroes — and NOT their quiet zones, which is the whole reason this is its own
   file rather than a prop on wave-grid-backdrop.jsx. Measured, the contact
   backdrop box runs 0.462 at 390x844, 0.800 at 800x1000 and 1.521 at 1440x900:
   the same aspects the hero frames were sized for, because both are viewport
   boxes. So PHONE/TABLET/WIDE and the 640/860 band edges carry over unchanged.

   ⚠️ What does NOT carry over is the quiet zone, and it cannot: a poster hero
   damps the grid where a paragraph sits in one corner of the measure, while the
   form here covers the whole frame — title, five fields and a textarea, edge to
   edge, top to bottom. There is no lit half left to protect the copy from, so
   an ellipse would be arbitrary. This renders with damping off (`calm.depth 0`)
   and pushes the entire layer back in CSS instead, which is the role the bends
   played: texture behind the form, never a subject competing with it.

   That also means no quiet zone was derived for this page — deliberately. See
   docs/wave-grid.md: a re-derived quiet zone is the most expensive mistake this
   codebase has recorded, and the honest alternative when the copy covers the
   frame is to dim the layer, not to invent a shape for it.

   A still image ships, exactly as on the heroes: the frame never changes, so
   three.js earns nothing. The live path only mounts under ?wave= or ?export=,
   which is how compositions get picked and how the script captures them. */
const WaveGrid = dynamic(() => import("@/components/pages/services/v2/shared/wave-grid"), {ssr: false});

const IMAGE_DIR = "/images/wave-grid";

/* One name, three frames derived from it — the same contract as the heroes, and
   the same reason: it is how export-wave-grid.mjs names what it writes, so a
   half-finished re-export cannot ship as two frames of one composition and one
   of another. */
/* Picked off the ?wave= switch, like every other page's. 297 is the calmest of
   the candidates — light low and to the right, well clear of the label column —
   which is what a page whose copy is a form wants behind it. */
const DEFAULT_COMPOSITION = "contact-297";

const framesOf = (composition) => ({
    wide: composition,
    phone: `${composition}-phone`,
    tablet: `${composition}-tablet`,
});

/* The hero's band edges, and here they are genuinely the same numbers for the
   same reason rather than by imitation: the box is the viewport, so the aspect
   ranges either side of 640 and 860 are the ones these frames were composed
   for. */
const PHONE_MAX = 640;
const TABLET_MAX = 860;

/* Damping off. Not "tuned to zero" — there is nothing here to tune it to; see
   the header. A stable module constant because WaveGrid re-runs its whole
   effect when this identity changes. */
const NO_CALM = {cx: 0, cz: 0, rx: 1, rz: 1, depth: 0};

/* Relief per frame, the hero's values. radius is the dial that holds pillar
   SIZE roughly constant as the frame grows — about eight pillars across a
   phone, eleven at tablet, fifteen wide. The contact box has the same aspects,
   so it wants the same counts. Do not re-derive: the frustum maths over-predict
   the count (count them on the export), and pushing view.mx toward -1 reveals
   the pillar side facing away from the key light. */
const RELIEF_PHONE = {radius: 22, maxHeight: 1.05, view: {mx: -0.2, my: 0.95}};
const RELIEF_TABLET = {radius: 18, maxHeight: 1.05, view: {mx: -0.2, my: 0.95}};

const RELIEF_FOR = {phone: RELIEF_PHONE, tablet: RELIEF_TABLET, wide: null};

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

/* Authoring-only switches, all absent in normal use — same three as the heroes:
     /contact?bg=contact-7        a specific exported file, to compare
     /contact?wave=7              composition 7 live, for picking
     /contact?export=2560x1600    live at fixed size, for the script

   Not useSearchParams: that opts the whole route into dynamic rendering to
   support debug flags. */
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
        image: pinned ? rawBg : framesOf(composition).wide,
        frames: framesOf(composition),
        pinned,
    };
};

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

/* `onReady` fires when the backdrop has actually painted, and the contact route
   needs it: HeroLoadingProvider holds a full-screen loader over "/" and
   "/contact" until the page reports in. The old bends reported when their
   canvas appeared; a still image has no canvas, so without this the route would
   fall through to the provider's 2.5s SAFETY_MS backstop on every load — the
   page would be ready and sitting behind the overlay for two seconds. The image
   is decoded before onLoad fires, so it is the same promise the canvas made. */
const ContactBackdrop = ({composition = DEFAULT_COMPOSITION, onReady}) => {
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
                        calm={NO_CALM}
                        relief={RELIEF_FOR[frame]}
                    />
                ) : (
                    <picture>
                        {/* Phone first: <picture> takes the first matching
                            <source>, so the wide one would otherwise win
                            everywhere. Dropped when ?bg= pins one file, which
                            exists to compare that exact file. */}
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
                        {/* AVIF first, WebP fallback — required, not
                            belt-and-braces: browserslist allows edge >= 111 and
                            Edge only shipped AVIF in 121. */}
                        <source srcSet={`${IMAGE_DIR}/${image}.avif`} type="image/avif"/>
                        <img
                            className={styles.still}
                            src={`${IMAGE_DIR}/${image}.webp`}
                            alt=""
                            width={2560}
                            height={1600}
                            decoding="async"
                            fetchPriority="high"
                            onLoad={onReady}
                            /* A 404 or a decode failure must still dismiss the
                               loader, or a missing frame turns into a page that
                               never reveals. */
                            onError={onReady}
                        />
                    </picture>
                )}
            </div>
            {/* Outside the aria-hidden layer so it stays reachable. */}
            {variant !== null ? <VariantPicker variant={variant}/> : null}
        </>
    );
};

export default ContactBackdrop;
