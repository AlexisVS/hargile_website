"use client";

/* The four offers as editorial rows beside a sticky numeral spine — layout from
   examplesPages/exports/app/services/page.jsx, tokens from ours.

   Left column holds while the rows scroll under it: kicker, the numeral of the
   row currently at reading height, that row's title, and one line about how the
   four offers are meant to be read. The numeral is the only thing that moves,
   and it crossfades rather than counting.

   Display order is the sales order (web, ia, seo, mvp), not the alphabetical
   order of the message keys. Each row steps further right than the one above by
   its own irregular amount — the stagger is the composition, so the indents are
   data, not a formula.

   The reference makes the entire row one <a>, which would put the promise and
   the three deliverables inside the link text. Here the anchor is the title and
   its ::after stretches over the row instead: same single hit area and single
   focus stop, but the accessible name is just the offer. */

import {useMemo} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {useSpotlight} from "@/components/pages/services/v2/shared/useSpotlight";
import {useActiveRow} from "@/components/pages/services/v2/shared/useActiveRow";
import {mergeRefs} from "@/components/pages/services/v2/shared/merge-refs";
import spotlight from "@/components/pages/services/v2/shared/spotlight.module.scss";
import styles from "./offers-index.module.scss";

const OFFERS = [
    {key: "web", num: "01", href: "/services/applications-web", indent: "clamp(0px, 3.2vw, 60px)"},
    {key: "ia", num: "02", href: "/services/ia", indent: "clamp(0px, 6vw, 120px)"},
    {key: "seo", num: "03", href: "/services/seo", indent: "clamp(0px, 4vw, 80px)"},
    {key: "mvp", num: "04", href: "/services/mvp-30-jours", indent: "clamp(0px, 8vw, 164px)"},
];

const OffersIndex = () => {
    const t = useTranslations("pages.services.index");
    /* One observer for the section; each row gets its rank in the stagger. */
    const reveal = useReveal();
    const {activeIndex, registerRow} = useActiveRow();
    const active = OFFERS[activeIndex] ?? OFFERS[0];

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.layout}>
                    {/* aria-hidden: every word here is a restatement of the rows
                        beside it, and the numeral is decorative by definition. */}
                    <div className={styles.spine} aria-hidden="true">
                        <p className={styles.spineKicker}>{t("spine.kicker")}</p>
                        {/* key remounts the node, so the crossfade replays on change. */}
                        <span key={active.num} className={`${section.numXl} ${styles.spineNum}`}>
                            {active.num}
                        </span>
                        <p key={active.key} className={styles.spineLabel}>
                            {t(`offers.${active.key}.title`)}
                        </p>
                        <p className={styles.spineText}>{t("spine.text")}</p>
                    </div>

                    <div className={styles.rows}>
                        {OFFERS.map((offer, i) => (
                            <OfferRow
                                key={offer.key}
                                offer={offer}
                                index={i}
                                t={t}
                                revealProps={reveal(i)}
                                registerRow={registerRow}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* Own component so the spotlight hook is per row rather than per section. */
const OfferRow = ({offer, index, t, revealProps, registerRow}) => {
    const spotRef = useSpotlight();
    const {ref: revealRef, ...revealData} = revealProps;
    const setRow = useMemo(
        () => mergeRefs(revealRef, spotRef, registerRow),
        [revealRef, spotRef, registerRow],
    );

    return (
        <article
            ref={setRow}
            data-row-index={index}
            className={`${styles.row} ${spotlight.spot}`}
            style={{"--indent": offer.indent}}
            {...revealData}
        >
            <span className={styles.num} aria-hidden="true">{offer.num}</span>
            <div className={styles.main}>
                <h2 className={styles.title}>
                    <Link href={offer.href} className={styles.rowLink}>
                        {t(`offers.${offer.key}.title`)}
                    </Link>
                </h2>
                <p className={styles.promise}>{t(`offers.${offer.key}.promise`)}</p>
                <ul className={styles.deliverables}>
                    {t.raw(`offers.${offer.key}.deliverables`).map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
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
        </article>
    );
};

export default OffersIndex;
