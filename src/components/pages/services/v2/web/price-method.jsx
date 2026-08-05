"use client";

/* How the price is set. No amount anywhere by decision (2026-08-05, Mihai) —
   same rule as mvp/fixed-price.jsx: the citable claim is the mechanism, not a
   range. If ranges are published later they belong in the messages, not here.

   The frame reveals as one block; the single rule inside it draws afterwards,
   splitting the mechanism from the three commitments that follow. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./price-method.module.scss";

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
            </div>
        </section>
    );
};

export default PriceMethod;
