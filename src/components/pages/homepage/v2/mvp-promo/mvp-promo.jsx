"use client";

import {useEffect, useRef, useState} from "react";
import {motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform} from "motion/react";
import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import section from "../v2-section.module.scss";
import styles from "./mvp-promo.module.scss";
import {useReveal} from "../useReveal";

const STEPS = [
    {key: "scope", num: "01"},
    {key: "build", num: "02"},
    {key: "launch", num: "03"},
];

/* Below this the steps stack and the rail runs vertically through their dots —
   must match the @media in mvp-promo.module.scss. */
const useVerticalRail = () => {
    const [vertical, setVertical] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)");
        const sync = () => setVertical(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return vertical;
};

const Step = ({step, i, fill, reveal, t}) => {
    // Where the fill front reaches this step's dot along the rail: dots sit at
    // the start of each of the three equal tracks, both in the desktop grid and
    // in the stacked mobile column.
    const at = i / STEPS.length;
    const ignite = useTransform(fill, [at, at + 0.12], [0, 1]);
    const dotOpacity = useTransform(ignite, [0, 1], [0.25, 1]);
    const dotScale = useTransform(ignite, [0, 1], [0.6, 1]);
    const weekOpacity = useTransform(ignite, [0, 1], [0.45, 1]);

    return (
        <motion.div className={styles.step} {...reveal(i)}>
            <motion.div className={styles.dot} style={{opacity: dotOpacity, scale: dotScale}}/>
            <div className={styles.ghostNum} aria-hidden="true">{step.num}</div>
            <div className={styles.stepBody}>
                <motion.div className={styles.week} style={{opacity: weekOpacity}}>
                    {t(`steps.${step.key}.week`)}
                </motion.div>
                <h3 className={styles.stepTitle}>{t(`steps.${step.key}.title`)}</h3>
                <p className={styles.stepText}>{t(`steps.${step.key}.text`)}</p>
            </div>
        </motion.div>
    );
};

const MvpPromoV2 = () => {
    const t = useTranslations("pages.homepage.sections.mvp-promo");
    const reveal = useReveal();
    const reducedMotion = useReducedMotion();
    const vertical = useVerticalRail();
    const timelineRef = useRef(null);

    // The rail fills as the timeline crosses the viewport: starts when its top
    // clears the lower part of the screen, completes a little past centre — so
    // the whole month "happens" during one natural scroll gesture.
    const {scrollYProgress} = useScroll({
        target: timelineRef,
        offset: ["start 0.85", "end 0.5"],
    });
    const fillSpring = useSpring(scrollYProgress, {stiffness: 90, damping: 24, mass: 0.4});
    // Reduced motion: the timeline just sits complete. Kept as a MotionValue so
    // the useTransform chains in <Step> work the same either way.
    const staticFull = useMotionValue(1);
    const fill = reducedMotion ? staticFull : fillSpring;

    return (
        <section className={section.section}>
            <div className={section.container}>
                <motion.h2 className={section.heading} {...reveal(0)}>
                    {t("title")} <span className={styles.accent}>{t("titleAccent")}</span>
                </motion.h2>
                <motion.p className={section.lead} style={{maxWidth: "56ch"}} {...reveal(1)}>
                    {t("lead")}
                </motion.p>

                <div className={styles.timeline} ref={timelineRef}>
                    <div className={styles.rail} aria-hidden="true">
                        <motion.div
                            className={styles.railFill}
                            style={
                                vertical
                                    ? {scaleY: fill, transformOrigin: "top"}
                                    : {scaleX: fill, transformOrigin: "left"}
                            }
                        />
                    </div>
                    <div className={styles.steps}>
                        {STEPS.map((step, i) => (
                            <Step key={step.key} step={step} i={i} fill={fill} reveal={reveal} t={t}/>
                        ))}
                    </div>
                </div>

                <motion.div className={styles.ctaWrap} {...reveal(3)}>
                    <CtaLink href="/contact" variant="primary">
                        {t("cta")}
                    </CtaLink>
                </motion.div>
            </div>
        </section>
    );
};

export default MvpPromoV2;
