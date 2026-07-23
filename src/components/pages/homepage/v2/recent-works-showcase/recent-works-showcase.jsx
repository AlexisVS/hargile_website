"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {usePortfolioData} from "@/hooks/usePortfolioData";
import CtaLink from "@/components/ui/cta-link/cta-link";
import styles from "./recent-works-showcase.module.scss";

const PIN_BREAKPOINT = 900;

// Domaine nu pour la barre de navigateur factice des cartes.
const hostnameOf = (url) => new URL(url).hostname.replace(/^www\./, "");

const RecentWorksShowcaseV2 = () => {
    const t = useTranslations("pages.homepage.sections.recent-works");
    const {getLatestProjects} = usePortfolioData();
    const projects = getLatestProjects(3);
    const total = projects.length;

    const outerRef = useRef(null);
    const trackRef = useRef(null);
    const wrapRef = useRef(null);
    const pinnedRef = useRef(false);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const outer = outerRef.current;
        const track = trackRef.current;
        const wrap = wrapRef.current;
        if (!outer || !track || !wrap) return;

        const setProgress = (p) => {
            setActive(Math.min(total - 1, Math.max(0, Math.round(p * (total - 1)))));
        };

        // Hauteur de la section = 100vh + distance horizontale à parcourir.
        const layout = () => {
            pinnedRef.current = window.innerWidth >= PIN_BREAKPOINT;
            if (pinnedRef.current) {
                const dist = Math.max(0, track.scrollWidth - window.innerWidth);
                outer.style.height = `${window.innerHeight + dist}px`;
            } else {
                outer.style.height = "auto";
                track.style.transform = "none";
            }
        };

        // Le scroll vertical "consommé" par la section devient une translation X.
        const onScroll = () => {
            if (!pinnedRef.current) return;
            const dist = outer.offsetHeight - window.innerHeight;
            if (dist <= 0) return;
            const y = Math.min(Math.max(-outer.getBoundingClientRect().top, 0), dist);
            track.style.transform = `translateX(${-y}px)`;
            setProgress(y / dist);
        };

        // Mobile : progression basée sur le balayage natif.
        const onTrackScroll = () => {
            if (pinnedRef.current) return;
            const max = wrap.scrollWidth - wrap.clientWidth;
            if (max > 0) setProgress(wrap.scrollLeft / max);
        };

        const onResize = () => {
            layout();
            onScroll();
        };

        window.addEventListener("scroll", onScroll, {passive: true});
        window.addEventListener("resize", onResize);
        wrap.addEventListener("scroll", onTrackScroll, {passive: true});

        // Le rail change de largeur sans resize fenêtre (hot reload CSS,
        // chargement de police/images) : on recale la distance d'épinglage.
        const ro = new ResizeObserver(onResize);
        ro.observe(track);

        layout();
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            wrap.removeEventListener("scroll", onTrackScroll);
            ro.disconnect();
            outer.style.height = "";
        };
    }, [total]);

    return (
        <section id="recent-works" className={styles.work} ref={outerRef}>
            <div className={styles.sticky}>
                <div className={styles.head}>
                    <h2 className={styles.heading}>{t("title")}</h2>
                    <div className={styles.progress}>
                        {String(active + 1).padStart(2, "0")}
                        <span className={styles.progressTotal}>
                            /{String(total).padStart(2, "0")}
                        </span>
                    </div>
                </div>
                <div className={styles.trackWrap} ref={wrapRef}>
                    <div className={styles.track} ref={trackRef}>
                        {projects.map((project, i) => (
                            <article className={styles.card} key={project.id}>
                                <div className={styles.cardMedia}>
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 899px) 100vw, 46vw"
                                        priority={i === 0}
                                    />
                                    <span className={styles.domainChip} aria-hidden="true">
                                        {hostnameOf(project.actionUrl)}
                                    </span>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.eyebrow}>{project.subtitle}</div>
                                    <h3 className={styles.title}>{project.title}</h3>
                                    <p className={styles.desc}>{project.description}</p>
                                    <CtaLink
                                        href={project.actionUrl}
                                        external
                                        variant="ghost"
                                        size="sm"
                                        className={styles.more}
                                    >
                                        {project.actionText}
                                    </CtaLink>
                                </div>
                            </article>
                        ))}

                        <div className={styles.end}>
                            <CtaLink
                                href="https://portfolio.hargile.com/"
                                external
                                variant="primary"
                            >
                                {t("view-all")}
                            </CtaLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentWorksShowcaseV2;
