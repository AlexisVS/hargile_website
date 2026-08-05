# Nouvelles sections des pages services — plan (session du 2026-08-05)

> **Plan validé et exécuté le 2026-08-05**, dans l'ordre des commits de la
> section 8. Vérification passée : build OK, lint à la baseline de 3 erreurs,
> les 8 URLs (4 pages × FR/EN) en 200 avec canonical et hreflang corrects,
> toute la copie des nouvelles sections présente dans le HTML sans JS, JSON-LD
> valide sur 18 sources et `FAQPage` toujours uniquement sur `/faq`.
> **Rien n'est poussé ni déployé** — reste la validation visuelle de Mihai.
>
> ⚠️ **La page mvp a évolué après l'exécution de ce plan**, le même jour : la
> timeline verticale a été remplacée par un calendrier horizontal, les trois
> sections de bas de page ont perdu leurs cadres, et `ScopeGuard` — décrite en
> §4 ci-dessous — a été démontée parce qu'elle doublonnait les exclusions. Ce
> document reste le plan tel que validé ; pour l'état réel des pages, voir
> [`services-graphs-session-prompt.md`](./services-graphs-session-prompt.md).

## Contexte

Les quatre pages offre ont perdu leurs sections « exemples de sites » et il faut décider ce qui les remplace — pas remplir un trou, mais rendre chaque page citable sur une question précise, avec une exécution immersive de niveau Awwwards **dans le goût établi** (sobre, hairline, one-shot, zéro effet en boucle).

Décisions prises par Mihai en ouverture de session :
1. **La preuve revient en chiffres, pas en captures** — uniquement des chiffres réels (30 jours, 3 projets, 50 boutiques, 2–3 langues, 100 % in-house). Aucun chiffre inventé, aucun score Lighthouse/position promis.
2. **Aucune fourchette de prix** — une section « comment le prix est fixé » (méthode) à la place.
3. **Pas de lecture de la boîte Resend** — sources : les 15 questions de `/faq`, les mini-FAQ, `llms.txt`.

État GSC relevé ce jour : l'indexation manuelle a fonctionné (`/faq` et `/contact` **indexées**, crawl 2026-08-05) ; les pages offres attendent le déploiement du maillage — normal.

Priorité : **web + seo construites d'abord** ; ia + mvp suivent le même moule une fois validé.

## La direction immersive (filtrée par le goût)

Trois leviers, chacun utilisé avec retenue :
- **Numéraux d'affichage géants** (`.numXl`/`.numLg` + `.numGhost`/`.numOutline` de `v2-section.module.scss` — existants, jamais utilisés sur les pages détail, `aria-hidden`).
- **Hairline qui se dessine** — nouveau variant one-shot dans `reveal.module.scss` (scaleX, origin left), même chorégraphie de stagger, fallback reduced-motion en fondu.
- **Un count-up** partagé (extrait de `hero-stats.jsx`), HTML SSR portant la valeur finale.

Un seul « moment signature » par page. Rejetés : marquees, blobs, gradients animés, curseur custom, parallax, sections pinnées.

## 0. Infrastructure partagée (commit 1)

**`src/components/pages/homepage/v2/reveal.module.scss`** — variant `.hairline` (marqueur ajouté au call-site, compose avec `.pending`/`.revealIn` posés par `useReveal`, aucun changement JS) :
- `.pending.hairline { opacity: 1; transform: scaleX(0.001); transform-origin: left; }` — le HTML SSR porte la règle pleine largeur, contrat subtract-never-add intact.
- `.revealIn.hairline { animation-name: v2RevealRule; }` + keyframes scaleX ; la boucle de délais `data-reveal-index` s'applique telle quelle.
- Reduced motion : bascule sur `v2RevealFade`.

**`src/components/pages/services/v2/shared/count-up.jsx`** — nouveau : extraction verbatim du `Counter` interne de `index/hero-stats.jsx` (SSR = valeur finale, IO à 0.6, `textContent`, bail reduced-motion) ; `hero-stats.jsx` refactoré pour l'importer. Zéro changement de comportement sur `/services`.

