# Prompt de reprise — session suivante

> Fichier à copier-coller tel quel en ouverture de session. C'est **la** source
> unique : les sections « Prompt de reprise » de `homepage-performance-plan.md`
> et `homepage-code-review-plan.md` renvoient ici pour éviter la dérive.
> Dernière mise à jour : 2026-07-29, après le tag **v0.19.0**.

---

Lire EN PREMIER, dans cet ordre :

1. ce fichier — état réel, périmètre, pièges ;
2. `docs/homepage-code-review-plan.md` — le détail par item, avec ce qui est
   déjà livré marqué ✅ ; ne pas ré-auditer ;
3. `docs/geo-plan.md` — si la session porte sur la phase 1 (voir plus bas) ;
4. `docs/homepage-performance-plan.md` §Verification — pièges de mesure.

## État au départ (vérifié le 2026-07-29)

- **v0.19.0 est taguée, poussée et publiée** (release GitHub + image GHCR).
  Vérifié à la main dans le navigateur avant tag : pas de flash, loader OK aux
  deux largeurs.
- **Le plan perf est entièrement livré** (phases 1 à 3). PSI production sur
  v0.18.0 : desktop **91** (baseline 61), mobile **94**, SEO **100**.
  v0.19.0 n'est pas censée bouger ces chiffres — 2.1 retire un chunk gaspillé,
  pas du travail sur le chemin critique.
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
- **Vérifier la version déployée dans un NAVIGATEUR, pas en curl depuis
  l'agent.** Le 2026-07-29, curl depuis la session a servi 20 min une copie
  cachée identique au byte près (même etag, 4 hostnames, cache-busters ignorés)
  alors que v0.18.0 était bien live — d'où un diagnostic « pas déployé »
  entièrement faux. Marqueur de version : `data-reveal-index` présent dans le
  HTML de `/fr` = v0.19.0 ou plus récent.
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
