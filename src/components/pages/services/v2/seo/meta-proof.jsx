"use client";

/* The meta-demonstration: this very page applies the method it sells.
   A framed checklist — each point is verifiable in the page source. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./meta-proof.module.scss";

const MetaProof = () => {
    const t = useTranslations("pages.services.detail.seo.metaProof");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.frame} {...reveal(0)}>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.text}>{t("text")}</p>
                    <ul className={styles.points}>
                        {t.raw("points").map((point) => (
                            <li key={point}>{point}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default MetaProof;
