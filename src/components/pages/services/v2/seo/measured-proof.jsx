"use client";

/* Les scores, juste après que MetaProof les a revendiqués.
 *
 * MetaProof dit « cette page est la démonstration, affichez la source ». C'est
 * le même argument avec les chiffres de l'outil attachés, pour que la
 * revendication cesse d'en être une. Tout vient de src/data/site-metrics.js,
 * mesuré sur la page en ligne ; la date de mesure est imprimée pour que
 * personne n'ait à croire qu'elle est fraîche.
 *
 * ── LES CORE WEB VITALS SONT RETIRÉS, TEMPORAIREMENT ─────────────────────
 * 06/08/2026 (décision de Mihai) : les trois barres (affichage principal,
 * stabilité visuelle, réponse du serveur) et la note qui les accompagnait ne
 * sont plus affichées, parce que le LCP est en cours de correction et que les
 * publier maintenant reviendrait à publier un chiffre qu'on sait sur le point
 * de changer.
 *
 * ⚠️ CE RETRAIT A UN COÛT ÉDITORIAL, ET IL EST ASSUMÉ COMME PROVISOIRE.
 * Le LCP était le seul chiffre en échec de la page, et la note disait « une
 * agence qui ne publie que ses bons scores ne vous dit pas ce qu'elle mesure :
 * elle vous dit ce qu'elle montre ». En l'état la section ne montre plus que
 * quatre bons scores — exactement ce que cette phrase dénonçait. C'est
 * pourquoi la note part avec les barres au lieu de rester seule : la garder
 * au-dessus de quatre scores choisis serait pire que de la retirer.
 *
 * Les clés `measured.vitals.*`, `measured.targetLabel` et `measured.note`
 * restent dans fr.json et en.json, et VITALS reste exporté par site-metrics.js.
 * Rien n'est à réécrire le jour où le LCP passe sous son seuil : il suffit de
 * remonter le bloc depuis git (état du 06/08/2026) — sauf `measured.note`, qui
 * parle explicitement de l'écart et devra être reformulée si l'écart a disparu.
 *
 * Les arcs sont statiques — le compteur sur les nombres est la seule pièce
 * mobile, la même île que /services et la section scope du MVP utilisent
 * déjà. Le moment signature de la page est le rail de Process, plus haut. */

import {useLocale, useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import CountUp from "@/components/pages/services/v2/shared/count-up";
import {LIGHTHOUSE, SCORES} from "@/data/site-metrics";
import styles from "./measured-proof.module.scss";

const R = 30;
const CIRC = 2 * Math.PI * R;

const MeasuredProof = () => {
    const t = useTranslations("pages.services.detail.seo.measured");
    const locale = useLocale();
    const reveal = useReveal();

    const measuredOn = new Intl.DateTimeFormat(locale, {
        day: "numeric", month: "long", year: "numeric",
    }).format(new Date(`${LIGHTHOUSE.measuredOn}T12:00:00Z`));

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>
                    {t("lead", {date: measuredOn, tool: LIGHTHOUSE.tool})}
                </p>

                <div className={styles.gauges}>
                    {SCORES.map(({key, value}, i) => (
                        <div key={key} className={styles.gauge} {...reveal(2 + i)}>
                            {/* Le cadran et son nombre partagent une seule
                                cellule de grille : le nombre est centré dans
                                l'anneau par la grille, pas par une marge
                                négative accordée à une taille de cadran. */}
                            <div className={styles.dialWrap}>
                                <svg className={styles.dial} viewBox="0 0 80 80" aria-hidden="true">
                                    <circle cx="40" cy="40" r={R} className={styles.track}/>
                                    <circle
                                        cx="40" cy="40" r={R}
                                        className={styles.arc}
                                        transform="rotate(-90 40 40)"
                                        strokeDasharray={`${(CIRC * value) / 100} ${CIRC}`}
                                    />
                                </svg>
                                <span className={styles.score}>
                                    <CountUp to={value}/>
                                </span>
                            </div>
                            <span className={styles.scoreLabel}>{t(`scores.${key}`)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MeasuredProof;
