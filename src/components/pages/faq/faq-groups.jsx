"use client";

/* The /faq page body: the 12 transversal questions grouped under three h2s,
   rendered by the shared accordion. Items come from pages.faq.items — the
   exact source build-json-ld.js reads for FAQPage.mainEntity, so the visible
   copy and the structured data cannot drift.

   Layout from examplesPages/exports/app/faq/page.jsx: each chapter is its own
   section, with a sticky numeral column on the left and the questions on the
   right. The heading holds while its own questions scroll under it, then
   releases at the bottom of its own container — which is why one section per
   group rather than one section for the three.

   Replaces the sticky title band: same intent (three chapters, not one long
   list), but the numeral does the marking, so nothing has to paint a solid
   band over the questions passing underneath.

   The reveal index restarts per group: the shared stagger loop covers 1-8 and
   fails silently beyond. */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import FaqAccordion from "@/components/ui/faq-accordion/faq-accordion";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {FAQ_GROUPS} from "./groups";
import styles from "./faq-groups.module.scss";

/* "The long answer" links — mirrors OFFERS in offers-index.jsx. */
const OFFER_LINKS = [
    {key: "web", href: "/services/applications-web"},
    {key: "seo", href: "/services/seo"},
];

const FaqGroups = () => {
    const t = useTranslations("pages.faq");
    const offersT = useTranslations("pages.services.index.offers");
    const reveal = useReveal();
    const items = t.raw("items");

    return (
        <>
            {FAQ_GROUPS.map(({key, id, num}) => (
                <section key={key} id={id} className={`${section.section} ${styles.chapter}`}>
                    <div className={section.container}>
                        <GroupBlock
                            num={num}
                            title={t(`groups.${key}`)}
                            items={items.filter((item) => item.group === key)}
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
const GroupBlock = ({num, title, items}) => {
    const reveal = useReveal();

    return (
        <div className={styles.group}>
            <div className={styles.spine}>
                <span className={`${section.numLg} ${styles.num}`} aria-hidden="true">{num}</span>
                <h2 className={styles.groupTitle} {...reveal(0)}>{title}</h2>
            </div>
            <div className={styles.list}>
                {/* First question of each chapter rests open — the reference's
                    resting state, and the answers are in the HTML either way. */}
                <FaqAccordion items={items} reveal={reveal} defaultOpenIndex={0}/>
            </div>
        </div>
    );
};

export default FaqGroups;
