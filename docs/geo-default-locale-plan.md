# Locale par défaut sans préfixe — cadrage

> GEO plan §1.2. Écrit le 2026-07-29, **après lecture du code**, pas d'après le
> plan. Conclusion en tête : **ne pas exécuter maintenant.** Ce document existe
> pour que la décision soit prise sur des faits, et pour que le jour où ça se
> fait, ça se fasse en une fois.

## Ce qu'on croyait, et ce qui est vrai

Le `geo-plan.md` §1.2 et le prompt de reprise décrivent l'item comme « passer
`localePrefix: 'as-needed'` dans `src/i18n/routing.js` ». **Ça ne marcherait
pas**, et c'est le fait le plus important de ce document.

`src/i18n/routing.js` ne déclare que `locales` et `defaultLocale`. La valeur
`localePrefix` y est consommée par exactement deux choses :

1. `createNavigation(routing)` dans `src/i18n/navigation.js` — c'est-à-dire la
   génération des `href` par `<Link>` et `redirect` ;
2. le middleware fourni par next-intl (`createMiddleware`) — **qui n'est pas
   utilisé dans ce dépôt**.

Le routage de locale est fait par `src/proxy.js`, écrit à la main. Il ne lit ni
`localePrefix` ni quoi que ce soit d'autre que `routing.locales` et
`routing.defaultLocale`. Sa règle actuelle est simple et sans exception :
**toute URL sans préfixe de locale est redirigée vers `/{locale}/…`**, où
`locale` vient du cookie `NEXT_LOCALE` ou, à défaut, de `defaultLocale`.

Conséquence directe : poser `localePrefix: 'as-needed'` ferait générer des
`href` **non préfixés** par tous les `<Link>` du site, que `proxy.js`
redirigerait aussitôt en 307 vers la version préfixée. On aurait ajouté une
redirection à **chaque navigation interne** pour supprimer celle de l'apex.
C'est strictement pire que l'état actuel.

**Il n'y a donc pas de « flip de config ». Il y a une réécriture de
`src/proxy.js`.**

## État vérifié aujourd'hui (2026-07-29, prod v0.20.0 + local)

Tout ce qui suit est correct et ne demande rien — c'est ce qu'une migration
mettrait en jeu.

- `defaultLocale: 'fr'` est déjà posé dans `routing.js`, et cohérent avec
  `next-sitemap.config.js` (`DEFAULT_LOCALE = 'fr'`) et
  `shared-metadata.js` (`isDefault = locale === 'fr'`).
- L'apex `https://hargile.com/` → **307** vers `/fr` (via `proxy.js`). `/fr` ne
  redirige pas.
- Les `hreflang` sont justes sur les 6 pages : `fr`, `en`, `x-default` → FR, et
  le `canonical` pointe sur la page elle-même. Vérifié dans le HTML servi.
- Le `sitemap.xml` contient les 6 URLs préfixées, toutes en 200.
- `proxy.js` ignore tout chemin contenant un point (`PUBLIC_FILE = /\.(.*)$/`),
  ce qui est pourquoi `/sitemap.xml`, `/robots.txt` et `/llms.txt` sont servis
  sans passer par la locale.

## Ce que la migration coûterait réellement

Chaque point ci-dessous est un fichier à changer **dans le même déploiement**.
Une migration d'URL à moitié faite produit des canoniques qui pointent vers des
redirections, ce qui est le pire des trois états possibles.

