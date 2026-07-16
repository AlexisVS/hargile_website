"use client";

import {useState} from "react";
import Image from "next/image";
import {motion} from "motion/react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {usePortfolioData} from "@/hooks/usePortfolioData";
import section from "../v2-section.module.scss";
import styles from "./recent-works.module.scss";
import {useReveal} from "../useReveal";

// Stack transforms for the deck, by visual position (0 = front)
const STACK_TF = [
    "none",
    "translate(26px,-22px) rotate(2.5deg) scale(.96)",
    "translate(-26px,-40px) rotate(-3.5deg) scale(.92)",
];

const RecentWorksV2 = () => {
    const t = useTranslations("pages.homepage.sections.recent-works");
    const {getLatestProjects} = usePortfolioData();
    const projects = getLatestProjects(3);
    const reveal = useReveal();

    // order[0] is the front card
    const [order, setOrder] = useState(projects.map((_, i) => i));

    const bringToFront = (i) =>
        setOrder((o) => [i, ...o.filter((n) => n !== i)]);
    const advance = () => setOrder((o) => [...o.slice(1), o[0]]);

    const active = order[0];
    const activeProject = projects[active];

    return (
        <section id="recent-works" className={section.section}>
            <div className={section.container}>
                <motion.h2 className={section.heading} {...reveal(0)}>
                    {t("title")}
                </motion.h2>

                <div className={styles.layout}>
                    {/* Card deck */}
                    <div className={styles.deck}>
                        {projects.map((project, i) => {
                            const pos = order.indexOf(i);
                            const isFront = pos === 0;
                            return (
                                <div
                                    key={project.id}
                                    className={styles.card}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={
                                        (isFront ? t("deck.next") : t("deck.show")) + " — " + project.title
                                    }
                                    onClick={() => (isFront ? advance() : bringToFront(i))}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            isFront ? advance() : bringToFront(i);
                                        }
                                    }}
                                    style={{
                                        transform: STACK_TF[pos] || STACK_TF[2],
                                        zIndex: 10 - pos,
                                        filter: isFront ? "none" : `brightness(${1 - pos * 0.28})`,
                                    }}
                                >
                                    <div className={styles.cardImage}>
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 640px) 90vw, 560px"
                                        />
                                    </div>
                                    <div className={styles.cardBar}>
                                        <div className={styles.cardTitle}>{project.title}</div>
                                        <div className={styles.cardSub}>{project.subtitle}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Panel: tabs + description + CTAs */}
                    <div className={styles.panel}>
                        <div className={styles.tabs}>
                            {projects.map((project, i) => (
                                <button
                                    key={project.id}
                                    type="button"
                                    className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
                                    onClick={() => bringToFront(i)}
                                    aria-pressed={i === active}
                                >
                                    <span className={styles.tabDot}/>
                                    <span>
                                        <span className={styles.tabTitle}>{project.title}</span>
                                        <span className={styles.tabSub}>{project.subtitle}</span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <p className={styles.desc}>{activeProject?.description}</p>

                        <div className={styles.ctaRow}>
                            <a
                                href={activeProject?.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaPrimary}
                            >
                                {activeProject?.actionText} →
                            </a>
                            <Link href="/portfolio" className={styles.ctaGhost}>
                                {t("view-all")} →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentWorksV2;
