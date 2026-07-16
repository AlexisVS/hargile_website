"use client";

import {motion} from "motion/react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import section from "../v2-section.module.scss";
import styles from "./design-dev.module.scss";
import {useReveal} from "../useReveal";

const OFFERS = [
    {key: "your-project", href: "/services"},
    {key: "multipass", href: "/solutions/multipass"},
];

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

                <div className={styles.list}>
                    {OFFERS.map((offer, i) => (
                        <motion.div key={offer.key} {...reveal(i)}>
                            <Link href={offer.href} className={styles.row}>
                                <div className={styles.rowHead}>
                                    <h3 className={styles.rowTitle}>{t(`offers.${offer.key}.title`)}</h3>
                                    <div className={styles.rowTagline}>{t(`offers.${offer.key}.tagline`)}</div>
                                </div>
                                <p className={styles.rowText}>{t(`offers.${offer.key}.description`)}</p>
                                <div className={styles.arrow} aria-hidden="true">→</div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DesignDevV2;
