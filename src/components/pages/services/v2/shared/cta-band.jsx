"use client";

/* Closing contact band shared by every M4 page.

   Two shapes, one component:
   - default — a hairline opens the band, copy and CTA stack (service pages).
   - "box"   — the bordered panel from examplesPages/exports: copy left, actions
               right, used by the two hub pages (/services, /faq).

   `secondary` is the optional quiet second action ({href, label}); the box
   variant is the only one that lays out two. */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./cta-band.module.scss";

const CtaBand = ({variant = "default", secondary}) => {
    const t = useTranslations("pages.services.shared.ctaBand");
    const reveal = useReveal();
    const box = variant === "box";

    return (
        <section className={`${section.section} ${section.sectionEnd}`}>
            <div className={section.container}>
                <div className={box ? styles.box : styles.band}>
                    <div className={styles.copy}>
                        <h2 className={`${section.heading} ${styles.title}`} {...reveal(0)}>
                            {t("title")}
                        </h2>
                        <p className={`${section.lead} ${styles.text}`} {...reveal(1)}>
                            {t("text")}
                        </p>
                    </div>
                    <div className={box ? styles.actions : styles.ctaWrap} {...reveal(2)}>
                        <CtaLink href="/contact" variant="primary">
                            {t("button")}
                        </CtaLink>
                        {secondary ? (
                            <CtaLink href={secondary.href} variant="ghost">
                                {secondary.label}
                            </CtaLink>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaBand;
