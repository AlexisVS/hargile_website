"use client";

import {useEffect, useRef, useState} from "react";
import {useReducedMotion} from "motion/react";
import {useTranslations} from "next-intl";
import styles from "./design-dev.module.scss";

const WORD_STAGGER = 0.07;

/**
 * "On écoute. On construit. On reste." — split into phrases (each rendered on
 * its own line so they never wrap into each other), then into words. A running
 * index across all words keeps the reveal stagger and shine timing continuous.
 *
 * Le reveal est en CSS et l'état au repos est l'état fini : le HTML du serveur
 * ne porte plus un `opacity: 0` par mot, qui donnait une citation transparente
 * à tout client sans JS (cf. geo-plan.md §1.5). JS ne fait que retrancher —
 * tant que la citation est hors écran les mots sont garés (.wordPending), puis
 * ils remontent quand on y arrive. Même principe que useReveal pour les
 * sections, mais un seul observateur pour toute la citation : les mots sont sur
 * la même ligne, ils entrent ensemble.
 */
const VerbsQuote = () => {
    const t = useTranslations("pages.homepage.sections.design-dev");
    const reducedMotion = useReducedMotion();

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
    // parked : la citation était sous la ligne de flottaison au montage, donc on
    // peut cacher les mots sans que personne le voie. Si elle est déjà à l'écran
    // on n'y touche pas — elle est lue, la faire disparaître pour la refaire
    // apparaître serait pire que pas d'animation.
    const [parked, setParked] = useState(false);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = quoteRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                setParked(true);
                return;
            }
            setInView(true);
            observer.disconnect();
        }, {threshold: 0.5});

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const hidden = parked && !inView;

    return (
        <figure className={styles.quote}>
            <blockquote ref={quoteRef} className={styles.quoteText}>
                {lines.map((line, li) => (
                    <span key={li} className={styles.line}>
                        {line.words.map(({word, i}) => (
                            <span
                                key={`${word}-${i}`}
                                className={[
                                    line.isAccent ? styles.wordAccent : styles.word,
                                    hidden ? styles.wordPending : "",
                                ].join(" ").trim()}
                                data-shine={line.isAccent && inView && !reducedMotion}
                                style={{
                                    "--reveal-delay": `${0.15 + i * WORD_STAGGER}s`,
                                    ...(line.isAccent
                                        ? {animationDelay: `${shineBaseDelay + (i - firstAccentIndex) * 0.12}s`}
                                        : null),
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </span>
                ))}
            </blockquote>
        </figure>
    );
};

export default VerbsQuote;
