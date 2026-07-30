"use client";

/* The three counters in the /services hero aside.

   The final value is what the server renders — the count-up only replaces the
   text once the element is in view, so a client that runs no JS (and every AI
   crawler) reads 30 / 22 / 4 rather than 0. Same subtract-never-add rule as
   useReveal. Reduced motion skips the animation entirely.

   Numbers are structural, not copy: 22 is the length of the portfolio the site
   already ships, 4 is OFFERS in offers-index.jsx, 30 is the MVP promise. Only
   the labels are translated. */

import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import styles from "./hero-stats.module.scss";

const STATS = [
    {key: "mvp", to: 30},
    {key: "projects", to: 22},
    {key: "offers", to: 4},
];

const DURATION = 900;

const HeroStats = () => {
    const t = useTranslations("pages.services.index.stats");

    return (
        <div className={styles.stats}>
            {STATS.map(({key, to}) => (
                <div key={key} className={styles.stat}>
                    <Counter to={to}/>
                    <span className={styles.label}>{t(key)}</span>
                </div>
            ))}
        </div>
    );
};

/* Writes textContent directly: the node never re-renders, so React and the
   animation are never fighting over the same text. */
const Counter = ({to}) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

        let frame = 0;
        const observer = new IntersectionObserver(([entry], obs) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();

            const start = performance.now();
            const step = (now) => {
                const p = Math.min(1, (now - start) / DURATION);
                el.textContent = String(Math.round(to * (1 - (1 - p) ** 3)));
                frame = p < 1 ? requestAnimationFrame(step) : 0;
            };
            frame = requestAnimationFrame(step);
        }, {threshold: 0.6});

        observer.observe(el);

        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
            /* Unmounting mid-count must not leave a partial number behind. */
            el.textContent = String(to);
        };
    }, [to]);

    return <span ref={ref} className={styles.value}>{to}</span>;
};

export default HeroStats;
