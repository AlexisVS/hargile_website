"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import styles from "./hero.module.scss";
import HeroBackdrop, {VARIANTS} from "./backdrops/hero-backdrop";
import {useHeroLoading} from "@/components/providers/hero-loading-provider";

const CARDS = [
    {key: "webdev", className: "floatCardA"},
    {key: "ai", className: "floatCardB"},
    {key: "marketing", className: "floatCardC"},
];

/* Backdrops made of hard-edged geometry rather than a gradient wash. They share
   both of the hero's layout answers: the .sectionSharp mask (a straight fade
   instead of a soft one, so the edges stay crisp) and the capability rail
   instead of the floating cards — glass cards sitting on a lattice read as a
   second grid fighting the first, whichever lattice it is. */
const SHARP = ["cubes", "wave"];
const isSharp = (variant) => SHARP.includes(variant);

/* The hero backdrop is the wave grid at every width — chosen over cubes and
   colour bends after comparing them side by side on /preview/home-wave.

   **No viewport branch here any more, and that is the point.** This used to
   resolve cubes above 1024px and colour bends below, which meant two unrelated
   designs on one page: a lattice on desktop, a drifting gradient on a phone.
   The wave grid answers the split inside itself — a live canvas on desktop and
   its own exported still below 1024px (see hero-backdrop.jsx) — so the *design*
   is the same everywhere and only the frame rate changes.

   Dropping the branch also lets the variant be known during render rather than
   after an effect, which is what makes the capability rail server-renderable.
   That mattered: the rail was desktop-only before, so its motion.* reveals never
   reached the SSR HTML. Now they would have, complete with inline `opacity: 0` —
   the same defect the h1 and the glass cards were each fixed for. They are CSS
   keyframes instead.

   A `backdrop` prop or ?backdrop=<key> still forces a variant, for comparisons.
   That is a debug path: it lands after hydration, and nothing else depends on
   it. */
const DEFAULT_VARIANT = "wave";

const useHeroVariant = (override) => {
    const [variant, setVariant] = useState(override ?? DEFAULT_VARIANT);

    useEffect(() => {
        if (override) return;
        const q = new URLSearchParams(window.location.search).get("backdrop");
        if (q && VARIANTS.includes(q)) setVariant(q);
    }, [override]);

    return variant;
};

/* Signals when the hero's backdrop has actually painted, so the branded loader
   can dismiss on "hero ready" rather than a fixed timer.

   The WebGL variants (ColorBends / CubeGrid / the live wave grid) are ssr:false
   dynamic imports that append a <canvas> once their context is up and the first
   shader is compiled. We watch the backdrop subtree for that element
   (MutationObserver), then wait two animation frames to guarantee a painted
   frame before flagging ready.

   **It has to watch for an <img> too.** Below 1024px the wave variant serves the
   exported still instead of a canvas, and a canvas-only query would never be
   satisfied — the hero would fall through to the hard timeout below and the
   loader would visibly outstay content that was already on screen. An image is
   not ready when it appears, though, only when it has decoded, so that branch
   waits on `complete` / the load event rather than resolving at once.

   Two backstops keep the whole thing honest: the "none" variant has no backdrop
   element so it's ready immediately, and a hard timeout dismisses the loader even
   if a device fails to report either — the loader must never outstay the
   content. */
const useBackdropReady = (containerRef, variant) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Unresolved variant: nothing is mounted to watch yet. Stay not-ready and
        // don't arm the timeout — useHeroVariant's effect resolves on the same
        // commit, which re-runs this one. (The loader keeps its own backstop.)
        if (!variant) return;

        if (variant === "none") {
            setReady(true);
            return;
        }

        setReady(false);
        const container = containerRef.current;
        if (!container) return;

        let raf1 = 0;
        let raf2 = 0;
        let done = false;
        let pending = null; // the <img> we're waiting on, so its listener can be removed

        const markReady = () => {
            if (done) return;
            done = true;
            // Two rAFs: the element exists in the DOM, now let it paint a frame.
            raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => setReady(true));
            });
        };

        // A canvas is painted by the time it is appended; an image is only a
        // promise of pixels until it has decoded. `complete` covers the common
        // case where it was already in the HTTP cache, and it is also true on a
        // failed load — which is correct here, since a broken image is still a
        // reason to stop waiting.
        const markWhenPainted = (el) => {
            if (el.tagName !== "IMG" || el.complete) {
                markReady();
                return;
            }
            pending = el;
            el.addEventListener("load", markReady, {once: true});
            el.addEventListener("error", markReady, {once: true});
        };

        const found = () => container.querySelector("canvas, img");

        const initial = found();
        if (initial) markWhenPainted(initial);

        const observer = new MutationObserver(() => {
            const el = found();
            if (el) {
                observer.disconnect();
                markWhenPainted(el);
            }
        });
        observer.observe(container, {childList: true, subtree: true});

        // Safety net: never let the loader hang past the point of usefulness.
        const timeout = setTimeout(() => {
            observer.disconnect();
            setReady(true);
        }, 2000);

        return () => {
            observer.disconnect();
            clearTimeout(timeout);
            pending?.removeEventListener("load", markReady);
            pending?.removeEventListener("error", markReady);
            if (raf1) cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
        };
    }, [containerRef, variant]);

    return ready;
};

