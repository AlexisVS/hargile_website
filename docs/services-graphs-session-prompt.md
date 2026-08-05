# Prompt de session — suite des pages services (graphiques + arbitrages)

> Écrit le 2026-08-05, en fin de session « sections + graphiques ».
> **Prompt à coller en ouverture de la prochaine session :**
>
> « Lis `docs/services-graphs-session-prompt.md` et exécute-le. Commence par la
> décision ouverte §2.1 — rien d'autre n'est bloquant. »
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
mvp  : PosterHero · WeekCalendar · Included · FixedPrice · ScopeGuard · MiniFaq · Siblings · CtaBand
```

Poids mesuré sur le HTML rendu. ⚠️ Le script de comptage rend ~5 % de moins que
celui du doc précédent (mesuré sur `/services` et `/faq`, non touchées) —
comparer des tendances, pas des valeurs absolues :

```
/services                    295 mots
/services/applications-web   777 mots   (était 482)
/services/ia                 670 mots   (était 578)
/services/seo                999 mots   (était 598)
/services/mvp-30-jours       730 mots   (était 643)
/faq                        1210 mots
```

**Infrastructure ajoutée, réutilisable :**

- `reveal.module.scss` a un variant `.hairline` — un filet qui se dessine
  (scaleX depuis la gauche) au lieu de monter en fondu. Se compose avec les
  classes que `useReveal` pose déjà : **aucun JS modifié, pas de second
  observer**. Repli reduced-motion en fondu. Stagger toujours **1 à 8**.
- `shared/count-up.jsx` — le compteur extrait de `index/hero-stats.jsx`, partagé
  avec `mvp/scope-guard.jsx`. Le HTML SSR porte la valeur finale.
- `src/data/site-metrics.js` — vrais chiffres Lighthouse de la page seo. **§3.**

**Le calendrier horizontal a remplacé la timeline verticale sur mvp.**
`week-timeline.jsx` reste sur le disque, intact, sur les mêmes clés
`timeline.*` — un import le remet. Composants dormants aujourd'hui :
`mvp/week-timeline.jsx`, `shared/proof-case.jsx`, `web/case-studies.jsx`.

---

## 2. Décisions ouvertes — traiter §2.1 en premier

### 2.1 Variante « inclus / pas inclus » ⇠ **le seul point bloquant**

Planche de six variantes publiée pour arbitrage :
**https://claude.ai/code/artifact/a7464a34-3c48-44d4-84c9-3b50c9c519c2**

Recherche faite et sourcée. Les trois conclusions qui pilotent le choix :

1. **L'ordre compte.** L'effet de crédibilité d'une exclusion publiée dépend du
   fait qu'elle arrive **après** le positif, pas à côté à poids égal (Ein-Gar,
   Shiv & Tormala, *When blemishing leads to blossoming*, JCR 2012). La page les
   met aujourd'hui **côte à côte** ; la variante **B** corrige ça à copie
   constante.
2. **Ni coches/croix ni barré.** Un tableau de comparaison sert à départager
   plusieurs offres — il y en a une. Le NN/g exige des filets pour qu'un tableau
   reste suivable : ils viennent d'être retirés. Et ✓/✗ comme `line-through` ne
   sont pas transmis de façon fiable aux lecteurs d'écran.
3. **Le terrain est libre** : sur six pages de services productisés vérifiées
   (Designjoy, ManyPixels, Awesomic, Linear, Basecamp, ONCE), aucune ne montre
   ses exclusions de façon scannable.

**Si Mihai ne tranche pas : appliquer B.** Même copie, même composant, seuls
l'ordre et la largeur changent — c'est le seul changement que la recherche
soutient directement.

### 2.2 Doublon `Included` ↔ `ScopeGuard` ⇠ à corriger quelle que soit la variante

| `included.out` | `scope.points` |
| --- | --- |
| Les fonctionnalités reportées ensemble en v2 | Ce qui déborde part sur la feuille de route v2… |
| Le contenu métier que vous seul pouvez écrire | Le contenu métier reste à vous… |
| La maintenance long terme… | — |
| — | La seule vraie condition… un décideur joignable |

Seul « décideur joignable » est neuf : les deux sections sont à moitié le même
texte, à quelques mètres d'écart. Proposition faite à Mihai, **sans réponse** :
resserrer `ScopeGuard` sur ce qu'elle seule dit — la semaine 1 qui existe pour
découper, et la condition côté client. **Copie commerciale = son appel.**

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
- ⚠️ **Nouveau** : les trois sections de bas de page mvp (`Included`,
  `FixedPrice`, `ScopeGuard`) sont **sans cadre ni filet**, à la demande de
  Mihai le 05/08. La structure y est portée par l'échelle typographique, le
  poids d'encre et l'espace. **Ne pas y réintroduire de bordure sans le lui
  demander** — c'est un écart assumé au « hairline-led » du reste du site.
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
