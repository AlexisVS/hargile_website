"use client";

import dynamic from "next/dynamic";
import {useEffect, useState, useSyncExternalStore} from "react";
import styles from "../hero.module.scss";

/* The hero's backdrop: the wave grid, and only the wave grid.

   This used to be a switcher over four variants (colour bends / cubes / wave /
   none) so the three treatments could be compared side by side. That comparison
   happened, Mihai picked the wave grid, and it was promoted to `/` at every
   width — after which the other two were reachable only through a `?backdrop=`
   debug flag no visitor ever types. They are removed rather than left in place:
   an unreachable second backdrop is what let the page carry two unrelated
   designs either side of a breakpoint in the first place, and `git show
   09ddb03:…/cube-grid.jsx` is a better archive than a dead import.

   Removed here, NOT removed everywhere: `@/components/vendor/color-bends` is
   still live on /contact. It was never only a hero variant. */

// Three.js is client-only and ~150KB — keep it out of the initial bundle. Shared
// with /services rather than reimplemented: the two pages are meant to end up
// with one visual language, and a second copy of that shader is how they'd stop
// having one.
const WaveGrid = dynamic(() => import("@/components/pages/services/v2/shared/wave-grid"), {ssr: false});

/* Desktop only: warm the wave chunk at module evaluation rather than after
   mount — the three.js download is what the branded loader spends most of its
   life waiting on, and Turbopack dedupes this against the dynamic() load above.

   Deliberately NOT done below the breakpoint, and the reason is stronger now
   than it was: there is no canvas down there at all, only the still image, so
   prefetching three.js on a phone would download ~150 kB to render nothing.
   Even when mobile did mount a canvas, the earlier fetch pulled the three.js
   parse/execute forward into the hydration window and measured as +1.7 s of
   mobile TBT. */
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

   **depth is the dial to move first, and it has been moved twice.** It ran at
   0.55 against the services 0.8, on the reasoning that the .backdrop mask
   (hero.module.scss) already fades the canvas out across the copy side, so a
   full-depth damp under it flattened the left half to a dead plate — the two
   doing one job between them. In practice 0.55 left ripples crossing the copy
   from the eyebrow down through the CTA row, which is the one thing the quiet
   zone exists to prevent, so it is back at the services value.

   If this now reads as a dead plate rather than a dark bed, the fix is to come
   back down (0.65–0.7), NOT to move the seeds: a seed cannot light the frame
   without throwing a ~6-unit ring through the middle on its way there. See the
   note on CALM in wave-grid.jsx.

   Module-level so the reference is stable: WaveGrid rebuilds its scene when this
   changes, and an inline literal would be a new object on every render. */
const HOME_CALM = {cx: -3.6, cz: 0.2, rx: 5.2, rz: 3.0, depth: 0.8};

/* The phone's quiet zone — a horizontal BAND, not a copy of the wide ellipse.

   The wide frame puts copy down the left and light on the right, so its ellipse
   is off-centre and the light arrives from the side. A phone has one column:
   eyebrow, headline, paragraph, both CTAs and the rail all run down the middle
   with nothing beside them. There is no side for the light to come from — so the
   quiet zone spans the full width and is short in z, and the light arrives from
   above and below instead. That is what makes the copy read as sitting *in* the
   surface rather than on a dark rectangle laid over it.

   ⚠️ These numbers are derived from the phone framing, not from the wide one,
   and the first version of this constant got that wrong: it used rx 3.4 when the
   entire visible half-width was 2.3, so it damped the screen edge to edge and
   exported a black column. With HOME_RELIEF_PHONE's radius 26 the visible extent
   is about x ±4.4, z ±9.5 — hence rx 5.4 (past the frame edge, so the damping
   never shows a rim) and rz 4.6 (the copy band; RIM_OUT 1.35 ramps it out by
   z ≈ 6.2, leaving the top and bottom thirds lit).

   depth is 0.7 rather than the wide frame's 0.8: below 1024px .backdrop already
   drops to opacity 0.6 with no mask at all (hero.module.scss), so the same damp
   lands on an already-quieter surface. */
const HOME_CALM_PHONE = {cx: 0, cz: 0.2, rx: 5.4, rz: 4.6, depth: 0.7};

