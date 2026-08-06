"use client";

/* Closing contact band shared by every M4 page.

   One shape for all of them: a hairline opens the band, copy left, actions
   across from it on the same row, stacking on narrow. The hub pages used to
   sit in a bordered panel instead; the frame made /faq and /services read as
   a different page from the four service pages, so there is now a single
   band and no variant to pick.

   `secondary` is the optional quiet second action ({href, label}). */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./cta-band.module.scss";

const CtaBand = ({secondary}) => {
    const t = useTranslations("pages.services.shared.ctaBand");
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
