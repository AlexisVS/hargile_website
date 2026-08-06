# Prompt de session — « Où vont vos données » sur /services/ia (refonte + schéma)

> Écrit le 2026-08-06, en fin de session « sections web + prix ».
> **Prompt à coller en ouverture de la prochaine session :**
>
> « Lis `docs/ia-data-schema-session-prompt.md` et exécute-le. La mission est la
> section « Où vont vos données » sur /services/ia, avec un schéma. Commence par
> la planche de variantes — Mihai choisit à l'œil avant qu'on code. »
>
> **Ne remplace PAS**
> [`services-graphs-session-prompt.md`](./services-graphs-session-prompt.md) :
> ses §2.3 (chevauchement des phases mvp), §2.4 (le LCP publié) et §3 (les
> chiffres Lighthouse qui vieillissent) sont **toujours ouverts** et ne sont pas
> recopiés ici — les lire là-bas. Ce document-ci ajoute une mission, il n'en
> clôt aucune.

---

## 1. La mission

Refaire la section **« Où vont vos données. »** de `/services/ia`, et lui donner
**un schéma**. C'est la seule des quatre pages offre qui n'a aucun graphique,
et c'est celle dont la question centrale se dessine le mieux : une frontière,
ce qui la traverse, ce qui ne la traverse pas.

Décidé par Mihai le 06/08. Rien n'a été touché sur cette page cette session.

---

## 2. État actuel — relevé dans le code, pas de mémoire

`/services/ia` est un **Server Component unique** :
`ia/ia-offre-section.jsx` rend le corps entier (bento des 4 cas d'usage ·
contre-argument `honesty` · **`DataGuarantees`** · MiniFaq · autres offres · CTA).

La section visée : `ia/data-guarantees.jsx` + `.module.scss`.
Namespace i18n : `pages.services.detail.ia.data` (miroir `en.json`).

```
h3   « Où vont vos données. »
3 rangées, chacune : numéro outline 01/02/03 · titre · paragraphe
     border-top 1px rgba(255,255,255,.1), la dernière ferme en border-bottom
```

| clé | titre | ce que la rangée affirme |
| --- | --- | --- |
| `flow` | Décidé avant la première ligne de code | quelles données sortent, vers quel fournisseur, sous quel contrat — défini au cadrage |
| `sensitive` | Ce qui est sensible reste chez vous | on **privilégie** les solutions qui gardent la donnée sur votre infra ; le RGPD décide de l'architecture |
| `reversible` | Réversible par conception | le fournisseur d'IA reste remplaçable, et le code qui l'appelle vous appartient |

⚠️ **La copie exacte est dans `fr.json` — la relire avant de dessiner.** Le
tableau ci-dessus est un résumé, pas la source.

---

## 3. Le schéma — ce qu'il doit tracer

Les trois rangées décrivent **un seul mécanisme vu sous trois angles**, ce qui
est exactement ce qu'un schéma sait faire mieux qu'une liste : une frontière
entre « chez vous » et « le fournisseur », ce qui la franchit, ce qui reste, et
le fait que la boîte de droite est interchangeable.

