"use client";

/* The four offers as typographic bands.

   This replaces the 2×2 grid of square cells, which replaced the sticky spine.
   The grid gave the four offers equal weight but also equal voice: four boxes
   of the same size, each with a title sized to fit its quarter of the page.
   The name of the offer is the only thing on this page a reader is actually
   scanning for, so here it takes the full measure — one offer per band, the
   name across the container, the promise whispering in the margin.

   Nothing is fenced and nothing is filled: the bands are told apart by a single
   hairline each, and the only thing that moves under the pointer is the
   chevron. The names drift horizontally with the scroll (useScrollDrift) — the
   page's one scroll-linked gesture, and it stops the moment the reader does.

   Bands alternate side: odd names sit left with their promise pushed right,
   even names mirror. Below 768px the mirror is dropped — a right-aligned name
   on a phone reads as a mistake, not a rhythm.

   The anchor is the title and its ::after stretches over the band: one hit
   area, one focus stop, and the accessible name stays the offer. */

import {useMemo} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {useScrollDrift} from "@/components/pages/services/v2/shared/useScrollDrift";
import styles from "./offers-index.module.scss";

/* Sales order, not the alphabetical order of the message keys. This is now also
   the reading order top-to-bottom, and the ItemList order published in
   build-json-ld.js — change one and change the other. */
/* HARG-302: GEO + SEO. Both route to /services/seo for now. */
const OFFERS = [
    {key: "geo", href: "/services/seo"},
    {key: "seo", href: "/services/seo"},
];

const OffersIndex = () => {
    const t = useTranslations("pages.services.index");
    /* One observer for the section; the header takes 0 and each band its rank. */
    const reveal = useReveal();
    /* One rAF for the section; the names read their direction off data-drift. */
    const drift = useScrollDrift();

    return (
        <section className={section.section}>
            <div className={section.container}>
                {/* The one thing the bands do not say: how the four relate to
                    each other. */}
                <div className={styles.head} {...reveal(0)}>
                    <p className={styles.kicker}>{t("spine.kicker")}</p>
                    <p className={styles.lead}>{t("spine.text")}</p>
                </div>

                <div className={styles.bands} ref={drift}>
                    {OFFERS.map((offer, i) => (
                        <OfferBand
                            key={offer.key}
                            offer={offer}
                            rank={i}
                            t={t}
                            revealProps={reveal(i + 1)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const OfferBand = ({offer, rank, t, revealProps}) => {
    /* Even ranks (01, 03) run left and drift right; odd ranks mirror. */
    const mirrored = rank % 2 === 1;
    const deliverables = useMemo(
        () => t.raw(`offers.${offer.key}.deliverables`),
        [t, offer.key],
    );

    return (
        <article
            className={`${styles.band} ${mirrored ? styles.mirror : ""}`}
            {...revealProps}
        >
            {/* The drift lives on the inner span, never on the h2 or the
                anchor: a transform makes an element the containing block for
                its absolute descendants, and the anchor's stretched ::after
                would collapse onto the name instead of the band. */}
            <h2 className={styles.name}>
                <Link href={offer.href} className={styles.bandLink}>
                    <span className={styles.drift} data-drift={mirrored ? "left" : "right"}>
                        {t(`offers.${offer.key}.title`)}
                    </span>
                </Link>
            </h2>

            <div className={styles.aside}>
                <p className={styles.promise}>{t(`offers.${offer.key}.promise`)}</p>
                <ul className={styles.deliverables}>
                    {deliverables.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        </article>
    );
};

export default OffersIndex;
