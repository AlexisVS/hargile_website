"use client";

/* Compact proof band on the services index: the three recent projects, each
   linking to its live site, plus the portfolio subdomain. Data from
   src/data/portfolio-data.js, copy from the pages.portfolio namespace the
   projects already own — no duplicated descriptions. */

import Image from "next/image";
import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import {projectsData} from "@/data/portfolio-data";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./proof-strip.module.scss";

const PROOF_IDS = [26, 25, 23]; // Ecole du Bonheur, La Marquisette, VENIZI
const PROJECTS = PROOF_IDS.map((id) => projectsData.find((p) => p.id === id));

const ProofStrip = () => {
    const t = useTranslations("pages.services.index.proof");
    const portfolioT = useTranslations("pages.portfolio");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <p className={styles.label} {...reveal(0)}>{t("label")}</p>
                <h2 className={section.heading} {...reveal(1)}>{t("title")}</h2>
                <div className={styles.grid}>
                    {PROJECTS.map((project, i) => (
                        <a
                            key={project.id}
                            href={project.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                            {...reveal(2 + i)}
                        >
                            <div className={styles.media}>
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 720px) 100vw, 30vw"
                                    className={styles.img}
                                />
                            </div>
                            <h3 className={styles.client}>{project.title}</h3>
                            <p className={styles.subtitle}>{portfolioT(project.subtitleKey)}</p>
                        </a>
                    ))}
                </div>
                <div className={styles.allWrap} {...reveal(5)}>
                    <CtaLink external href="https://portfolio.hargile.com/" variant="ghost" size="sm">
                        {t("linkLabel")}
                    </CtaLink>
                </div>
            </div>
        </section>
    );
};

export default ProofStrip;
