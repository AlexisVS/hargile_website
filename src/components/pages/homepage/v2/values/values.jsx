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

    /* No .sectionEnd: this is no longer the last section. The bottom breathing
       room before the footer now belongs to the work rail, and keeping it here
       would just double the gap before it. */
    return (
        <section className={section.section}>
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
                {/* Editorial rows, not cards. The lit-glass tiles this section
                    used to carry (20px backdrop-filter, gradient fill, 14px
                    radius, drop shadow) are gone: they were the last filled
                    object left on the site, and everything the M4/M5 pages draw
                    — the IA use-cases figure, the sibling-offer rows, the FAQ —
                    is drawn with 1px hairlines on nothing.

                    Two columns rather than a grid of tiles, because the copy is
                    lopsided: Fiabilité is one line where Souveraineté is three.
                    In any equal-cell layout the short values leave holes; here
                    each row is only as tall as its own description.

                    Same construction as .othersRow on the service pages — the
                    rule OPENS each row instead of closing it, so the block ends
                    on the last value rather than on a line under it. */}
                <ul className={styles.list}>
                    {values.map((v, i) => (
                        <li key={v.value} className={styles.row} {...reveal(i)}>
                            <h3 className={styles.valueName}>{v.value}</h3>
                            <p className={styles.valueDesc}>{v.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default ValuesV2;
