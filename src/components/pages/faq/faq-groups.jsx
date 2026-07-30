"use client";

/* The /faq page body: the 12 transversal questions grouped under three h2s,
   rendered by the shared accordion. Items come from pages.faq.items — the
   exact source build-json-ld.js reads for FAQPage.mainEntity, so the visible
   copy and the structured data cannot drift. The reveal index restarts per
   group: the shared stagger loop covers 1-8 and fails silently beyond. */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import FaqAccordion from "@/components/ui/faq-accordion/faq-accordion";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./faq-groups.module.scss";

const GROUP_ORDER = ["project", "budget", "tech"];

/* "The long answer" links — mirrors OFFERS in offers-index.jsx. */
const OFFER_LINKS = [
    {key: "web", href: "/services/applications-web"},
    {key: "ia", href: "/services/ia"},
    {key: "seo", href: "/services/seo"},
    {key: "mvp", href: "/services/mvp-30-jours"},
];

const FaqGroups = () => {
    const t = useTranslations("pages.faq");
    const offersT = useTranslations("pages.services.index.offers");
    const reveal = useReveal();
    const items = t.raw("items");

    return (
        <>
            {GROUP_ORDER.map((group) => (
                <section key={group} className={section.section}>
                    <div className={section.container}>
                        <GroupBlock
                            title={t(`groups.${group}`)}
                            items={items.filter((item) => item.group === group)}
                        />
                    </div>
                </section>
            ))}
            <section className={section.section}>
                <div className={section.container}>
                    <div className={styles.more}>
                        <h2 className={styles.moreTitle} {...reveal(0)}>{t("more.title")}</h2>
                        <p className={styles.moreText} {...reveal(1)}>{t("more.text")}</p>
                        <ul className={styles.moreLinks} {...reveal(2)}>
                            {OFFER_LINKS.map(({key, href}) => (
                                <li key={key}>
                                    <CtaLink href={href} variant="ghost" size="sm">
                                        {offersT(`${key}.title`)}
                                    </CtaLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
};

/* Own component so each group gets its own useReveal observer and its own
   0-based stagger indices. */
const GroupBlock = ({title, items}) => {
    const reveal = useReveal();

    return (
        <>
            <h2 className={styles.groupTitle} {...reveal(0)}>{title}</h2>
            <div className={styles.accordionWrap}>
                <FaqAccordion items={items} reveal={reveal}/>
            </div>
        </>
    );
};

export default FaqGroups;
