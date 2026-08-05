# Prompt de session — nouvelles sections pour les pages services

> ✅ **MISSION EXÉCUTÉE le 2026-08-05. Ce document est historique.**
> Il garde sa valeur pour le *pourquoi* (état GSC de départ, ce qui avait été
> démonté, les sources de contenu), mais **son état des pages est périmé** :
> les sections ont été construites, la timeline mvp remplacée par un
> calendrier, et `ScopeGuard` démontée depuis.
>
> **Le prompt de reprise est désormais
> [`services-graphs-session-prompt.md`](./services-graphs-session-prompt.md).**

> Écrit le 2026-08-05, en fin de session « retraits + maillage ».
> **Prompt à coller en ouverture de la prochaine session :**
>
> « Lis `docs/services-sections-session-prompt.md` et exécute-le : phase Plan
> d'abord, rien ne se code avant validation du plan par Mihai. »
>
> Priorité annoncée par Mihai : **`/services/applications-web` et
> `/services/seo`** d'abord. Les deux autres pages suivent le même moule une
> fois le moule validé.

## Mission

Les quatre pages offre ont perdu leurs sections « exemples de sites » le
2026-08-05, à la demande de Mihai et **pour l'instant seulement**. Il faut
décider ce qui prend leur place — pas remplir un trou, mais choisir ce qui rend
chaque page citable sur une question précise.

Livrable de la session : **un plan validé, puis les sections construites**, en
commençant par les deux pages prioritaires.

## Où en sont les pages (mesuré le 2026-08-05 sur le HTML rendu)

```
/services                    308 mots   6 h2   0 h3
/services/applications-web   482 mots   5 h2   8 h3   ← la plus fragile
/services/ia                 578 mots   2 h2   7 h3
/services/seo                598 mots   6 h2   8 h3
/services/mvp-30-jours       643 mots   7 h2   9 h3
/faq                        1277 mots   6 h2  15 h3
```

Composition actuelle, après retraits :

- **web** : hero · `MadeInHouse` · FAQ · offres sœurs · CTA — **une seule vraie
  section de contenu**. C'est celle qui a le plus besoin de matière.
- **seo** : hero · `Process` · `MetaProof` · FAQ · sœurs · CTA. `MetaProof`
  reste : il démontre la méthode sur la page elle-même, ce n'est pas un site
  client.
- **ia** : hero · bento 4 cas d'usage · contre-argument « quand l'IA n'est pas
  la réponse » · FAQ · sœurs · CTA.
- **mvp** : hero · `WeekTimeline` · `Included` · `FixedPrice` · FAQ · sœurs ·
  CTA.

## Ce qui a été retiré, et comment le remettre

**Rien n'a été supprimé.** Composants, styles et clés de traduction sont intacts
— chaque retour tient en un import :

| Page | Composant démonté | Ligne à remettre |
| --- | --- | --- |
| web | `web/case-studies.jsx` (3 projets) | `<CaseStudies/>` |
| seo | `shared/proof-case.jsx` + VENIZI | `<ProofCase namespace="pages.services.detail.seo" project={VENIZI}/>` |
| mvp | `shared/proof-case.jsx` + La Marquisette | `<ProofCase namespace="pages.services.detail.mvp" project={MARQUISETTE}/>` |
| /services | `index/proof-strip.jsx` | ⚠️ **supprimé**, à récupérer dans l'historique git |

Les deux `ProofCase` ont besoin de leur `const` (`projectsData.find(...)`) et de
l'import `projectsData` remis en haut du fichier.

