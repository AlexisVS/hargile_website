"use client";

import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./verticals.module.scss";
import {useReveal} from "../useReveal";

/* Who it's for — the verticals the GEO offer targets.
   Simple grid of labels, no icons, no illustrations. The copy does the work. */

const VERTICALS = [
    "fiduciaries",
    "lawyers",
    "notaries",
    "consultants",
    "recruiters",
    "architects",
];

const Verticals = () => {
    const t = useTranslations("pages.homepage.sections.verticals");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>
                    {t("lead")}
                </p>

                <ul className={styles.grid}>
                    {VERTICALS.map((key, i) => (
                        <li key={key} className={styles.card} {...reveal(2 + i)}>
                            <h3 className={styles.name}>{t(`items.${key}.title`)}</h3>
                            <p className={styles.desc}>{t(`items.${key}.text`)}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Verticals;
