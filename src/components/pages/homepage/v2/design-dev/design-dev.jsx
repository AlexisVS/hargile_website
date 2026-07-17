"use client";

import {motion} from "motion/react";
import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./design-dev.module.scss";
import {useReveal} from "../useReveal";

const DesignDevV2 = () => {
    const t = useTranslations("pages.homepage.sections.design-dev");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <motion.h2 className={section.heading} {...reveal(0)}>
                    {t("title")}
                </motion.h2>
                <motion.p className={section.lead} style={{maxWidth: "58ch"}} {...reveal(1)}>
                    {t("lead")}
                </motion.p>

                <motion.figure className={styles.quote} {...reveal(2)}>
                    <div className={styles.quoteGlow} aria-hidden="true"/>
                    <blockquote className={styles.quoteText}>
                        {t("offers.your-project.description")}
                    </blockquote>
                </motion.figure>
            </div>
        </section>
    );
};

export default DesignDevV2;
