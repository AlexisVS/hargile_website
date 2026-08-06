/* The whole body of /services/ia below the hero, in one Server Component:
   the four use cases as an asymmetric bento, the anti-hype counter-argument,
   the mini-FAQ and the sibling offers. The closing CTA is the shared CtaBand,
   mounted from page.jsx like every other service page mounts it: this file
   used to carry its own copy of that block, and the copy is what made the
   page read differently at the fold.

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
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import DataGuarantees from "./data-guarantees";
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

    return (
        <section className={section.section}>
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

                {/* Where the data goes. Ahead of the FAQ because on this page
                    it is the question that decides whether there is a project
                    at all, not a detail to check afterwards. */}
                <DataGuarantees locale={locale}/>

                {/* The FAQ every other service page mounts. It is a client
                    component inside this Server Component, which costs nothing
                    here: its answers ship in this page's first HTML response
                    all the same, and the collapse no longer has to open
                    everything and shut it after hydration. */}
                <div className={styles.faqBlock}>
                    <MiniFaq namespace="pages.services.detail.ia.faq" bare/>
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

            </div>

            {/* Island: drives --mx/--my on the bento. It renders no markup, so
                nothing here depends on it running. */}
            <BentoSpotlight/>
        </section>
    );
};

export default IaOffreSection;
