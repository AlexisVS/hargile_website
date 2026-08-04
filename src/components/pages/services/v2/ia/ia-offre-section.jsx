/* The whole body of /services/ia below the hero, in one Server Component:
   the four use cases as an asymmetric bento, the anti-hype counter-argument,
   the mini-FAQ, the sibling offers and the closing CTA.

   Server Component on purpose — every string ships in the initial HTML and
   stays readable with JS off, which is the GEO constraint the five sections
   this replaces each satisfied on their own (docs/geo-plan.md §1.5). The two
   islands at the bottom render nothing: they only add behaviour on top of
   markup that is already complete.

   Copy comes from the same message keys the old sections used — nothing was
   rewritten here, only regrouped. The one message change: useCases.*.signal
   and .outcome used to carry their "Le signal :" / "Le résultat :" prefix
   inline; the prefix is now its own key (signalLabel / resultLabel) so the
   label can be a styled span rather than part of the sentence. */

import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import FaqAccordion from "./faq-accordion-island";
import BentoSpotlight from "./bento-spotlight";
import styles from "./ia-offre-section.module.scss";

/* Spans on the six-column bento: 4 / 2 — 2 / 4. The order is the message
   order; the spans are the only layout information that is not in the copy.
   Filling the wide cells is the stylesheet's job, not this array's — see
   .pair and .cardTitle. */
const CASES = [
    {key: "automation", span: 4},
    {key: "content", span: 2},
    {key: "support", span: 2},
    {key: "data", span: 4},
];

/* Same hrefs and same sales order as offers-index.jsx / sibling-offers.jsx —
   /services/ia itself left out, since this is the page. */
const OTHER_OFFERS = [
    {key: "web", href: "/services/applications-web"},
    {key: "seo", href: "/services/seo"},
    {key: "mvp", href: "/services/mvp-30-jours"},
];

const Chevron = () => (
    <span className={styles.chevron} aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none">
            <path
                d="M6 3.5 10.5 8 6 12.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </span>
);

const IaOffreSection = async ({locale}) => {
    const t = await getTranslations({locale, namespace: "pages.services.detail.ia"});
    const shared = await getTranslations({locale, namespace: "pages.services.shared"});
    const offers = await getTranslations({locale, namespace: "pages.services.index.offers"});

    const faqItems = t.raw("faq.items");

    return (
        <section className={`${section.section} ${section.sectionEnd}`}>
            <div className={`${section.container} ${styles.ia}`}>
                <h2 className={`${section.heading} ${styles.title}`}>{t("useCases.title")}</h2>

                {/* Asymmetric bento: 4 / 2 — 2 / 4 over six columns, glued into
                    one figure — the cells share their hairlines, no gaps. */}
                <div className={styles.bento}>
                    {CASES.map((useCase) => (
                        <article key={useCase.key} className={styles.card} data-span={useCase.span} data-bento-card>
                            {/* Hover spotlight, positioned by --mx / --my. */}
                            <span className={styles.spot} aria-hidden="true"/>

                            <h3 className={styles.cardTitle}>
                                {t(`useCases.items.${useCase.key}.title`)}
                            </h3>

                            {/* Wide cards read signal and result side by side, narrow
                                ones stack them — see .pair in the stylesheet. */}
                            <div className={styles.pair}>
                                <p className={styles.signal}>
                                    <span className={`${styles.label} ${styles.labelAccent}`}>
                                        {t("useCases.signalLabel")}
                                    </span>{" "}
                                    {t(`useCases.items.${useCase.key}.signal`)}
                                </p>
                                <p className={styles.result}>
                                    <span className={`${styles.label} ${styles.labelAccent}`}>
                                        {t("useCases.resultLabel")}
                                    </span>{" "}
                                    {t(`useCases.items.${useCase.key}.outcome`)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Outside the grid on purpose: this answers the four cases
                    rather than being a fifth one. */}
                <article className={styles.counter}>
                    <h3 className={styles.counterTitle}>{t("honesty.title")}</h3>
                    <p className={styles.counterText}>{t("honesty.text")}</p>
                </article>

                {/* FAQ: heading and the way out on the left, accordion on the right.
                    The answers rest OPEN in this HTML — the island collapses them
                    after mount, so a crawler with no JS reads all four. */}
                <div className={styles.faq}>
                    <div>
                        <h3 className={styles.faqTitle}>{shared("miniFaq.title")}</h3>
                        <Link className={styles.pill} href="/faq">
                            {shared("miniFaq.allLink")}
                            <Chevron/>
                        </Link>
                    </div>

                    <div className={styles.faqList} data-accordion>
                        {faqItems.map((item, i) => (
                            <div key={item.q} className={styles.faqItem} data-faq>
                                <h4 className={styles.faqHeading}>
                                    <button
                                        type="button"
                                        id={`ia-faq-q${i}`}
                                        className={styles.faqBtn}
                                        data-faq-btn
                                        aria-expanded="true"
                                        aria-controls={`ia-faq-a${i}`}
                                    >
                                        <span>{item.q}</span>
                                        <span className={styles.faqPlus} data-plus aria-hidden="true">
                                            <svg viewBox="0 0 16 16" fill="none">
                                                <path
                                                    d="M8 2.5v11M2.5 8h11"
                                                    stroke="currentColor"
                                                    strokeWidth="1.4"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </span>
                                    </button>
                                </h4>
                                {/* 1fr -> 0fr: the answer never leaves the DOM. */}
                                <div
                                    id={`ia-faq-a${i}`}
                                    role="region"
                                    aria-labelledby={`ia-faq-q${i}`}
                                    className={styles.faqPanel}
                                    data-faq-panel
                                >
                                    <div className={styles.faqPanelInner}>
                                        <p className={styles.faqAnswer}>{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The three offers you are not reading — one hairline each, the
                    row itself is the target. */}
                <div className={styles.others}>
                    <div className={styles.othersHead}>
                        <span className={styles.kicker}>{shared("siblings.title")}</span>
                        <Link className={styles.link} href="/services">
                            {shared("siblings.all")}
                            <Chevron/>
                        </Link>
                    </div>
                    <div className={styles.othersList}>
                        {OTHER_OFFERS.map((offer) => (
                            <Link key={offer.key} className={styles.othersRow} href={offer.href}>
                                <span className={styles.othersTitle}>{offers(`${offer.key}.title`)}</span>
                                <span className={styles.othersNote}>{offers(`${offer.key}.promise`)}</span>
                                <Chevron/>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={styles.cta}>
                    <div>
                        <h3 className={styles.ctaTitle}>{shared("ctaBand.title")}</h3>
                        <p className={styles.ctaText}>{shared("ctaBand.text")}</p>
                    </div>
                    <div className={styles.ctaActions}>
                        <Link className={`${styles.pill} ${styles.pillAccent}`} href="/contact">
                            {shared("ctaBand.button")}
                            <Chevron/>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Islands: the first collapses the accordion (HTML resting state is
                all open), the second drives --mx/--my on the bento. Neither
                renders markup, so nothing here depends on them running. */}
            <FaqAccordion/>
            <BentoSpotlight/>
        </section>
    );
};

export default IaOffreSection;
