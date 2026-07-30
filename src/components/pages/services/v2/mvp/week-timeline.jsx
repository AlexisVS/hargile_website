"use client";

/* The 30 days as a vertical week-by-week timeline — deliberately distinct
   from the homepage's horizontal three-step rail (same offer, deeper cut:
   deliverables per week). The spine fills with scroll progress, one natural
   gesture for the whole month — scroll-linked, never looping. */

import {useRef} from "react";
import {motion, useMotionValue, useReducedMotion, useScroll, useSpring} from "motion/react";
import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./week-timeline.module.scss";

const WEEKS = ["w1", "w23", "w4"];

const WeekTimeline = () => {
    const t = useTranslations("pages.services.detail.mvp.timeline");
    const reveal = useReveal();
    const reducedMotion = useReducedMotion();
    const timelineRef = useRef(null);

    const {scrollYProgress} = useScroll({
        target: timelineRef,
        offset: ["start 0.8", "end 0.55"],
    });
    const fillSpring = useSpring(scrollYProgress, {stiffness: 90, damping: 24, mass: 0.4});
    // Reduced motion: the month just sits complete.
    const staticFull = useMotionValue(1);
    const fill = reducedMotion ? staticFull : fillSpring;

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <div className={styles.timeline} ref={timelineRef}>
                    <div className={styles.spine} aria-hidden="true">
                        <motion.div
                            className={styles.spineFill}
                            style={{scaleY: fill, transformOrigin: "top"}}
                        />
                    </div>
                    <ol className={styles.weeks}>
                        {WEEKS.map((week, i) => (
                            <li key={week} className={styles.week} {...reveal(i + 1)}>
                                <span className={styles.dot} aria-hidden="true"/>
                                <p className={styles.label}>{t(`weeks.${week}.label`)}</p>
                                <h3 className={styles.weekTitle}>{t(`weeks.${week}.title`)}</h3>
                                <p className={styles.weekText}>{t(`weeks.${week}.text`)}</p>
                                <ul className={styles.deliverables}>
                                    {t.raw(`weeks.${week}.deliverables`).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
};

export default WeekTimeline;
