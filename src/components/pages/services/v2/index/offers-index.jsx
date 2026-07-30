"use client";

/* The four offers as numbered editorial rows — hairline separations, no
   cards. Display order is the sales order (web, ia, seo, mvp), not the
   alphabetical order of the message keys. */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./offers-index.module.scss";

const OFFERS = [
    {key: "web", num: "01", href: "/services/applications-web"},
    {key: "ia", num: "02", href: "/services/ia"},
    {key: "seo", num: "03", href: "/services/seo"},
    {key: "mvp", num: "04", href: "/services/mvp-30-jours"},
];

const OffersIndex = () => {
    const t = useTranslations("pages.services.index");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.rows}>
                    {OFFERS.map((offer, i) => (
                        <article key={offer.key} className={styles.row} {...reveal(i)}>
                            <span className={styles.num} aria-hidden="true">{offer.num}</span>
                            <div className={styles.main}>
                                <h2 className={styles.title}>{t(`offers.${offer.key}.title`)}</h2>
                                <p className={styles.promise}>{t(`offers.${offer.key}.promise`)}</p>
                                <ul className={styles.deliverables}>
                                    {t.raw(`offers.${offer.key}.deliverables`).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.ctaCol}>
                                <CtaLink href={offer.href} variant="ghost" size="sm">
                                    {t("detailCta")}
                                </CtaLink>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OffersIndex;
