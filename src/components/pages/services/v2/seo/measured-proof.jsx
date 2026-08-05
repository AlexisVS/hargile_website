"use client";

/* The scores, right after MetaProof claims them.
 *
 * MetaProof says "this page is the demonstration — view the source". This is
 * the same argument with the tool's own numbers attached, so the claim stops
 * being a claim. Every figure comes from src/data/site-metrics.js, measured on
 * the live page; the measurement date is printed so nobody has to trust that
 * it is current.
 *
 * The LCP row is above its target and is shown that way. That is the whole
 * reason the vitals block exists: four perfect gauges read as marketing, and
 * this page ends on a section about what we refuse to promise. A miss we
 * publish ourselves is worth more than a score we curate.
 *
 * Arcs are static — the count-up on the numbers is the one moving part, the
 * same island /services and the mvp scope section already use. */

import {useLocale, useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import CountUp from "@/components/pages/services/v2/shared/count-up";
import {LIGHTHOUSE, SCORES, VITALS} from "@/data/site-metrics";
import styles from "./measured-proof.module.scss";

const R = 30;
const CIRC = 2 * Math.PI * R;

/* The target tick sits at a fixed point on every track, so three different
   scales stay comparable at a glance: left of the tick is inside budget. */
const TARGET_X = 62;
const MAX_X = 100;

const MeasuredProof = () => {
    const t = useTranslations("pages.services.detail.seo.measured");
    const locale = useLocale();
    const reveal = useReveal();

    const nf = (value, decimals) =>
        new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);

    const measuredOn = new Intl.DateTimeFormat(locale, {
        day: "numeric", month: "long", year: "numeric",
    }).format(new Date(`${LIGHTHOUSE.measuredOn}T12:00:00Z`));

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>
                    {t("lead", {date: measuredOn, tool: LIGHTHOUSE.tool})}
                </p>

                <div className={styles.gauges}>
                    {SCORES.map(({key, value}, i) => (
                        <div key={key} className={styles.gauge} {...reveal(2 + i)}>
                            <svg className={styles.dial} viewBox="0 0 80 80" aria-hidden="true">
                                <circle cx="40" cy="40" r={R} className={styles.track}/>
                                <circle
                                    cx="40" cy="40" r={R}
                                    className={styles.arc}
                                    transform="rotate(-90 40 40)"
                                    strokeDasharray={`${(CIRC * value) / 100} ${CIRC}`}
                                />
                            </svg>
                            <span className={styles.score}>
                                <CountUp to={value}/>
                            </span>
                            <span className={styles.scoreLabel}>{t(`scores.${key}`)}</span>
                        </div>
                    ))}
                </div>

                <span
                    className={`${styles.rule} ${revealStyles.hairline}`}
                    aria-hidden="true"
                    {...reveal(6)}
                />

                <div className={styles.vitals} {...reveal(7)}>
                    {VITALS.map(({key, value, target, unit, decimals, over}) => {
                        const width = Math.min(
                            MAX_X,
                            target ? (value / target) * TARGET_X : 0
                        );
                        return (
                            <div key={key} className={styles.vital} data-over={over ? "1" : undefined}>
                                <span className={styles.vitalLabel}>{t(`vitals.${key}`)}</span>
                                <span className={styles.vitalTrack} aria-hidden="true">
                                    <span className={styles.vitalFill} style={{width: `${width}%`}}/>
                                    <span className={styles.vitalTick} style={{left: `${TARGET_X}%`}}/>
                                </span>
                                <span className={styles.vitalValue}>
                                    {nf(value, decimals)}{unit ? ` ${unit}` : ""}
                                </span>
                                <span className={styles.vitalTarget}>
                                    {t("targetLabel", {value: `${nf(target, decimals)}${unit ? ` ${unit}` : ""}`})}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <p className={styles.note} {...reveal(8)}>{t("note")}</p>
            </div>
        </section>
    );
};

export default MeasuredProof;