/* The 641-1023px band's quiet zone. A band like the phone's, not an ellipse like
   the wide frame's: the hero has already stacked into one full-width column by
   this width, so there is again no side for the light to arrive from.

   Sized from this frame's own world extents, which is the mistake
   HOME_CALM_PHONE made the first time. Below REF_ASPECT the vertical FOV is
   pinned at 40°, so visible height is 2·R·tan20° = 0.728·R and visible width is
   that times the aspect. At HOME_RELIEF_TABLET's radius 18 and 0.8:1 that is
   x ±5.24, z ±6.55 — hence rx 7.0 (past the frame edge, so the damping never
   shows a rim) and rz 3.8, which holds the same band-to-frame proportion the
   phone uses (0.58 of the half-height) and ramps out by z ≈ 5.1 via RIM_OUT,
   leaving the top and bottom fifths lit.

   depth 0.7 matches the phone rather than the wide frame's 0.8, for the reason
   the phone has it: .backdrop drops to opacity 0.6 with no mask below 1024px
   (hero.module.scss), and this band is on that side of the breakpoint. */
const HOME_CALM_TABLET = {cx: 0, cz: 0.2, rx: 7.0, rz: 3.8, depth: 0.7};

/* The colour ramp is deliberately NOT overridden here.

   It was, briefly — a more saturated mid, on the theory that the homepage hero
   could carry more colour than /services. Wrong call: the lit tone is
   $accent-mihai (#96b9f9, _theme.scss), the brand accent, and it is what the
   /services grid, that page's eyebrow and this page's own eyebrow and rail dots
   all already use. Pushing the homepage cubes off it made this one hero the only
   surface on the site lit in a colour nothing else uses.

   So both heroes take WaveGrid's default ramp and the grid reads as the same
   object on both pages. If the surface needs more presence, `relief` is the
   dial — the ramp keys off height, so a taller surface is a more colourful one
   without moving the hue off brand. */

/* Relief for the phone frame only — "reaches higher, and you can see the
   levels".

   Two separate things, and only doing both reads as 3D:

   - **radius** pulls the camera back, from 14 to 22. This one is not optional:
     at the default distance a phone aspect sees only world x ±2.3, about six
     pillars across the whole screen, which reads as a few flat slabs rather than
     as a grid at all. See WaveGrid's prop docs for why distance rather than a
     wider field of view.

     ⚠️ **This is a decoration dial, not a fidelity dial, and it was set wrong
     twice by treating it as one.** 26 came from the frustum maths (predicted
     eleven pillars across, delivered nine). 34 was then chosen to match the wide
     frame's fifteen, on the reasoning that both heroes should read as the same
     object. Mihai rejected that on sight: at phone size fifteen pillars is a
     busy mosaic competing with the copy, and the phone's job here is to decorate
     and suggest depth, not to reproduce the desktop grid. 22 gives about eight —
     big enough to read as objects, few enough to stay out of the way.

     So: count pillars on the exported image rather than deriving them, and judge
     the count against the phone frame, not against `home.*`.
   - **maxHeight** raises the clamp, so overlapping ripples stack into genuinely
     taller pillars instead of all flattening at the same ceiling. Amplitude is
     left alone: raising it instead makes every ripple taller, including the ones
     that should stay low, which just brightens the whole plate.
   - **view** tilts the camera further off overhead. This is the one that shows
     *sides* of pillars rather than only their tops — dead overhead, a height
     difference survives as colour alone and the frame reads flat however tall it
     is. A phone frame can afford more tilt than a wide one because the grid edge
     enters a narrow frustum much later.

     ⚠️ **But more tilt is not more depth, and past a point it is less.** With
     big pillars at radius 22 the obvious move for "make it read 3D" is to push
     `mx` toward its −1 limit. Rendered, that goes the wrong way: sides face away
     from the key light, so the extra side area that appears is *dark* area. The
     frame dims overall and the lit tops that carry the accent colour shrink.
     −0.2 with `maxHeight` left at 1.05 beat −0.9 at 1.35 outright. Depth here
     comes from the pillars being large enough to have visible edges at all, not
     from rotating further off vertical.

   Still inside WaveGrid's ±1 normalised range, which caps at ±5.4°/±9°; past it
   the frustum points out across the grid toward its boundary. */
const HOME_RELIEF_PHONE = {radius: 22, maxHeight: 1.05, view: {mx: -0.2, my: 0.95}};

/* Relief for the 641-1023px band. Same treatment as the phone, one step less of
   it: this frame is physically wider, so it can carry more pillars before they
   stop reading as objects.

   radius 18 puts about eleven across, sitting between the phone's eight and the
   wide frame's fifteen — the screen grows, the pillar count grows with it, and
   the pillars themselves stay roughly the size they are on a phone. `maxHeight`
   and `view` are the phone's values unchanged, because those were settled by
   rendering rather than by frame size: see the two warnings on
   HOME_RELIEF_PHONE, which apply here in full. In particular do not reach for
   more tilt to make this read deeper. */
