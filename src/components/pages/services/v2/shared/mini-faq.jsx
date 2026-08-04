"use client";

/* Short offer-specific FAQ closing each service page. Plain HTML only: the
   FAQPage JSON-LD lives on /faq alone — one markup home per question — and
   these questions are deliberately distinct from the /faq set. Ends on a
   link to the full FAQ instead of duplicating it. */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import FaqAccordion from "@/components/ui/faq-accordion/faq-accordion";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./mini-faq.module.scss";

/** namespace: the page's faq subtree, e.g. "pages.services.detail.mvp.faq" */
const MiniFaq = ({namespace}) => {
    const t = useTranslations(namespace);
    const shared = useTranslations("pages.services.shared.miniFaq");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={styles.title} {...reveal(0)}>{shared("title")}</h2>
                <div className={styles.accordionWrap} {...reveal(1)}>
                    <FaqAccordion items={t.raw("items")}/>
                </div>
                <div className={styles.allWrap} {...reveal(2)}>
                    <CtaLink href="/faq" variant="ghost" size="sm">
                        {shared("allLink")}
                    </CtaLink>
                </div>
            </div>
        </section>
    );
};

export default MiniFaq;
