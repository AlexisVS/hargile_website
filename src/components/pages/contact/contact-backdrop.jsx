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

   ⚠️ What does NOT carry over is the quiet zone. A poster hero damps the grid
   where a paragraph sits in one corner of the measure; the form here covers
   almost the whole frame, so the shape it needs is a full-width BAND with the
   light left above the title and below the submit button — cubes framing the
   form rather than sitting under it. See CALM_WIDE.

   This shipped once with damping off and the whole layer dimmed instead, on the
   reasoning that a form covering the frame leaves nothing to carve out. Mihai
   rejected it and was right: dimming makes the page darker than every other one
   on the site without making the cubes any less present where the copy is. The
   grid now runs at the heroes' own opacity and the band does the work — which
   is also what keeps /contact the same weight as its neighbours.

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

/* The quiet zone, and it is a BAND rather than the heroes' ellipse.

   Measured off the rendered page at 1440x900: the form runs x 98…1340 of 1440
   and y 160…815 of a 947-tall box, which maps onto the wide frame's visible
   x ±8.2, z ±3.9 as x -7.1…+7.1, z -2.6…+2.8. It covers almost the whole frame
   horizontally, so there is no side for light to arrive from — the only room
   left is above the title and below the submit button, and that is the shape
   these describe: rx past the frame edge so the damping spans the full width,
   rz just tight enough to leave a lit band top and bottom.

   ⚠️ rx is deliberately larger than the visible half-width. That is not a typo
   or a safety margin — an rx inside the frame would put the ellipse's left and
   right shoulders on screen, and a form sitting in a visible oval of calm is
   worse than no damping at all.

   Also why the depth is high (0.85 against the heroes' 0.8): the layer now runs
   at the heroes' opacity rather than dimmed, so all of the work of keeping the
   form readable is done here instead of half here and half by the CSS.

   Derived by rendering and checking, not by arithmetic from another frame's
   extents — see docs/wave-grid.md on what that has cost before. */
/* Two dials, and they do different jobs — worth keeping straight, because the
   first pass turned the wrong one.

   rz is WHERE the calm reaches: the flat core is 0.8·rz and the ramp runs out
   to 1.35·rz (RIM_IN/RIM_OUT in wave-grid.jsx). depth is HOW empty the core
   actually is. At depth 0.85 the core still passes 15% of the light, which is
   enough to read as cubes behind the fields however wide the band is — the
   fields looked "calmer" but never clear. 0.96 is what empties them.

   rz 3.3 at cz 0 puts the core at z ±2.64, i.e. y 153…794 of the 947-tall box:
   from above the title down past the submit button. 1.35·rz then lands at 4.46
   against a frame edge of 3.9, so the top and bottom bands light to about 77%
   rather than 100% — cubes bright at the edges, fading as they approach the
   form, some touching it. That is the trade and no setting avoids it: a form
   this tall cannot be cleared AND leave a fully-lit rim. */
const CALM_WIDE = {cx: 0, cz: 0, rx: 9.6, rz: 3.3, depth: 0.96};

/* Phone and tablet, where the same shape has to make a harder choice, and where
   they stop agreeing with each other.

   Stacked, the form runs from just under the navbar to just above the footer
   note — on a phone that is z -5.9…+7.2 of a visible ±8.00. Clearing all of it
   would push 1.35·rz past 11 against a frame edge of 8: the entire frame damped
   and a dead plate shipped. So both clear the part that has to be clear — the
   title and the four field rows — and let the light back in over the message
   box and below it. That is the "at least the form without the message" line,
   and it is why cz is negative in both: the calm sits high, over the fields.

   The message box is the one thing these deliberately do NOT clear — it spans
   the full width, so protecting it would mean damping the frame. It has its own
   border and fill to sit on, which the bare field rows do not.

   ⚠️ An offset ellipse was tried on phone and is WORSE — do not re-derive it.
   The reasoning looked sound: stacked, the labels and inputs only reach about
   x 300 of 390, so unlike the wide frame there appears to be a right margin for
   light to arrive from, and {cx -1.1, rx 2.85} clears the copy column while
   leaving it lit. Measured, that render came out at 14.8 mean against the
   band's 15.7 — DARKER, not brighter — and it put a lit block hard beside the
   email row. At 0.46 aspect the visible x range is only ±3.70, so narrowing rx
   unlocks very little area while the ramp still covers most of it, and what it
   does unlock arrives next to the copy rather than away from it. The band wins
   on both counts.

   Phone visible extent is x ±3.70, z ±8.00; tablet x ±5.24, z ±6.55. rx is past
   the frame edge in both so the damping spans the full width — see CALM_WIDE on
   why an rx inside the frame is worse than none.

   Derived by rendering at 390 and 800 and measuring, not by scaling the wide
   frame's numbers — see docs/wave-grid.md on what that has cost before. */
const CALM_PHONE = {cx: 0, cz: -2.1, rx: 5.4, rz: 4.8, depth: 0.96};
const CALM_TABLET = {cx: 0, cz: -1.6, rx: 7.0, rz: 4.0, depth: 0.96};

const CALM_FOR = {phone: CALM_PHONE, tablet: CALM_TABLET, wide: CALM_WIDE};

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
                        calm={CALM_FOR[frame]}
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
