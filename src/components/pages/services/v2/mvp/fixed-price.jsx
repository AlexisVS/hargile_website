"use client";

/* Fixed-price statement. No amount anywhere by decision (2026-07-30, Mihai):
   the citable claim is the mechanism — price announced before the start,
   never billed by time. If an amount is published later it belongs in the
   messages, not here. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./fixed-price.module.scss";

const FixedPrice = () => {
    const t = useTranslations("pages.services.detail.mvp.price");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.frame} {...reveal(0)}>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.text}>{t("text")}</p>
                </div>
            </div>
        </section>
    );
};

export default FixedPrice;
