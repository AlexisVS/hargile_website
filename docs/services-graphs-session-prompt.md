# Prompt de session — suite des pages services (graphiques + arbitrages)

> Écrit le 2026-08-05, en fin de session « sections + graphiques ».
> **Prompt à coller en ouverture de la prochaine session :**
>
> « Lis `docs/services-graphs-session-prompt.md` et exécute-le. Les deux
> décisions encore ouvertes sont §2.3 et §2.4 ; aucune n'est bloquante, donc
> commence par la dette de mesure (§3) si Mihai n'a rien à trancher. »
>
> Remplace [`services-sections-session-prompt.md`](./services-sections-session-prompt.md),
> dont la mission est exécutée.

---

## 1. Ce qui a été fait le 2026-08-05 (13 commits, **rien de poussé**)

Plan validé et exécuté :
[`services-sections-plan-2026-08-05.md`](./services-sections-plan-2026-08-05.md).

**Composition actuelle des quatre pages offre** — relevée dans le code, pas de
mémoire :

```
web  : PosterHero · MadeInHouse · Deliverables · PriceMethod · MiniFaq · Siblings · CtaBand
seo  : PosterHero · Process · MetaProof · MeasuredProof · GeoAnswer · Measures · MiniFaq · Siblings · CtaBand
ia   : PosterHero · [serveur : bento · honesty · DataGuarantees · MiniFaq · siblings · cta]
mvp  : PosterHero · WeekCalendar · Included · FixedPrice · MiniFaq · Siblings · CtaBand
```

Poids mesuré sur le HTML rendu. ⚠️ Le script de comptage rend ~5 % de moins que
celui du doc précédent (mesuré sur `/services` et `/faq`, non touchées) —
comparer des tendances, pas des valeurs absolues :

```
/services                    295 mots
/services/applications-web   777 mots   (était 482)
/services/ia                 670 mots   (était 578)
/services/seo                999 mots   (était 598)
/services/mvp-30-jours       621 mots   (était 643)
/faq                        1210 mots
```

⚠️ **mvp est la seule page qui a perdu du poids** : elle est montée à 730 puis
redescendue à 621 en fin de session, quand `ScopeGuard` a été démontée (§2.2).
C'est voulu — c'était du doublon — mais si la page doit regagner de la matière,
c'est celle-là qu'il faut regarder, et **pas** en réécrivant ce qui vient de
partir.

**Infrastructure ajoutée, réutilisable :**

- `reveal.module.scss` a un variant `.hairline` — un filet qui se dessine
  (scaleX depuis la gauche) au lieu de monter en fondu. Se compose avec les
  classes que `useReveal` pose déjà : **aucun JS modifié, pas de second
  observer**. Repli reduced-motion en fondu. Stagger toujours **1 à 8**.
- `shared/count-up.jsx` — le compteur extrait de `index/hero-stats.jsx`. Le HTML
  SSR porte la valeur finale. ⚠️ Son second consommateur était `scope-guard.jsx`,
  aujourd'hui démontée : **il n'est donc plus utilisé que par `/services`.**
  Il reste partagé et documenté comme tel — ne pas le réintégrer dans
  `hero-stats.jsx` sous prétexte qu'il n'a plus qu'un appelant.
- `src/data/site-metrics.js` — vrais chiffres Lighthouse de la page seo. **§3.**

**Le calendrier horizontal a remplacé la timeline verticale sur mvp**, et
`ScopeGuard` a été démontée. Rien n'est supprimé : composants, styles et clés
restent intacts, un import les remet. **Composants dormants au 2026-08-05 :**

| Fichier | Clés | Pourquoi démonté |
| --- | --- | --- |
| `mvp/week-timeline.jsx` | `mvp.timeline.*` (partagées avec le calendrier) | remplacé par `week-calendar.jsx` |
| `mvp/scope-guard.jsx` | `mvp.scope.*` (orphelines) | doublonnait les exclusions |
| `shared/proof-case.jsx` | `seo.proofCase`, `mvp.proofCase` | retrait des exemples clients (04/08) |
| `web/case-studies.jsx` | `web.cases.*` | idem |

---

## 2. Décisions — deux tranchées en fin de session, deux encore ouvertes

### 2.1 ✅ Variante « inclus / pas inclus » — **tranchée, appliquée**

