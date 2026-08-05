"use client";

/* What gets measured — and the one thing that is refused.

   The refusal is the point of the section, not a disclaimer at the bottom of
   it: an SEO page that promises nothing checkable is worth less than one that
   names what it will not sell. It gets the accent hairline and sits below the
   rule, so it reads as a claim of its own.

   No score, position or traffic figure appears here. There is no measured
   history to publish yet; when there is, it belongs in the messages. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./measures.module.scss";

const Measures = () => {
    const t = useTranslations("pages.services.detail.seo.measures");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.frame} {...reveal(0)}>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.text}>{t("text")}</p>
                    <ul className={styles.points}>
                        {t.raw("points").map((point) => <li key={point}>{point}</li>)}
                    </ul>
                    <span
                        className={`${styles.rule} ${revealStyles.hairline}`}
                        aria-hidden="true"
                        {...reveal(1)}
                    />
                    <p className={styles.refusal}>{t("refusal")}</p>
                </div>
            </div>
        </section>
    );
};

export default Measures;
