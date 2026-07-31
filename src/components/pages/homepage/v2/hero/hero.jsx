"use client";

import {useEffect, useRef, useState} from "react";
import {motion, useReducedMotion} from "motion/react";
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

/* Cubes are a desktop treatment: they're pointer-driven (touch only ever sees
   idle ripples) and the WebGL cost is real on phones. Below the breakpoint the
   hero falls back to the color bends. matchMedia can't run during render (server
   and first client render have to agree), so the variant starts null — meaning
   *unresolved* — and HeroBackdrop renders nothing until the effect lands it.
   Starting at "bends" instead made every desktop load mount ColorBends for a
   beat before flipping to cubes: its chunk was fetched for nothing and the
   gradient was visibly on screen on a hard refresh. Waiting costs one frame,
   and the backdrops are ssr:false dynamic imports, so nothing visible has
   loaded that early either way.
   A `backdrop` prop or ?backdrop=<key> URL param still forces a variant. */
const useHeroVariant = (override) => {
    const [variant, setVariant] = useState(override ?? null);

    useEffect(() => {
        if (override) return;
        const q = new URLSearchParams(window.location.search).get("backdrop");
        if (q && VARIANTS.includes(q)) {
            setVariant(q);
            return;
        }
        const mq = window.matchMedia("(min-width: 1024px)");
        const sync = () => setVariant(mq.matches ? "cubes" : "bends");
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, [override]);

    return variant;
};

/* Signals when the hero's WebGL backdrop has actually painted, so the branded
   loader can dismiss on "hero ready" rather than a fixed timer.

   The backdrop variants (ColorBends / CubeGrid) are ssr:false dynamic imports
   that append a <canvas> once their WebGL context is up and the first shader is
   compiled. We watch the backdrop subtree for that canvas (MutationObserver),
   then wait two animation frames to guarantee a painted frame before flagging
   ready. Two backstops keep it honest: the "none" variant has no canvas so it's
   ready at once, and a hard timeout dismisses the loader even if a device fails
   to report a canvas — the loader must never outstay the content. */
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

        const markReady = () => {
            if (done) return;
            done = true;
            // Two rAFs: the canvas exists in the DOM, now let it paint a frame.
            raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => setReady(true));
            });
        };

        if (container.querySelector("canvas")) {
            markReady();
        }

        const observer = new MutationObserver(() => {
            if (container.querySelector("canvas")) {
                observer.disconnect();
                markReady();
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
            if (raf1) cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
        };
    }, [containerRef, variant]);

    return ready;
};

const HeroV2 = ({backdrop, label}) => {
    const t = useTranslations("pages.homepage.sections.hero.v2");
    const reducedMotion = useReducedMotion();
    const variant = useHeroVariant(backdrop);
    const backdropRef = useRef(null);
    const backdropReady = useBackdropReady(backdropRef, variant);

    // Tell the full-screen loader (layout level) the hero has painted, so it can
    // draw its ring to completion and dismiss. On mobile the backdrop is the
    // lighter color-bends canvas; useBackdropReady waits for whichever canvas the
    // active variant mounts, so this fires correctly on both mobile and desktop.
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
                    /* Against the cube grid, floating cards fight the geometry — so
                       the services read as ONE object instead: a labelled column
                       where a vertical light spine threads three luminous dots (the
                       same marker as the glass cards' .cardDot). The spine draws on
                       once at load and each node ignites with its row as the line
                       reaches it — a single one-shot reveal, then stillness. The
                       column stays transparent so the cubes read through it. Not
                       links — it states what we provide, it doesn't navigate. */
                    <motion.div
                        className={styles.rail}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.8, ease: "easeOut", delay: 0.25}}
                    >
                        <p className={styles.railLabel}>{t("cardsLabel")}</p>
                        <div className={styles.railBody}>
                            <motion.span
                                className={styles.railLine}
                                aria-hidden="true"
                                initial={reducedMotion ? {opacity: 0} : {scaleY: 0}}
                                animate={reducedMotion ? {opacity: 1} : {scaleY: 1}}
                                transition={{duration: 0.9, ease: "easeInOut", delay: 0.45}}
                            />
                            <ul className={styles.capList}>
                                {CARDS.map((card, i) => (
                                    <motion.li
                                        key={card.key}
                                        className={styles.capItem}
                                        initial={reducedMotion ? {opacity: 0} : {opacity: 0, x: 14}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{duration: 0.5, ease: "easeOut", delay: 0.55 + i * 0.22}}
                                    >
                                        <motion.span
                                            className={styles.capDot}
                                            aria-hidden="true"
                                            initial={reducedMotion ? {opacity: 0} : {opacity: 0, scale: 0.4}}
                                            animate={{opacity: 1, scale: 1}}
                                            transition={{duration: 0.35, ease: "easeOut", delay: 0.55 + i * 0.22}}
                                        />
                                        <span className={styles.capBody}>
                                            <span className={styles.capTitle}>{t(`cards.${card.key}.title`)}</span>
                                            <span className={styles.capText}>{t(`cards.${card.key}.text`)}</span>
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
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