La boucle de stagger 1–8 n'est **pas** élargie ; tout reste ≤ index 5.

## 1. /services/applications-web — deux sections (priorité 1)

Nouvel ordre dans `ServiceWebClient.jsx` : PosterHero · MadeInHouse · **Deliverables** · **PriceMethod** · MiniFaq · SiblingOffers · CtaBand.

### 1.1 `web/deliverables.jsx` — « Ce que vous recevez. » — moule A (colonnes)
h2 `reveal(0)` · lead `reveal(1)` · 4 colonnes `reveal(2..5)`, chacune : hairline dessinée (même index que sa colonne — trait et copie synchronisés), numéral `.numOutline` « 01 »–« 04 » réduit, h3, p.
Clés `pages.services.detail.web.deliverables` : `title`, `lead` (rien ne reste chez nous — 100 % in-house), `items.design` (maquettes + design system, même équipe), `items.code` (dépôt à votre nom — écho ownership sans le répéter), `items.live` (production sur votre domaine, dans vos langues — trilingue Marquisette / bilingue ce site), `items.keys` (accès + documentation — « vous restez par choix »). ~200 mots FR.
**Moment signature de la page : les quatre hairlines qui se dessinent en cascade sous les numéraux outline.**

### 1.2 `web/price-method.jsx` — « Comment le prix est fixé. » — moule B (cadre)
Cadre `reveal(0)`, hairline interne `reveal(1)`. Aucun chiffre — commentaire de tête de fichier façon `fixed-price.jsx`.
Clés `pages.services.detail.web.priceMethod` : `title`, `text` (pas de tarif unique honnête ; prix arrêté au cadrage, annoncé avant, figé — FAQ `cout`), `points[3]` (périmètre figé / pas de facturation au temps passé / idée nouvelle chiffrée à part — FAQ `prix-fixe`), `note` (côté délais : le MVP prix fixe sort en 30 jours). ~140 mots FR.

Page à ~700+ mots FR au total.

## 2. /services/seo — deux sections (priorité 1)

Nouvel ordre dans `ServiceSeoClient.jsx` : PosterHero · Process · MetaProof · **GeoAnswer** · **Measures** · MiniFaq · SiblingOffers · CtaBand. Récit : MetaProof démontre sur cette page → GeoAnswer en fait l'offre → Measures dit comment on en répond.

### 2.1 `seo/geo-answer.jsx` — « Être cité par les IA. » — moule A — porte le différenciateur
h2 **gradient identitaire** `reveal(0)` · lead `reveal(1)` (quand on demande à ChatGPT/Perplexity…, être cité = le nouveau référencement) · 3 colonnes `reveal(2..4)` avec hairline dessinée : `readable` (copie dans le premier HTML), `structured` (schema.org partout), `answers` (une page = une vraie question, le format que citent les moteurs de réponse) · strip de clôture `reveal(5)` (frontière honnête : personne ne contrôle les algorithmes ; on garantit la méthode et la transparence). ~150 mots FR.
**Moment signature : le h2 gradient + les trois traits synchronisés. Pas de count-up ici (aucun chiffre de citation réel n'existe — on n'en promet pas).**

### 2.2 `seo/measures.jsx` — « Ce qu'on mesure — et ce qu'on ne promet pas. » — moule B
Cadre `reveal(0)`, hairline interne `reveal(1)`.
Clés `pages.services.detail.seo.measures` : `title`, `text` (on regarde les mêmes chiffres que vous), `points[3]` (positions sur les requêtes métier / trafic organique avec l'échéance honnête semaines-vs-mois / pages citées par les moteurs de réponse), `refusal` (ce qu'on ne vend pas : la première position garantie). ~110 mots FR.

## 3. /services/ia — `ia/data-guarantees.jsx` — moule C (serveur)