Pistes à mettre sur la planche (non exhaustif — en proposer d'autres) :

- **La frontière** : deux zones, un filet vertical entre elles, les flux
  étiquetés qui la traversent. `sensitive` devient visible : c'est ce qui ne
  franchit pas la ligne.
- **Le slot remplaçable** : le fournisseur dessiné comme un emplacement, pas
  comme un logo — c'est `reversible` sans une phrase de plus.
- **La chronologie du cadrage** : `flow` est une décision *antérieure*, pas un
  composant ; la marquer comme un moment plutôt que comme une boîte.

⚠️ **Le piège du schéma, à traiter avant de tracer.** La copie dit « on
**privilégie** les solutions qui les gardent sur votre infrastructure » — une
préférence, pas une garantie. Un schéma qui montre la donnée sensible
définitivement enfermée chez le client **transforme la préférence en promesse**,
et l'affirme plus fort que la phrase ne l'assume. Même classe d'erreur que le
garde-fou de `web/price-method.jsx` (« ne pas laisser entendre que le prix
couvre la maintenance ») : si l'engagement plus fort est vrai, il se décide et
s'écrit, il ne se déduit pas d'un dessin. **Poser la question à Mihai avant de
choisir la forme** — la réponse change le schéma.

Deuxième piège : ne pas dessiner une architecture précise (noms de produits,
protocoles, ports). Ce n'est pas un diagramme d'implémentation, c'est le
principe. Un dessin trop spécifique devient faux au premier projet qui diffère.

---

## 4. Contraintes techniques — dont deux propres à cette page

- **SVG écrit à la main, rendu côté serveur, zéro dépendance.** Tranché au §4 de
  `services-graphs-session-prompt.md` : une librairie de graphiques rend côté
  navigateur, les chiffres n'arriveraient pas dans le premier HTML, ce qui
  casserait la règle dont `/services/seo` se vante.
- ⚠️ **Cette page ne s'anime pas.** `data-guarantees.jsx` renonce délibérément à
  `useReveal` — commentaire en tête du fichier : « le corps entier est immobile,
  un bloc animé au milieu se lirait comme un accident ». **Le schéma n'a donc
  ni apparition, ni tracé progressif, ni survol qui bouge.** C'est la contrainte
  la plus facile à oublier, parce que tout le reste du site en a.
- ⚠️ **Server Component** : pas de hook, pas de `"use client"`. Si une forme
  exige de l'interactivité, c'est le signe qu'elle est la mauvaise forme ici.
- **Accent unique** `#96b9f9` et ses alphas. Le trio de rechange
  (`#4A80D6 · #BE8329 · #2FA98D`) n'est à sortir que si une comparaison à trois
  séries devient indispensable — un schéma de flux n'en est pas une.
- **Contraste** : sur `#080c16`, `#ededed` ne passe 4,5:1 **qu'à partir de 0,50
  d'alpha**. Les étiquettes d'un schéma sont du texte, pas de la décoration.
- **Accessibilité du SVG** : `role="img"` + un `<title>` qui dit ce que la figure
  montre, ou `aria-hidden` **si et seulement si** la copie à côté porte déjà
  l'information en entier. Le second cas est préférable ici : les trois
  paragraphes existent, le schéma les résume.
- **i18n** : chaque étiquette du schéma est une string sous
  `pages.services.detail.ia.data`, dans les **deux** locales. Une clé manquante
  est silencieuse en prod. Prévoir que les libellés FR sont plus longs que les
  EN — un `<text>` SVG ne se re-wrappe pas tout seul.
- **GEO §1.5** ([`geo-plan.md`](./geo-plan.md)) : toute la copie dans le HTML SSR.

---

## 5. Question ouverte — les numéros 01/02/03

La section les porte encore (`section.numLg` + `numOutline`). Le 06/08, les
mêmes numéros ont été retirés de « Ce que vous recevez » sur
`/services/applications-web`, pour une raison qui **s'applique telle quelle
ici** : trois garanties simultanées ne sont pas une séquence, rien n'est fait en
premier ni en dernier, donc les numéroter donne un ordre que le contenu n'a pas.

Nuance à trancher avec Mihai : `flow` est explicitement *antérieur* (« décidé
avant la première ligne de code »), donc il existe un fil temporel faible que
`sensitive` et `reversible` ne prolongent pas. **À poser comme question, pas à
décider seul.**

---

## 6. Méthode — la planche d'abord

Workflow validé et reconduit deux fois : **une planche de variantes en artifact,
Mihai choisit à l'œil, on code le gagnant.** Ne pas coder avant le choix.

- Thème exact du site dans la planche (`#080c16`, `#ededed`, `#96b9f9`, filets
  1px, Outfit + Manrope embarquées en data-URI depuis `public/fonts/**` — le CSP
  des artifacts bloque les CDN de polices).
- Montrer **la section entière** à chaque variante, pas seulement le schéma :
  c'est la couture avec `honesty` au-dessus et la mini-FAQ en dessous qui se
  juge.
- Copie FR de production verbatim, jamais réécrite dans une maquette.
- Planches existantes, à ne pas refaire : les douze formes de graphiques
  ([artifact](https://claude.ai/code/artifact/38f4933e-4829-4e1d-a0f7-d0bf1a4af7e2)),
  les variantes des sections web
  ([artifact](https://claude.ai/code/artifact/b09099e7-07a9-4c24-a1bf-31090b6f6453)),
  et celle du 06/08 pour prix + livrables
  ([artifact](https://claude.ai/code/artifact/b04f834e-76e8-4d3d-9848-f1f8f18c4f22)).

---

## 7. Fait le 2026-08-06 — à ne pas défaire

Trois commits, **poussés** (contrairement aux sessions précédentes ; Mihai a
donné son accord explicite le 06/08 — la règle par défaut reste : rien de poussé
sans son feu vert).

**`/services/applications-web`** — les deux sections retenues sur la planche :

- `web/deliverables.jsx` : **bento 2×2 à lignes partagées**, numéros 01–04
  retirés, l'amorce du titre prend l'accent (clés `titleLead` / `titleRest`,
  les deux locales). Précédent i18n suivi : le préfixe « Le signal : » de la
  page IA était déjà devenu sa propre clé pour la même raison.
- `web/price-method.jsx` : **plus aucun cadre**. Titre, paragraphe, les trois
  engagements sur une ligne, les trois métiers, la note. Les métiers sont
  **entre** les engagements et la note — la note dit « la même méthode » et doit
  suivre la méthode, y compris pour un lecteur sans CSS.
- Les trois métiers ne sont **nommés qu'une fois**, dans leur titre ; leurs clés
  `cols.*.title` ont quitté les messages. ⚠️ **Ne pas les réintroduire** en
  trouvant la liste nue : la répétition était le défaut signalé.
- Les deux listes à trois (engagements / métiers) sont **volontairement
  identiques de forme** — même grille, même tiret tracé. Ce qui les sépare est
  le rang : texte .72 / tiret .7 pour les engagements, .62 / .45 pour les
  métiers. **Ne pas « harmoniser » en alignant les alphas.**
- ⚠️ Le garde-fou survit et reste vrai : le titre nomme les trois métiers et
  s'arrête là. **Il ne dit pas que le prix les couvre.**

**Homepage** : `recent-works-showcase.module.scss` gagne un
`margin-bottom: clamp(112px, 10vw, 180px)` — c'était la dernière section du site
sans respiration en bas, le logo du footer touchait le bouton. **Margin et non
padding** : la hauteur de `.work` est écrite en JS (100vh + distance
d'épinglage), un padding serait absorbé par ce calcul.

**Composition à jour de la page web** :

```
web : PosterHero · MadeInHouse[grille + compteurs + propriété] · Deliverables[bento 2×2]
      · PriceMethod[sans cadre, métiers inclus] · MiniFaq · Siblings · CtaBand
```

---

## 8. Vérification et clôture

Reprendre **la checklist §6 de `services-graphs-session-prompt.md`** (purge du
port 3000, matrice curl FR nu **et** `/en`, `hrefLang` sensible à la casse, lint
**baseline 3 erreurs**, `seo:jsonld`, heredoc pour les messages de commit).
Points propres à cette mission :

- Le schéma est-il **dans le HTML SSR** ? `curl | grep` sur une étiquette du
  SVG, dans les deux langues. C'est le test qui rattrape une régression vers un
  rendu client.
- Aucune animation ajoutée sur `/services/ia` : `grep` de `useReveal`,
  `revealStyles`, `@keyframes` dans les fichiers `ia/`.
- Le SVG passe-t-il en FR **et** en EN sans débordement d'étiquette ? Les deux
  locales, aux trois breakpoints.
- Alphas du texte du schéma ≥ 0,50.

⚠️ **Piège du dépôt, mordu le 06/08** : un serveur `next dev` peut répondre 404
sur **toutes** les routes, y compris `/`, quand le cache Turbopack de dev
(`turbopackFileSystemCacheForDev`, expérimental) est périmé. Un `next build`
remet les choses d'aplomb. Ne pas chercher la cause dans le code applicatif :
si `/` est 404, ce n'est pas la section qu'on vient d'écrire.

⚠️ Un serveur d'un **autre projet** tournait sur le port 3001 pendant la
session : vérifier le `<title>` de ce qu'on interroge avant de conclure quoi que
ce soit d'une réponse HTTP.
