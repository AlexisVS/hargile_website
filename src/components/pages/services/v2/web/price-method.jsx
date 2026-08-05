"use client";

/* How the price is set. No amount anywhere by decision (2026-08-05, Mihai) —
   same rule as mvp/fixed-price.jsx: the citable claim is the mechanism, not a
   range. If ranges are published later they belong in the messages, not here.

   V3, 05/08 (Mihai): the frame is gone and designed / built / maintained now
   live inside this one section rather than below it. An uneven split — the
   title alone on the left, the whole argument on the right — replaces the
   panel: the section right above is a hard-edged bento, and answering it with
   a second bordered box made the page two boxes in a row. The mechanism reads
   as a column of statements instead, separated by two drawn rules.

   ⚠️ The crafts sit under a quiet label, and that label names the three trades
   and stops there. It does not say the price covers all three, tempting as the
   sentence is now that they share a section: maintenance is an ongoing
   relationship the copy explicitly leaves open ("vous restez par choix"), so
   writing that it is included would be a new commercial claim invented by a
   layout change. If it is true, it needs to be decided and written, not implied
   by adjacency. Merging the two blocks visually does not merge the promises.

   The note keeps its own place at the bottom of the left column but is LAST in
   the DOM: it points at another offer and says "la même méthode", so a reader
   without CSS — an answer-engine crawler, docs/geo-plan.md §1.5 — must meet the
   method before the sentence that refers back to it. Grid areas put it where
   the eye wants it without moving it in the source.

   Reveal budget, full 0–8: 0 title (and the note, one visual block with it),
   1 statement, 2 rule, 3 points, 4 rule, 5 label, 6–8 the three crafts. There
   is no ninth slot — anything added here has to share a rank. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./price-method.module.scss";

const COLS = ["design", "build", "maintain"];

const PriceMethod = () => {
    const t = useTranslations("pages.services.detail.web.priceMethod");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.split}>
                    <h2 className={styles.title} {...reveal(0)}>{t("title")}</h2>

                    <div className={styles.method}>
                        <p className={styles.statement} {...reveal(1)}>{t("text")}</p>
                        <span
                            className={`${styles.rule} ${revealStyles.hairline}`}
                            aria-hidden="true"
                            {...reveal(2)}
                        />
                        <ul className={styles.points} {...reveal(3)}>
                            {t.raw("points").map((point) => <li key={point}>{point}</li>)}
                        </ul>
                        <span
                            className={`${styles.rule} ${revealStyles.hairline}`}
                            aria-hidden="true"
                            {...reveal(4)}
                        />

                        <h3 className={styles.colsTitle} {...reveal(5)}>{t("cols.title")}</h3>
                        <div className={styles.cols}>
                            {COLS.map((col, i) => (
                                <div key={col} className={styles.col} {...reveal(6 + i)}>
                                    <h4 className={styles.colTitle}>{t(`cols.${col}.title`)}</h4>
                                    <p className={styles.colText}>{t(`cols.${col}.text`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className={styles.note} {...reveal(0)}>{t("note")}</p>
                </div>
            </div>
        </section>
    );
};

export default PriceMethod;
