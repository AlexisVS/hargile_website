# Prompt de reprise — session suivante : items 2.1, 1.3, 1.1

> Fichier à copier-coller tel quel en ouverture de session. C'est **la** source
> unique : les sections « Prompt de reprise » de `homepage-performance-plan.md`
> et `homepage-code-review-plan.md` renvoient ici pour éviter la dérive.
> Dernière mise à jour : 2026-07-29, après le déploiement de v0.18.0.

---

Session : traiter les trois items restants du code-review de la homepage —
**2.1** (flash du mauvais backdrop, + 2.3 dans la foulée), **1.3** (crash
potentiel) et **1.1** (bloqueur GEO). Rien d'autre : le reste est listé en fin
de fichier pour mémoire, à ne pas attaquer sans accord.

Lire EN PREMIER, dans cet ordre :

1. ce fichier — état réel, périmètre, pièges ;
2. `docs/homepage-code-review-plan.md` — le détail par item ; ne pas
   ré-auditer, tout y est (chemins, cause, fix envisagé, vérif) ;
3. `docs/homepage-performance-plan.md` — résultats mesurés et section
   Verification (pièges de mesure) ;
4. `docs/geo-plan.md` §1.5 — guardrail : le copy doit rester dans le premier
   HTML. C'est la raison d'être de l'item 1.1.

## État au départ (vérifié le 2026-07-29)

- **v0.18.0 est déployée en prod.** PSI production : **desktop 91**
  (baseline 61 — objectif 90+ atteint), **mobile 94** (baseline 95, plat),
  **SEO 100** (baseline 92). `main` est à jour et poussé.
- Le plan perf est **entièrement livré** (phases 1 à 3) : i18n client scopé,
  reflow du rail supprimé, spinner en pause, bandeau GDPR en SSR avec script
  anti-flash (c'était l'élément LCP mobile), recharts + 3 deps retirées,
  aria-labels, `h4` → `h3`, panneaux teintés en 769-1023 px, manifesto
  `aria-hidden` + copie `sr-only`. Plus, après le merge : suppression de la
  feature audit (aucun point d'entrée) et retrait du preload de l'image
  below-the-fold (item 1.2).
- **Aucun des trois items ci-dessous n'est commencé.**

### Deux choses à ne pas chercher à « corriger »

- **Le banc local mobile sort ~49.** Artefact du banc (le loader retarde le
  rendu du h1 localement) ; la prod est à 94. Ne pas optimiser contre ça.
- **L'écart desktop 98 local → 91 PSI est structurel.** PSI tourne sans GPU,
  le backdrop WebGL passe en rendu logiciel — le verdict SwiftShader prévu par
  le plan. Le reste de l'écart à 100 vient de là, pas d'un bug.

### Attentes réalistes sur ces trois items

**Seul 2.1 peut bouger un chiffre Lighthouse, et de peu.** 1.3 est une
assurance anti-crash, 1.1 vise les moteurs de réponse IA et les crawlers sans
JS — pas le score. Ne pas juger cette session au PSI.

---

## Ordre de travail

### 1. Item 2.1 (+ 2.3) — flash du mauvais backdrop sur desktop

**Priorité haute : c'est le seul défaut visible par un visiteur.**

*Constaté, pas supposé* : en hard refresh sur desktop, le dégradé bends
s'affiche réellement avant que la grille de cubes le remplace. L'item était
écrit à l'origine comme « octets gaspillés » — il a été requalifié après
observation.

**Cause.** `useHeroVariant` (`hero.jsx` ~23-41) démarre à `"bends"` et ne
corrige qu'en effet après mount : le premier render client monte donc
`<ColorBends>` (import `dynamic(..., {ssr:false})` dans
`backdrops/hero-backdrop.jsx`) et déclenche son chunk avant le flip.

**Fix.** État initial `null` (= non résolu) et `HeroBackdrop` rend `null` tant
que ce n'est pas résolu — desktop ne monte alors plus jamais ColorBends. Coût :
une frame, rien de visible n'est chargé si tôt de toute façon (les backdrops
sont `ssr:false`).

**Contraintes à respecter :**
- La résolution doit **rester dans un effet**. La passer en render casserait
  l'accord SSR / premier render client → mismatch d'hydratation sur la classe
  `sectionSharp` et sur le markup du rail.
