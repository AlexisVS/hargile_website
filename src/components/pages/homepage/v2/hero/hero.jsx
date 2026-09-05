"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import CtaLink from "@/components/ui/cta-link/cta-link";
import styles from "./hero.module.scss";
import HeroBackdrop from "./backdrops/hero-backdrop";
import {useHeroLoading} from "@/components/providers/hero-loading-provider";

/* Each row is the offer page it names. The three services were deliberately
   inert until now — but the pages they describe exist, and this is the home
   page's only route to them: without these links the four offers hung off a
   single hub, which is what left them "Discovered – currently not indexed" in
   Search Console. MVP is the fourth offer and is not here on purpose: it has
   its own section further down the page, which carries its own link. */
/* HARG-302: the two offers are now GEO and SEO — both route to the same
   SEO page for now until a dedicated GEO page exists. */
const CARDS = [
    {key: "geo", href: "/services/seo"},
    {key: "seo", href: "/services/seo"},
];

/* The hero backdrop is the wave grid, at every width and with no branch left to
   resolve — chosen over cubes and colour bends after comparing them side by
   side, then made the only one (see hero-backdrop.jsx).

   Two things follow from there being no variant, and both are why the branching
   is gone rather than merely unused:

   - There used to be a *viewport* branch — cubes above 1024px, colour bends
     below — which meant two unrelated designs on one page: a lattice on desktop,
     a drifting gradient on a phone. The wave grid answers that split inside
     itself (a live canvas on desktop, its own exported still below 1024px), so
     the design is the same everywhere and only the frame rate changes.
   - The layout is known during render rather than after an effect, which is what
     makes the capability rail server-renderable. That mattered: the rail was
     desktop-only before, so its motion.* reveals never reached the SSR HTML.
     Now they would have, complete with inline `opacity: 0` — the same defect the
     h1 and the old glass cards were each fixed for. They are CSS keyframes
     instead. */

/* Signals when the hero's backdrop has actually painted, so the branded loader
   can dismiss on "hero ready" rather than a fixed timer.

   The live wave grid is an ssr:false dynamic import that appends a <canvas> once
   its context is up and the first shader is compiled. We watch the backdrop
   subtree for that element (MutationObserver), then wait two animation frames to
   guarantee a painted frame before flagging ready.

   **It has to watch for an <img> too.** Below 1024px the backdrop serves the
   exported still instead of a canvas, and a canvas-only query would never be
   satisfied — the hero would fall through to the hard timeout below and the
   loader would visibly outstay content that was already on screen. An image is
   not ready when it appears, though, only when it has decoded, so that branch
   waits on `complete` / the load event rather than resolving at once.

   A hard timeout keeps the whole thing honest: the loader must never outstay the
   content, even if a device fails to report either element. */
const useBackdropReady = (containerRef) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
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
    }, [containerRef]);

    return ready;
};

const HeroV2 = () => {
    const t = useTranslations("pages.homepage.sections.hero.v2");
    const backdropRef = useRef(null);
    const backdropReady = useBackdropReady(backdropRef);

    // Tell the full-screen loader (layout level) the hero has painted, so it can
    // draw its ring to completion and dismiss. On mobile the backdrop is an
    // <img>, not a canvas at all; useBackdropReady waits for whichever of the two
    // the viewport mounts, so this fires correctly on both.
    const {markHeroReady} = useHeroLoading();
    useEffect(() => {
        if (backdropReady) markHeroReady();
    }, [backdropReady, markHeroReady]);

    return (
        <section className={styles.section}>
            <div ref={backdropRef} className={styles.backdropHost}>
                <HeroBackdrop/>
            </div>

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
                        <CtaLink href="/faq" variant="ghost">
                            {t("ctaWork")}
                        </CtaLink>
                    </div>
                </div>

                {/* Against a lattice, floating cards fight the geometry — so the
                    services read as ONE object instead: a labelled column where a
                    vertical light spine threads three luminous dots. The spine
                    draws on once at load and each node ignites with its row as the
                    line reaches it — a single one-shot reveal, then stillness. The
                    column stays transparent so the grid reads through it.

                    The rows navigate now (see CARDS): the chevron only appears
                    on hover or keyboard focus, so at rest the column is the same
                    object it was when it merely stated what we provide.

                    The alternative used to live right here as a second branch:
                    three .floatCard glass panels (20px backdrop-filter, border,
                    gradient fill, continuous drift) for anything below 1024px.
                    Having two unrelated objects either side of a breakpoint was
                    exactly the inconsistency the wave hero exists to remove, so
                    the branch is gone rather than merely never taken. Same page,
                    same content, one design. */}
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
                                    {/* The dot stays outside the link: it is
                                        absolutely positioned against the row, and
                                        the row is padded past it. */}
                                    <span className={styles.capDot} aria-hidden="true"/>
                                    <Link href={card.href} className={styles.capLink}>
                                        <span className={styles.capBody}>
                                            <span className={styles.capTitle}>
                                                {t(`cards.${card.key}.title`)}
                                                <span className={styles.capChevron} aria-hidden="true">
                                                    <svg viewBox="0 0 16 16" fill="none">
                                                        <path
                                                            d="M6 3.5 10.5 8 6 12.5"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                            </span>
                                            <span className={styles.capText}>{t(`cards.${card.key}.text`)}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroV2;
