"use client";

/* One-project proof band for a service page: label, client, one factual
   sentence, link to the live site, portfolio image. Data (url, image) comes
   from src/data/portfolio-data.js via the page; the sentence comes from the
   page's messages ("proofCase.text"). */

import Image from "next/image";
import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./proof-case.module.scss";

/**
 * namespace: the detail page subtree, e.g. "pages.services.detail.seo"
 * project: {title, actionUrl, image} — an entry from projectsData
 */
const ProofCase = ({namespace, project}) => {
    const t = useTranslations(namespace);
    const shared = useTranslations("pages.services.shared.proofCase");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.band}>
                    <div className={styles.copy}>
                        <p className={styles.label} {...reveal(0)}>{shared("label")}</p>
                        <h2 className={styles.client} {...reveal(1)}>{project.title}</h2>
                        <p className={styles.text} {...reveal(2)}>{t("proofCase.text")}</p>
                        <a
                            className={styles.link}
                            href={project.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...reveal(3)}
                        >
                            {shared("linkLabel")}
                            <span aria-hidden="true" className={styles.arrow}>&rarr;</span>
                        </a>
                    </div>
                    <div className={styles.media} {...reveal(2)}>
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 860px) 100vw, 46vw"
                            className={styles.img}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProofCase;
