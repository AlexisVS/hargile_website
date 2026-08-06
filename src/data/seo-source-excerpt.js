/* Un extrait de la source réellement servie par /services/seo.
 *
 * La section « Cette page est la démonstration » (seo/meta-proof.jsx) invite le
 * lecteur à afficher le code source. Depuis le 06/08/2026 elle le montre
 * directement : ces lignes sont l'argument, pas une illustration.
 *
 * ── LA SEULE RÈGLE QUI COMPTE ────────────────────────────────────────────
 * Un extrait périmé serait exactement l'hypocrisie que la section dénonce.
 * Rien ici ne peut être écrit de mémoire, embelli ni raccourci en douce.
 *
 * POUR LE REGÉNÉRER (à faire dès que le head, le JSON-LD ou le H1 de la page
 * changent, et au minimum quand `fetchedOn` date de plusieurs mois) :
 *
 *   curl -s https://hargile.com/services/seo > /tmp/seo.html
 *   grep -o '<link rel="canonical"[^>]*>' /tmp/seo.html
 *   grep -o '<link rel="alternate"[^>]*>' /tmp/seo.html
 *   node -e "…"   # bloc application/ld+json
 *
 * Puis mettre `fetchedOn` à jour dans le même commit que les lignes.
 *
 * Les abrégements sont marqués par « … » et n'ont le droit de retirer que du
 * volume, jamais un fait : le JSON-LD réel porte le graphe complet de
 * l'organisation, les lignes 6 à 9 en gardent la forme et les @type exacts.
 * Tout le reste est copié caractère pour caractère depuis la réponse HTTP —
 * y compris `hrefLang`, que React sérialise ainsi (les attributs HTML sont
 * insensibles à la casse, les moteurs le lisent sans broncher). Le corriger
 * en `hreflang` pour faire plus propre serait déjà mentir. */

export const SOURCE_EXCERPT = {
    fetchedOn: "2026-08-06",
    url: "https://hargile.com/services/seo",

    /* Une entrée par ligne affichée, dans l'ordre. `proven: true` fait porter à
       la ligne le filet accent : c'est une ligne qu'un des quatre points
       revendique, et que le lecteur peut retrouver dans sa propre vue source. */
    lines: [
        {text: `<link rel="canonical" href="https://hargile.com/services/seo"/>`},
        {text: `<link rel="alternate" hrefLang="fr" href="https://hargile.com/services/seo"/>`, proven: true},
        {text: `<link rel="alternate" hrefLang="en" href="https://hargile.com/en/services/seo"/>`, proven: true},
        {text: `<script type="application/ld+json">`, proven: true},
        {text: `{"@context":"https://schema.org","@graph":[`, proven: true},
        {text: `  {"@type":"WebPage","@id":"…/services/seo#page","inLanguage":"fr",`, proven: true},
        {text: `   "isPartOf":{"@type":"WebSite","@id":"https://hargile.com/#website"}},`, proven: true},
        {text: `  {"@type":"Service","serviceType":"Search engine optimization",`, proven: true},
        {text: `   "provider":{"@id":"https://hargile.com/#organization"}}]}`, proven: true},
        {text: `</script>`, proven: true},
        {text: `<h1>Votre visibilité, automatisée.</h1>`, proven: true},
        {text: `<p>Nous rendons les PME visibles là où leurs clients cherchent : sur`, proven: true},
        {text: `Google, et désormais dans les réponses des assistants IA…</p>`, proven: true},
    ],

    /* Le renvoi de chaque point de `seo.metaProof.points` vers les lignes qu'il
       revendique, dans l'ordre du tableau de messages. `null` = le point
       n'annote aucune ligne en particulier (l'invitation finale porte sur tout
       l'extrait). Des chiffres plutôt qu'un mot : ça se lit dans les deux
       langues sans clé de traduction.

       ⚠️ CE TABLEAU EST TRIÉ, ET LES MESSAGES LE SONT AVEC LUI.
       Les renvois montent — 2–3, puis 4–10, puis 11–13 — parce qu'ils longent
       l'extrait de haut en bas, comme on le lit. `seo.metaProof.points` a donc
       été réordonné dans fr.json et en.json pour suivre : l'index i désigne la
       même chose des deux côtés, il n'y a pas de tri caché au rendu.

       Cet ordre est celui du document, pas celui de l'argument : la version
       d'avant ouvrait sur « tout le contenu est dans le HTML », qui est le
       point le plus fort, et descendait ensuite vers 4–10 puis 2–3. Des
       renvois qui reculent pendant que l'œil avance annulent l'intérêt de les
       afficher. Si on remet un jour le point le plus fort en tête, il faut
       renoncer aux numéros de ligne — on ne peut pas réordonner l'extrait,
       le head précède le corps dans un vrai document. */
    refs: ["2–3", "4–10", "11–13", null],
};