const HeroV2 = ({backdrop, label}) => {
    const t = useTranslations("pages.homepage.sections.hero.v2");
    const variant = useHeroVariant(backdrop);
    const backdropRef = useRef(null);
    const backdropReady = useBackdropReady(backdropRef, variant);

    // Tell the full-screen loader (layout level) the hero has painted, so it can
    // draw its ring to completion and dismiss. On mobile the backdrop is an
    // <img>, not a canvas at all; useBackdropReady waits for whichever of the two
    // the active variant mounts, so this fires correctly on both.
    const {markHeroReady} = useHeroLoading();
    useEffect(() => {
        if (backdropReady) markHeroReady();
    }, [backdropReady, markHeroReady]);

    return (
        <section
            className={[
                styles.section,
                isSharp(variant) ? styles.sectionSharp : "",
                // On top of sectionSharp, not instead of it: the wave grid wants
                // the crisp treatment but neither of cube-grid's vertical moves.
                variant === "wave" ? styles.sectionWave : "",
            ].filter(Boolean).join(" ")}
        >
            <div ref={backdropRef} className={styles.backdropHost}>
                <HeroBackdrop variant={variant}/>
            </div>
            {label && <div className={styles.variantTag}>{label}</div>}

            <div className={styles.container}>
                {/* The copy reveals are CSS keyframes (hero.module.scss), not
                    motion.*: a serialized `opacity:0` initial state kept the h1
                    out of the SSR HTML's paint until hydration — LCP waited on
                    the whole JS chain, and AI crawlers read a transparent
                    headline. CSS starts at first style resolution instead. */}
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>
                        {t("eyebrow")}
                    </p>

                    <h1 className={styles.headline}>
                        {t("headline")}
                    </h1>

                    <p className={styles.paragraph}>
                        {t("paragraph")}
                    </p>

                    <div className={styles.ctaRow}>
                        <CtaLink href="/contact" variant="primary">
                            {t("ctaAudit")}
                        </CtaLink>
                        <CtaLink href="#recent-works" variant="ghost">
                            {t("ctaWork")}
                        </CtaLink>
                    </div>
                </div>

                {isSharp(variant) ? (
                    /* Against a lattice, floating cards fight the geometry — so the
                       services read as ONE object instead: a labelled column where
                       a vertical light spine threads three luminous dots. The spine
                       draws on once at load and each node ignites with its row as
                       the line reaches it — a single one-shot reveal, then
                       stillness. The column stays transparent so the grid reads
                       through it. Not links — it states what we provide, it doesn't
                       navigate.

                       This is the treatment at *every* width now. The glass cards
                       below are what the sub-1024px hero used to get, and having two
                       unrelated objects either side of a breakpoint — one a 20px
                       backdrop-filter panel with a border, the other a hairline with
                       no fill — was exactly the inconsistency the wave hero exists to
                       remove. Same page, same content, one design. */
                    <div className={styles.rail}>
                        <p className={styles.railLabel}>{t("cardsLabel")}</p>
                        <div className={styles.railBody}>
                            <span className={styles.railLine} aria-hidden="true"/>
                            <ul className={styles.capList}>
                                {CARDS.map((card, i) => (
                                    <li
                                        key={card.key}
                                        className={styles.capItem}
                                        /* The only thing that varies per row. Everything
                                           else about the reveal lives in the stylesheet —
                                           see the note on .railLine for why none of this
                                           is motion.* any more. */
                                        style={{"--cap-delay": `${0.55 + i * 0.22}s`}}
                                    >
                                        <span className={styles.capDot} aria-hidden="true"/>
                                        <span className={styles.capBody}>
                                            <span className={styles.capTitle}>{t(`cards.${card.key}.title`)}</span>
                                            <span className={styles.capText}>{t(`cards.${card.key}.text`)}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    /* Fade-in in CSS (hero.module.scss), not motion: this branch is
                       the one that ships in the SSR HTML, and a serialized
                       `opacity: 0` left the three capability blurbs invisible to
                       every client that doesn't run JS — the same defect the copy
                       above was fixed for. The rail branch opposite is desktop-only
                       and mounts after hydration, so it never reaches that HTML. */
                    <div className={styles.visual} aria-hidden="true">
                        {CARDS.map((card) => (
                            <div key={card.key} className={`${styles.floatCard} ${styles[card.className]}`}>
                                <div className={styles.cardDot}/>
                                <div className={styles.cardTitle}>{t(`cards.${card.key}.title`)}</div>
                                <div className={styles.cardText}>{t(`cards.${card.key}.text`)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroV2;
