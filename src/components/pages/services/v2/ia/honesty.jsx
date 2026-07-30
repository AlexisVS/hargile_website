"use client";

/* The anti-hype differentiator: what happens when AI is not the answer.
   Pull-quote treatment — left accent hairline, nothing else. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./honesty.module.scss";

const Honesty = () => {
    const t = useTranslations("pages.services.detail.ia.honesty");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.quote} {...reveal(0)}>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.text}>{t("text")}</p>
                </div>
            </div>
        </section>
    );
};

export default Honesty;