- `useBackdropReady` (`hero.jsx` ~53-106) a un chemin rapide `"none"` et un
  timeout de 2 s : vérifier qu'un variant `null` ne marque pas ready trop tôt
  **ni** ne bloque le loader de marque.

**Enchaîner 2.3 dans le même commit :** supprimer `resolveVariant`
(`backdrops/hero-backdrop.jsx` ~59-66), code mort qui re-implémente le parsing
`?backdrop=` déjà fait par `useHeroVariant` (+ un chemin
`NEXT_PUBLIC_HERO_BACKDROP`). Rendre `variant` prop requise. Grep les autres
usages de `HeroBackdrop` avant, pour confirmer que personne ne dépend de la
forme sans prop.

**Vérif.** DevTools Network sur viewport ≥1024 px, hard reload → aucun chunk
`color-bends` demandé. Le loader se dismisse toujours en desktop **et** en
<1024 px. `?backdrop=cubes` et `?backdrop=bends` fonctionnent toujours. Plus
de flash au hard refresh (c'est le critère qui compte).

### 2. Item 1.3 — `hostnameOf` peut blanchir la homepage

One-liner, zéro risque, à passer vite.

`recent-works-showcase.jsx` ~ligne 13 : `const hostnameOf = (url) => new
URL(url).hostname…` non gardé, exécuté **pendant le render** pour la puce
« barre d'adresse » décorative. Toutes les `actionUrl` de
`src/data/portfolio-data.js` sont absolues aujourd'hui — c'est donc latent :
une URL relative ou vide ajoutée plus tard throw pendant le render → homepage
blanche.

**Fix.** try/catch renvoyant `""` ; ne rendre la puce `domainChip` que si la
valeur est non vide.

**Vérif.** Ajouter temporairement une `actionUrl` vide et/ou relative dans
`portfolio-data.js`, confirmer que la page rend toujours et que la puce
disparaît proprement, puis retirer le test.

### 3. Item 1.1 — le copy below-the-fold est en `opacity:0` dans le HTML SSR

**Le bloqueur GEO principal, et le gros morceau de la session.**

**Problème.** Tout client qui n'exécute pas JS — c'est-à-dire la plupart des
crawlers de moteurs de réponse IA, exactement la cible de `geo-plan.md` — lit
une page transparente sous le hero.

**Mesure de référence : 76 occurrences de `opacity:0` inline sur `/fr`**
(comptées sur le build v0.18.0, `curl … | grep -o 'opacity:0' | wc -l`).

**Le patron existe déjà : le hero est corrigé.** Voir `hero.jsx` ~132 (et le
commentaire qui l'explique) + les keyframes dans `hero.module.scss` : reveal
piloté par CSS, l'animation démarre à la première résolution de style au lieu
d'attendre l'hydratation, et le HTML SSR ne porte plus `opacity:0`. C'est
exactement ce qu'il faut répliquer.

**Restent à traiter :**
- `useReveal()` (`src/components/pages/homepage/v2/useReveal.js`) renvoie
  `initial: {opacity: 0, …}`, consommé par `mvp-promo.jsx`, `design-dev.jsx`
  et `values.jsx`. **Réécrire `useReveal` en reveal par classe CSS +
  IntersectionObserver règle les trois consommateurs d'un coup** — c'est
  l'option à privilégier. Alternative si on garde motion : pas d'`initial` +
  gate client-only pour que la passe SSR ne sérialise jamais `opacity:0`.
- `verbs-quote.jsx` ~45 : `initial={{opacity: 0, y: "0.7em"}}` mot par mot,
  même traitement.
- `scrub-word.jsx` (0.16 par mot) est **déjà traité** côté a11y/GEO
  (`aria-hidden` + copie `sr-only` sur le blockquote) — **ne pas y toucher**.

**Impératif.** Garder un équivalent `prefers-reduced-motion` : aujourd'hui les
reveals s'effondrent en fondu via `useReducedMotion()`, une réécriture CSS doit
reproduire ce comportement. Re-tester chaque section sous ce mode après coup.

**Vérif.** `curl -s http://localhost:3000/fr | grep -c 'opacity:0'` doit
chuter nettement sous 76, sur les 2 locales. Il en restera légitimement
quelques-unes (CSS du menu, visuel hero `aria-hidden`) — **les lister
explicitement** plutôt que viser 0 aveuglément. Confirmer aussi à l'œil que le
stagger des sections est inchangé.

---

## Vérification (à chaque item)

1. `npm run build && npm run start` (`next start` râle à cause de
   `output: standalone` mais sert correctement ; la prod tourne
   `node .next/standalone/server.js`).
2. Smoke test complet : loader dismissé, bascule cubes/bends à 1024 px,
   `?backdrop=cubes` / `?backdrop=bends`, pin recent-works + compteur,
   `/contact`, portrait 390×844 = 1 seul canvas, cartes teintées à ~900 px,
   les 2 locales.
3. Guardrail GEO §1.5 : `curl` du HTML brut `/fr` et `/en` → h1, copy et texte
   cookies présents sans JS.
4. Lighthouse **seulement** si l'item est censé bouger un chiffre (donc 2.1
   éventuellement, pas 1.3 ni 1.1). Médianes de 3 runs, jamais un run isolé.

## Pièges (tous vécus)

- **Vérifier la version déployée dans un NAVIGATEUR, pas en curl depuis
  l'agent.** Le 2026-07-29, curl depuis la session a servi 20 min une copie
  cachée identique au byte près (même etag, 4 hostnames, cache-busters
  ignorés) alors que v0.18.0 était bien live — d'où un diagnostic « pas
  déployé » entièrement faux, maintenu trop longtemps face à l'utilisateur qui
  voyait le contraire. Marqueur de version : `/fr/audit/result` → 404 =
  v0.18.0 ou plus récent.
- **Tuer les vieux serveurs avant de mesurer, et vérifier le port.** Arrêter
  la tâche tue le wrapper npm mais **laisse le process node enfant** tenir le
  3000 ; le nouveau `next start` meurt en `EADDRINUSE` et on mesure sans le
  savoir l'ANCIEN build. `Get-NetTCPConnection -LocalPort 3000` puis tuer par
  PID.
- Fermer le navigateur QA pendant Lighthouse (~5 pts de TBT de bruit).
- Comparer à locale constante (`/fr` ≈ 4 KB de plus que `/en`).
- Une string i18n manquante est **silencieuse en prod**, bruyante en dev
  seulement. Toute string client ajoutée doit rejoindre `CLIENT_NAMESPACES`
  dans `src/app/[locale]/layout.js`.
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

---

## Hors périmètre de cette session (pour mémoire)

À ne pas attaquer sans accord explicite. Détail dans
`docs/homepage-code-review-plan.md`.

- **2.2** — le pinning recent-works ignore `prefers-reduced-motion`.
- **3.1** — `usePortfolioData` : classe dans un `useMemo`, 22 projets traduits
  pour en afficher 3. Garder l'API publique (utilisée par `/portfolio`).
- **3.2** — `values.jsx` split `who_description` sur `"\n\n"` : fragile à la
  traduction, scinder en deux clés.
- **3.3** — extraire un `useMediaQuery` partagé (3 hooks identiques). **Après
  2.1**, qui touche `useHeroVariant`.
- **3.4** — nits, dont un **conflit à trancher** : le plan recommande
  `` aria-label={`${project.actionText} — ${project.title}`} `` mais v0.18.0 a
  shippé `aria-label={project.title}` (`recent-works-showcase.jsx:137`), qui
  écrase le texte visible « View more ».
- **3.5** — nettoyage v1. `digital-audit/`, `hero/GaugeChart.jsx` et
  `hero/AuditMultiModal.jsx` sont déjà supprimés avec la feature audit.
  Restent non référencés par la v2 : `about-us/`, `services/`,
  `trusted-brands/`, `latest-insights/`, `mvp-promo/`, `quote-request/`,
  `Stars.jsx`, `BlurredCircles.jsx`, `hero/heroSection.jsx`. Grep chaque
  dossier avant suppression.
- **`geo-plan.md` Phase 1** (~1 jour, non commencé) : entité Organization
  enrichie, contradiction de locale par défaut, Bing/IndexNow, `llms.txt`.
  L'item 1.1 ci-dessus en est un prérequis de fait.
