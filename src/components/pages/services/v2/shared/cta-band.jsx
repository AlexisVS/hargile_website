"use client";

/* Closing contact band shared by every M4 page.

   One layout — copy left, actions across from it on the same row, stacking on
   narrow — in two shapes:
   - default — a hairline opens the band (service pages).
   - "box"   — the bordered panel from examplesPages/exports, used by the two
               hub pages (/services, /faq).

   `secondary` is the optional quiet second action ({href, label}).
   `framed={false}` keeps the box layout but drops the frame and its inset, so
   the copy sits on the container edge like every other section (/services). */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./cta-band.module.scss";

const CtaBand = ({variant = "default", framed = true, secondary}) => {
    const t = useTranslations("pages.services.shared.ctaBand");
    const reveal = useReveal();
    const box = variant === "box";
    const boxClass = framed ? styles.box : `${styles.box} ${styles.bare}`;

    return (
        <section className={`${section.section} ${section.sectionEnd}`}>
            <div className={section.container}>
                <div className={box ? boxClass : styles.band}>
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
