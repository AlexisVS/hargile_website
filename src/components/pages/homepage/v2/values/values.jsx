"use client";

import {motion} from "motion/react";
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
                {/* Value rows */}
                <div className={styles.values}>
                    {values.map((v, i) => (
                        <motion.div key={v.value} className={styles.valueRow} {...reveal(i)}>
                            <div className={styles.valueNum}>{String(i + 1).padStart(2, "0")}</div>
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
