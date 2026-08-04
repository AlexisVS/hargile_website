"use client";

/* The SEO method in four numbered steps — hairline columns, no cards. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./process.module.scss";

const STEPS = [
    {key: "audit", num: "01"},
    {key: "tech", num: "02"},
    {key: "content", num: "03"},
    {key: "measure", num: "04"},
];

const Process = () => {
    const t = useTranslations("pages.services.detail.seo.process");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <div className={styles.steps}>
                    {STEPS.map(({key, num}, i) => (
                        <div key={key} className={styles.step} {...reveal(1 + i)}>
                            <p className={styles.num}>{num}</p>
                            <h3 className={styles.stepTitle}>{t(`steps.${key}.title`)}</h3>
                            <p className={styles.stepText}>{t(`steps.${key}.text`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