**Question à poser à Mihai en début de session** : la preuve revient-elle sous
une autre forme (chiffres plutôt que captures d'écran) ou reste-t-elle dehors ?
La réponse change le plan : si elle reste dehors, chaque page doit fabriquer sa
crédibilité autrement.

## Ce que GSC peut et ne peut pas dire (relevé du 2026-08-05)

**Ne pas ouvrir la session en promettant un plan piloté par la donnée : il n'y
en a pas.** Sur 90 jours le domaine fait **11 clics et 20 requêtes**, dont ~18
sont la marque ou des fautes de frappe. Les seules requêtes non-marque :
`développeur site saas` (6 impressions, position 34), `entreprise technologique`
(7 impressions, position 3,9), `innovation software`.

État d'indexation au 2026-08-05 — **aucune page offre n'a jamais été crawlée** :

```
/services                    URL inconnue de Google
/services/applications-web   Découverte, non indexée
/services/ia                 Découverte, non indexée
/services/seo                URL inconnue de Google
/services/mvp-30-jours       Découverte, non indexée
/faq                         URL inconnue de Google
/en/services                 Page avec redirection (crawl du 2026-05-22, fiche périmée)
```

Sitemap valide, 18 URLs, téléchargé le 04/08. Les pages live renvoient 200,
`index, follow`, canonical correct — rien ne bloque techniquement. C'était un
problème de découverte, traité ci-dessous.

**Mihai a demandé l'indexation manuelle le 2026-08-05** de `/services`, `/faq`
et `/contact` dans les deux langues. Restent les huit pages offres (4 FR + 4 EN),
à demander **après le déploiement du maillage**. Vérifier l'évolution en début de
session avec `mcp__gsc__batch_url_inspection` — si les pivots sont passés
« Indexée », le maillage a fait effet et les offres suivent.

Baseline d'avant : [`docs/geo-gsc-baseline-2026-07-30.md`](./geo-gsc-baseline-2026-07-30.md).

## Le maillage interne est fait (commité le 2026-08-05, non poussé)

C'était la cause du « Discovered – not indexed » : les quatre offres n'étaient
atteignables que depuis `/services`, elle-même inconnue de Google.

- **Rail du hero** (`homepage/v2/hero/hero.jsx`) : les trois lignes sont
  devenues des liens vers web / ia / seo. Chevron au survol et au focus
  uniquement — au repos la colonne est l'objet qu'elle a toujours été.
- **Section MvpPromo** : second bouton fantôme vers `/services/mvp-30-jours`,
  libellé repris de `pages.services.index.detailCta`.
- **Footer** : les quatre offres dans la colonne du milieu de la barre du bas
  (`offer-links.styled.js`), donc **site-wide**. L'email a quitté la ligne
  d'adresse — il reste dans le JSON-LD, `llms.txt` et le menu overlay.

Vérifié : les cinq pages testées lient les quatre offres.

## Sources de contenu réellement disponibles

Par ordre de valeur, faute de données GSC :

1. **Les 15 questions de `/faq`** (`pages.faq.items` dans les messages) — elles
   encodent déjà les vraies questions prospects : coût, délais, agence vs
   freelance, propriété du code, WordPress vs sur-mesure, maintenance.
2. **La boîte de réception via le MCP Resend** (`list-received-emails`) — les
   questions réellement posées avant de signer. ⚠️ **Demander l'accord explicite
   de Mihai avant de lire quoi que ce soit** : c'est du contenu privé. La
   question lui a été posée le 05/08, sans réponse à ce jour.
3. **`src/app/llms.txt/route.js`** — l'inventaire canonique des quatre offres.
4. **Les SERP belges** sur les requêtes cibles, lues à la main.
5. ⚠️ **Ne pas partir de `src/messages/fr.json`** pour la taxonomie : piège
   documenté dans [`m4-content-session-prompt.md`](./m4-content-session-prompt.md).

## Hypothèses de sections — à challenger, pas à exécuter telles quelles

Ce qui manque le plus n'est pas de la preuve visuelle, c'est **du chiffre**.
`/faq` répond déjà à « combien ça coûte » ; les pages offres, non.

- **web** (deux sections, c'est la plus vide) : « ce que vous recevez » —
  livrables concrets ; et « prix et délais » — fourchette assumée, ou à défaut
  la méthode de fixation du prix.
- **seo** : un bloc **GEO — être cité par les IA**. C'est le vrai
  différenciateur d'Hargile et la page qui doit le porter. Plus « ce qu'on
  mesure » (KPI, rythme de reporting).
- **ia** : « vos données » — hébergement, RGPD, réversibilité. Forte intention,
  et c'est déjà la question n°1 de la FAQ de cette page.
- **mvp** : « hors périmètre » — ce qui n'entre pas dans les 30 jours. Une
  promesse aussi nette a besoin de sa frontière pour rester crédible.

**Décision commerciale, pas technique, à trancher par Mihai** : afficher des
fourchettes de prix. C'est le point le plus rentable du plan. Question posée le
05/08, sans réponse à ce jour.

## Contraintes du dépôt — non négociables

- **Garde-fou GEO §1.5** ([`geo-plan.md`](./geo-plan.md)) : toute la copie dans
  le HTML SSR. Reveals via `useReveal` + `reveal.module.scss` uniquement, jamais
  d'`opacity: 0` dans un `style=`. La boucle de stagger couvre les index 1–8 et
  échoue en silence au-delà.
- **Goût établi** : sobre, hairline plutôt qu'aplats, Outfit + Manrope, reveals
  one-shot, **aucun effet en boucle ni backdrop ambiant**.
- **Le FAQ est le composant client partout**, `/services/ia` compris depuis le
  05/08 (`shared/mini-faq.jsx`, prop `bare` pour la section serveur IA).
  Mesuré : les réponses sont dans le premier HTML des quatre pages. Ne pas
  réintroduire d'island d'accordéon.
- **`CtaBand`** : une seule mise en page, copie à gauche et actions en face.
  `variant="box"` pour les deux pages pivots, `framed={false}` sur `/services`.
- **i18n** : toute string client → `CLIENT_NAMESPACES` dans
  `src/app/[locale]/layout.js`. Deux locales, pas de `nl`. Une clé manquante est
  silencieuse en prod.
- **JSON-LD** : si une section ajoute des Q/R, le nœud `FAQPage` ne doit exister
  qu'à **un** endroit par question. Aujourd'hui il n'est que sur `/faq`.
  Un nœud `Service` par page offre est une piste ouverte, à côté du nœud page et
  non à sa place (`build-json-ld.js`).

## Vérification et clôture

- Purger le port 3000 avant toute mesure (piège récidiviste du dépôt).
- `npm run build && npm run start`, puis curl matrix : 200 en FR nu **et** sous
  `/en`, canonical/hreflang/`lang` corrects.
- `npm run lint` : **baseline 3 erreurs** au 2026-08-05 —
  `examplesPages/NosValeurs2a.jsx`, `banner-mvp/mvp-studio.jsx:231`,
  `footer/Footer.jsx:45`. Comparer à 3, pas à 0. (Le doc M4 annonce 4 : périmé.)
- Contrôle GEO : les nouvelles sections doivent apparaître dans le HTML sans JS.
  Script utilisé le 05/08 — normaliser les entités avant de comparer, React
  échappe les apostrophes en `&#x27;` :

  ```js
  const norm = s => s.replace(/&#x27;/g, "'").replace(/\s+/g, ' ');
  const html = await (await fetch('http://localhost:3000/services/seo')).text();
  const text = norm(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' '));
  text.includes(norm(uneChaineDeLaNouvelleSection));
  ```

- Un commit par item, conventional commits. **Ne rien pousser, taguer ou
  déployer sans accord explicite de Mihai.**
- Après déploiement : demander l'indexation des huit pages offres, resoumettre
  le sitemap (MCP `gsc` + Bing), `npm run seo:indexnow`.
- Relever GSC à 4 et 8 semaines — c'est à ce moment-là que la boucle
  « GSC → contenu » devient réelle.

## MCP

- **`gsc`** : opérationnel, propriété `sc-domain:hargile.com`. L'API
  d'inspection est en **lecture seule** — impossible de déclencher une
  indexation, c'est Mihai qui clique.
- **`chatseo`** : ajouté à [`.mcp.json`](../.mcp.json) le 05/08 en portée projet
  (`https://api.chatseo.app/mcp`). Le binaire `claude` n'étant pas dans le PATH
  de l'extension VSCode, la config a été écrite à la main. **Non testé** :
  approuver le serveur au démarrage et vérifier avec `/mcp`.
- **`Resend`** : disponible, mais lecture de la boîte soumise à l'accord de
  Mihai (voir plus haut).
