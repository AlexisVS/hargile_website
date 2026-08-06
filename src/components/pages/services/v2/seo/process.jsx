"use client";

/* Les quatre étapes, sur le rail animé de la homepage.
 *
 * V2, 06/08/2026 (choix de Mihai) : remplace quatre colonnes à filet haut. Le
 * traitement vient de homepage/v2/mvp-promo — rail qui se remplit au scroll,
 * points qui s'allument quand le front du remplissage les atteint. Même
 * mécanique, quatre étapes au lieu de trois.
 *
 * ── POURQUOI LE RAIL EST LÉGITIME ICI ────────────────────────────────────
 * Un rail affirme un ordre. Audit → technique → contenu → mesure en est un
 * vrai : rien ne se corrige avant l'état des lieux, rien ne se mesure avant
 * d'exister. C'est aussi la seule section de cette page où l'ordre est réel —
 * les quatre livrables de /services/applications-web ont perdu leurs numéros
 * pour la raison inverse (web/deliverables.jsx). Les numéraux restent donc, et
 * ils prennent la place que la homepage donne au libellé de semaine.
 *
 * ── LE RAIL EST LE MOMENT SIGNATURE DE LA PAGE ───────────────────────────
 * Budget de mouvement : un seul par page (docs/m5-immersive-design-concepts.md
 * §0.3). C'est celui-ci. Le compteur des scores plus bas est une île déjà
 * admise ailleurs sur le site ; rien d'autre ne doit bouger sur /services/seo.
 *
 * Le rail passe à la verticale sous 1100px, et non 640px comme sur la
 * homepage : à quatre colonnes, la fenêtre où la grille se replie en deux
 * rangs laisserait le rail horizontal flotter au-dessus d'un second rang qui
 * ne le touche pas. Le seuil doit rester synchronisé avec le @media de
 * process.module.scss. */

import {useEffect, useRef, useState} from "react";
import {motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform} from "motion/react";
import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./process.module.scss";

const STEPS = [
    {key: "audit", num: "01"},
    {key: "tech", num: "02"},
    {key: "content", num: "03"},
    {key: "measure", num: "04"},
];

/* Doit correspondre au @media de process.module.scss. */
const useVerticalRail = () => {
    const [vertical, setVertical] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1100px)");
        const sync = () => setVertical(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return vertical;
};

const Step = ({step, i, fill, reveal, t}) => {
    /* Où le front du remplissage atteint ce point : les points sont au départ
       de chacune des quatre pistes égales, en grille comme en colonne. */
    const at = i / STEPS.length;
    const ignite = useTransform(fill, [at, at + 0.1], [0, 1]);
    const dotOpacity = useTransform(ignite, [0, 1], [0.25, 1]);
    const dotScale = useTransform(ignite, [0, 1], [0.6, 1]);
    const numOpacity = useTransform(ignite, [0, 1], [0.4, 1]);

    return (
        <div className={styles.step} {...reveal(1 + i)}>
            <motion.div className={styles.dot} style={{opacity: dotOpacity, scale: dotScale}}/>
            <div className={styles.stepBody}>
                {/* aria-hidden : l'ordre est déjà porté par l'ordre du DOM. */}
                <motion.div className={styles.num} style={{opacity: numOpacity}} aria-hidden="true">
                    {step.num}
                </motion.div>
                <h3 className={`${section.blockHeading} ${styles.stepTitle}`}>{t(`steps.${step.key}.title`)}</h3>
                <p className={styles.stepText}>{t(`steps.${step.key}.text`)}</p>
            </div>
        </div>
    );
};

const Process = () => {
    const t = useTranslations("pages.services.detail.seo.process");
    const reveal = useReveal();
    const reducedMotion = useReducedMotion();
    const vertical = useVerticalRail();
    const timelineRef = useRef(null);

    /* Le rail se remplit pendant que la section traverse l'écran : il démarre
       quand son haut dégage le bas de la fenêtre et se termine un peu après le
       centre — les quatre étapes « se passent » en un seul geste de scroll. */
    const {scrollYProgress} = useScroll({
        target: timelineRef,
        offset: ["start 0.85", "end 0.5"],
    });
    const fillSpring = useSpring(scrollYProgress, {stiffness: 90, damping: 24, mass: 0.4});
    /* Mouvement réduit : la timeline est simplement complète. Reste une
       MotionValue pour que les useTransform de <Step> marchent à l'identique. */
    const staticFull = useMotionValue(1);
    const fill = reducedMotion ? staticFull : fillSpring;

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>

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
            </div>
        </section>
    );
};

export default Process;
