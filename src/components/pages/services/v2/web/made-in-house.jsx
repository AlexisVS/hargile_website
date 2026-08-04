"use client";

/* Designed / built / maintained — the in-house argument in three hairline
   columns, closed by the ownership strip ("your code, your data"). */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./made-in-house.module.scss";

const COLS = ["design", "build", "maintain"];

const MadeInHouse = () => {
    const t = useTranslations("pages.services.detail.web.madeInHouse");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <div className={styles.cols}>
                    {COLS.map((col, i) => (
                        <div key={col} className={styles.col} {...reveal(1 + i)}>
                            <h3 className={styles.colTitle}>{t(`cols.${col}.title`)}</h3>
                            <p className={styles.colText}>{t(`cols.${col}.text`)}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.ownership} {...reveal(4)}>
                    <h3 className={styles.ownTitle}>{t("ownership.title")}</h3>
                    <p className={styles.ownText}>{t("ownership.text")}</p>
                </div>
            </div>
        </section>
    );
};

export default MadeInHouse;
