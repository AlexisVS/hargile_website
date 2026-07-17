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

    // "On écoute. On construit. On reste." — split into phrases (each rendered on
    // its own line so they never wrap into each other), then into words. A running
    // index across all words keeps the reveal stagger and shine timing continuous.
    const quote = t("offers.your-project.description");
    const phrases = quote.match(/[^.!?]+[.!?]*/g)?.map((p) => p.trim()) ?? [quote];
    let wordIndex = 0;
    const lines = phrases.map((phrase, pi) => ({
        isAccent: pi === phrases.length - 1,
        words: phrase.split(/\s+/).map((word) => ({word, i: wordIndex++})),
    }));
    const wordCount = wordIndex;
    const firstAccentIndex = lines.find((l) => l.isAccent)?.words[0]?.i ?? 0;
    // The shine starts once the last word has finished rising
    const shineBaseDelay = wordCount * WORD_STAGGER + 0.6;

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
                        {lines.map((line, li) => (
                            <span key={li} className={styles.line}>
                                {line.words.map(({word, i}) => (
                                    <motion.span
                                        key={`${word}-${i}`}
                                        className={line.isAccent ? styles.wordAccent : styles.word}
                                        data-shine={line.isAccent && inView && !reducedMotion}
                                        style={line.isAccent ? {animationDelay: `${shineBaseDelay + (i - firstAccentIndex) * 0.12}s`} : undefined}
                                        initial={reducedMotion ? {opacity: 0} : {opacity: 0, y: "0.7em"}}
                                        animate={inView ? {opacity: 1, y: 0} : undefined}
                                        transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * WORD_STAGGER}}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </blockquote>
                </figure>
            </div>
        </section>
    );
};

export default DesignDevV2;
