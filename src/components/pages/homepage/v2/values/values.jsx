"use client";

import {motion} from "motion/react";
import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./values.module.scss";
import {useReveal} from "../useReveal";

/* Thin-stroke icons, one per value, in the order of the our-values array:
   Excellence, Innovation, Collaboration, Intégrité, Adaptabilité */
const VALUE_ICONS = [
    // Excellence — gem
    <svg key="gem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4h10l4 6-9 11L3 10l4-6z"/>
        <path d="M3 10h18M12 21 8.5 10 11 4M12 21l3.5-11L13 4"/>
    </svg>,
    // Innovation — lightbulb
    <svg key="bulb" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 1 3.7 10.7c-.6.5-.7 1.3-.7 2.3h-6c0-1-.1-1.8-.7-2.3A6 6 0 0 1 12 3z"/>
        <path d="M9.5 19h5M10.5 22h3"/>
    </svg>,
    // Collaboration — overlapping circles
    <svg key="circles" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="12" r="5.5"/>
        <circle cx="15" cy="12" r="5.5"/>
    </svg>,
    // Intégrité — shield
    <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 2.8v5.4c0 4.4-2.9 7.8-7 9.8-4.1-2-7-5.4-7-9.8V5.8L12 3z"/>
        <path d="M9 12l2 2 4-4.5"/>
    </svg>,
    // Adaptabilité — crossing arrows
    <svg key="arrows" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h3c5 0 5 10 10 10h3M4 17h3c2.2 0 3.5-2 4.6-4M20 7h-3c-2.2 0-3.5 2-4.6 4"/>
        <path d="M17.5 4.5 20 7l-2.5 2.5M17.5 14.5 20 17l-2.5 2.5"/>
    </svg>,
];

const ValuesV2 = () => {
    const t = useTranslations("pages.homepage.sections.about-us");
    const reveal = useReveal();

    // Arrays live in the message file; t.raw returns them untranslated-through
    const values = t.raw("our-values") ?? [];

    // who_description holds the statement + ambition split on the blank line
    const [statement, ambition] = (t("who_description") || "").split("\n\n");

    // Spotlight: track the cursor per card via CSS vars consumed by .cardSpotlight
    const handleMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    return (
        <section className={`${section.section} ${section.sectionEnd}`}>
            <div className={styles.orb} aria-hidden="true"/>
            <div className={section.container}>
                <motion.h2 className={section.heading} {...reveal(0)}>
                    {t("who_title")}
                </motion.h2>
                <motion.p className={styles.statement} {...reveal(1)}>
                    {statement}
                </motion.p>
                {ambition && (
                    <motion.p className={styles.ambition} {...reveal(1)}>
                        {ambition}
                    </motion.p>
                )}
                {/* Value cards */}
                <div className={styles.values}>
                    {values.map((v, i) => (
                        <motion.div
                            key={v.value}
                            className={styles.card}
                            onMouseMove={handleMove}
                            {...reveal(i)}
                        >
                            <div className={styles.cardSpotlight} aria-hidden="true"/>
                            <div className={styles.valueIcon} aria-hidden="true">{VALUE_ICONS[i]}</div>
                            <h4 className={styles.valueName}>{v.value}</h4>
                            <p className={styles.valueDesc}>{v.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesV2;