Mihai a choisi la **variante B (empilée)** sur la planche
[https://claude.ai/code/artifact/a7464a34-3c48-44d4-84c9-3b50c9c519c2](https://claude.ai/code/artifact/a7464a34-3c48-44d4-84c9-3b50c9c519c2),
plus des coches en bleu accent. C'est en place dans `mvp/included.jsx`.

Ce qu'il faut savoir pour ne pas défaire la raison du choix :

- **L'ordre est la substance, pas la mise en page.** Une exclusion publiée
  volontairement n'achète de la crédibilité que si elle arrive **après** le
  positif, pas à côté à poids égal (Ein-Gar, Shiv & Tormala, *When blemishing
  leads to blossoming*, JCR 2012). Ne pas « rééquilibrer » en remettant deux
  colonnes côte à côte.
- **Les coches sont sûres ici parce que ce ne sont pas des plans.** Un tableau
  coches/croix sert à départager plusieurs offres ; il y en a une. La coche est
  donc une décoration sur une liste que son titre nomme déjà — d'où un **SVG
  `aria-hidden`** et non le caractère ✓, que les lecteurs d'écran énoncent de
  façon peu fiable. La liste exclue garde un tiret et **pas une croix rouge** :
  la palette n'a qu'un accent, et inventer une seconde couleur sémantique pour
  dire « non » échouerait au même test que les coches ont été conçues pour
  passer.
- **Ne pas réintroduire de barré** (`line-through` ne transmet rien) ni de
  tableau (le NN/g exige des filets pour qu'il reste suivable — ils sont partis).

### 2.2 ✅ Doublon `Included` ↔ `ScopeGuard` — **tranché : section supprimée**

`ScopeGuard` (« La limite qui tient la promesse ») est **démontée**. Deux de ses
trois puces redisaient les lignes « pas dans les 30 jours » ; la troisième — le
décideur joignable — est **déjà la réponse mot pour mot de la question 2 de la
mini-FAQ de la même page**. Vérifié avant de retirer : rien ne se perd.

Le composant, ses styles et les clés `mvp.scope` restent sur le disque.
⚠️ **Ne pas réécrire cette section « en mieux »** si la page paraît courte : le
problème d'origine était le doublon, pas la formulation.

### 2.3 Les phases du calendrier se chevauchent-elles ?

`mvp/week-calendar.jsx` les dessine **bout à bout**, parce que c'est ce que dit
la copie : semaine 1, semaines 2–3, semaine 4. La planche de graphiques les
montrait en chevauchement — c'était une illustration, pas un fait documenté.
Si elles se chevauchent réellement : **six nombres dans `PHASES`**, mais la copie
doit l'assumer avant qu'un dessin ne l'affirme. Question posée, sans réponse.

### 2.4 Le LCP publié sur /services/seo

`MeasuredProof` affiche un manqué assumé : affichage principal à 3,0 s contre un
seuil de 2,5 s, en barre hachurée, avec une note qui l'assume en toutes lettres.
Choix éditorial : quatre scores parfaits se lisent comme de la pub sur une page
qui se termine par « ce qu'on ne promet pas ». **Mihai valide ou demande le
retrait** — c'est une ligne à supprimer.

---

## 3. La seule vraie dette : les chiffres publiés vieillissent

`src/data/site-metrics.js` porte des mesures **réelles** de la page seo en
production, prises le 2026-08-05 : Performance 93, Accessibilité 96, Bonnes
pratiques 100, SEO 100, CLS 0, réponse serveur 40 ms, LCP 3,0 s.

⚠️ **Le mode d'échec n'est pas un chiffre faux, c'est un chiffre périmé sous une
date fraîche** — et la date est imprimée sur la page. Re-mesurer :

```bash
npx lighthouse@12 "https://hargile.com/services/seo" \
  --chrome-flags="--headless=new" --output=json --output-path=./lh.json \
  --quiet --only-categories=performance,accessibility,best-practices,seo
```

`measuredOn` se met à jour **dans le même commit** que les chiffres.
**À refaire après le déploiement**, puisque les nouvelles sections changent la
page mesurée. PageSpeed Insights sans clé API est en quota journalier épuisé —
passer par Lighthouse local, Chrome est installé sur la machine.

---

## 4. Graphiques — décidé et en attente

Planche des douze formes :
**https://claude.ai/code/artifact/38f4933e-4829-4e1d-a0f7-d0bf1a4af7e2**

- **Fait** : jauges Lighthouse + barres mesure-contre-seuil → `seo/measured-proof.jsx`.
- **Fait le même jour, en fin de session** : la grille de comptage (D) →
  `web/delivered-grid.jsx`, sur `/services/applications-web` et pas sur
  `/services`. Voir §8, qui prime sur ce qui précède la concernant.
- **Écarté avec raison** : l'avant/après Ecole du Bonheur (l'ancien WordPress
  n'est plus mesurable équitablement — sur une archive Wayback on mesurerait
  Wayback) ; la barre de couverture SSR (100 % partout : graphique plat que
  `MetaProof` dit déjà mieux en une phrase) ; la barre inclus/exclus du MVP
  (elle ne trace qu'un décompte de puces, pas une grandeur — et laisserait
  entendre que l'offre est « aux deux tiers »).
- **En attente de données** : courbe de trafic, positions par requête, petites
  séries. Rien à tracer avec 11 clics sur 90 jours. **Relever GSC à 4 et
  8 semaines.**

**Tranché : pas de librairie de graphiques.** Recharts et consorts rendent côté
navigateur — les chiffres n'arriveraient pas dans le premier HTML, ce qui
casserait exactement la règle dont `/services/seo` se vante. Tout est du SVG
écrit à la main, rendu côté serveur, zéro dépendance ajoutée.

**Palette** : le validateur refuse les accents du thème en série multiple
(#0EA5E9 et #5B8DEF sont à ΔE 7,3 en vision normale, sous le plancher de 15 —
indistinguables même sans daltonisme). Trio de rechange qui passe les six
contrôles sur fond `#080c16` : `#4A80D6 · #BE8329 · #2FA98D`. À ne sortir que si
une comparaison à trois séries devient indispensable : il est plus sombre et
plus saturé que l'accent du site.

---

## 5. Contraintes du dépôt — dont deux nouvelles

- **Garde-fou GEO §1.5** ([`geo-plan.md`](./geo-plan.md)) : toute la copie dans
  le HTML SSR. Reveals via `useReveal` + `reveal.module.scss` uniquement, jamais
  d'`opacity: 0` dans un `style=`. Stagger 1–8, échec silencieux au-delà.
- **Goût** : sobre, one-shot, aucun effet en boucle ni backdrop ambiant.
- ⚠️ **Nouveau** : les sections de bas de page mvp (`Included` et `FixedPrice`,
  ainsi que `ScopeGuard` tant qu'elle était montée) sont **sans cadre ni
  filet**, à la demande de Mihai le 05/08. La structure y est portée par
  l'échelle typographique, le poids d'encre et l'espace. **Ne pas y
  réintroduire de bordure sans le lui demander** — c'est un écart assumé au
  « hairline-led » du reste du site, limité à cette page.
- ⚠️ **Nouveau — contraste : mesurer, ne pas juger à l'œil.** Sur `#080c16`,
  l'encre `#ededed` ne passe 4,5:1 **qu'à partir de 0,50 d'alpha** (0,44 =
  3,89:1, échec AA). Piège mordu cette session sur la liste « pas inclus ».
- **i18n** : toute string client sous `pages.services.*`, déjà entier dans
  `CLIENT_NAMESPACES`. Deux locales. Clé manquante = silence en prod.
- **JSON-LD** : `FAQPage` uniquement sur `/faq` ; nœuds `Service` déjà en place.
  Aucune section ajoutée cette session n'introduit de Q/R.

---

## 6. Vérification et clôture

- Purger le port 3000 avant toute mesure (piège récidiviste du dépôt).
- `npm run build && npm run start`, puis matrice curl : 200 en FR nu **et** sous
  `/en`. ⚠️ L'attribut est émis en **`hrefLang`** — un grep sensible à la casse
  sur `hreflang` le fait paraître absent à tort. Piège mordu cette session.
- `npm run lint` : **baseline 3 erreurs** — `NosValeurs2a.jsx`,
  `mvp-studio.jsx:231`, `footer/Footer.jsx:45`. Comparer à 3, pas à 0.
- `npm run seo:jsonld -- --site http://localhost:3000` : 0 erreur, 18 sources.
- Contrôle GEO : normaliser les entités avant de comparer (`&#x27;` → `'`).
- ⚠️ **Pas de backticks dans un message de commit passé en `-m` depuis bash** :
  ils sont interprétés comme substitution de commande et le code disparaît du
  message. Utiliser un heredoc — `git commit -F - <<'MSG'`. Mordu cette session.
- **Ne rien pousser, taguer ou déployer sans accord explicite de Mihai.**
- Après déploiement : indexation des huit pages offres, resoumission du sitemap
  (MCP `gsc` + Bing), `npm run seo:indexnow`, et **re-mesure Lighthouse** (§3).

---

## 7. État GSC au 2026-08-05

L'indexation manuelle demandée le matin a porté : `/faq` et `/contact` sont
passées **« Soumise et indexée »**, crawlées le 05/08. Les quatre pages offres
restent « Découverte, non indexée » ou inconnues — attendu, le maillage interne
n'est pas déployé. Vérifier en ouverture avec `mcp__gsc__batch_url_inspection` :
si les offres ont bougé, le maillage a porté.

Toujours **11 clics et 20 requêtes sur 90 jours**. **Ne pas ouvrir la prochaine
session en promettant un plan piloté par la donnée : il n'y en a toujours pas.**

---

## 8. Addendum du 2026-08-05, fin de journée — la grille de comptage est en ligne

> Écrit après les §1–7 : **en cas de contradiction avec ce qui précède, ce
> paragraphe gagne.** Trois commits, rien de poussé.

**Ce qui a changé sur `/services/applications-web` :**

```
web : PosterHero · MadeInHouse[grille + compteurs + propriété] · Deliverables
      · PriceMethod[+ conçu/codé/maintenu] · MiniFaq · Siblings · CtaBand
```

- `web/delivered-grid.jsx` — 23 carrés, un par projet livré, **chacun un lien**
  vers le site du client. Rampe d'un seul accent sur l'année, du plus récent au
  plus ancien. Plancher d'opacité **0,52** : ce sont des liens, donc 3:1
  minimum ; 0,45 tombe à 2,81:1. Compteurs **23 / 15 / ∞**, les deux premiers
  calculés, jamais écrits.
- **Conçu / codé / maintenu a quitté `MadeInHouse` pour `PriceMethod`**, clés
  i18n comprises (`madeInHouse.cols` → `priceMethod.cols`). L'encadré de
  propriété reste dans `MadeInHouse`, sous les compteurs — la proposition 3A de
  la planche (le déplacer vers `Deliverables`) **reste ouverte**.
- Les filets au-dessus des trois colonnes sont retirés (Mihai). Écart local au
  hairline-led, comme sur mvp : **ne pas les rétablir sans lui demander.**

**La source des projets a changé de dépôt.** `scripts/sync-portfolio.mjs` lit
`Hargile Portfolio/hargile-portfolio/src/data/projects` et écrit
`src/data/portfolio-projects.json`, commité. `npm run sync:portfolio`.

⚠️ **`src/data/portfolio-data.js` est périmé et toujours en service** : 22
projets, 13 catégories, contre 23 et 18 en amont. Il alimente encore la page
portfolio, et **`index/hero-stats.jsx` affiche un `22` écrit en dur** —
c'est-à-dire que `/services` annonce aujourd'hui un chiffre faux d'une unité.
Le brancher sur le nouveau JSON est le prochain geste évident, et il n'est pas
fait.

⚠️ **Le `15` n'est pas le `18` du portfolio.** `SECTOR_GROUPS`, dans le script,
fusionne « Tourisme », « Hotellerie » et « Hébergement & Tourisme » en un métier
et « Streetwear » dans « Mode ». C'est un jugement éditorial assumé, écrit à un
seul endroit. Le correctif réel est en amont : renommer les `industry` du
portfolio, après quoi le tableau se vide.

**Planches à jour :**

- Variantes des sections web (2·D est celle qui a été construite) :
  [https://claude.ai/code/artifact/b09099e7-07a9-4c24-a1bf-31090b6f6453](https://claude.ai/code/artifact/b09099e7-07a9-4c24-a1bf-31090b6f6453)
- Les douze formes : voir §4.

**Côté dépôt portfolio** — plan écrit, **aucun code touché** :
`.planning/phases/16-visual-alignment-with-hargile-com/`. Alignement complet
décidé par Mihai (Outfit + Manrope, Cormorant abandonnée, fond `#080c16`).
Trois pièges y sont consignés : l'ordre des `@font-face`, le fond qui bouge en
famille, et `--color-text-muted` à 0,3 qui échoue AA sur le nouveau fond.

**Vérifié** : build propre, lint à 3 (baseline), 200 en FR nu et sous `/en`,
`seo:jsonld` 0 erreur sur 18 sources, les 23 liens et les deux compteurs
présents dans le HTML rendu serveur dans les deux langues.
