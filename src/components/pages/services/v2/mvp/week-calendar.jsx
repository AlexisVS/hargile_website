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
 * timeline juste au-dessus, et deux h2 identiques sur une page seraient un
 * doublon de structure.
 *
 * Les phases sont dessinées bout à bout, pas en chevauchement. La planche
 * montrait des barres qui se recouvraient — c'était une illustration de ma
 * part, et la copie ne l'affirme nulle part : elle dit semaine 1, semaines
 * 2–3, semaine 4. Si les phases se chevauchent réellement dans le travail,
 * c'est une information à ajouter à la copie avant de la dessiner. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./week-calendar.module.scss";

/* start / span are grid columns over the four weeks of the month. */
const PHASES = [
    {key: "w1", start: 1, span: 1},
    {key: "w23", start: 2, span: 2},
    {key: "w4", start: 4, span: 1},
];

const WEEK_TICKS = [1, 2, 3, 4];

const WeekCalendar = () => {
    const t = useTranslations("pages.services.detail.mvp.timeline");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <div className={styles.calendar}>
                    {/* The month itself: four columns, hairline between each. */}
                    <div className={styles.grid} aria-hidden="true">
                        {WEEK_TICKS.map((week) => (
                            <span key={week} className={styles.column}/>
                        ))}
                    </div>

                    <div className={styles.bars}>
                        {PHASES.map(({key, start, span}, i) => (
                            <div
                                key={key}
                                className={styles.bar}
                                style={{gridColumn: `${start} / span ${span}`}}
                                data-rank={i + 1}
                                {...reveal(i + 1)}
                            >
                                <span className={styles.barLabel}>{t(`weeks.${key}.label`)}</span>
                                <span className={styles.barTitle}>{t(`weeks.${key}.title`)}</span>
                            </div>
                        ))}
                    </div>

                    <span
                        className={`${styles.axis} ${revealStyles.hairline}`}
                        aria-hidden="true"
                        {...reveal(4)}
                    />
                    <span className={styles.end} aria-hidden="true">{t("endMarker")}</span>
                </div>

                {/* The same week detail the vertical timeline carries, laid out
                    under the phase it belongs to. */}
                <div className={styles.details}>
                    {PHASES.map(({key, start, span}, i) => (
                        <div
                            key={key}
                            className={styles.detail}
                            style={{gridColumn: `${start} / span ${span}`}}
                            {...reveal(5 + i)}
                        >
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
