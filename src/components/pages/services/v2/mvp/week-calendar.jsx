"use client";

/* ⚠ VARIANTE DE COMPARAISON — proposition H de la planche de graphiques.
 *
 * Montée temporairement SOUS week-timeline.jsx pour que Mihai compare les deux
 * traitements du même contenu. Ce n'est pas un ajout définitif : à l'issue du
 * choix, soit ce fichier remplace week-timeline.jsx, soit il est supprimé.
 * Tant que les deux coexistent, la copie des semaines apparaît deux fois dans
 * le HTML de la page — raison de plus pour ne pas déployer cet état.
 *
 * Pas de <h2> ici, volontairement : le titre de la section est celui de la
 * timeline juste au-dessus, et deux h2 identiques seraient un doublon.
 *
 * ── LES PHASES SONT DES POURCENTAGES DU MOIS ─────────────────────────────
 * Une ligne par phase : c'est ce qui produit l'escalier, et c'est ce qui
 * distingue un calendrier d'une barre segmentée.
 *
 * `from` et `to` sont des positions sur les 30 jours, 0 à 100. Aujourd'hui
 * elles sont bout à bout, parce que c'est ce que dit la copie : semaine 1,
 * semaines 2–3, semaine 4. Pour montrer des phases qui se chevauchent — le
 * design qui déborde sur le début du dev, les tests qui commencent avant la
 * fin — il suffit de changer ces six nombres. Mais alors la copie doit le dire
 * aussi : un dessin ne doit pas affirmer ce qu'aucune phrase n'assume. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./week-calendar.module.scss";

const PHASES = [
    {key: "w1", from: 0, to: 25},
    {key: "w23", from: 25, to: 75},
    {key: "w4", from: 75, to: 100},
];

/* Boundaries between the four weeks, and the centre of each one for its tick. */
const BOUNDARIES = [25, 50, 75];
const TICKS = [
    {week: 1, at: 12.5},
    {week: 2, at: 37.5},
    {week: 3, at: 62.5},
    {week: 4, at: 87.5},
];

const WeekCalendar = () => {
    const t = useTranslations("pages.services.detail.mvp.timeline");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.chart}>
                    {/* Week boundaries, behind everything. */}
                    <div className={styles.gridlines} aria-hidden="true">
                        {BOUNDARIES.map((at) => (
                            <span key={at} className={styles.gridline} style={{left: `${at}%`}}/>
                        ))}
                    </div>

                    {/* The deadline the whole offer is named after. */}
                    <div className={styles.deadline} aria-hidden="true">
                        <span className={styles.deadlineLabel}>{t("endMarker")}</span>
                        <span className={styles.deadlineLine}/>
                    </div>

                    <div className={styles.rows}>
                        {PHASES.map(({key, from, to}, i) => (
                            <div key={key} className={styles.row}>
                                {/* Position travels as custom properties, not as
                                    left/width directly: below the stack point the
                                    bar stops being a block with a title inside and
                                    becomes a rule under the title, and the rule
                                    needs the same two numbers. */}
                                <span
                                    className={styles.bar}
                                    data-rank={i + 1}
                                    style={{"--from": `${from}%`, "--span": `${to - from}%`}}
                                    {...reveal(i + 1)}
                                >
                                    <span className={styles.barTitle}>{t(`weeks.${key}.title`)}</span>
                                </span>
                            </div>
                        ))}
                    </div>

                    <span
                        className={`${styles.axis} ${revealStyles.hairline}`}
                        aria-hidden="true"
                        {...reveal(4)}
                    />

                    <div className={styles.ticks} aria-hidden="true">
                        {TICKS.map(({week, at}) => (
                            <span key={week} className={styles.tick} style={{left: `${at}%`}}>
                                {`S${week}`}
                            </span>
                        ))}
                    </div>
                </div>

                {/* The same week detail the vertical timeline carries. */}
                <div className={styles.details}>
                    {PHASES.map(({key}, i) => (
                        <div key={key} className={styles.detail} {...reveal(5 + i)}>
                            <p className={styles.label}>{t(`weeks.${key}.label`)}</p>
                            <p className={styles.text}>{t(`weeks.${key}.text`)}</p>
                            <ul className={styles.chips}>
                                {t.raw(`weeks.${key}.deliverables`).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WeekCalendar;
