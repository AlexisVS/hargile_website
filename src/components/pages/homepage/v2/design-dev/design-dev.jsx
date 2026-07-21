"use client";

import {useRef} from "react";
import {motion, useReducedMotion, useScroll} from "motion/react";
import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./design-dev.module.scss";
import {useReveal} from "../useReveal";
import ScrubWord from "./scrub-word";
import VerbsQuote from "./verbs-quote";

/**
 * Design & development — the manifesto.
 * Section title, then an editorial paragraph whose words scrub from dim to
 * bright as they cross the viewport (scroll-linked, no loop). Accent segments
 * (from the message file) take the blue gradient — the early "with you, not
 * for you" and the closing promise. The three verbs land below as the
 * signature.
 */
const DesignDevV2 = () => {
    const t = useTranslations("pages.homepage.sections.design-dev");
    const reveal = useReveal();
    const reducedMotion = useReducedMotion();
    const manifestoRef = useRef(null);
    const {scrollYProgress} = useScroll({
        target: manifestoRef,
        offset: ["start 0.85", "end 0.5"],
    });

    // Manifesto lives in the message file as [{text, accent?}] segments
    const segments = t.raw("manifesto") ?? [];
    const words = segments.flatMap((seg) =>
        seg.text.split(/\s+/).filter(Boolean).map((w) => ({w, accent: !!seg.accent}))
    );
    const n = words.length;

    return (
        <section className={section.section}>
            <div className={section.container}>
                <motion.h2 className={`${section.heading} ${styles.centered}`} {...reveal(0)}>
                    {t("title")}
                </motion.h2>

                <blockquote ref={manifestoRef} className={styles.manifesto}>
                    {words.map(({w, accent}, i) => (
                        <ScrubWord
                            key={`${w}-${i}`}
                            word={w}
                            className={accent ? styles.mWordAccent : styles.mWord}
                            progress={scrollYProgress}
                            start={(i / n) * 0.85}
                            end={(i / n) * 0.85 + 0.15}
                            reduced={reducedMotion}
                        />
                    ))}
                </blockquote>

                <div className={styles.quoteAfterManifesto}>
                    <VerbsQuote/>
                </div>
            </div>
        </section>
    );
};

export default DesignDevV2;