Monté dans `ia-offre-section.jsx` entre `.counter` et `.faqBlock`, `getTranslations`, **aucun reveal** (cohérent avec le corps serveur de la page — choix de chorégraphie, pas un oubli). Trois rangées hairline avec `.numOutline` « 01/02/03 » réduits.
Clés `pages.services.detail.ia.data` : `title` (« Où vont vos données. »), `rows.flow` (défini avant toute intégration : quelles données, quel fournisseur, quel contrat), `rows.sensitive` (les données sensibles restent chez vous — RGPD), `rows.reversible` (fournisseur remplaçable par conception, le code vous appartient). ~110 mots FR.

## 4. /services/mvp-30-jours — `mvp/scope-guard.jsx` — moule B + le count-up de la page

Dans `ServiceMvpClient.jsx` après `FixedPrice`, avant `MiniFaq`. Cadre `reveal(0)` ; en coin de cadre, « 30 » en `.numXl .numGhost` aria-hidden animé par `CountUp to={30}` (SSR = « 30 »). WeekTimeline garde la spine scroll-linked : chaque levier une seule fois par page.
Clés `pages.services.detail.mvp.scope` : `title` (« La limite qui tient la promesse. »), `text` (la semaine 1 existe pour découper), `points[3]` (un décideur joignable / ce qui déborde va sur la feuille de route v2 / le contenu métier reste à vous). ~120 mots FR.

## 5. i18n & JSON-LD

- Toutes les clés sous `pages.services.detail.*` — l'arbre `pages.services` est déjà entier dans `CLIENT_NAMESPACES` : rien à déclarer. FR d'abord, EN ensuite.
- Aucune nouvelle copy formulée en Q/R → aucun risque de doublon `FAQPage` (reste uniquement sur `/faq`). Les nœuds `Service` de `build-json-ld.js` sont déjà en place — pas de travail JSON-LD.

## 6. Fichiers

Nouveaux (13) : `web/deliverables.{jsx,module.scss}`, `web/price-method.{jsx,module.scss}`, `seo/geo-answer.{jsx,module.scss}`, `seo/measures.{jsx,module.scss}`, `ia/data-guarantees.{jsx,module.scss}`, `mvp/scope-guard.{jsx,module.scss}`, `shared/count-up.jsx` — tous sous `src/components/pages/services/v2/`.
Modifiés (8) : `reveal.module.scss`, `index/hero-stats.jsx`, `ServiceWebClient.jsx`, `ServiceSeoClient.jsx`, `ServiceMvpClient.jsx`, `ia/ia-offre-section.jsx`, `src/messages/fr.json`, `src/messages/en.json`.

## 7. Vérification

1. Purger le port 3000, puis `npm run build && npm run start`.
2. Matrice curl : 4 pages × FR nu et `/en` → 200, `lang`, canonical, paire hreflang.
3. `npm run lint` : comparer à la **baseline de 3 erreurs** — toute 4ᵉ erreur est une régression.
4. Contrôle GEO : script fetch avec normalisation des entités (`&#x27;` → `'`) — une string distinctive par nouvelle section, par locale.
5. Audit reveal : grep `data-reveal-index` dans les nouvelles sections — max ≤ 5.
6. Spot-check reduced-motion : hairlines pleines largeur, « 30 » statique, pas de rise.

## 8. Commits (un par item, conventional ; rien n'est poussé/tagué/déployé sans accord explicite)

1. `feat(reveal): hairline-draw variant and a shared count-up island`
2. `content(web): what you receive and how the price is set`
3. `content(seo): being cited by AI answers, and what gets measured`
4. `content(ia): where your data goes, in the server body`
5. `content(mvp): the boundary that holds the 30 days`

Séquencement : commits 1–3 (web + seo) d'abord — validation visuelle par Mihai en hot reload — puis 4–5 sur le même moule. Après déploiement (au go de Mihai) : demande d'indexation des 8 pages offres, resoumission sitemap, `npm run seo:indexnow`.
