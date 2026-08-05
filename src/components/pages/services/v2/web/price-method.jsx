"use client";

/* How the price is set. No amount anywhere by decision (2026-08-05, Mihai) —
   same rule as mvp/fixed-price.jsx: the citable claim is the mechanism, not a
   range. If ranges are published later they belong in the messages, not here.

   The frame reveals as one block; the single rule inside it draws afterwards,
   splitting the mechanism from the three commitments that follow.

   Below the frame: designed / built / maintained, moved down from
   made-in-house.jsx (Mihai, 05/08) so the grid section stays something you look
   at rather than read. They sit OUTSIDE the frame on purpose — the frame is a
   checkable statement about the price, and folding three paragraphs about the
   craft into it would dilute exactly what makes it checkable.

   ⚠️ Their heading names the three trades and stops there. It does not say the
   price covers all three, tempting as the sentence is: maintenance is an
   ongoing relationship the copy explicitly leaves open ("vous restez par
   choix"), so writing that it is included would be a new commercial claim
   invented by a layout change. If it is true, it needs to be decided and
   written, not implied by adjacency. */

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
                <div className={styles.frame} {...reveal(0)}>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.text}>{t("text")}</p>
                    <span
                        className={`${styles.rule} ${revealStyles.hairline}`}
                        aria-hidden="true"
                        {...reveal(1)}
                    />
                    <ul className={styles.points}>
                        {t.raw("points").map((point) => <li key={point}>{point}</li>)}
                    </ul>
                    <p className={styles.note}>{t("note")}</p>
                </div>

                <h3 className={styles.colsTitle} {...reveal(2)}>{t("cols.title")}</h3>
                <div className={styles.cols}>
                    {COLS.map((col, i) => (
                        <div key={col} className={styles.col} {...reveal(3 + i)}>
                            <h4 className={styles.colTitle}>{t(`cols.${col}.title`)}</h4>
                            <p className={styles.colText}>{t(`cols.${col}.text`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PriceMethod;
