"use client";

/* La grille de comptage : un carré, un site livré, et il est cliquable.
 *
 * C'est la proposition D de la planche de graphiques
 * (claude.ai/code/artifact/38f4933e-4829-4e1d-a0f7-d0bf1a4af7e2), montée en tête
 * de « Tout se passe chez nous » : la section arrête d'argumenter une page et
 * montre les 23 sites en ligne, que le lecteur peut vérifier en un clic. Un
 * comptage, pas une mesure — ça ne prouve pas une qualité, ça donne une échelle.
 *
 * ⚠️ Les deux nombres ne sont écrits nulle part. Ce sont CELLS.length et
 * GROUPS.length, calculés à partir de src/data/portfolio-projects.json, lui-même
 * généré depuis le dépôt Hargile Portfolio par scripts/sync-portfolio.mjs. La
 * raison est concrète : la copie locale du portfolio (src/data/portfolio-data.js)
 * avait dérivé à 22 projets, et /services annonçait « 22 projets en ligne » avec
 * le 22 en dur. Un littéral ici recréerait exactement cette panne.
 *
 * Couleur : un seul accent, et une rampe continue du plus clair au plus foncé,
 * posée sur l'année de livraison. Les plus récents ouvrent la grille, les plus
 * anciens la ferment. C'est une échelle séquentielle sur une grandeur ordonnée
 * — le cas où une rampe d'une seule teinte est la bonne réponse, et pas un
 * pis-aller : une couleur par secteur serait indéfendable à quinze catégories,
 * et le validateur refuse de toute façon les séries multiples sur cette
 * palette. Chaque millésime est un palier, le dégradé traverse la grille, et
 * l'identité reste portée par la position, le libellé au survol et le lien.
 *
 * Le libellé sous la grille est aria-hidden : chaque lien porte déjà son
 * aria-label complet, et une deuxième annonce du même texte au focus ferait
 * bégayer le lecteur d'écran.
 *
 * ⚠️ Sa consigne au repos ne parle que du clic. Le survol n'existe pas au
 * doigt : « survolez un carré » y serait une instruction impossible à suivre.
 * Le nom au survol reste un bonus pour la souris, il n'est jamais annoncé
 * comme le moyen d'accéder à quoi que ce soit — le lien fait ça, partout. */

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import CountUp from "@/components/pages/services/v2/shared/count-up";
import data from "@/data/portfolio-projects.json";
import styles from "./delivered-grid.module.scss";

/* Rangés par année, la plus récente d'abord. À année égale l'ordre du portfolio
   est conservé — il est déjà éditorial là-bas, et le rejouer ici en inventerait
   un second. Tout est calculé une fois au chargement du module : rien ne dépend
   du rendu, donc serveur et client tombent sur la même grille. */
const YEARS = [...new Set(data.projects.map((p) => p.year))].sort().reverse();

/* La rampe : du plus clair au plus foncé, un palier par millésime. Le plancher
   est à 0,52 et pas plus bas parce que ces carrés sont des liens — soumis, à ce
   titre, au 3:1 des éléments non textuels. Mesuré sur #080c16 : 0,52 donne
   3,35:1, 0,45 tombe à 2,81:1 et échoue. Le nombre d'années vient des données,
   donc la rampe se recalcule au lieu d'être écrite en classes : une année de
   plus n'est pas une couleur à ajouter, c'est un palier de plus. */
const TINT_TOP = 0.95;
const TINT_FLOOR = 0.52;

const CELLS = YEARS.flatMap((year, rank) => {
    const step = YEARS.length > 1 ? rank / (YEARS.length - 1) : 0;
    const tint = (TINT_TOP - step * (TINT_TOP - TINT_FLOOR)).toFixed(3);
    return data.projects.filter((p) => p.year === year).map((project) => ({...project, tint}));
});

/* Les secteurs restent comptés sur le regroupement, indépendamment de l'ordre
   d'affichage : le chiffre publié ne doit pas dépendre de la façon dont on
   range les carrés. */
