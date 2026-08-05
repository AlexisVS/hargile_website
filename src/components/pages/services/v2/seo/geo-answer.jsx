"use client";

/* Being cited by AI answer engines — the differentiator this page has to carry.

   It sits after MetaProof on purpose: MetaProof demonstrates the technique on
   this very page, this section says what it is and how it is worked, and
   Measures says how we are held to it. The closing strip is the boundary that
   keeps the claim credible — nobody controls the models, so what is promised
   is the method.

   The title takes the identity gradient: on this page, this is the claim. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./geo-answer.module.scss";

const COLS = ["readable", "structured", "answers"];

const GeoAnswer = () => {
    const t = useTranslations("pages.services.detail.seo.geo");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={`${section.heading} ${styles.title}`} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("lead")}</p>
                <div className={styles.cols}>
                    {COLS.map((col, i) => (
                        <div key={col} className={styles.col}>
                            <span
                                className={`${styles.rule} ${revealStyles.hairline}`}
                                aria-hidden="true"
                                {...reveal(2 + i)}
                            />
                            <div className={styles.body} {...reveal(2 + i)}>
                                <h3 className={styles.colTitle}>{t(`cols.${col}.title`)}</h3>
                                <p className={styles.colText}>{t(`cols.${col}.text`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.closing} {...reveal(5)}>
                    <h3 className={styles.closingTitle}>{t("closing.title")}</h3>
                    <p className={styles.closingText}>{t("closing.text")}</p>
                </div>
            </div>
        </section>
    );
};

export default GeoAnswer;