const HOME_RELIEF_TABLET = {radius: 18, maxHeight: 1.05, view: {mx: -0.2, my: 0.95}};

/* The exported still, for viewports that don't get the canvas. Its own file, not
   the /services one: that image was composed against a different quiet ellipse
   and a different hero aspect, so reusing it would put the dark band in the wrong
   place. Produced by `npm run images:wavegrid:home` — see the export switch
   below. */
const IMAGE_DIR = "/images/wave-grid";
const HOME_IMAGE = "home";
/* Served to phones instead of HOME_IMAGE. A separate render, not a crop: the
   wide export is 1.6:1 and object-fit: cover keeps roughly its middle 29% at
   390x844, so a phone was being shown a slice of a composition laid out for a
   frame it never sees. This one is composed at the aspect it is served at. */
/* Rendered, looked at, and served. It was not for a while: the first
   home-phone.* export was a black column with about six giant pillars — the
   camera over-zoomed and the quiet zone damping the frame edge to edge — so the
   <source> elements below sat commented out rather than putting a black hero on
   every phone. Both causes were framing, and both are fixed on
   HOME_CALM_PHONE and HOME_RELIEF_PHONE. */
const PHONE_IMAGE = "home-phone";
/* Served between PHONE_MAX and the canvas breakpoint. Added because that band
   had no composition of its own and borrowed the wide one, which is a
   two-column layout cropped into a nearly-square window — its quiet zone runs
   down the left while the hero there has already stacked into one full-width
   column, so the copy sat half over dark and half over lit.
   Extending PHONE_IMAGE upward instead was measured and rejected: see
   HOME_CALM_TABLET. */
const TABLET_IMAGE = "home-tablet";

/* Where each render takes over. These match the <source> media queries below,
   and TABLET_MAX matches the 1023px breakpoint hero.module.scss drops the
   canvas mask at — all of them have to move together, or a viewport gets an
   image composed for a frame it isn't. */
const PHONE_MAX = 640;
const TABLET_MAX = 1023;

/* Authoring switches, all absent in normal use:

     /?wave=7             → composition 7, still, for picking one
     /?export=2560x1600   → fixed-size render, for the export script

   Wired into this component rather than into a dedicated export component on
   purpose. The exported image has to be the composition the live canvas draws,
   and the only way to guarantee that is for both to come out of the same call
   site with the same HOME_CALM — a second mounting of WaveGrid somewhere else is
   exactly how the two would quietly drift apart. The export script reaches these
   switches through /preview/home-wave, which renders this same hero; see the
   note on TARGETS in scripts/export-wave-grid.mjs for why not through `/`.

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

/* Which of the three frames we're drawing: "phone", "tablet" or "wide". Only
   "wide" gets the live canvas; the other two get their exported still.

   An export is answered from the ASPECT it asked for rather than from a flag of
   its own, and that is the load-bearing part. The export and a browser window at
   the same shape have to resolve to the same composition — if they could
   disagree, they eventually would, which is the drift these switches are wired
   into this component to avoid. A flag can disagree with the preview; an aspect
   cannot. So `?wave=N` at tablet width previews exactly what
   `npm run images:wavegrid:tablet N` writes.

   The thresholds are the aspects halfway between the three exports (0.46, 0.8
   and 1.6 — see PHONE/TABLET/WIDE in export-wave-grid.mjs), so each export lands
   well inside its own band rather than near an edge. */
const frameForAspect = (w, h) => {
    const aspect = w / h;
    if (aspect < 0.6) return "phone";
    if (aspect < 1.15) return "tablet";
    return "wide";
};

/* Null means *unresolved*, and nothing renders until the effect lands.
   Defaulting to any of the three instead would mount the wrong one for a beat —
   below the canvas breakpoint that means paying for the three.js parse we are
   trying to avoid, which is the entire point of the still.

   Two queries rather than one: they partition the range at exactly PHONE_MAX and
   TABLET_MAX, which are the same edges the <source> media queries use. */
const useFrame = (exportSize) => {
    const [frame, setFrame] = useState(null);

    useEffect(() => {
        const phone = window.matchMedia(`(max-width: ${PHONE_MAX}px)`);
        const tablet = window.matchMedia(`(max-width: ${TABLET_MAX}px)`);
        const sync = () => setFrame(phone.matches ? "phone" : tablet.matches ? "tablet" : "wide");
        sync();
        phone.addEventListener("change", sync);
        tablet.addEventListener("change", sync);
        return () => {
            phone.removeEventListener("change", sync);
            tablet.removeEventListener("change", sync);
        };
    }, []);

    if (exportSize) return frameForAspect(exportSize.w, exportSize.h);
    return frame;
};

