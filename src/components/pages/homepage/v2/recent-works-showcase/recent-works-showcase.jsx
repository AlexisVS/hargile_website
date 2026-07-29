"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {usePortfolioData} from "@/hooks/usePortfolioData";
import CtaLink from "@/components/ui/cta-link/cta-link";
import styles from "./recent-works-showcase.module.scss";

const PIN_BREAKPOINT = 900;

// Domaine nu pour la barre de navigateur factice des cartes. Gardé : `new URL`
// throw sur une URL relative ou vide, et ça s'exécute pendant le render — une
// actionUrl mal formée ajoutée dans portfolio-data.js blanchirait la homepage
// entière pour une puce décorative. Chaîne vide = pas de puce.
const hostnameOf = (url) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
};

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

        // Géométrie cachée par layout() : lire offsetHeight/getBoundingClientRect
        // dans onScroll forçait deux reflows par frame de scroll.
        let pinDist = 0;
        let outerTop = 0;

        // Hauteur de la section = 100vh + distance horizontale à parcourir.
        const layout = () => {
            pinnedRef.current = window.innerWidth >= PIN_BREAKPOINT;
            if (pinnedRef.current) {
                pinDist = Math.max(0, track.scrollWidth - window.innerWidth);
                outer.style.height = `${window.innerHeight + pinDist}px`;
            } else {
                pinDist = 0;
                outer.style.height = "auto";
                track.style.transform = "none";
            }
            outerTop = outer.getBoundingClientRect().top + window.scrollY;
        };

        // Le scroll vertical "consommé" par la section devient une translation X.
        const onScroll = () => {
            if (!pinnedRef.current || pinDist <= 0) return;
            const y = Math.min(Math.max(window.scrollY - outerTop, 0), pinDist);
            track.style.transform = `translateX(${-y}px)`;
            setProgress(y / pinDist);
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
        // body aussi : outerTop est caché, donc tout changement de hauteur du
        // contenu au-dessus de la section doit déclencher un re-layout.
        const ro = new ResizeObserver(onResize);
        ro.observe(track);
        ro.observe(document.body);

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
                        {projects.map((project) => {
                            const domain = hostnameOf(project.actionUrl);

                            return (
                                <article className={styles.card} key={project.id}>
                                    <div className={styles.cardMedia}>
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 899px) 100vw, 46vw"
                                        />
                                        {domain && (
                                            <span className={styles.domainChip} aria-hidden="true">
                                                {domain}
                                            </span>
                                        )}
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
                                            aria-label={project.title}
                                        >
                                            {project.actionText}
                                        </CtaLink>
                                    </div>
                                </article>
                            );
                        })}

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