const SECTORS = new Set(data.projects.map((p) => p.group)).size;

/* `aside` : ce que la section veut poser sous les compteurs. La grille fait
   trois rangs, les trois nombres n'en font qu'un — sans ce contenu-là, la
   colonne de droite serait aux deux tiers vide. Le bloc est passé plutôt
   qu'importé pour que sa copie et ses clés restent dans la section qui les
   possède ; ici on ne fournit que la place. */
const DeliveredGrid = ({reveal, aside}) => {
    const t = useTranslations("pages.services.detail.web.madeInHouse.grid");
    const locale = useLocale();
    const [active, setActive] = useState(null);

    /* On affiche le secteur regroupé, pas le brut : trois carrés qui disent
       « Tourisme », « Hotellerie » et « Hébergement & Tourisme » alors qu'ils
       forment une seule bande et comptent pour un se liraient comme une erreur.
       Le libellé suit la locale ; le regroupement et le compte, eux, restent
       sur le champ canonique, pour que les deux langues annoncent le même
       nombre même si une traduction fusionnait deux métiers. */
    const sectorOf = (project) =>
        (locale === "en" && project.groupEn) || project.group;

    return (
        <div className={styles.block}>
            <div {...reveal(2)}>
                <ul className={styles.grid}>
                    {CELLS.map((project) => (
                        <li key={project.id}>
                            <a
                                className={styles.cell}
                                /* Une variable, pas une couleur : la feuille de
                                   style garde la teinte, le composant ne passe
                                   que le rang sur la rampe. Le seul style en
                                   ligne de la page, et il ne peut rien cacher —
                                   sa plage est 0,52 à 0,95. */
                                style={{"--cell-tint": project.tint}}
                                href={project.url}
                                target="_blank"
                                rel="noopener"
                                aria-label={t("cell", {
                                    client: project.client,
                                    sector: sectorOf(project),
                                    year: project.year,
                                })}
                                onMouseEnter={() => setActive(project)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(project)}
                                onBlur={() => setActive(null)}
                            />
                        </li>
                    ))}
                </ul>
                {/* Deux lignes, jamais une seule qui alterne. La consigne était
                    remplacée par le nom au survol puis remise en partant : le
                    texte clignotait au moindre passage de souris sur la grille.
                    Elle ne bouge plus. Le nom a sa propre ligne, dont la hauteur
                    est réservée — elle se remplit, elle ne pousse rien. */}
                <p className={styles.readout}>
                    <span className={styles.readoutName} aria-hidden="true">
                        {active ? (
                            <>
                                <b>{active.client}</b>
                                {` · ${sectorOf(active)} · ${active.year}`}
                            </>
                        ) : null}
                    </span>
                    <span className={styles.readoutHint}>{t("hint")}</span>
                </p>
            </div>

            <div className={styles.side}>
                <div className={styles.tiles} {...reveal(3)}>
                    <div className={styles.tile}>
                        <CountUp to={CELLS.length} className={styles.tileNum}/>
                        <span className={styles.tileLabel}>{t("projects")}</span>
                    </div>
                    <div className={styles.tile}>
                        <CountUp to={SECTORS} className={styles.tileNum}/>
                        <span className={styles.tileLabel}>{t("sectors")}</span>
                    </div>
                    <div className={styles.tile}>
                        {/* Le seul signe de la section qui ne se compte pas.
                            Assumé comme tel : les deux voisins sont
                            vérifiables, celui-ci est un clin d'œil, et il est
                            écrit dans l'accent pour qu'on ne le lise pas comme
                            une mesure de plus. */}
                        <span className={`${styles.tileNum} ${styles.tileInfinity}`}>∞</span>
                        <span className={styles.tileLabel}>{t("code")}</span>
                    </div>
                </div>
                {aside}
            </div>
        </div>
    );
};

export default DeliveredGrid;
