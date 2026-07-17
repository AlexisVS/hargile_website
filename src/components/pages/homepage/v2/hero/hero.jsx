"use client";

import {useEffect, useState} from "react";
import {motion, useReducedMotion} from "motion/react";
import {useTranslations} from "next-intl";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import styles from "./hero.module.scss";
import HeroBackdrop, {VARIANTS} from "./backdrops/hero-backdrop";

const CARDS = [
    {key: "webdev", className: "floatCardA"},
    {key: "ai", className: "floatCardB"},
    {key: "marketing", className: "floatCardC"},
];

/* Cubes are a desktop treatment: they're pointer-driven (touch only ever sees
   idle ripples) and the WebGL cost is real on phones. Below the breakpoint the
   hero falls back to the color bends. Resolved in an effect so server and first
   client render agree ("bends"), then corrected after mount — the backdrops are
   ssr:false dynamic imports anyway, so nothing visible has loaded by then.
   A `backdrop` prop or ?backdrop=<key> URL param still forces a variant. */
const useHeroVariant = (override) => {
    const [variant, setVariant] = useState(override ?? "bends");

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

const HeroV2 = ({backdrop, label}) => {
    const t = useTranslations("pages.homepage.sections.hero.v2");
    const {setIsAuditModalOpen} = useSiteNavigation();
    const reducedMotion = useReducedMotion();
    const variant = useHeroVariant(backdrop);

    const reveal = (index) => ({
        initial: reducedMotion ? {opacity: 0} : {opacity: 0, y: 16},
        animate: reducedMotion ? {opacity: 1} : {opacity: 1, y: 0},
        transition: {duration: 0.5, ease: "easeOut", delay: index * 0.09},
    });

    return (
        <section className={`${styles.section} ${variant === "cubes" ? styles.sectionSharp : ""}`}>
            <HeroBackdrop variant={variant}/>
            {label && <div className={styles.variantTag}>{label}</div>}

            <div className={styles.container}>
                <div className={styles.copy}>
                    <motion.p className={styles.eyebrow} {...reveal(0)}>
                        {t("eyebrow")}
                    </motion.p>

                    <motion.h1 className={styles.headline} {...reveal(1)}>
                        {t("headline")}
                    </motion.h1>

                    <motion.p className={styles.paragraph} {...reveal(2)}>
                        {t("paragraph")}
                    </motion.p>

                    <motion.div className={styles.ctaRow} {...reveal(3)}>
                        <button
                            type="button"
                            className={styles.ctaPrimary}
                            onClick={() => setIsAuditModalOpen(true)}
                        >
                            {t("ctaAudit")}
                        </button>
                        <a href="#recent-works" className={styles.ctaGhost}>
                            {t("ctaWork")}
                        </a>
                    </motion.div>
                </div>

                {variant === "cubes" ? (
                    /* Against the cube grid, the floating cards fight the geometry —
                       a ruled column echoes the grid's own alignment instead, and
                       stays transparent so the cubes read through it. */
                    <motion.ul
                        className={styles.capList}
                        aria-hidden="true"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.8, ease: "easeOut", delay: 0.25}}
                    >
                        {CARDS.map((card, i) => (
                            <motion.li
                                key={card.key}
                                className={styles.capItem}
                                initial={reducedMotion ? {opacity: 0} : {opacity: 0, x: 18}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, ease: "easeOut", delay: 0.35 + i * 0.12}}
                            >
                                <span className={styles.capBody}>
                                    <span className={styles.capTitle}>{t(`cards.${card.key}.title`)}</span>
                                    <span className={styles.capText}>{t(`cards.${card.key}.text`)}</span>
                                </span>
                            </motion.li>
                        ))}
                    </motion.ul>
                ) : (
                    <motion.div
                        className={styles.visual}
                        aria-hidden="true"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.8, ease: "easeOut", delay: 0.25}}
                    >
                        {CARDS.map((card) => (
                            <div key={card.key} className={`${styles.floatCard} ${styles[card.className]}`}>
                                <div className={styles.cardDot}/>
                                <div className={styles.cardTitle}>{t(`cards.${card.key}.title`)}</div>
                                <div className={styles.cardText}>{t(`cards.${card.key}.text`)}</div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default HeroV2;
