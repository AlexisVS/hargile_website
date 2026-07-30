"use client";

/* The signature section of the web page: the three projects as short
   narratives, image and copy alternating sides. Facts only — sector, client,
   one factual sentence, link to the live site. */

import Image from "next/image";
import {useTranslations} from "next-intl";
import {projectsData} from "@/data/portfolio-data";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./case-studies.module.scss";

const CASES = [
    {key: "edb", id: 26},
    {key: "marquisette", id: 25},
    {key: "venizi", id: 23},
];

const CaseStudies = () => {
    const t = useTranslations("pages.services.detail.web.cases");
    const shared = useTranslations("pages.services.shared.proofCase");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <div className={styles.rows}>
                    {CASES.map(({key, id}, i) => {
                        const project = projectsData.find((p) => p.id === id);
                        return (
                            <article
                                key={key}
                                className={`${styles.row} ${i % 2 === 1 ? styles.rowFlip : ""}`}
                                {...reveal(1 + i)}
                            >
                                <div className={styles.copy}>
                                    <p className={styles.sector}>{t(`items.${key}.sector`)}</p>
                                    <h3 className={styles.client}>{t(`items.${key}.client`)}</h3>
                                    <p className={styles.text}>{t(`items.${key}.text`)}</p>
                                    <a
                                        className={styles.link}
                                        href={project.actionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {shared("linkLabel")}
                                        <span aria-hidden="true" className={styles.arrow}>&rarr;</span>
                                    </a>
                                </div>
                                <div className={styles.media}>
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 860px) 100vw, 44vw"
                                        className={styles.img}
                                    />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;