/* Per-frame overrides, looked up by frame name. The values are the module
   constants above, so what reaches WaveGrid is a stable reference — which it
   must be, since both props are effect dependencies that rebuild the scene.
   `wide` maps to null relief: the wide frame is what WaveGrid's own defaults are
   tuned for. */
const CALM_FOR = {phone: HOME_CALM_PHONE, tablet: HOME_CALM_TABLET, wide: HOME_CALM};
const RELIEF_FOR = {phone: HOME_RELIEF_PHONE, tablet: HOME_RELIEF_TABLET, wide: null};

/* WaveGrid's `compact` profile is deliberately never used here. It reframes the
   grid for a narrow canvas, and on this page there is no narrow canvas: below
   1024px the still image is served instead, and an export always uses the full
   profile by design. Passing it would only affect the authoring paths, where it
   would misrepresent what actually ships. */

/* A canvas on desktop, the exported still below 1024px.

   This is the split /services already ships, arrived at for the same reason — a
   surface that never moves costs ~20 kB of AVIF against ~150 kB of three.js plus
   the main-thread work of parsing it, building the instances and compiling two
   shader programs. On the homepage the trade is even clearer, because the phone
   is exactly where that work lands in the hydration window.

   What it buys beyond the bytes is the thing this whole exercise was for: the
   same grid, the same colour, the same composition language on both viewports.
   Desktop moves, mobile does not. */
const WaveSurface = () => {
    const {variant: wave, exportSize} = useWaveSwitches();
    const frame = useFrame(exportSize);

    /* Both authoring switches force a *still* canvas at any width: an export
       must capture one frame, and browsing compositions with ?wave=N is
       browsing seeded still frames — live mode ignores the seed table entirely
       and fills its trail from the pointer instead. */
    const authored = exportSize !== null || wave !== null;

    if (authored) {
        // Unresolved only on the ?wave= path; an export answers from its size.
        if (frame === null) return null;
        return (
            <WaveGrid
                mode="still"
                variant={wave}
                exportSize={exportSize}
                calm={CALM_FOR[frame]}
                relief={RELIEF_FOR[frame]}
            />
        );
    }

    // Unresolved viewport — render nothing rather than guessing. See useFrame.
    if (frame === null) return null;

    if (frame === "wide") return <WaveGrid mode="live" calm={HOME_CALM}/>;

    return (
        <picture>
            {/* Phone render — a different composition, not a crop. Its media
                query must match PHONE_MAX, which is what the canvas branch above
                switches on.

                These two must stay FIRST: <picture> takes the first matching
                <source>, so the wide AVIF below would otherwise win at every
                width and the phone render would never be served. */}
            <source
                media={`(max-width: ${PHONE_MAX}px)`}
                srcSet={`${IMAGE_DIR}/${PHONE_IMAGE}.avif`}
                type="image/avif"
            />
            <source
                media={`(max-width: ${PHONE_MAX}px)`}
                srcSet={`${IMAGE_DIR}/${PHONE_IMAGE}.webp`}
                type="image/webp"
            />
            {/* The 641-1023px band. Its own composition, for the same reason
                the phone has one: see TABLET_IMAGE. */}
            <source
                media={`(max-width: ${TABLET_MAX}px)`}
                srcSet={`${IMAGE_DIR}/${TABLET_IMAGE}.avif`}
                type="image/avif"
            />
            <source
                media={`(max-width: ${TABLET_MAX}px)`}
                srcSet={`${IMAGE_DIR}/${TABLET_IMAGE}.webp`}
                type="image/webp"
            />
            {/* The wide pair. With the two above covering everything up to
                TABLET_MAX, and the canvas taking over past it, this is now only
                reachable if the canvas branch stops running — no WebGL, or the
                breakpoints drift apart. Kept as that safety net, not as a
                width the site actually serves it at.

                AVIF first, WebP fallback. The fallback is required, not
                belt-and-braces: browserslist allows edge >= 111 and Edge only
                shipped AVIF in 121 — and the same is true of the two pairs
                above, which is why each frame ships both formats. */}
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

const HeroBackdrop = () => (
    <div className={styles.backdrop} aria-hidden="true">
        <WaveSurface/>
    </div>
);

export default HeroBackdrop;
