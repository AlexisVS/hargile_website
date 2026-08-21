"use client";

/* The three counters in the /services hero aside.

   The count-up itself lives in shared/count-up.jsx — same component the mvp
   scope section uses, so the two never drift apart.

   Numbers are structural, not copy: 22 is the length of the portfolio the site
   already ships, 2 is OFFERS in offers-index.jsx. Only the labels are
   translated. */

import {useTranslations} from "next-intl";
import CountUp from "@/components/pages/services/v2/shared/count-up";
import styles from "./hero-stats.module.scss";

const STATS = [
    {key: "projects", to: 22},
    {key: "offers", to: 2},
];

const HeroStats = () => {
    const t = useTranslations("pages.services.index.stats");

    return (
        <div className={styles.stats}>
            {STATS.map(({key, to}) => (
                <div key={key} className={styles.stat}>
                    <CountUp to={to} className={styles.value}/>
                    <span className={styles.label}>{t(key)}</span>
                </div>
            ))}
        </div>
    );
};

export default HeroStats;
