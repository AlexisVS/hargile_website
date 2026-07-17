"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {useTranslations} from "next-intl";
import {usePortfolioData} from "@/hooks/usePortfolioData";
import section from "../v2-section.module.scss";
import styles from "./recent-works-showcase.module.scss";
import {useReveal} from "../useReveal";

const AUTO_ADVANCE_MS = 6000;

const RecentWorksShowcaseV2 = () => {
    const t = useTranslations("pages.homepage.sections.recent-works");
    const {getLatestProjects} = usePortfolioData();
    const projects = getLatestProjects(4);
    const reveal = useReveal();
    const reducedMotion = useReducedMotion();

    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (reducedMotion || paused) return;
        const id = setInterval(
            () => setActive((a) => (a + 1) % projects.length),
            AUTO_ADVANCE_MS,
        );
        return () => clearInterval(id);
    }, [reducedMotion, paused, projects.length]);

    const project = projects[active];

    return (
        <section id="recent-works" className={section.section}>
            <div className={section.container}>
                <motion.h2 className={section.heading} {...reveal(0)}>
                    {t("title")}
                </motion.h2>

                <motion.div
                    className={styles.stage}
                    {...reveal(1)}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocusCapture={() => setPaused(true)}
                    onBlurCapture={() => setPaused(false)}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={project.id}
                            className={styles.stageImage}
                            initial={{opacity: 0, scale: reducedMotion ? 1 : 1.04}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.7, ease: "easeOut"}}
                        >
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 1200px) 100vw, 1120px"
                                priority={active === 0}
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className={styles.stageScrim} aria-hidden="true"/>

                    <div className={styles.stageContent}>
                        <div className={styles.stageIndex}>
                            {String(active + 1).padStart(2, "0")}
                            <span className={styles.stageIndexTotal}>
                                /{String(projects.length).padStart(2, "0")}
                            </span>
                        </div>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={project.id}
                                initial={{opacity: 0, y: reducedMotion ? 0 : 18}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: reducedMotion ? 0 : -10}}
                                transition={{duration: 0.45, ease: "easeOut"}}
                            >
                                <div className={styles.stageSub}>{project.subtitle}</div>
                                <h3 className={styles.stageTitle}>{project.title}</h3>
                                <p className={styles.stageDesc}>{project.description}</p>
                                <div className={styles.stageCtas}>
                                    <a
                                        href={project.actionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.ctaPrimary}
                                    >
                                        {project.actionText} →
                                    </a>
                                    <a
                                        href="https://portfolio.hargile.be/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.ctaGhost}
                                    >
                                        {t("view-all")} →
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div className={styles.rail} {...reveal(2)}>
                    {projects.map((p, i) => (
                        <button
                            key={p.id}
                            type="button"
                            className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
                            onClick={() => setActive(i)}
                            aria-pressed={i === active}
                            aria-label={p.title}
                        >
                            <span className={styles.thumbImage}>
                                <Image
                                    src={p.image}
                                    alt=""
                                    fill
                                    sizes="180px"
                                />
                            </span>
                            <span className={styles.thumbBar} aria-hidden="true"/>
                        </button>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default RecentWorksShowcaseV2;
