# Bing Webmaster Tools + IndexNow — mode d'emploi

> ENG-87, milestone M2 · GEO plan §1.3. Écrit le 2026-07-29.
>
> **Ce document décrit ce qui se fait dans un navigateur.** L'agent ne peut ni
> créer les comptes, ni valider la propriété du domaine, ni cliquer dans une
> console Microsoft. Tout le code que cet item demandait est livré (voir « Déjà
> fait » plus bas) ; ce qui reste tient en ~30 min et n'appartient qu'à Mihai.
>
> ✅ **FAIT le 2026-07-29. Propriété vérifiée, sitemap soumis, `/fr` confirmée
> indexée, IndexNow accepté.** Voir « Relevé du 2026-07-29 » en bas — c'est la
> section à lire, le reste est la procédure qui a servi à y arriver.

## Pourquoi ça compte plus que sa taille

**ChatGPT Search interroge l'index Bing.** Une page que Bing n'a pas indexée ne
peut pas apparaître dans une réponse ChatGPT, quel que soit son classement
Google. Copilot idem. C'est le seul item de la phase 1 qui peut débloquer une
source de citations entière plutôt que d'améliorer une source existante.

Personne n'a jamais vérifié le statut Bing de `hargile.com`. Il est possible que
les 6 URLs y soient déjà, il est possible qu'aucune n'y soit. Tant que ce n'est
pas regardé, on ne sait pas si le travail GEO a un index sur lequel atterrir.

## Déjà fait, côté code — ne pas refaire

Vérifié le 2026-07-29 sur la prod (v0.20.0) sauf mention contraire.

- **Aucun crawler IA n'est bloqué.** Testé en envoyant les vrais user-agents à
  `https://hargile.com/fr` : `bingbot/2.0`, `GPTBot/1.1`, `OAI-SearchBot/1.0`,
  `ClaudeBot/1.0`, `PerplexityBot/1.0`, `meta-externalagent/1.1` → **200 pour
  les six**, et le texte visible est **identique** au mot près à celui d'un curl
  normal (121 lignes de texte, même h1, même NAP, même JSON-LD). Il n'y a donc
  ni WAF ni règle de blocage à faire sauter — le point « WAF test » d'ENG-74 M2
  est répondu.
  <br>(Curiosité relevée au passage, sans rapport : la réponse servie à bingbot
  fait 109 KB contre 126 KB pour les autres, parce que les réponses non-bot
  contiennent **deux fois** le même bloc `<style>` inline de 15,8 KB. Ce n'est
  pas du contenu, ce n'est pas un problème GEO, et la perf est close — c'est
  noté ici pour que personne ne reparte enquêter sur l'écart d'octets.)
- **`robots.txt` autorise tout** et déclare le sitemap. Il est désormais généré
  par `next-sitemap.config.js` uniquement — `src/app/robots.js` a été supprimé,
  c'était du code mort qu'un fichier de `public/` masquait (ses `Disallow`
  n'ont jamais été servis).
- **`sitemap.xml` est propre** : 6 URLs, toutes en 200, hreflang correct,
  x-default sur le FR, aucune redirection dedans.
- **La clé IndexNow est dans le dépôt** :
  `public/bfca279c73ec400f7b3ceef8e1e1483f.txt`. Elle sera servie à
  `https://hargile.com/bfca279c73ec400f7b3ceef8e1e1483f.txt` **une fois le
  déploiement fait**. La clé est publique par conception (c'est le mécanisme de
  vérification du protocole) : ce n'est pas un secret.
- **Le script de soumission existe** : `npm run seo:indexnow`. Il lit le sitemap
  en prod, vérifie que le fichier de clé répond et contient bien la clé, puis
  poste. `npm run seo:indexnow -- --dry-run` montre ce qui partirait sans rien
  envoyer.

## À faire dans le navigateur

### 0. Prérequis

Être connecté au compte Google qui possède la propriété Search Console de
`hargile.com`. C'est ce qui rend l'étape 1 triviale.

### 1. Créer / vérifier la propriété dans Bing Webmaster Tools

<https://www.bing.com/webmasters>

Deux chemins :

- **Import depuis Google Search Console** (recommandé) — « Import from GSC »,
  OAuth Google, cocher `hargile.com`, importer. La propriété arrive **déjà
  vérifiée** et les sitemaps connus de GSC sont repris. C'est un clic.
- **Ajout manuel**, si l'import échoue. Bing propose alors :
  - une balise meta `msvalidate.01` dans le `<head>` — **demande du code**, dis-le
    et je l'ajoute dans `src/app/[locale]/shared-metadata.js` (Next expose
    `verification.other`) ;
  - un fichier `BingSiteAuth.xml` à la racine — **demande du code** aussi
    (un fichier dans `public/`), même remarque ;
  - un enregistrement **CNAME** DNS — pas de code, mais il faut la main sur la
    zone DNS.

  ⚠️ Les deux premières options impliquent un déploiement, donc ~10 min
  d'attente entre le collage du jeton et le clic sur « Verify ». Prendre
  l'import GSC si possible.

### 2. Soumettre le sitemap

Bing WMT → **Sitemaps** → *Submit sitemap* → `https://hargile.com/sitemap.xml`

Attendre le passage en « Success ». S'il reste en « Pending » plus de 24 h, c'est
un signal, pas une lenteur normale.

### 3. Inspecter les 6 URLs

Bing WMT → **URL Inspection**, une par une :

