"use client";

/* Ce qu'on mesure — et la seule chose qu'on refuse.
 *
 * V2, 06/08/2026 (choix de Mihai) : plus de cadre. C'était le même moule 16px
 * que MetaProof, quatre sections plus haut, et il aplatissait en un seul bloc
 * un titre qui est déjà une opposition.
 *
 * Le refus est le sujet de la section, pas son avertissement de bas de page :
 * une page SEO qui ne promet rien de vérifiable vaut moins qu'une page qui
 * nomme ce qu'elle ne vendra pas. Il garde donc le filet accent et le corps de
 * texte plein, et ce qui l'annonce est le plus grand pas vertical de la page —
 * l'espace fait ce que la bordure faisait, comme sur web/price-method depuis
 * son dé-cadrage.
 *
 * ── CETTE SECTION PORTE LES DEUX REFUS DE LA PAGE ────────────────────────
 * 06/08/2026 (Mihai) : GeoAnswer fermait sur une bande « Ce que ça ne garantit
 * pas » qui disait déjà « personne ne peut promettre d'être cité », juste
 * avant que cette section-ci n'enchaîne sur « personne de sérieux ne peut
 * promettre la première position ». Deux refus de la même forme à une section
 * d'écart : le second désamorçait le premier.
 *
 * `measures.refusal` les tient maintenant tous les deux, avec leurs deux
 * mécanismes nommés — l'algorithme de Google et les modèles — et la phrase
 * d'engagement qui fermait GeoAnswer. C'est ce qui justifie que le paragraphe
 * soit plus long et plus gros que le reste : c'est la seule limite de la page,
 * et elle est ici. Y toucher veut dire relire geo-answer.jsx d'abord.
 *
 * Aucun score, aucune position, aucun chiffre de trafic ici. Il n'y a pas
 * encore d'historique mesuré à publier ; le jour où il y en aura, il ira dans
 * les messages. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./measures.module.scss";

const Measures = () => {
    const t = useTranslations("pages.services.detail.seo.measures");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("text")}</p>

                {/* Trois mesures sur une ligne, ouvertes chacune par un filet.
                    Pas de tirets ni de puces : à trois colonnes, le filet est
                    déjà la marque de liste. */}
                <div className={styles.cols} {...reveal(2)}>
                    {t.raw("points").map((point) => (
                        <p key={point} className={styles.point}>{point}</p>
                    ))}
                </div>

                {/* Le pas le plus large de la page, puis un filet accent court :
                    c'est le changement de registre, et plus aucune boîte ne
                    l'annonce. */}
                <div className={styles.refusalBlock}>
                    <span
                        className={`${styles.refusalRule} ${revealStyles.hairline}`}
                        aria-hidden="true"
                        {...reveal(3)}
                    />
                    <p className={styles.refusal} {...reveal(4)}>{t("refusal")}</p>
                </div>
            </div>
        </section>
    );
};

export default Measures;
