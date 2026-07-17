"use client";

import {useRef} from "react";
import {motion, useInView, useReducedMotion} from "motion/react";
import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./design-dev.module.scss";
import {useReveal} from "../useReveal";

const WORD_STAGGER = 0.07;

const DesignDevV2 = () => {
    const t = useTranslations("pages.homepage.sections.design-dev");
    const reveal = useReveal();
    const reducedMotion = useReducedMotion();

    // "On écoute. On construit. On reste." — split into words, keeping track of
    // which sentence each word belongs to so the last one can carry the accent
    const quote = t("offers.your-project.description");
    const phrases = quote.match(/[^.!?]+[.!?]*/g)?.map((p) => p.trim()) ?? [quote];
    const words = phrases.flatMap((phrase, pi) =>
        phrase.split(/\s+/).map((word) => ({word, isAccent: pi === phrases.length - 1}))
    );
    const firstAccentIndex = words.findIndex((w) => w.isAccent);
    // The shine starts once the last word has finished rising
    const shineBaseDelay = words.length * WORD_STAGGER + 0.6;

    const quoteRef = useRef(null);
    const inView = useInView(quoteRef, {once: true, amount: 0.5});

    return (
        <section className={section.section}>
            <div className={section.container}>
                <motion.h2 className={`${section.heading} ${styles.centered}`} {...reveal(0)}>
                    {t("title")}
                </motion.h2>
                <motion.p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>
                    {t("lead")}
                </motion.p>

                <figure className={styles.quote}>
                    <blockquote ref={quoteRef} className={styles.quoteText}>
                        {words.map(({word, isAccent}, i) => (
                            <motion.span
                                key={`${word}-${i}`}
                                className={isAccent ? styles.wordAccent : styles.word}
                                data-shine={isAccent && inView && !reducedMotion}
                                style={isAccent ? {animationDelay: `${shineBaseDelay + (i - firstAccentIndex) * 0.12}s`} : undefined}
                                initial={reducedMotion ? {opacity: 0} : {opacity: 0, y: "0.7em"}}
                                animate={inView ? {opacity: 1, y: 0} : undefined}
                                transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * WORD_STAGGER}}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </blockquote>
                </figure>
            </div>
        </section>
    );
};

export default DesignDevV2;