```
https://hargile.com/fr
https://hargile.com/en
https://hargile.com/fr/contact
https://hargile.com/en/contact
https://hargile.com/fr/legal/privacy-policy
https://hargile.com/en/legal/privacy-policy
```

Pour chacune, noter : **indexée ou non**, la date du dernier crawl, et les
éventuelles erreurs signalées. Si une URL n'est pas indexée, utiliser *Request
indexing* sur place.

C'est le livrable de cet item : **savoir**. Les six réponses sont l'information
qui manquait.

### 4. IndexNow

La clé est déjà déployée (étape 0 : vérifier que
`https://hargile.com/bfca279c73ec400f7b3ceef8e1e1483f.txt` renvoie 200 et
affiche la clé). Ensuite, depuis le dépôt :

```bash
npm run seo:indexnow -- --dry-run   # contrôle : les 6 URLs, rien d'envoyé
npm run seo:indexnow                # soumission réelle
```

Le script refuse de soumettre si le fichier de clé n'est pas joignable ou ne
correspond pas — un 403 de l'API IndexNow veut presque toujours dire « la clé
n'est pas déployée », pas « IndexNow est cassé ».

Bing WMT a aussi un onglet **IndexNow** qui montre les soumissions reçues :
c'est là qu'on confirme que le POST a été pris en compte.

⚠️ **Ne soumettre qu'une fois le déploiement vérifié en prod.** Un tag n'est pas
un déploiement dans ce dépôt (voir `docs/next-session-prompt.md`, « Comment le
déploiement marche »). Soumettre des URLs qui servent encore l'ancien HTML ne
fait qu'indexer l'ancien HTML plus vite.

### 5. Vérification finale

- `site:hargile.com` sur **bing.com** — combien d'URLs ressortent ?
- Bing WMT → **Site Explorer** : arborescence crawlée, erreurs éventuelles.
- Bing WMT → **Crawl information** : bingbot passe-t-il, et à quelle fréquence ?

## ✅ Relevé du 2026-07-29 — ENG-87 est répondu

**La réponse à la question que cet item posait : `hargile.com` EST dans l'index
Bing, et depuis longtemps.** Découverte le 25 mars 2025. Ce n'était pas acquis —
personne ne l'avait jamais regardé, et l'hypothèse « aucune URL n'y est » était
sur la table.

Ce que l'URL Inspection de `https://hargile.com/fr` renvoie :

- **Indexed successfully — URL can appear on Bing**
- Discovered on **25 Mar 2025**
- Last crawl attempted : **2026-07-28 18:48**
- Crawl allowed : **Yes** · Page Fetch : **Successful** · Indexing allowed : **Yes**
- Canonical URL : `- -`
- **No SEO/GEO issues found** (Bing a désormais un contrôle « GEO » explicite)
- **1 markup type found : JSON-LD**

| À relever | Valeur |
| --- | --- |
| Propriété Bing vérifiée le | 2026-07-29 ✅ |
| Méthode de vérification | fichier `BingSiteAuth.xml`, livré en **v0.21.1** |
| Sitemap accepté (statut) | soumis le 2026-07-29, les 6 URLs sont remontées |
| URLs indexées / 6 | `/fr` **indexée**, confirmée. Les 5 autres non inspectées |
| Date du premier crawl bingbot | découverte 2025-03-25 ; dernier crawl 2026-07-28 18:48 |
| Soumission IndexNow acceptée | ✅ HTTP **202**, 6 URLs, 2026-07-29 |
| `site:hargile.com` sur Bing | **non mesuré** — Bing sert un captcha aux fetchs automatisés, à faire à la main |

### Deux fausses pistes, vérifiées et écartées le jour même

À ne pas ré-ouvrir. Les deux venaient d'une lecture trop rapide du rapport Bing.

- **`Canonical URL: - -` n'est pas un canonical manquant.** La page émet bien
  `<link rel="canonical" href="https://hargile.com/fr"/>` — vérifié en prod. Le
  `- -` de Bing veut dire « aucun canonical *divergent* », ce qui est l'état
  sain.
- **hreflang n'est pas absent** parce qu'il n'y a pas de `<link hreflang>` dans
  le `<head>`. Il est déclaré **dans le sitemap** — les 6 URLs portent chacune
  `fr` / `en` / `x-default`, en absolu et auto-référencées. Le sitemap est l'une
  des trois méthodes officielles ; c'est valide. Ajouter les liens dans le
  `<head>` serait de la redondance, pas un correctif.

### Le seul point à retenir pour la suite

**Le dernier crawl (2026-07-28 18:48) est ANTÉRIEUR aux déploiements du 29/07.**
Ce que Bing a indexé est donc l'ancien HTML : avant `WebPage`, avant
`/llms.txt`, avant l'année du footer. La soumission IndexNow du 29/07 doit
provoquer un re-crawl dans les jours qui viennent. **Ne rien en conclure avant
que « Last crawl attempted » soit postérieur au 2026-07-29 15:47 UTC.**

## Après quoi

Rien ne change en une nuit : l'indexation Bing puis sa reprise dans ChatGPT se
comptent en semaines. Reprendre le tableau ci-dessus ~4 semaines plus tard, en
même temps que le panel de prompts d'**ENG-82**.

Et garder la vraie perspective : la contrainte dominante reste que le site n'a
que **3 pages réelles**. Bing peut indexer parfaitement 6 URLs qui ne répondent
qu'à une seule question. C'est la phase 2 du `geo-plan.md` qui règle ça.
