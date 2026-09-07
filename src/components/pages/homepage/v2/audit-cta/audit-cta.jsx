"use client";

/* Homepage audit CTA — full-width band with the GEO diagnostic pitch
   and a single link to the contact/audit form. Reuses the shared CTA band
   shape but reads from homepage-specific copy so it can say "diagnostic"
   instead of "parlons de votre projet". */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "../v2-section.module.scss";
import {useReveal} from "../useReveal";
import styles from "./audit-cta.module.scss";

const AuditCta = () => {
    const t = useTranslations("pages.homepage.sections.audit-cta");
    const reveal = useReveal();

    return (
        <section className={`${section.section} ${section.sectionEnd}`}>
            <div className={section.container}>
                <div className={styles.band}>
                    <div className={styles.copy}>
                        <h2 className={`${section.heading} ${styles.title}`} {...reveal(0)}>
                            {t("title")}
                        </h2>
                        <p className={`${section.lead} ${styles.text}`} {...reveal(1)}>
                            {t("text")}
                        </p>
                    </div>
                    <div className={styles.actions} {...reveal(2)}>
                        <CtaLink href="/contact" variant="primary">
                            {t("button")}
                        </CtaLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuditCta;
