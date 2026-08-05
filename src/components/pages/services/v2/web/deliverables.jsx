"use client";

/* What you receive — the four things that are yours at the end of a project.

   This is the page's answer to "concretely, what do I get?", and it is
   deliberately a list of objects rather than of qualities: maquettes, a repo, a
   live site, the accounts. Nothing here is a figure we cannot show.

   The four rules draw themselves at the same reveal index as the column they
   open, so line and copy land together rather than in two waves. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./deliverables.module.scss";

const ITEMS = [
    {key: "design", num: "01"},
    {key: "code", num: "02"},
    {key: "live", num: "03"},
    {key: "keys", num: "04"},
];

const Deliverables = () => {
    const t = useTranslations("pages.services.detail.web.deliverables");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={section.lead} {...reveal(1)}>{t("lead")}</p>
                <div className={styles.cols}>
                    {ITEMS.map(({key, num}, i) => (
                        <div key={key} className={styles.col}>
                            <span
                                className={`${styles.rule} ${revealStyles.hairline}`}
                                aria-hidden="true"
                                {...reveal(2 + i)}
                            />
                            <div className={styles.body} {...reveal(2 + i)}>
                                <span
                                    className={`${section.numLg} ${section.numOutline} ${styles.num}`}
                                    aria-hidden="true"
                                >
                                    {num}
                                </span>
                                <h3 className={styles.colTitle}>{t(`items.${key}.title`)}</h3>
                                <p className={styles.colText}>{t(`items.${key}.text`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Deliverables;
