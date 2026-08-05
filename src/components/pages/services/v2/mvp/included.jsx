"use client";

/* The most citable block of the MVP page: what the 30 days contain, and —
   just as important — what they honestly don't.

   Stacked, not side by side (choix de Mihai, 2026-08-05). The order is the
   point: a voluntarily published exclusion only buys credibility when it
   arrives *after* the positive rather than beside it at equal weight
   (Ein-Gar, Shiv & Tormala, "When blemishing leads to blossoming", JCR 2012).
   Side-by-side columns gave the two lists the same rank.

   On the icons: a comparison matrix of ticks and crosses would be the wrong
   pattern — those exist to separate several offers, and there is one. Here the
   check is pure decoration on a list the heading already names, so it is an
   aria-hidden SVG rather than a ✓ character: screen readers announce those
   inconsistently, and nothing about the meaning depends on seeing it. The
   excluded list keeps a dash, not a red cross — the palette has one accent, and
   inventing a second semantic colour to say "no" would fail the same test. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./included.module.scss";

const Check = () => (
    <svg className={styles.mark} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <path
            d="M2.6 7.4 5.6 10.4 11.4 3.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Dash = () => (
    <svg className={styles.mark} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <path
            d="M3 7h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

const Included = () => {
    const t = useTranslations("pages.services.detail.mvp.included");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>

                <div className={styles.in} {...reveal(1)}>
                    <h3 className={styles.kicker}>{t("inLabel")}</h3>
                    <ul className={styles.list}>
                        {t.raw("in").map((item) => (
                            <li key={item}><Check/>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.out} {...reveal(2)}>
                    <h3 className={styles.kicker}>{t("outLabel")}</h3>
                    <ul className={styles.list}>
                        {t.raw("out").map((item) => (
                            <li key={item}><Dash/>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Included;
