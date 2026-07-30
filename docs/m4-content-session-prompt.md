# Prompt de session — M4 : FAQ + pages services, niveau Awwwards (ENG-91, ENG-92)

> Écrit le 2026-07-30. **Prompt à coller en ouverture de la prochaine session :**
>
> « Lis `docs/m4-content-session-prompt.md` et exécute-le : phase Plan d'abord,
> rien ne se code avant validation du plan. »
>
> Répartition décidée le 30/07 : **Dorian prend ENG-82** (les 20 prompts).
> Cette session-ci est la session de *construction de la surface citable* —
> la vraie contrainte du site selon le plan GEO (« a one-page site can only
> ever be cited for one thing »).

## Mission

Créer, dans cet ordre de valeur :

1. **`/services` — l'index** : présente les 4 offres, chacune menant à sa page.
2. **4 pages service** (ENG-91) — une par offre, chacune étant *la* réponse
   citable à une question précise d'un prospect.
3. **`/faq`** (ENG-92) — alimentée par les questions réelles des prospects,
   avec JSON-LD `FAQPage` (ça avance ENG-95 au passage).

Ambition visuelle : **niveau Awwwards**, en cohérence avec la homepage v2 —
pas un template générique à côté d'une homepage soignée.

## Les skills VibeCurb sont installés — s'en servir

`.claude/skills/` contient 4 skills (source : github.com/Yu-369/VibeCurb,
commités dans ce dépôt le 30/07) :

- **awwwards-hero** — pipeline hero uniquement : 6 architectures, typo à
  l'échelle du viewport, un seul point focal, palette serrée.
- **visual-redesign** — transformer du React fonctionnel-mais-moche en design
  soigné sans toucher au JS.
- **awwwards-motion** — animation et typographie cinétique sur layouts
  statiques.
