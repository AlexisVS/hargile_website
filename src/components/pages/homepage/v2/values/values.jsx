"use client";

import {useTranslations} from "next-intl";
import section from "../v2-section.module.scss";
import styles from "./values.module.scss";
import {useReveal} from "../useReveal";

/* Le prompt du terminal. Purement décoratif — il est rendu dans un conteneur
   aria-hidden, la valeur qu'il précède est un vrai <h3> en dessous. */
const Prompt = () => (
    <>
        <span className={styles.arrow}>➜</span>{" "}
        <span className={styles.path}>~/hargile-tech-studio</span>
    </>
);

/* Nos valeurs, disposées d'après examplesPages/NosValeurs2a.jsx : colonne de
   texte à gauche, fenêtre de terminal à droite qui « cat » le fichier des
   valeurs.

   Le contenu est le nôtre et n'a pas bougé — titre, phrase d'intro et les
   quatre valeurs sortent des mêmes clés de messages qu'avant. Seul le nom de
   fichier a été ajouté (terminal-file), parce que c'est le seul texte de la
   fenêtre qui se traduit. Les deux lignes de prose de la maquette
   (« // lisible par les humains, écrit avec soin » et « # 4 valeurs, compilées
   depuis 2025, 0 warning ») ne sont PAS reprises : ce sont des affirmations,
   pas du chrome de terminal.

   Ce qui a été adapté à la maison, et pourquoi :
   - le curseur ne clignote plus. Un blink infini est exactement l'effet en
     boucle que le reste du site s'interdit ; le bloc est posé, plein, immobile.
   - les trois pastilles de la barre de titre étaient pleines, dont un ambre
     (#F5C26B) absent de la palette. Ce sont trois anneaux filaires : une seule
     couleur d'accent sur le site, et on dessine au trait plutôt qu'on ne
     remplit.
   - plus de box-shadow ni de radius : la fenêtre est tracée à la hairline, dans
     la même langue que la figure de /services/ia et l'encoche du portfolio.
   - le corps reste transparent. Un fond propre ferait de la fenêtre le seul
     objet rempli de la page, ce qu'on vient de retirer partout ailleurs.
   - le #2563eb de la maquette (chemin et « ## ») est un bleu très sombre sur un
     fond quasi noir : illisible. Il passe sur les crans dimmés de l'accent. */
const ValuesV2 = () => {
    const t = useTranslations("pages.homepage.sections.about-us");
    const reveal = useReveal();

    // Arrays live in the message file; t.raw returns them untranslated-through
    const values = t.raw("our-values") ?? [];
    const file = t("terminal-file");

    // who_description holds the statement + ambition split on the blank line
    const [statement, ambition] = (t("who_description") || "").split("\n\n");

    return (
        <section className={section.section}>
            <div className={styles.orb} aria-hidden="true"/>
            <div className={section.container}>
                <div className={styles.split}>
                    <div className={styles.intro}>
                        <h2 className={section.heading} {...reveal(0)}>
                            {t("who_title")}
                        </h2>
                        <p className={styles.statement} {...reveal(1)}>
                            {statement}
                        </p>
                        {ambition && (
                            <p className={styles.ambition} {...reveal(1)}>
                                {ambition}
                            </p>
                        )}
                    </div>

                    <div className={styles.panel} {...reveal(2)}>
                        {/* Barre de titre : décor, aucun contrôle derrière. */}
                        <div className={styles.chrome} aria-hidden="true">
                            <span className={styles.dot}/>
                            <span className={styles.dot}/>
                            <span className={styles.dot}/>
                            {/* Le nom du fichier seul. Il était préfixé de
                                « hargile — », soit la marque une fois de plus
                                au-dessus des deux prompts qui la portent déjà. */}
                            <span className={styles.fileName}>{file}</span>
                        </div>

                        <div className={styles.body}>
                            <p className={styles.line} aria-hidden="true">
                                <Prompt/> <span className={styles.cmd}>cat {file}</span>
                            </p>

                            {/* Pas de titre `#` au-dessus des ##, deux essais plus
                                tard : who_title répétait mot pour mot le <h2>
                                juste à gauche, et le nom du studio ajoutait une
                                troisième marque à une fenêtre qui la porte déjà
                                dans le prompt d'ouverture et dans celui de
                                fermeture. Un .md qui commence sur un ## est de
                                toute façon banal — c'est un fragment de doc, pas
                                un README. */}

                            {/* La sortie du « cat ». Les dièses sont le balisage
                                markdown que la fenêtre est censée afficher, donc
                                aria-hidden : un lecteur d'écran annonce déjà un
                                titre de niveau 3, il n'a pas besoin des dièses.

                                L'espace après ## est un VRAI caractère, pas un
                                gap flex. Sans lui le markdown est faux — `##`
                                n'ouvre un titre que suivi d'une espace — et
                                quiconque copie la sortie récupère du «
                                ##Transparence » qui ne compile pas. */}
                            <ul className={styles.list}>
                                {values.map((v) => (
                                    <li key={v.value} className={styles.entry}>
                                        <h3 className={styles.name}>
                                            <span className={styles.hash} aria-hidden="true">{"## "}</span>
                                            {v.value}
                                        </h3>
                                        <p className={styles.desc}>{v.description}</p>
                                    </li>
                                ))}
                            </ul>

                            <p className={styles.line} aria-hidden="true">
                                <Prompt/> <span className={styles.caret}/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValuesV2;
