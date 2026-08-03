"use client";

/* Compact proof band on the services index: the three recent projects, each
   linking to its live site, plus the portfolio subdomain. Data from
   src/data/portfolio-data.js, copy from the pages.portfolio namespace the
   projects already own — no duplicated descriptions.

   Layout from examplesPages/exports: the heading and the portfolio link share
   one baseline-aligned row, and the three cards sit in an even grid inside
   hairline frames. The M5 offsets are gone with the reference layout; the ±4°
   pointer tilt stays, since it needs no asymmetry to make sense.

   The cell wrapper is not cosmetic. The reveal animation ends on
   `transform: none` with fill-mode both, which would win over the tilt rule for
   the rest of the page's life — so the revealed element and the transformed one
   have to be different nodes. */

import Image from "next/image";
import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import {projectsData} from "@/data/portfolio-data";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {useSpotlight} from "@/components/pages/services/v2/shared/useSpotlight";
import styles from "./proof-strip.module.scss";

const PROOF_IDS = [26, 25, 23]; // Ecole du Bonheur, La Marquisette, VENIZI
const PROJECTS = PROOF_IDS.map((id) => projectsData.find((p) => p.id === id));

const ProofStrip = () => {
    const t = useTranslations("pages.services.index.proof");
    const portfolioT = useTranslations("pages.portfolio");
    const reveal = useReveal();
    const spotRef = useSpotlight();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.head}>
                    <div {...reveal(0)}>
                        <p className={styles.label}>{t("label")}</p>
                        <h2 className={`${section.heading} ${styles.title}`}>{t("title")}</h2>
                    </div>
                    <div className={styles.headLink} {...reveal(1)}>
                        <CtaLink external href="https://portfolio.hargile.com/" variant="ghost" size="sm">
                            {t("linkLabel")}
                        </CtaLink>
                    </div>
                </div>
                <div className={styles.grid}>
                    {PROJECTS.map((project, i) => (
                        <div key={project.id} className={styles.cell} {...reveal(2 + i)}>
                            <a
                                ref={spotRef}
                                href={project.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.card}
                            >
                                <div className={styles.media}>
                                    <Image
                                        src={project.image}
                                        /* The client name alone described the
                                           card, not the image. These are site
                                           screenshots, so the alt says so and
                                           carries the sector the subtitle
                                           already names — same source, so it
                                           cannot drift from the caption. */
                                        alt={`${project.title} — ${portfolioT(project.subtitleKey)}`}
                                        fill
                                        sizes="(max-width: 720px) 100vw, 30vw"
                                        className={styles.img}
                                    />
                                </div>
                                <div className={styles.body}>
                                    <h3 className={styles.client}>{project.title}</h3>
                                    <p className={styles.subtitle}>{portfolioT(project.subtitleKey)}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProofStrip;
