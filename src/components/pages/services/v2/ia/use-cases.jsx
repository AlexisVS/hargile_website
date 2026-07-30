"use client";

/* Four places where AI earns its place — a 2×2 grid of hairline cards, each
   card a signal ("the sign this is for you") and an expected outcome. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./use-cases.module.scss";

const CASES = ["automation", "content", "support", "data"];

const UseCases = () => {
    const t = useTranslations("pages.services.detail.ia.useCases");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <div className={styles.grid}>
                    {CASES.map((useCase, i) => (
                        <article key={useCase} className={styles.card} {...reveal(1 + i)}>
                            <h3 className={styles.cardTitle}>{t(`items.${useCase}.title`)}</h3>
                            <p className={styles.signal}>{t(`items.${useCase}.signal`)}</p>
                            <p className={styles.outcome}>{t(`items.${useCase}.outcome`)}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