- **pixel-perfect** — répliquer une référence visuelle (si Mihai apporte des
  screenshots de sites primés qu'il aime).

**Règle de préséance en cas de conflit : les contraintes de CE dépôt gagnent.**
Concrètement : si awwwards-motion propose un reveal `opacity: 0` inline, c'est
non — le système de reveal maison (ci-dessous) est la seule voie. Les skills
donnent la direction artistique ; le dépôt donne les lois physiques.

Goût établi du site (mémoire des sessions précédentes) : sobre, hairline/border
plutôt qu'aplats, Outfit + Manrope, reveals one-shot subtils, **aucun effet en
boucle ni backdrop ambiant permanent**.

## Sources de vérité pour le contenu

- **`src/app/llms.txt/route.js`** — l'inventaire canonique des 4 offres :
  apps web sur mesure PME · IA là où elle change le résultat · SEO automatisé ·
  MVP 30 jours à prix fixe. C'est LA base des 4 pages service.
- **`src/data/portfolio-data.js`** — les 3 preuves (Ecole du Bonheur,
  La Marquisette, VENIZI) à réutiliser comme social proof par page.
- **`src/lib/nap.js`** — toute mention d'adresse/contact passe par là.
- ⚠️ **NE PAS partir de `src/messages/fr.json`** : il traîne la taxonomie v1
  (dev / IA / analyse / maintenance), des projets morts (AGVES, I GO) et du
  lorem ipsum. Piège documenté, déjà mordu.
- **FAQ** : si `docs/geo-prompt-panel.md` existe (ENG-82, Dorian), mapper
  chaque entrée FAQ sur un prompt `P01`–`P20`. Sinon, rédiger depuis les offres
  et les questions réelles (coût, délais, stack, propriété du code, maintenance,
  sur-mesure vs WordPress) et réconcilier quand Dorian livre. **Ne pas bloquer
  sur ENG-82.**
- ⚠️ **ENG-83 (relevé de citations) est une photo d'AVANT** : idéalement il se
  passe avant la mise en ligne de ces pages. Le rappeler à Mihai en début de
  session — si le relevé n'est pas fait, la mise en prod peut attendre 2-3
  jours, pas l'inverse.

## Phase Plan (obligatoire, AVANT tout code)

Produire un plan et le faire valider par Mihai. Décisions à trancher dedans :

1. **Slugs** : partagés entre locales comme `/contact` (recommandé), et en
   quelle langue ? Proposition à challenger : `/services/applications-web`,
   `/services/ia`, `/services/seo`, `/services/mvp-30-jours` — marché cible
   francophone, l'EN les porte tels quels sous `/en/services/...`.
2. **Architecture de page service** : hero (awwwards-hero) + problème/promesse +
   déroulé concret + preuve (projet portfolio) + FAQ courte spécifique + CTA
   contact. À affiner par offre — 4 pages ne doivent pas être 4 clones.
3. **FAQ** : page unique `/faq` ou FAQ par service + index ? (Le JSON-LD
   `FAQPage` ne doit exister qu'à UN endroit par question — pas de duplication.)
4. **Navigation** : où entrent « Services » et « FAQ » dans la navbar/footer ?
5. **Étendue du run** : les 5 pages en une session, c'est ambitieux. Ordre de
   repli assumé : index + MVP (l'offre différenciante) + FAQ d'abord.

## Pièges d'intégration — la checklist qui évite de re-déboguer le connu

Chaque nouvelle page touche **8 fichiers**. En rater un = canonical/sitemap/
llms.txt qui se contredisent (exactement ce que le GEO combat).

1. 🛑 **`next.config.mjs` `redirects()` : retirer `services` de la liste
   `gone`** — aujourd'hui `/services` ET `/:locale(en|fr)/services` font un
   **301 permanent vers `/`**. Si on crée la page sans retirer la redirection,
   elle est inatteignable. Les 301 sont cachés dur par les navigateurs des
   visiteurs passés — accepter le coût, il est faible (peu de trafic).
   `solutions/*`, `sitemap`, `portfolio` restent morts. `about-us` reste 307.
2. **`src/seo/routes.js`** — une entrée `ROUTES` par page (`'services'`,
   `'services.mvp'`, `'faq'`, …) + les clés `seo.pages.*` dans **les deux**
   `src/messages/{fr,en}.json` (title, description, og.*, schemaType).
3. **`next-sitemap.config.js` `PAGES`** — sinon la page n'existe pas pour les
   moteurs. Le schéma d'URL est : FR nu, EN préfixé (`localeUrl` /
   duplication CJS dans le fichier — commentaires sur place).
4. **`scripts/validate-json-ld.mjs` `SITE_PATHS`** — sinon le validateur ne
   valide pas les nouvelles pages et « 0 erreur » devient un mensonge.
5. **`src/app/llms.txt/route.js`** — ajouter les pages à la liste ; c'est
   l'inventaire que lisent les crawlers IA.
6. **JSON-LD** : `schemaType` par page existe déjà via les messages
   (`CollectionPage` pour l'index, `FAQPage` pour la FAQ, `WebPage` pour les
   services). MAIS : `FAQPage` exige `mainEntity` (les Q/R) et une offre mérite
   un nœud `Service` **à côté** du nœud page, pas à sa place (commentaire dans
   `build-json-ld.js`) — **étendre `build-json-ld.js`**, puis
   `npm run seo:jsonld -- --site http://localhost:3000` (le contrôle négatif
   doit passer).
7. **Garde-fou GEO §1.5** — la copie intégrale dans le HTML SSR : reveals via
   `useReveal` + `reveal.module.scss` uniquement (la boucle de stagger couvre
   les index 1–8 : l'élargir si besoin, elle échoue en silence) ; **les
   réponses de la FAQ doivent être dans le HTML même si l'accordéon est fermé**
   (collapse en CSS/aria, jamais en montage conditionnel React). Contrôle :
   0 `opacity:0` dans un attribut `style=` (regex `opacity:0(?![.\d])`, via
   node — `grep -P` ne marche pas dans ce shell).
8. **i18n** : toute string client → `CLIENT_NAMESPACES` dans
   `src/app/[locale]/layout.js` ; une string manquante est silencieuse en prod.
   Deux locales, pas de `nl`.

## Vérification et clôture (rituel du dépôt)

- Purger le port 3000 AVANT toute mesure (piège n°1 du dépôt, récidiviste).
- `npm run build && npm run start` ; curl matrix : nouvelles pages **200 en FR
  nu et sous `/en`**, canonical/hreflang corrects, `lang` correct.
- `npm run lint` : comparer à la baseline **4 erreurs**, pas à 0.
- Un commit par item, conventional commits. **Ne rien pousser/tagger/déployer
  sans accord explicite de Mihai.**
- Après déploiement (quand Mihai dit go) : resoumettre le sitemap (GSC via MCP
  `gsc` + Bing), `npm run seo:indexnow`, demandes d'indexation, et **mettre à
  jour ENG-91 / ENG-92 / ENG-95 dans Linear** (rappel : le WAF devant Linear
  rejette les commandes shell avec pipe dans les commentaires — prose).
- Réécrire l'en-tête de `docs/next-session-prompt.md` en fin de session.
