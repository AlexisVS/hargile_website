"use client";

import {motion} from "motion/react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import section from "../v2-section.module.scss";
import styles from "./mvp-promo.module.scss";
import {useReveal} from "../useReveal";

const STEPS = [
    {key: "scope", num: "01"},
    {key: "build", num: "02"},
    {key: "launch", num: "03"},
];

const MvpPromoV2 = () => {
    const t = useTranslations("pages.homepage.sections.mvp-promo");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <motion.h2 className={section.heading} {...reveal(0)}>
                    {t("title")} <span className={styles.accent}>{t("titleAccent")}</span>
                </motion.h2>
                <motion.p className={section.lead} style={{maxWidth: "56ch"}} {...reveal(1)}>
                    {t("lead")}
                </motion.p>

                <div className={styles.timeline}>
                    <div className={styles.rail} aria-hidden="true"/>
                    <div className={styles.steps}>
                        {STEPS.map((step, i) => (
                            <motion.div key={step.key} className={styles.step} {...reveal(i)}>
                                <div className={styles.dot}/>
                                <div className={styles.ghostNum} aria-hidden="true">{step.num}</div>
                                <div className={styles.stepBody}>
                                    <div className={styles.week}>{t(`steps.${step.key}.week`)}</div>
                                    <h3 className={styles.stepTitle}>{t(`steps.${step.key}.title`)}</h3>
                                    <p className={styles.stepText}>{t(`steps.${step.key}.text`)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div className={styles.ctaWrap} {...reveal(3)}>
                    <Link href="/contact" className={styles.cta}>
                        {t("cta")} →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default MvpPromoV2;
