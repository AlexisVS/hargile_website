# Export Next.js — HARGILE /services + /faq

Composants prêts à copier dans `hargile_website` (App Router, JSX, React 18/19).

## Arborescence à copier

```
exports/app/services/page.jsx      ->  app/(fr)/services/page.jsx
exports/app/faq/page.jsx           ->  app/(fr)/faq/page.jsx
exports/components/SiteChrome.jsx  ->  components/SiteChrome.jsx
exports/components/ServicesMotion.jsx -> components/ServicesMotion.jsx
exports/components/FaqAccordion.jsx   -> components/FaqAccordion.jsx
exports/lib/css.js                 ->  lib/css.js
exports/styles/hargile.css         ->  styles/hargile.css
```

Adaptez les imports relatifs (`../../lib/css`) à vos alias (`@/lib/css`) si vous en avez.

## 1. Polices + CSS global

Dans `app/layout.jsx` :

```jsx
import { Outfit, Manrope } from 'next/font/google';
import '../styles/hargile.css';

const outfit = Outfit({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-outfit' });
const manrope = Manrope({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-manrope' });

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${outfit.variable} ${manrope.variable}`}>
      <body style={{ fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
```

Les titres utilisent `font-family: Outfit` en style inline. Avec `next/font`, remplacez-le
par `var(--font-outfit)` — un simple find/replace `font-family:Outfit,sans-serif` →
`font-family:var(--font-outfit),sans-serif` dans les deux pages suffit.

## 2. Architecture : markup serveur, motion en îlot client

- Les pages sont des **Server Components** : aucun `"use client"`, donc **chaque mot de copy
  est dans le HTML initial** (non-négociable 1) et indexable, JS coupé.
- `ServicesMotion` et `FaqAccordion` ne rendent **rien** (`return null`). Ce sont des îlots
  clients qui lisent le DOM déjà rendu via `data-*` et n'y touchent que pour animer.
- Les reveals **soustraient** d'un état visible : au montage, seuls les éléments sous la ligne
  de flottaison sont repoussés (`opacity:0; translateY(20px)`), puis ramenés au scroll. Filet
  de sécurité à 2,5 s, et à l'unmount tout est remis visible.
- FAQ : l'état de repos du HTML est **tout ouvert**. L'îlot replie tout sauf la première
  question de chaque groupe. Les réponses restent dans le DOM (`grid-template-rows: 1fr → 0fr`),
  non-négociable 2 respecté.

## 3. Moment signature

Dans `app/services/page.jsx`, en haut :

```js
const SIGNATURE = 'spine'; // 'spine' | 'pile' | 'velocity'
```

- `spine` — colonne numérale collante 280px + lignes indentées irrégulièrement (défaut).
- `pile` — les quatre offres se déplient d'une pile empilée, scroll-lié.
- `velocity` — bande cinétique des quatre noms, pilotée par la vélocité du scroll (une par site).

Un seul moment signature par page : ne combinez pas.

## 4. Motion — specs

| Élément | Trigger | Durée / easing | Reduced motion |
|---|---|---|---|
| Entrées (titres, lignes, cartes) | scroll, one-shot, jamais rejoué | 600 ms `cubic-bezier(.16,1,.3,1)`, opacity + translateY 20px | état final immédiat |
| Chiffre de la colonne | scroll-lié, seuil 55 % de viewport | crossfade 350 ms | change sans fade |
| Spotlight des lignes | pointeur | opacity 450 ms, radial-gradient 420px | désactivé |
| Compteurs 30 / 50 / 4 | entrée en vue, une fois | 900 ms ease-out cubic | valeur finale (dans le HTML) |
| Bande cinétique | vélocité du scroll, amortissement .86 | s'arrête sous 0,05 px/frame — pas de boucle ambiante | statique |
| FAQ ouverture | clic | 450 ms `cubic-bezier(.16,1,.3,1)` sur `grid-template-rows` | bascule instantanée |

Seuls `transform` et `opacity` sont animés, un seul `requestAnimationFrame` par page,
listeners `passive` + `capture` (fonctionne quel que soit le conteneur de scroll).

## 5. GSAP / React Bits

L'export n'a **aucune dépendance** — tout est en rAF natif. Si vous préférez brancher
ScrollTrigger, les correspondances sont directes :

- reveals → `ScrollTrigger` + `gsap.from(el, {opacity:0, y:20, once:true})` (`immediateRender:false` pour garder l'état visible en SSR)
- variante `pile` → `scrub:true` sur une timeline par ligne (équivalent de **ScrollStack**, sans son conteneur scrollable ni ses ombres)
- variante `velocity` → **ScrollVelocity**, en supprimant la dérive au repos
- spotlight → **SpotlightCard**, réduit au gradient suiveur (pas de fond rempli, pas de border glow)
- FAQ → **AnimatedList**, en gardant seulement le décalage d'entrée (les items existent déjà dans le HTML)

## 6. Mobile (< 768px)

Aucune media query : tout passe par `clamp()` / `minmax()` / `auto-fit`, donc rien ne dépend
de la longueur du texte (non-négociable 6). Comportements sous 768px :

- Colonne numérale : la grille passe à une colonne, le chiffre coiffe les lignes. Si vous
  voulez la barre collante 56px décrite dans la spec, ajoutez-la côté CSS — c'est le seul
  ajout de media query recommandé.
- Indentations des lignes : `clamp()` les ramène à 16px.
- `pile` : décalage réduit par la même `clamp`, le scale reste imperceptible.
- Cartes preuves et groupes FAQ : une colonne, zones de tap pleine largeur ≥ 56px.

## 7. i18n

Toute la copy est dans des tableaux en haut de chaque page (`OFFERS`, `PROOFS`, `STATS`,
`GROUPS`). Pour `/en`, remplacez ces tableaux par vos clés de traduction — aucune structure
ne dépend de la longueur des chaînes.
