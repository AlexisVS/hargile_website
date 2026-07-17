"use client";

import {motion, useReducedMotion} from "motion/react";
import {useTranslations} from "next-intl";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import styles from "./hero.module.scss";
import HeroBackdrop from "./backdrops/hero-backdrop";

const CARDS = [
    {key: "webdev", className: "floatCardA"},
    {key: "ai", className: "floatCardB"},
    {key: "marketing", className: "floatCardC"},
];

const HeroV2 = () => {
    const t = useTranslations("pages.homepage.sections.hero.v2");
    const {setIsAuditModalOpen} = useSiteNavigation();
    const reducedMotion = useReducedMotion();

    const reveal = (index) => ({
        initial: reducedMotion ? {opacity: 0} : {opacity: 0, y: 16},
        animate: reducedMotion ? {opacity: 1} : {opacity: 1, y: 0},
        transition: {duration: 0.5, ease: "easeOut", delay: index * 0.09},
    });

    return (
        <section className={styles.section}>
            <div className={styles.orb} aria-hidden="true"/>
            <div className={styles.dotGrid} aria-hidden="true"/>
            <HeroBackdrop/>

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

                <motion.div
                    className={styles.visual}
                    aria-hidden="true"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.8, ease: "easeOut", delay: 0.25}}
                >
                    <div className={styles.ringDashed}/>
                    <div className={styles.ringSpin}/>
                    <div className={styles.centerGlow}/>

                    {CARDS.map((card) => (
                        <div key={card.key} className={`${styles.floatCard} ${styles[card.className]}`}>
                            <div className={styles.cardDot}/>
                            <div className={styles.cardTitle}>{t(`cards.${card.key}.title`)}</div>
                            <div className={styles.cardText}>{t(`cards.${card.key}.text`)}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HeroV2;
