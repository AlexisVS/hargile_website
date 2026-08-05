"use client";

/* The most citable block of the MVP page: what the 30 days contain, and —
   just as important — what they honestly don't.

   Unframed since 2026-08-05. The two lists are separated by weight, size and
   marker rather than by a rule over each column: a filled accent dot for what
   is in, a dash for what is out. The labels stayed h3 — they are the headings
   of the two halves, and dropping them to spans would cost the page two
   entries in its outline for a purely visual reason. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./included.module.scss";

const Included = () => {
    const t = useTranslations("pages.services.detail.mvp.included");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <div className={styles.cols}>
                    <div {...reveal(1)}>
                        <h3 className={styles.kicker}>{t("inLabel")}</h3>
                        <ul className={styles.list}>
                            {t.raw("in").map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.colOut} {...reveal(2)}>
                        <h3 className={styles.kicker}>{t("outLabel")}</h3>
                        <ul className={styles.list}>
                            {t.raw("out").map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Included;
