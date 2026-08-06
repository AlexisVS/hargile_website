"use client";

/* Être cité par les moteurs de réponse — la revendication que cette page doit
   porter, et la seule dont le titre prend le dégradé identitaire.
 *
 * V2, 06/08/2026 (choix de Mihai) : la section gagne sa figure. Elle sortait
 * en trois colonnes à filet, la même silhouette que Process quatre sections
 * plus haut, et elle demandait au lecteur de se représenter tout seul un
 * mécanisme qu'il n'a jamais vu.
 *
 * ── CE QUE LA FIGURE TRACE, ET POURQUOI ELLE A DEUX PAGES ────────────────
 * Trois propriétés sortent de votre page vers le moteur, et la réponse qui en
 * ressort vous nomme. En dessous, une seconde page — celle que personne n'a
 * travaillée — envoie un trait qui meurt sur une barre : rien à lire, rien à
 * citer. Sans ce second cas la figure serait une nomenclature ; avec lui elle
 * dit ce que la copie dit déjà en toutes lettres (« un moteur de réponse qui
 * ne voit qu'une page vide ne citera jamais rien »), et c'est la phrase qui
 * l'autorise à exister. Un dessin ne doit rien affirmer qu'aucune phrase
 * n'assume — même règle que le calendrier du MVP.
 *
 * Les trois rangs de la page portent les repères a / b / c, repris par les
 * trois colonnes en dessous : la figure et la prose sont un seul objet, pas
 * une image suivie d'un texte.
 *
 * ── LA LIMITE N'EST PLUS ICI, ET C'EST VOULU ─────────────────────────────
 * 06/08/2026 (Mihai) : la bande « Ce que ça ne garantit pas » a quitté cette
 * section. Elle disait « personne ne peut promettre d'être cité », et Measures
 * — la section immédiatement suivante, intitulée « ce qu'on mesure et ce qu'on
 * ne promet pas » — enchaînait sur « personne de sérieux ne peut promettre la
 * première position ». Deux sections consécutives fermant chacune sur un refus
 * de la même forme : le second affaiblissait le premier au lieu de l'appuyer.
 *
 * Les deux refus sont désormais fondus dans `measures.refusal`, avec leurs deux
 * mécanismes nommés (l'algorithme de Google, les modèles). La revendication de
 * cette page n'est donc pas laissée sans garde-fou : il est une section plus
 * bas, à l'endroit qui porte son nom. Ne pas remettre de clôture ici sans
 * retirer l'autre — c'est exactement la redite qu'on vient de défaire.
 *
 * SVG écrit à la main, rendu avec le reste de la page. Une bibliothèque de
 * graphes dessinerait dans le navigateur, ce qui garderait ces libellés hors
 * de la première réponse HTML — précisément ce dont la section d'au-dessus
 * fait un argument de vente.
 *
 * Deux figures dans le markup, une masquée en CSS : un <text> SVG ne se
 * recoupe pas, donc un seul dessin ne peut pas tenir à 1440px et à 390px. La
 * compacte garde le contre-exemple (les colonnes en parlent) et perd la note
 * « rien à lire », que le titre du bloc dit déjà.
 *
 * Aucune animation : le moment signature de /services/seo est le rail de
 * Process. La figure arrive avec le reveal de la section et ne bouge plus. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import revealStyles from "@/components/pages/homepage/v2/reveal.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./geo-answer.module.scss";

/* Les trois conditions, dans l'ordre où la figure les empile et où les
   colonnes les reprennent. Les repères sont des lettres et non des chiffres :
   elles tiennent en même temps, rien n'est fait en premier. */
const COLS = [
    {key: "readable", mark: "a"},
    {key: "structured", mark: "b"},
    {key: "answers", mark: "c"},
];

/* Un <text> SVG ne se recoupe pas : les libellés qui ont besoin de deux lignes
   arrivent en tableau et chaque langue choisit sa coupe. */
const Label = ({value, x, y, dy, className, anchor}) => {
    const lines = Array.isArray(value) ? value : [value];
    return (
        <text className={className} x={x} y={y} textAnchor={anchor}>
            {lines.map((line, i) => (
                <tspan key={line} x={x} dy={i === 0 ? 0 : dy}>{line}</tspan>
            ))}
        </text>
    );
};

