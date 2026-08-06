"use client";

/* La méta-démonstration : cette page applique la méthode qu'elle vend.
 *
 * V2, 06/08/2026 (choix de Mihai) : le cadre 16px a sauté. Il était le même
 * que celui de Measures quatre sections plus bas — le même moule deux fois, en
 * sandwich autour des chiffres — et surtout il ne prouvait rien.
 *
 * La copie dit « Affichez le code source de cette page : tout y est. » La
 * section le montre maintenant : un extrait de la réponse HTTP réelle, à
 * gauche, et les quatre points à droite renvoyant chacun aux lignes qu'il
 * revendique. C'est la seule section de la page où la forme démontre au lieu
 * d'affirmer, et le prix à payer est une servitude : l'extrait doit rester
 * vrai. Tout est dans src/data/seo-source-excerpt.js, avec sa procédure.
 *
 * Le panneau de code est du texte, pas une image : il part dans le HTML servi
 * comme le reste, ce qui est précisément ce que les lignes 11–13 affirment.
 * Un <pre> ferait déborder la page sur mobile, donc chaque ligne est son
 * propre élément et le débordement est confié à un conteneur qui défile seul. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {SOURCE_EXCERPT} from "@/data/seo-source-excerpt";
import styles from "./meta-proof.module.scss";

const MetaProof = () => {
    const t = useTranslations("pages.services.detail.seo.metaProof");
    const reveal = useReveal();
    const points = t.raw("points");

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("text")}</p>

                <div className={styles.split}>
                    {/* aria-hidden : les quatre points disent en prose ce que
                        l'extrait montre, donc le faire lire ligne à ligne par
                        un lecteur d'écran doublerait l'argument sans l'ajouter.
                        Le texte reste dans le HTML — c'est ce que lisent les
                        moteurs, et c'est tout l'intérêt. */}
                    <div className={styles.code} {...reveal(2)} aria-hidden="true">
                        <div className={styles.codeScroll}>
                            {SOURCE_EXCERPT.lines.map((line, i) => (
                                <span
                                    key={line.text}
                                    className={line.proven ? styles.lineProven : styles.line}
                                >
                                    <span className={styles.ln}>{i + 1}</span>
                                    <span className={styles.lineText}>{line.text}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <ul className={styles.notes} {...reveal(3)}>
                        {points.map((point, i) => (
                            <li key={point} className={SOURCE_EXCERPT.refs[i] ? styles.note : styles.noteWide}>
                                {SOURCE_EXCERPT.refs[i] ? (
                                    <span className={styles.ref}>{SOURCE_EXCERPT.refs[i]}</span>
                                ) : null}
                                <span className={styles.noteText}>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default MetaProof;
