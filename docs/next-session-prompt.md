# Prompt de reprise — session suivante

> Fichier à copier-coller tel quel en ouverture de session. C'est **la** source
> unique : les sections « Prompt de reprise » de `homepage-performance-plan.md`
> et `homepage-code-review-plan.md` renvoient ici pour éviter la dérive.
> Dernière mise à jour : 2026-07-29, après le tag **v0.19.1** (déployé).

---

Lire EN PREMIER, dans cet ordre :

1. ce fichier — état réel, périmètre, pièges ;
2. `docs/homepage-code-review-plan.md` — le détail par item, avec ce qui est
   déjà livré marqué ✅ ; ne pas ré-auditer ;
3. `docs/geo-plan.md` — si la session porte sur la phase 1 (voir plus bas) ;
4. `docs/homepage-performance-plan.md` §Verification — pièges de mesure.

## État au départ (vérifié le 2026-07-29)

- **v0.19.1 est taguée, publiée ET déployée** (2026-07-29 12:58 UTC).
  Vérifié en prod : 14 marqueurs `data-reveal-index` et **0 `opacity:0` inline
  sur la copie** sur `/fr` et `/en`, `/fr/audit/result` → 404, et **aucun
  fichier de police `-ext` demandé** (le fix d'ordre `@font-face`).
- ✅ **PSI production, 8 runs sur v0.19.1 : médiane desktop 89, médiane
  mobile 94.** Baseline desktop 61. Objectif 90+ atteint, le plan perf est
  livré. **Il n'y a plus rien à gratter côté score** : les items restants
  (2.2, 3.x) sont qualité de code et accessibilité, pas perf.
- 🛑 **LIRE CECI AVANT DE REGARDER UN SCORE PSI. L'amplitude est de ±25 points
  sans le moindre changement de code.** Runs bruts : desktop 70 / 79 / 95 / 87 /
  97 / 91 / 71 / 93, mobile 82 / 98 / 97 / 84 / 93 / 95 / 71 / 97. Un run à
  71/71 et le suivant, **5 secondes plus tard**, à 93/97 — même build, mêmes
  octets, même serveur.
  **Cause** : le TBT pèse 30 % du score et il est dominé par le backdrop WebGL
  du hero, qui **anime en continu**. PSI tourne sans GPU, donc chaque frame
  passe en SwiftShader sur le CPU, et le coût dépend de la machine que la flotte
  Google attribue au run (TBT mesuré de 40 à 160 ms sur le même build).
  **Conséquence pratique** : un run PSI isolé sur ce site ne mesure pas le code.
  Médiane de 3 à 5 runs, ou rien. Le « 99/99 » qui a traîné une heure dans ces
  docs était un run isolé, pris pour argent comptant parce qu'il faisait
  plaisir — la règle des médianes avait été appliquée aux chiffres qui
  déplaisaient et levée pour celui-là. Ne pas s'en resservir comme baseline.
  **Ce qui compte vraiment, ce sont les données terrain (CrUX)** en haut du
  rapport PSI, pas le score labo : de vrais utilisateurs, avec de vrais GPU.
- 💡 **Piste si l'amplitude devient gênante** (non faite, non chiffrée) :
  détecter le rendu logiciel via `gl.getParameter(gl.RENDERER)` (retourne
  « SwiftShader » / « llvmpipe ») et router ces clients vers **l'image fixe que
  `prefers-reduced-motion` produit déjà**. Ce n'est pas tricher : c'est ne pas
  faire tourner une animation GPU coûteuse sur une machine sans GPU, ce qui
  profite aussi aux vraies machines bas de gamme.
- ℹ️ **PSI teste `hargile.com`, pas `hargile.com/fr`** : l'apex fait un 307 vers
  `/fr` (+44 ms sur le chemin critique, et `/fr` apparaît deux fois dans l'arbre
  de dépendances). `/fr` en direct ne redirige pas. C'est la « contradiction de
  locale par défaut » déjà listée dans `geo-plan.md` phase 1 — à traiter là, pas
  en one-shot.
- ⚠️ **v0.18.0 n'a jamais été déployée.** La prod a tourné sur **v0.17.0** du
  2026-07-28 au 2026-07-29 10:03 UTC : le PR de bump d'image côté
  `hargile-infra` est resté ouvert (voir « Comment le déploiement marche »).
  Les anciens chiffres « desktop 91 / mobile 94 » attribués à v0.18.0
  mesuraient en fait v0.17.0, donc la phase 1 seule.
- ⚠️ **Un run juste après un déploiement ne mesure rien d'utile**, et pas
  seulement à cause du conteneur froid : chaque build re-hashe le nom de tous
  les chunks, donc le cache CDN est vide pour **chaque** CSS/JS/police. Un run
  à +1 min a sorti desktop 70 ; le même build tourne à 91–97 une fois chaud. Un
  premier run post-rollout a même sorti un TTFB de 2 489 ms alors que le serveur
  répondait en 72–224 ms mesuré en direct au même instant (et « Server responds
  quickly, 10 ms » dans le rapport PSI suivant). Attendre ~10 min.

## Comment le déploiement marche (personne ne l'avait écrit — d'où 2 releases perdues)

Ce dépôt **ne se déploie pas tout seul** et le tag n'est pas ce qui part en
prod. La chaîne réelle :

1. Push sur `main` **ou** tag `v*` → workflow `docker.yml` → image poussée sur
   `ghcr.io/alexisvs/hargile-website:<tag>`. **S'arrête là.** Un run vert ici
   veut dire « image publiée », pas « site à jour ».
2. Le contrôleur image-automation de Flux (dans le cluster) voit la nouvelle
   image et commite un bump sur la branche `image-updates/auto` du dépôt
   **`HARGILE-tech-studio/hargile-infra`**, fichier
   `clusters/ks5/apps/hargile-website.yaml` (une ligne, `APP_IMAGE:`).
3. Ce bump vit dans une **PR** que `auto-merge-image-updates.yml` fusionne
   *une fois la CI verte*.
4. Flux tourne **dans le cluster** et poll `master` de `hargile-infra` toutes
   les **1 min** (`clusters/ks5/flux-system/gotk-sync.yaml`) → applique →
   les pods roulent. Compter ~2 min entre le merge et le site à jour.

**Le point de rupture est l'étape 3.** La CI de `hargile-infra` tourne sur
`runs-on: arc-hargile-org` — des runners self-hosted (Actions Runner Controller)
dans le cluster. Runners morts = checks en `queued` = PR jamais fusionnée = rien
ne se déploie, **sans aucun signal d'échec** : tout est vert côté `hargile_website`.
C'est exactement ce qui a mangé v0.18.0.

À savoir : le workflow `Flux Reconcile` ne *fait* pas le déploiement, il ne fait
que forcer une synchro immédiate. Flux dans le cluster continue son poll même
si ARC est mort — donc une PR fusionnée part en prod même sans runner.

**Après chaque release, vérifier que c'est vraiment déployé** (30 s) :

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://hargile.com/fr/audit/result   # 404 = v0.18.0+
curl -s https://hargile.com/fr | grep -c 'data-reveal-index'                   # >0 = v0.19.0+
gh pr list -R HARGILE-tech-studio/hargile-infra                                # une PR de bump ouverte = bloqué
```

Si une PR `image-updates/auto` traîne : son diff est une seule ligne, elle se
fusionne à la main avec `gh pr merge <n> -R HARGILE-tech-studio/hargile-infra
--squash --delete-branch --admin`, et Flux prend le relais en ~2 min.
- **Le code-review priorités 1 et 2 est clos** : 1.1, 1.2, 1.3, 2.1, 2.3
  livrés. Reste **2.2** et le lot **3.x**.
- **Le HTML SSR ne cache plus aucune copie.** 0 `opacity:0` inline sur `/fr`
  et `/en`. Les 6 restants sont des règles CSS dans `<style>` (burger, overlay
  du menu, blob de hover) — c'est le plancher, pas une cible.

### Ce que v0.19.0 a changé et qu'il faut connaître avant de toucher au v2

- **Les reveals de sections sont en CSS, plus en motion.** `useReveal` rend
  `{ref, data-reveal-index}` et n'écrit aucun style inline ; l'état au repos est
  l'état *fini* et JS ne fait que retrancher (`.pending` sur ce qui est encore
  hors écran, puis `.revealIn`). Timing, stagger et `prefers-reduced-motion`
  vivent dans `src/components/pages/homepage/v2/reveal.module.scss`.
  **Toute nouvelle section qui révèle doit passer par là** — remettre un
  `initial={{opacity:0}}` motion, c'est réintroduire le bug GEO.
- **La boucle de stagger SCSS couvre les index 1 à 8.** Une section qui grandit
  au-delà perd son décalage en silence : élargir la boucle.
- `verbs-quote.jsx` révèle en **transition** et pas en animation, parce que les
  mots accentués ont besoin de leur unique slot `animation` pour le shine. Ne
  pas « harmoniser » ça sans relire le commentaire.
- **Le variant du hero a trois états** : `null` (non résolu), `"bends"`,
  `"cubes"`. `HeroBackdrop` ne rend rien tant que c'est `null` — c'est le fix
  2.1, pas une négligence.

### Livré dans v0.19.1, et vérifié en prod

Les deux correctifs qui traînaient sur une branche sont **mergés, déployés et
confirmés dans le rapport PSI lui-même** — la branche `fix/font-subset-order`
n'existe plus.

- **Ordre des `@font-face`** (`_font-family.scss`) — les sous-ensembles se
  recouvraient (`U+0100-02BA` de latin-ext avale `U+0152-0153`, Œ œ), et
  d'après CSS Fonts §4.5 la **dernière** règle qui matche gagne. latin-ext
  était déclaré en second, donc le seul « œ » de « sculpte une œuvre » tirait
  les deux fichiers `-ext` sur toutes les pages FR. latin est maintenant déclaré
  en dernier. **Ne pas réinverser ces blocs** (un commentaire le dit sur place).
  Résultat mesuré en prod : plus aucun `-ext.woff2` demandé, et les deux nœuds
  de 406/494 ms ont disparu de l'arbre de dépendances PSI.
- **Reflow forcé** (`recent-works-showcase.jsx`, `layout()`) — les lectures
  passent avant les écritures. L'insight « Forced reflow » a disparu du rapport.

Méthode qui a servi à les valider, à réutiliser (`agent-browser` est installé) :
`performance.getEntriesByType("resource")` pour les polices réellement
demandées, et un scroll réel pour le pin. Deux pièges rencontrés :
`window.scrollTo` ne fait rien (Lenis intercepte — utiliser `agent-browser
scroll down N`), et `querySelector("[class*=track]")` attrape `trackWrap` avant
`track`, ce qui fait passer un pin fonctionnel pour cassé.

## Ce qui reste — proposition de périmètre, à valider

**Recommandation : `geo-plan.md` phase 1.** C'était bloqué par l'item 1.1, qui
est maintenant livré. C'est ~1 jour, c'est la seule chose de la liste qui a une
valeur business directe (visibilité dans les moteurs de réponse IA), et le
reste est du polish. Contenu : entité Organization enrichie, contradiction de
locale par défaut, Bing/IndexNow, `llms.txt`.

**Si tu préfères finir le code-review d'abord**, l'ordre qui a du sens :

- **2.2** — le pinning de recent-works ignore `prefers-reduced-motion`. Seul
  vrai défaut fonctionnel restant (accessibilité). Petit.
- **3.3** — extraire un `useMediaQuery` partagé (3 hooks identiques).
  Débloqué par 2.1 ; attention, `useHeroVariant` a maintenant un troisième état
  (`null`) que l'extraction doit préserver.
- **3.5** — nettoyage v1. Grep chaque dossier avant suppression. Recouvre en
  partie 3.2 (voir ci-dessous).
- **3.2** — scinder `who_description` en deux clés. ⚠️ Ce piège a **déjà
  frappé** : `fr.json` n'avait pas de ligne vide, donc le paragraphe « ambition »
  ne s'affichait qu'en anglais. v0.19.0 l'a réglé en supprimant le paragraphe
  côté `en` pour aligner les deux locales — le split fragile est toujours là.
  Deuxième consommateur : le v1 `about-us/about-us.jsx`.
- **3.1**, **3.4** — polish. 3.4 contient un **conflit à trancher** : le plan
  recommande `` aria-label={`${project.actionText} — ${project.title}`} `` mais
  ce qui est en prod est `aria-label={project.title}`
  (`recent-works-showcase.jsx`), qui écrase le texte visible « View more ».

## Vérification (à chaque item)

1. `npm run build && npm run start` (`next start` râle à cause de
   `output: standalone` mais sert correctement ; la prod tourne
   `node .next/standalone/server.js`).
2. Smoke test complet : loader dismissé, bascule cubes/bends à 1024 px,
   `?backdrop=cubes` / `?backdrop=bends`, pin recent-works + compteur,
   `/contact`, portrait 390×844 = 1 seul canvas, cartes teintées à ~900 px,
   les 2 locales.
3. Guardrail GEO §1.5 : `curl` du HTML brut `/fr` et `/en` → h1, copy et texte
   cookies présents sans JS, et **0 `opacity:0` dans un attribut `style=`**.
4. Lighthouse **seulement** si l'item est censé bouger un chiffre. Médianes de
   3 runs, jamais un run isolé.

## Pièges (tous vécus)

- **Compter `opacity:0` sans garde donne un faux chiffre.** `grep -o
  'opacity:0'` matche aussi `opacity:0.16` / `0.25` / `0.45` (scrub-word, points
  de mvp-promo) : c'est ce qui avait gonflé la baseline de 27 à « 76 ».
  Utiliser `opacity:0(?![.\d])`, et de préférence ne compter que ce qui est
  dans un `style="…"` — c'est le seul chiffre qui veut dire « caché à un
  crawler ».
- **Tuer les vieux serveurs avant de mesurer, et vérifier le port.** Arrêter la
  tâche tue le wrapper npm mais **laisse le process node enfant** tenir le 3000 ;
  le nouveau `next start` meurt en `EADDRINUSE` et on mesure sans le savoir
  l'ANCIEN build. `Get-NetTCPConnection -LocalPort 3000` puis tuer par PID.
  (Arrivé encore le 2026-07-29 : un `next start` de la session précédente
  servait toujours le build v0.18.0.)
- **« Taguée » ≠ « déployée ».** Voir la section déploiement plus haut. Le
  2026-07-29, v0.18.0 est restée non déployée pendant ~1 h sans que rien ne
  paraisse cassé. Toujours faire le check à 30 s après une release.
- **Le diagnostic « pas déployé » de la session précédente était en fait
  juste — c'est la rétractation qui était fausse.** Une copie cachée servie en
  curl avait fait croire à un artefact de cache, et le marqueur
  `/fr/audit/result` (qui renvoyait 200, donc « pas déployé ») a été écarté à
  tort. Marqueurs fiables : `/fr/audit/result` → 404 = v0.18.0+ ;
  `data-reveal-index` dans le HTML de `/fr` = v0.19.0+. Croire le marqueur, et
  vérifier l'état réel dans `hargile-infra` plutôt que de spéculer sur le cache.
- **`npm run lint` sort 4 erreurs préexistantes** (`mvp-studio.jsx`,
  `Footer.jsx`, et 2× `setState` dans un effet de `hero.jsx`). C'est la
  baseline, pas une régression : comparer à 4, pas à 0.
- Fermer le navigateur QA pendant Lighthouse (~5 pts de TBT de bruit).
- Comparer à locale constante (`/fr` ≈ 4 KB de plus que `/en`).
- Une string i18n manquante est **silencieuse en prod**, bruyante en dev
  seulement. Toute string client ajoutée doit rejoindre `CLIENT_NAMESPACES`
  dans `src/app/[locale]/layout.js`.
- Il n'y a que **deux locales** : `src/messages/{fr,en}.json`. Pas de `nl`,
  malgré ce que traînent de vieux commentaires.
- `npm run dev -- -p X` avale le flag → `npx next dev -p X`.
- En dev, le premier démarrage à froid après un build prod peut 404
  transitoirement toutes les routes `(context)` — recompiler avant de conclure.

## Règles

- Mesurer avant de proposer quoi que ce soit. L'item 2.1 était écrit comme
  « octets gaspillés » et n'a été pris au sérieux qu'une fois le flash **vu** :
  ne pas confondre une hypothèse écrite dans un plan avec un fait.
- Un commit par item, conventional commits avec scope (`perf(homepage):`,
  `fix(homepage):`, `seo(i18n):`).
- **Ne rien pousser, merger ou tagger sans mon accord explicite.**
