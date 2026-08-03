"use client";

/* The four offers as a full-width 2×2 grid of square cells.

   This replaces the sticky-spine layout. That version held a left column that
   crossfaded the numeral and the title of whichever row was at reading height
   — which meant the words "Solutions IA" sat 40px from a row whose heading was
   "Solutions IA". The column restated its neighbour, and with the numerals gone
   it had nothing left of its own to say. The section header says the one thing
   the rows do not (how the four are meant to be read) and then gets out of the
   way.

   Square, because that is the site's own geometry — the wave grid behind the
   hero is a field of squares, and four equal cells echo it without drawing a
   single line. Nothing is fenced and nothing is filled: the cells are told
   apart by the gap, and the only surface that ever lights up is the shared
   spotlight following the pointer.

   The anchor is the title and its ::after stretches over the cell: one hit
   area, one focus stop, and the accessible name stays the offer. */

import {useMemo} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {useSpotlight} from "@/components/pages/services/v2/shared/useSpotlight";
import {mergeRefs} from "@/components/pages/services/v2/shared/merge-refs";
import spotlight from "@/components/pages/services/v2/shared/spotlight.module.scss";
import styles from "./offers-index.module.scss";

/* Sales order, not the alphabetical order of the message keys. Reading order
   is left-to-right then down, so this is also the ItemList order published in
   build-json-ld.js — change one and change the other. */
const OFFERS = [
    {key: "web", href: "/services/applications-web"},
    {key: "ia", href: "/services/ia"},
    {key: "seo", href: "/services/seo"},
    {key: "mvp", href: "/services/mvp-30-jours"},
];

const OffersIndex = () => {
    const t = useTranslations("pages.services.index");
    /* One observer for the section; the header takes 0 and each cell its rank. */
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                {/* Not aria-hidden, unlike the spine it replaces: that column
                    was a restatement of the rows, this is the only place the
                    page says how the four relate to each other. */}
                <div className={styles.head} {...reveal(0)}>
                    <p className={styles.kicker}>{t("spine.kicker")}</p>
                    <p className={styles.lead}>{t("spine.text")}</p>
                </div>

                <div className={styles.grid}>
                    {OFFERS.map((offer, i) => (
                        <OfferCell
                            key={offer.key}
                            offer={offer}
                            t={t}
                            revealProps={reveal(i + 1)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

/* Own component so the spotlight hook is per cell rather than per section. */
const OfferCell = ({offer, t, revealProps}) => {
    const spotRef = useSpotlight();
    const {ref: revealRef, ...revealData} = revealProps;
    const setCell = useMemo(() => mergeRefs(revealRef, spotRef), [revealRef, spotRef]);

    return (
        <article ref={setCell} className={`${styles.cell} ${spotlight.spot}`} {...revealData}>
            <h2 className={styles.title}>
                <Link href={offer.href} className={styles.cellLink}>
                    {t(`offers.${offer.key}.title`)}
                </Link>
            </h2>
            <p className={styles.promise}>{t(`offers.${offer.key}.promise`)}</p>
            <ul className={styles.deliverables}>
                {t.raw(`offers.${offer.key}.deliverables`).map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
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