| # | Fichier | Ce qui casse si on l'oublie |
| --- | --- | --- |
| 1 | `src/proxy.js` | Le cœur. Il faut **réécrire** dans FR non préfixé : servir `/contact` par une **rewrite** interne vers `/fr/contact` (pas une redirection), et rediriger `/fr/*` → `/*` en 301. Aujourd'hui il fait exactement l'inverse. |
| 2 | `src/i18n/routing.js` | `localePrefix: 'as-needed'` — nécessaire pour que `<Link>` génère les bons `href`, mais **inutile seul** (voir plus haut). |
| 3 | `src/seo/generate-page-metadata.js` | `baseUrl = ${SITE_URL}/${locale}${pathSuffix}` → canonical et hreflang FR faux sur les 6 pages. |
| 4 | `src/seo/build-json-ld.js` | Même construction, même problème : `url` et `@id` de chaque page. Le `@id` **change**, donc l'entité page est réémise sous une nouvelle identité. |
| 5 | `src/app/[locale]/shared-metadata.js` | `baseUrl`, et `alternates.languages` (qui n'a d'ailleurs **pas** de `x-default` ici — c'est `generate-page-metadata` qui le fournit, et lui seul). |
| 6 | `next-sitemap.config.js` | `url(locale, path)` construit `/${locale}${path}` en dur. Sans changement il émettrait 6 URLs dont 3 seraient devenues des redirections — exactement le défaut corrigé lors du nettoyage précédent du sitemap. |
| 7 | `next.config.mjs` `redirects()` | Chaque page morte est déclarée deux fois : `/:locale(en|fr)/x` et `/x`. La forme nue entrerait en collision avec le nouvel espace de noms FR non préfixé. À relire ligne par ligne. |
| 8 | `src/proxy.js`, branche cookie | Aujourd'hui `/` redirige vers la locale **du cookie**. En FR non préfixé, `/` doit servir le FR de façon canonique. Rediriger automatiquement un visiteur EN depuis `/` est précisément ce que Google déconseille sur une page `x-default`. À trancher, pas à porter tel quel. |

Et hors dépôt :

- Les 3 URLs FR (`/fr`, `/fr/contact`, `/fr/legal/privacy-policy`) sont
  **indexées aujourd'hui**. Une migration les remplace par `/`, `/contact`,
  `/legal/privacy-policy`. Il faut des 301 permanentes, resoumettre le sitemap
  à Search Console **et à Bing** (voir `geo-bing-indexnow-runbook.md`), et
  accepter quelques semaines de réindexation.
- Tout lien externe existant vers `/fr…` passe par une redirection de plus.

## Ce que ça rapporte

Honnêtement, peu, et rien qui soit mesurable aujourd'hui :

- **Suppression du 307 sur l'apex** (~44 ms sur le chemin critique, et `/fr`
  qui apparaît deux fois dans l'arbre de dépendances PSI). Mais **CrUX ne
  renvoie aucune donnée** pour hargile.com : les Core Web Vitals ne pèsent pas
  sur le référencement de ce site, et le score labo n'est que du diagnostic. Le
  plan perf est clos.
- **URLs FR plus courtes et plus naturelles** (`hargile.com/contact`). Vrai
  bénéfice de présentation, effet SEO nul en soi.
- **`/` sert du contenu au lieu de rediriger.** Marginal : les crawlers IA
  suivent les redirections sans difficulté, et le sitemap donne les URLs
  canoniques directement.

Aucun de ces gains ne répond à la contrainte réelle du site, qui est de n'avoir
que **3 pages**.

## Recommandation

**Ne pas exécuter maintenant. À refaire au même moment que la phase 2.**

La phase 2 du `geo-plan.md` crée `/services/*`, `/about-us` et des pages
d'études de cas. Ces URLs n'existent pas encore : les créer directement dans le
schéma non préfixé ne coûte rien, alors que migrer d'abord puis créer, ou créer
puis migrer, veut dire **deux** vagues de réindexation sur le même site. Une
seule migration, au moment où l'espace d'URL change de toute façon.

Si la décision est prise de le faire quand même avant, l'ordre est : réécrire
`proxy.js` en premier avec les 301 `/fr/*` → `/*`, puis les six fichiers de
construction d'URL, puis le sitemap, **le tout dans un seul commit et un seul
déploiement** — et vérifier après coup que `curl -sI https://hargile.com/fr`
renvoie 301 vers `/`, que `/` renvoie 200, et que le `canonical` de `/` est
`https://hargile.com/`.

## Détail relevé en passant (pas dans le périmètre)

`src/proxy.js`, branche « locale confusion » : sur `/en/fr/contact`, la
redirection est construite avec `locale` (cookie ou défaut), pas avec
`pathParts[0]`. Un visiteur avec `NEXT_LOCALE=fr` demandant `/en/fr/contact`
atterrit en FR alors que la première locale de l'URL dit `en`. Cas de figure
qui n'arrive pas naturellement ; noté pour ne pas le redécouvrir.
