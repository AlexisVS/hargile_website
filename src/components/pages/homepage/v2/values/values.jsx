"use client";

import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./values.module.scss";
import {useReveal} from "../useReveal";

const ValuesV2 = () => {
    const t = useTranslations("pages.homepage.sections.about-us");
    const reveal = useReveal();

    // Arrays live in the message file; t.raw returns them untranslated-through
    const values = t.raw("our-values") ?? [];

    // who_description holds the statement + ambition split on the blank line
    const [statement, ambition] = (t("who_description") || "").split("\n\n");

    return (
        <section className={`${section.section} ${section.sectionEnd}`}>
            <div className={styles.orb} aria-hidden="true"/>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>
                    {t("who_title")}
                </h2>
                <p className={styles.statement} {...reveal(1)}>
                    {statement}
                </p>
                {ambition && (
                    <p className={styles.ambition} {...reveal(1)}>
                        {ambition}
                    </p>
                )}
                {/* Value cards — same lit-glass card + luminous dot as the hero's
                    capability cards on mobile (.floatCard / .cardDot) */}
                <div className={styles.values}>
                    {values.map((v, i) => (
                        <div
                            key={v.value}
                            className={styles.card}
                            {...reveal(i)}
                        >
                            <div className={styles.cardDot} aria-hidden="true"/>
                            <h3 className={styles.valueName}>{v.value}</h3>
                            <p className={styles.valueDesc}>{v.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesV2;