const GeoAnswer = () => {
    const t = useTranslations("pages.services.detail.seo.geo");
    const reveal = useReveal();
    const s = (key) => t(`schema.${key}`);

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={`${section.heading} ${styles.title}`} {...reveal(0)}>{t("title")}</h2>
                <p className={`${section.lead} ${styles.lead}`} {...reveal(1)}>{t("lead")}</p>

                {/* aria-hidden : les trois colonnes et la clôture portent tout
                    l'argument en prose, donc annoncer la figure le lirait deux
                    fois. Les libellés partent quand même dans le HTML — c'est
                    ce que lisent les moteurs, et c'est le sujet même. */}
                <div className={styles.schema} {...reveal(2)}>
                    <svg
                        className={`${styles.fig} ${styles.figWide}`}
                        viewBox="0 0 1040 400"
                        aria-hidden="true"
                        focusable="false"
                    >
                        {/* Votre page : un mount à équerres, ses trois propriétés
                            en rangs repérés a / b / c. */}
                        <rect className={styles.mount} x="2" y="36" width="344" height="182"/>
                        <path className={styles.tick} d="M2 50 V36 H16"/>
                        <path className={styles.tick} d="M332 36 H346 V50"/>
                        <path className={styles.tick} d="M2 204 V218 H16"/>
                        <path className={styles.tick} d="M332 218 H346 V204"/>
                        <text className={styles.boxTitle} x="174" y="72" textAnchor="middle">{s("page")}</text>

                        {COLS.map(({key, mark}, i) => {
                            const y = 114 + i * 36;
                            return (
                                <g key={key}>
                                    <text className={styles.mark} x="24" y={y}>{mark}</text>
                                    <text className={styles.label} x="48" y={y}>{s(key)}</text>
                                    {/* Une propriété, un trait : trois entrées
                                        distinctes plutôt qu'une flèche unique
                                        qui les résumerait en « la page ». */}
                                    <line className={styles.flow} x1="346" y1={y} x2="462" y2={y}/>
                                    <path className={styles.headAccent} d={`M468 ${y} l-11 -5.5 v11 z`}/>
                                </g>
                            );
                        })}

                        <rect className={styles.box} x="468" y="92" width="212" height="116"/>
                        <text className={styles.boxTitle} x="574" y="136" textAnchor="middle">{s("engine")}</text>
                        <text className={styles.label} x="574" y="162" textAnchor="middle">{s("engineNote")}</text>

                        <line className={styles.flow} x1="680" y1="150" x2="798" y2="150"/>
                        <path className={styles.headAccent} d="M804 150 l-11 -5.5 v11 z"/>

                        <rect className={styles.mount} x="810" y="84" width="228" height="132"/>
                        <path className={styles.tick} d="M810 98 V84 H824"/>
                        <path className={styles.tick} d="M1024 84 H1038 V98"/>
                        <path className={styles.tick} d="M810 202 V216 H824"/>
                        <path className={styles.tick} d="M1024 216 H1038 V202"/>
                        <text className={styles.boxTitle} x="924" y="120" textAnchor="middle">{s("answer")}</text>
                        <text className={styles.source} x="924" y="152" textAnchor="middle">{s("source")}</text>
                        <text className={styles.label} x="924" y="178" textAnchor="middle">{s("sourceNote")}</text>

                        {/* Le contre-exemple. Mêmes équerres, tracées en sourdine :
                            c'est la même sorte d'objet, pas une autre catégorie —
                            seule la différence de travail les sépare. */}
                        <rect className={styles.mount} x="2" y="290" width="344" height="80"/>
                        <path className={styles.tickDim} d="M2 304 V290 H16"/>
                        <path className={styles.tickDim} d="M332 290 H346 V304"/>
                        <path className={styles.tickDim} d="M2 356 V370 H16"/>
                        <path className={styles.tickDim} d="M332 370 H346 V356"/>
                        <text className={styles.boxTitleDim} x="174" y="324" textAnchor="middle">{s("blank")}</text>
                        <text className={styles.label} x="174" y="350" textAnchor="middle">{s("blankNote")}</text>

                        <line className={styles.flowDim} x1="346" y1="330" x2="430" y2="330"/>
                        <line className={styles.closed} x1="440" y1="310" x2="440" y2="350"/>
                        <text className={styles.labelAccent} x="456" y="336">{s("nothing")}</text>
                    </svg>

                    {/* Pas la figure large compressée : le même objet debout, la
                        chaîne descendant la page. Les trois propriétés restent
                        des rangs mais n'émettent plus qu'un trait — trois
                        flèches parallèles de 30 unités ne diraient plus rien. */}
                    <svg
                        className={`${styles.fig} ${styles.figCompact}`}
                        viewBox="0 0 320 620"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <rect className={styles.mount} x="2" y="24" width="316" height="168"/>
                        <path className={styles.tick} d="M2 38 V24 H16"/>
                        <path className={styles.tick} d="M304 24 H318 V38"/>
                        <path className={styles.tick} d="M2 178 V192 H16"/>
                        <path className={styles.tick} d="M304 192 H318 V178"/>
                        <text className={styles.boxTitle} x="160" y="58" textAnchor="middle">{s("page")}</text>

                        {COLS.map(({key, mark}, i) => {
                            const y = 98 + i * 32;
                            return (
                                <g key={key}>
                                    <text className={styles.mark} x="22" y={y}>{mark}</text>
                                    <text className={styles.label} x="44" y={y}>{s(key)}</text>
                                </g>
                            );
                        })}

                        <line className={styles.flow} x1="160" y1="192" x2="160" y2="222"/>
                        <path className={styles.headAccent} d="M160 228 l-5.5 -11 h11 z"/>

                        <rect className={styles.box} x="2" y="234" width="316" height="84"/>
                        <text className={styles.boxTitle} x="160" y="268" textAnchor="middle">{s("engine")}</text>
                        <text className={styles.label} x="160" y="292" textAnchor="middle">{s("engineNote")}</text>

                        <line className={styles.flow} x1="160" y1="318" x2="160" y2="348"/>
                        <path className={styles.headAccent} d="M160 354 l-5.5 -11 h11 z"/>

                        <rect className={styles.mount} x="2" y="360" width="316" height="116"/>
                        <path className={styles.tick} d="M2 374 V360 H16"/>
                        <path className={styles.tick} d="M304 360 H318 V374"/>
                        <path className={styles.tick} d="M2 462 V476 H16"/>
                        <path className={styles.tick} d="M304 476 H318 V462"/>
                        <text className={styles.boxTitle} x="160" y="396" textAnchor="middle">{s("answer")}</text>
                        <text className={styles.source} x="160" y="426" textAnchor="middle">{s("source")}</text>
                        <text className={styles.label} x="160" y="450" textAnchor="middle">{s("sourceNote")}</text>

                        <rect className={styles.mount} x="2" y="524" width="176" height="72"/>
                        <path className={styles.tickDim} d="M2 538 V524 H16"/>
                        <path className={styles.tickDim} d="M164 524 H178 V538"/>
                        <path className={styles.tickDim} d="M2 582 V596 H16"/>
                        <path className={styles.tickDim} d="M164 596 H178 V582"/>
                        <Label
                            className={styles.boxTitleDim}
                            value={t.raw("schema.blankCompact")}
                            x="90" y="552" dy="18" anchor="middle"
                        />

                        <line className={styles.flowDim} x1="178" y1="560" x2="214" y2="560"/>
                        <line className={styles.closed} x1="224" y1="542" x2="224" y2="578"/>
                        <text className={styles.labelAccent} x="236" y="566">{s("nothing")}</text>
                    </svg>
                </div>

                <div className={styles.cols}>
                    {COLS.map(({key, mark}, i) => (
                        <div key={key} className={styles.col}>
                            <span
                                className={`${styles.rule} ${revealStyles.hairline}`}
                                aria-hidden="true"
                                {...reveal(3 + i)}
                            />
                            <div className={styles.body} {...reveal(3 + i)}>
                                {/* Le même repère que dans la figure — c'est ce
                                    qui fait des deux un seul objet. */}
                                <span className={styles.colMark} aria-hidden="true">{mark}</span>
                                <h3 className={styles.colTitle}>{t(`cols.${key}.title`)}</h3>
                                <p className={styles.colText}>{t(`cols.${key}.text`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GeoAnswer;
