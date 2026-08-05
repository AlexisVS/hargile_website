"use client";

/* Fixed-price statement. No amount anywhere by decision (2026-07-30, Mihai):
   the citable claim is the mechanism — price announced before the start,
   never billed by time. If an amount is published later it belongs in the
   messages, not here.

   Unframed since 2026-08-05. The box is replaced by an editorial split: the
   heading holds the left column and the statement runs large in the right one.
   The claim is short and absolute, so it earns the scale — this is the one
   place on the page where the type gets loud instead of the layout. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./fixed-price.module.scss";

const FixedPrice = () => {
    const t = useTranslations("pages.services.detail.mvp.price");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={`${section.container} ${styles.split}`}>
                <h2 className={`${section.heading} ${styles.title}`} {...reveal(0)}>
                    {t("title")}
                </h2>
                <p className={styles.text} {...reveal(1)}>{t("text")}</p>
            </div>
        </section>
    );
};

export default FixedPrice;
