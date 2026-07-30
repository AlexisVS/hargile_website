"use client";

/* Closing contact band shared by every M4 page. */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./cta-band.module.scss";

const CtaBand = () => {
    const t = useTranslations("pages.services.shared.ctaBand");
    const reveal = useReveal();

    return (
        <section className={`${section.section} ${section.sectionEnd}`}>
            <div className={section.container}>
                <div className={styles.band}>
                    <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                    <p className={`${section.lead} ${styles.text}`} {...reveal(1)}>{t("text")}</p>
                    <div className={styles.ctaWrap} {...reveal(2)}>
                        <CtaLink href="/contact" variant="primary">
                            {t("button")}
                        </CtaLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaBand;
