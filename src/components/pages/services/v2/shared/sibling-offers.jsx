"use client";

/* The three offers you are NOT reading, plus the way back to the index.

   Without this a detail page is a dead end: the four offers only ever linked
   downward from /services, so moving between two of them meant the browser's
   back button. That is a navigation problem first — a visitor comparing two
   offers is the most interesting visitor on the site — and an internal-linking
   problem second: the four pages sat on a single inbound link each, from one
   hub, with nothing between siblings.

   Named by the offer, not "read more": the link text IS the crawlable signal,
   so it reuses the index's own offer titles (pages.services.index.offers.*)
   rather than restating them. One copy of that string, in one place.

   `current` is the key to leave out. Passing the wrong one shows four rows
   including the page you are on — visible immediately, which is why this takes
   a key rather than reading the route. */

import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./sibling-offers.module.scss";

/* Same order and same hrefs as offers-index.jsx — sales order, which is also
   the ItemList order in build-json-ld.js. Change one, change the others. */
/* HARG-302: GEO + SEO. */
const OFFERS = [
    {key: "geo", href: "/services/seo"},
    {key: "seo", href: "/services/seo"},
];

const SiblingOffers = ({current}) => {
    const t = useTranslations("pages.services.shared.siblings");
    /* The offer names live with the index, which is the page that owns them. */
    const offers = useTranslations("pages.services.index");
    const reveal = useReveal();

    const others = OFFERS.filter((offer) => offer.key !== current);

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.head} {...reveal(0)}>
                    <h2 className={section.heading}>{t("title")}</h2>
                    {/* The same "see all" action the mini-FAQ puts next to its
                        own heading, so it gets the same pill. It used to be a
                        bare text link here and a ghost pill there, two shapes
                        for one job on the same page. */}
                    <CtaLink href="/services" variant="ghost" size="sm">
                        {t("all")}
                    </CtaLink>
                </div>

                <ul className={styles.list}>
                    {others.map((offer, i) => (
                        <li key={offer.key} {...reveal(i + 1)}>
                            {/* One anchor per row: the whole row is the hit area
                                and the accessible name stays the offer title. */}
                            <Link href={offer.href} className={styles.row}>
                                <span className={`${section.blockHeading} ${styles.name}`}>
                                    {offers(`offers.${offer.key}.title`)}
                                </span>
                                <span className={styles.promise}>
                                    {offers(`offers.${offer.key}.promise`)}
                                </span>
                                <Chevron/>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

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

export default SiblingOffers;
