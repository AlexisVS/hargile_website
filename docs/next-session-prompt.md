# Prompt de reprise — session suivante

> Fichier à copier-coller tel quel en ouverture de session. C'est **la** source
> unique : les sections « Prompt de reprise » de `homepage-performance-plan.md`
> et `homepage-code-review-plan.md` renvoient ici pour éviter la dérive.
> Dernière mise à jour : 2026-07-31 (fin de session « hero wave », phase 6).
>
> **Trois chantiers en vol, à ne pas confondre :**
>
> | Chantier | Où | État |
> | --- | --- | --- |
> | GEO phase 1 | `main`, prod | ✅ terminé (`v0.21.0`/`v0.21.1`) |
> | Session M4 — les 6 pages | `main`, **non poussé, non déployé** | codé et commité |
> | Hero wave-grid | `feat/services-faq-redesign`, **poussé** | phases 1–6 faites ; reste l'image fixe (yeux de Mihai) puis la fusion |
>
> ### ✅ 2026-07-31 — hero wave-grid animé : phases 1 à 5 (branche poussée, non fusionnée)
>
> Branche `feat/services-faq-redesign`, poussée sur origin jusqu'à `11e1c34`.
> **Ni fusionnée, ni taguée, ni déployée** — consigne habituelle de Mihai.
> Plan de référence : [`docs/homepage-wave-hero-plan.md`](./homepage-wave-hero-plan.md).
> Boucle d'usage quotidienne : [`docs/wave-grid.md`](./wave-grid.md).
>
> Le point de départ : la version *animée* de la grille n'existait plus dans le
> code — construite animée, réécrite en image fixe, et l'animée jamais commitée.
> Elle a été reconstruite à partir des constantes notées dans le plan.
>
> Ce qui existe maintenant :
>
> - **`wave-grid.jsx` a deux modes**, `still` (ce que `/services` livre) et
>   `live`, dans **un seul composant**. Le texel est `{x, z, spawnTime, strength}`
>   et le shader calcule `age = uTime - spawn` ; en mode still `uTime` reste à 0
>   et le spawn d'une graine est simplement moins son âge — l'image fixe est donc
>   littéralement la surface vivante, horloge arrêtée. C'est ce qui empêche les
>   deux de diverger.
> - **`/preview/home-wave`** : la vraie homepage avec `backdrop="wave"` forcé
>   (un prop sur `HomePageClient`, pas une copie de la page). `noindex`, sans
>   JSON-LD ni `generatePageMetadata` — c'est un doublon de `/` par construction.
>   `/?backdrop=wave` fait le même A/B sans quitter la homepage.
> - **Canvas au-dessus de 1024px, image exportée en dessous** — même langage
>   visuel sur les deux, ce qui est exactement ce que ce hero doit démontrer
>   contre le partage actuel cubes-desktop / bends-mobile.
> - **La homepage a son propre export** (`home.avif`, 22 kB), distinct de
>   `curated.*` : ellipse de calme et colonne de copie différentes, donc une
>   image faite pour l'une place sa bande sombre au mauvais endroit sur l'autre.
> - **Le bug du loader annoncé dans le plan était réel** : `useBackdropReady`
>   guettait un `<canvas>`, qu'un `<img>` ne satisfait jamais. Corrigé ; la
>   branche image attend `complete`/`load`/`error` — « prêt dès l'apparition »
>   aurait renvoyé le loader sur un hero encore vide.
>
> Deux corrections demandées par Mihai en séance, gardées ici parce qu'elles
> décrivent des pièges et pas seulement des réglages :
>
> - **Plein cadre.** `.sectionSharp` décale le canvas de 40px et le dissout en
>   bas ; les deux viennent de `cube-grid`, qui a du brouillard et donc un bord
>   lointain qui recule vraiment. La grille wave est un sol plein sans
>   brouillard : les mêmes traitements se lisent comme un sol tranché sous la
>   navbar. `.sectionWave` garde le reste et supprime les deux. `/services`
>   avait tiré la même conclusion de son côté.
> - **Le sillage saccadait.** `exp(-age / fadeTime)` vaut 1.0 à l'âge 0, donc
>   chaque ondulation naissait à pleine hauteur et « popait ». La rampe de
>   naissance (`MODE.live.ramp`, 0.55 s) les fond les unes dans les autres —
>   `cube-grid.jsx` avait trouvé la même chose et l'appelle « anti-bounce ».
>   Éclaircir la traînée pour calmer l'ensemble est le mauvais levier : on
>   obtient un sillage plus grossier, pas plus calme.
>
> Vérifications faites (pas seulement supposées) :
>
> - **Non-régression `/services` prouvée à l'octet** : après chaque changement,
>   `npm run images:wavegrid` reproduit `curated.avif`/`curated.webp`
>   à l'identique, `git status` propre. C'est le contrôle à refaire après toute
>   retouche de `wave-grid.jsx`.
> - 60 fps verrouillé, ombres activées : médiane 16,7 ms, p95 17,0 ms sur
>   180 frames.
> - 390×844 : image servie, aucun canvas monté, loader parti. 1440×900 : canvas.
> - `next build` OK, sitemap régénéré inchangé, lint à la baseline de 4
>   (⚠️ la phase 6 l'a depuis ramenée à 2 — voir plus haut).
>
> ### ✅ Phase 5 — tranchée en séance : le hero wave est promu sur `/`
>
> Mihai a comparé et choisi. `/` sert la grille wave **à toutes les largeurs** —
> `DEFAULT_VARIANT = "wave"` dans `hero.jsx`, plus aucune branche de viewport.
> Le rail de capacités remplace donc les cartes de verre partout, ce qui était la
> deuxième demande : sous 1024px le hero rendait `.floatCard` (backdrop-filter
> 20px, bordure, dégradé) pendant que le desktop rendait le filet sans fond. Deux
> objets sans rapport de part et d'autre d'un breakpoint ; il n'y en a plus qu'un.
>
> Conséquence à connaître avant de toucher au rail : **il est maintenant rendu
> côté serveur**, donc ses reveals ne sont plus du `motion.*`. Ils étaient
> desktop-only et montaient après l'hydratation ; en devenant le défaut, leur
> `initial={{opacity: 0}}` serait parti dans le HTML SSR — exactement le défaut
> corrigé deux fois déjà (le h1, puis les cartes). Ce sont des keyframes CSS
> (`railDraw`, `capItemIn`, `capDotIn`), le décalage par ligne passe par une
> custom property `--cap-delay`. Vérifié dans le HTML servi : copie présente,
> aucun `opacity: 0` inline.
>
> ### ✅ 2026-07-31 (suite) — phase 6 : les variantes de comparaison sont supprimées
>
> Mihai a laissé le choix garder/supprimer à l'assistant. **Supprimé.** La
> comparaison avait déjà eu lieu et été tranchée ; ce qui restait, c'était deux
> fonds WebGL et une *deuxième mise en page de hero* qu'aucun visiteur ne pouvait
> atteindre — soit exactement la forme du problème que tout ce chantier existait
> pour supprimer. `git show 09ddb03` archive mieux qu'un import mort.
>
> **Deux points sur lesquels le cadrage de la session précédente (le 👉 qui était
> ici) se trompait, tous deux trouvés dans le code et pas dans les docs :**
>
> - **`src/components/vendor/color-bends/` ne part PAS.** Le point 2 la listait
>   comme supprimable avec la variante `bends`. Elle est **vivante sur
>   `/contact`** (`contact-form.jsx`, derrière `BendsBackdrop`) et n'a jamais été
>   seulement une variante de hero. Seule la branche `bends` du hero est partie.
> - **Le gros du gain, c'est le hero lui-même.** Sans `bends` ni `cubes`,
>   `isSharp(variant)` est toujours vrai : la branche des cartes de verre
>   (`.visual`, `.floatCard`, les trois keyframes de dérive `floatA/B/C`,
>   `.cardDot`/`.cardTitle`/`.cardText`) était du markup inatteignable et
>   ~240 lignes de feuille de style morte. `.sectionSharp` et `.sectionWave` se
>   sont effondrées dans `.backdrop` pour la même raison : trois règles en
>   cascade dont seule la dernière s'appliquait.
>
> Sont partis : `cube-grid.jsx` ; les branches `bends`/`cubes`, `BEND_COLORS` et
> `usePortrait` de `hero-backdrop.jsx` ; `VARIANTS`, `DEFAULT_VARIANT`,
> `useHeroVariant`, `SHARP`/`isSharp`, les props `backdrop`/`label` et la branche
> cartes de `hero.jsx` ; `.sectionSharp`, `.sectionWave`, `.variantTag` et tout le
> bloc cartes de `hero.module.scss` ; et la prop `backdrop` de `HomePageClient`.
>
> ### ⚠️ `/preview/home-wave` a été supprimée, puis remise — à lire avant de la resupprimer
>
> Elle avait tout de la victime évidente suivante : sa raison d'être était la
> comparaison, la comparaison est finie, et elle rend maintenant exactement ce que
> rend `/` — un doublon `noindex` par construction. Elle est donc partie, et la
> cible `home` de `scripts/export-wave-grid.mjs` a été repointée sur `/`.
>
> **Ça ne marche pas, et le repointage a été annulé.** Sur `/`,
> `agent-browser open` ne rend jamais la main — deux tentatives, cinq minutes
> chacune, aucune image écrite — là où la route de preview capture en une
> trentaine de secondes. Pire : le premier blocage a coincé la session du
> navigateur, après quoi même la capture `/services` (pourtant connue bonne) s'est
> bloquée jusqu'à ce que les processus Chrome headless orphelins soient tués.
>
> La cause n'a **pas** été identifiée. Le candidat le plus probable est le loader
> de marque, que `HeroLoadingProvider` monte sur `/` et `/contact` uniquement et
> que la route de preview n'affiche donc jamais — c'est la seule différence de
> comportement entre les deux pages. Mais c'est une hypothèse, pas un constat.
>
> Donc la route reste, avec une justification nouvelle : **c'est la surface
> d'export, plus une preview.** Elle porte `npm run images:wavegrid:home`, qui
> fabrique l'image du hero sous 1024px et dont le point 1 ci-dessous a besoin. La
> route et le `TARGETS` du script portent chacun une note qui le dit.
>
> Vérifié, pas supposé :
>
> - `npm run images:wavegrid` reproduit `curated.avif`/`curated.webp` à l'octet
>   (`git status --short public/` vide). **Ça clôt aussi le contrôle d'une
>   commande qui traînait** depuis le changement de signature de `capture()` —
>   c'était le point 3 de l'ancien 👉.
> - `npm run images:wavegrid:home` reproduit `home.avif`/`home.webp` à l'octet
>   via la route restaurée.
> - `next build` OK ; `next-sitemap` régénère à l'identique.
> - **Lint : de la baseline de 4 erreurs à 2.** Deux des quatre étaient des
>   `react-hooks/set-state-in-effect` dans `hero.jsx`, dans les effets de
>   résolution de variante qui n'existent plus. ⚠️ **La baseline est 2
>   maintenant** — les mentions « baseline de 4 » plus bas décrivent l'état
>   d'avant cette session. Les deux restantes sont dans `mvp-studio.jsx` et
>   `Footer.jsx`.
>
> ### ✅ 2026-07-31 (fin) — phase 7 : on pilote la composition, on ne tire plus au sort
>
> Décision de Mihai, et c'est la bonne : `?wave=N` est un **échantillonnage par
> rejet** qui connaît déjà l'ellipse de calme, donc feuilleter des graines
> n'explore que l'intérieur de contraintes écrites par quelqu'un d'autre. Le
> commentaire de la table de graines dit la même chose — « deliberately laid out,
> not random ». Cette phase déplace donc les contraintes, pas les dés.
>
> **Acquis et vérifié :**
>
> - **`HOME_CALM.depth` 0.55 → 0.8.** À 0.55 des ondulations traversaient la
>   copie de l'eyebrow jusqu'à la rangée de CTA. Le repli (0,65–0,7) est noté sur
>   la constante si ça lit maintenant « plaque morte » plutôt que « lit sombre ».
>   Vérifié sur l'image exportée : côté copie sombre, bleu accent à droite.
> - **Une prop `relief` sur `WaveGrid`** — `{amplitude, maxHeight, view, radius}`.
>   `/services` ne passe rien et son export reste identique à l'octet.
> - **Le script d'export a sa propre session agent-browser** (voir plus bas).
>
> **Annulé, et il faut savoir pourquoi :**
>
> - **Une prop `colors` par page.** Ajoutée, utilisée pour donner à la homepage un
>   mid plus saturé (#4d84f0), puis retirée le jour même sur consigne de Mihai :
>   la teinte allumée est `$accent-mihai` (#96b9f9, `_theme.scss`), l'accent de
>   marque que les eyebrows, les points du rail et la copie de /services utilisent
>   déjà. **Les deux heros partagent `COLORS`, c'est voulu.** La prop est partie
>   avec l'override plutôt que de rester un bouton sans appelant — la règle même
>   que la phase 6 a appliquée aux variantes.
>
> ### ✅ L'image téléphone est livrée (2026-08-03)
>
> Le premier rendu `home-phone` était une colonne noire avec six énormes piliers.
> Deux causes, toutes deux de cadrage :
>
> 1. **`fovForAspect` ne fait que *fermer* le champ, jamais l'ouvrir.** Sous le
>    ratio de référence 1.6:1 le vertical reste à 40° et la couverture
>    horizontale s'effondre avec l'aspect : à 0,46:1 il ne reste que x ±2,3
>    contre ±8,2 en large.
> 2. **`HOME_CALM_PHONE` était dimensionnée sur les unités du cadre large**
>    (`rx 3.4` contre une demi-largeur visible de 2,3) : tout l'écran amorti.
>
> Corrigé en ajoutant `radius` à `relief` et en refaisant la zone calme en
> **bande horizontale** — sur un téléphone la copie occupe presque toute la
> largeur, la lumière doit donc venir du haut et du bas, pas du côté.
>
> **Rendu, regardé, livré.** `home-phone.{avif,webp}` (13 kB / 24 kB) est commité
> et les deux `<source>` sont actifs dans `hero-backdrop.jsx`.
>
> ⚠️ `radius` vaut **22** — soit ~8 piliers de large, et c'est un réglage de
> **goût, pas de fidélité**. 26 venait du calcul de champ (annoncé ~11, rendu 9).
> Puis 34 (~12) pour coller aux 15 du cadre large, en se disant que les deux
> heros doivent lire comme le même objet : **refusé à vue par Mihai** — à taille
> téléphone, une douzaine de piliers fait une mosaïque qui concurrence la copie.
> Le cadre téléphone décore et suggère la profondeur, il ne reproduit pas la
> grille desktop. Ses mots : « a nice mix of big cubes and readability ».
>
> ⚠️ `view` a aussi été testé comme levier « rendre ça 3D » et **rejeté** :
> pousser `mx` vers −1 montre plus de *flancs*, mais les flancs sont dans l'ombre
> — l'image s'assombrit et les dessus allumés qui portent l'accent rétrécissent.
> `{mx: -0.2}` à `maxHeight` 1.05 bat `{mx: -0.9}` à 1.35.
>
> **Compter les piliers sur l'image exportée, jamais depuis le frustum — et les
> juger sur le cadre téléphone, pas sur `home.*`.**
>
> ### ✅ Et un troisième cadre : `home-tablet.*` (641–1023px)
>
> La bande 641–1023px (tablettes, fenêtre desktop en demi-écran) n'avait pas de
> composition à elle et empruntait `home.*` : une mise en page deux colonnes
> recadrée dans une fenêtre presque carrée, dont la zone calme court sur la
> gauche alors que le hero y est **déjà passé en une seule colonne pleine
> largeur** — la copie se retrouvait moitié sur du sombre, moitié sur de
> l'éclairé.
>
> ⚠️ **Étendre `home-phone.*` vers le haut ne marche pas, et c'est mesuré, pas
> supposé** : à 0,8:1 le `cover` ne garde que les ~40% du milieu du rendu 0,46:1,
> et ce milieu est exactement sa bande calme. Toute la lumière est dans les tiers
> haut et bas, donc recadrée — il ne reste qu'une plaque morte.
>
> D'où un export dédié à 1600x2000 (0,8:1 = la moyenne géométrique des extrêmes
> mesurés de la bande : 0,695 à 820x1180 et 0,938 à 1000x700), `radius: 18`
> (~11 piliers, entre les 8 du téléphone et les 15 du large) et une zone calme en
> bande dimensionnée sur **ses** unités monde à lui (x ±5,24, z ±6,55).
>
> Le choix du cadre passe par `frameForAspect` dans `hero-backdrop.jsx` : un
> export répond depuis l'aspect demandé, une fenêtre depuis sa largeur. Donc
> `?wave=N` à une largeur donnée prévisualise exactement ce que l'export
> correspondant écrit. **Il y a maintenant quatre images à réexporter** quand la
> composition bouge : `curated`, `home`, `home-phone`, `home-tablet`.
>
> ### 🔧 Sessions agent-browser — la vraie cause des « exports qui pendent »
>
> Beaucoup de temps perdu sur des exports sans sortie. Ce n'était **ni la page ni
> le code** : agent-browser garde **un démon par nom de session**, et deux
> processus sur `default` se battent pour lui. Parfois ça se dit franchement
> (« A daemon for session 'default' started concurrently with different daemon
> configuration »), le reste du temps `open` ne rend simplement jamais la main.
> Et une fois coincé ça le reste : même la capture `/services` connue bonne pend
> tant que les Chrome headless orphelins (profil temporaire
> `agent-browser-chrome-*`) ne sont pas tués.
>
> `scripts/export-wave-grid.mjs` tourne désormais dans sa propre session
> `wave-export` et ferme avec `close` et non `close --all`. ⚠️ **Deux exports
> simultanés se collisionneraient encore entre eux — les enchaîner.**
>
> ### ✅ 2026-08-03 — le hero de /faq est aligné sur /services (commité, non poussé)
>
> Demande de Mihai : positionnement, taille, design — et **sans eyebrow**. Fait
> en deux props sur `FaqPageClient` (l'eyebrow retiré, `WaveGridBackdrop`
> ajouté), plus les commentaires devenus faux ailleurs. Relevé complet dans
> [`faq-hero-plan.md`](./faq-hero-plan.md), section « EXÉCUTÉ ».
>
> **Et `/faq` a sa propre composition : `wave-70`** (choix de Mihai au `?wave=`),
> contre `wave-7` sur `/services`. Trois exports (22/12/9 kB), **aucune entrée
> `TARGETS` ajoutée et aucune route `/faq`** : le script est déjà paramétré par
> le numéro de variante et continue de piloter `/services`, ce qui est correct
> puisque la zone calme et l'aspect demandé sont identiques. Le câblage est une
> prop `composition` sur `WaveGridBackdrop` — **un nom, trois cadres dérivés**
> (`wave-70`, `wave-70-phone`, `wave-70-tablet`), comme les nomme l'export.
>
> ⚠️ **Les compositions se choisissent sur le cadre large.** Sept variantes
> feuilletées à 390 et 768 : elles s'y ressemblent toutes, parce que sous 860px
> la bande calme couvre presque tout un écran à une colonne et il ne reste
> presque rien à différencier. Un premier verdict « wave 70 est plat en étroit »
> était **faux** — il comparait le canvas *live* de 70 à l'export *encodé* de
> wave-7. **Comparer à égal : live avec live, export avec export.**
>
> Le pari du plan a tenu et il a été **mesuré, pas supposé** : `img.currentSrc`
> est identique sur les deux pages aux six largeurs testées (390/640/641/860/861/
> 1440), et la boîte du hero aussi — même hauteur de section, même `padding-top`,
> même `min-height`, même gouttière, et le **centre vertical du bloc de copie
> coïncide au pixel** (459/459, 486/486, 500/500).
>
> ⚠️ **Le `top` et la largeur du `h1` diffèrent toujours entre les deux pages, et
> c'est normal** — `.title` est en `width: fit-content` et `.hero.tight` centre
> verticalement, donc un titre plus long est une boîte plus large qui commence
> plus haut. `/faq` fait deux lignes contre une sur `/services`. **Mesurer
> `.container`, jamais le `h1`** : c'est le `h1` qui a failli faire conclure à une
> dérive alors qu'il n'y en avait pas.
>
> **Reste pour les yeux de Mihai** : les `01/02/03` de `FaqIndex` tombent sur la
> masse éclairée du cadre large, c'est le contraste le plus faible de la page. Si
> ça gêne, le levier est la **zone calme**, pas les graines (voir la note sous
> `CALM`).
>
> ℹ️ Conséquence : **plus aucun appelant ne passe `eyebrow`** à `PosterHero`. La
> prop est gardée volontairement (elle porte `.tight` avec elle, et c'est un choix
> de goût qui peut se retourner) — c'est écrit sur le composant. Ne pas la
> supprimer au nom de la règle « pas de bouton sans appelant » de la phase 6 sans
> demander à Mihai.
>
> ### 👉 Ensuite, ce qui restait ouvert
>
> #### 1. Essayer une autre composition pour les stills du hero
>
> ⚠️ **Mis à jour le 2026-08-03 — la description ci-dessous a changé.** Sous
> 1024px on ne sert plus `home.*` mais **deux** images composées pour leur bande :
> `home-phone.*` (≤640) et `home-tablet.*` (641–1023). `home.*` n'est en fait plus
> servi à personne (voir « Known gaps » dans [`wave-grid.md`](./wave-grid.md)).
>
> Le cadrage des trois a été validé à l'œil par Mihai. Ce qui n'a **jamais** été
> revu, c'est la **table de graines** : les trois sortent toujours de la
> composition `curated`, la même que `/services`, qui n'a jamais été composée pour
> les zones calmes de la homepage. C'est donc là qu'il reste à chercher mieux —
> et c'est le point qui demande les yeux de Mihai.
>
> La boucle complète est dans [`wave-grid.md`](./wave-grid.md) (« Making a new
> composition ») ; en résumé, et **dans cet ordre** :
>
> ```
> npm run dev
> # 1. feuilleter — sur la homepage, PAS sur /services : la même graine ne donne
> #    pas la même image, chaque page est amortie par une ellipse différente
> open http://localhost:3000/?wave=1     # puis 2, 3, 12, 34…
>
> # 2. exporter celles qui plaisent (60-90 s chacune, encodage AVIF)
> #    ⚠️ feuilleter à la LARGEUR du cadre visé : la fenêtre choisit le cadre
> npm run images:wavegrid:phone 12 34     # → home-phone-12.*, home-phone-34.*
> npm run images:wavegrid:tablet 12       # → home-tablet-12.*
>
> # 3. comparer les fichiers produits, puis pointer PHONE_IMAGE / TABLET_IMAGE
> #    (hero-backdrop.jsx) sur celui qu'on garde : "home-phone-12"
> ```
>
> ⚠️ Deux URL ont changé avec la phase 6 : on feuillette sur `/?wave=N`
> (`?backdrop=` n'existe plus), mais **l'export passe toujours par
> `/preview/home-wave`** — voir l'encadré ci-dessus, la route est repartie puis
> revenue.
>
> Trois pièges, tous déjà rencontrés :
>
> - **`?wave=N` rend une image FIXE, pas la grille vivante.** Feuilleter des
>   compositions, c'est feuilleter des tables de graines, et le mode live ignore
>   la table — il remplit sa traînée au pointeur. Un `?wave=7` en live ne
>   montrerait rien de la composition 7.
> - **Une composition n'est pas transportable entre les deux pages.** Toujours
>   feuilleter sur la page qu'on exporte.
> - **Si le problème est *où* tombe la bande sombre** et non où tombe la lumière,
>   le levier est l'ellipse (`HOME_CALM`), pas les graines — voir la note sous
>   `CALM` : déplacer des graines ne peut pas faire ce travail, chaque ondulation
>   allume un anneau d'environ 6 unités de large.
>
> Pour garder une composition générée de façon lisible plutôt que cachée derrière
> un numéro : la console imprime son tableau de graines sous `?wave=N`. ⚠️ Mais
> `STILL` est **partagé** avec `/services` — le recopier dedans change aussi
> l'image de `/services`. Si les deux pages veulent des tables différentes, c'est
> le moment de rendre `STILL` propre à chaque page, pas de basculer l'une puis
> l'autre.
>
> #### 2. ~~Finir le cadre téléphone~~ — fait le 2026-08-03
>
> ```
> npm run dev
> npm run images:wavegrid:phone     # écrit home-phone.{avif,webp}
> ```
>
> Reste la boucle si la composition change : exporter, **regarder le fichier**,
> et si c'est trop zoomé, `radius` dans `HOME_RELIEF_PHONE` est le seul chiffre à
> bouger. Les deux `<source>` sont désormais actifs et doivent rester **en
> premier** dans le `<picture>` — voir la note sur `PHONE_IMAGE`.
>
> #### 3. Une revue visuelle du hero, à **trois** largeurs
>
> Rien ne devrait avoir bougé à l'écran : tout ce qui est supprimé était
> inatteignable, et la fusion `.sectionSharp`/`.sectionWave` → `.backdrop` a été
> faite en gardant règle par règle ce qui gagnait réellement dans la cascade
> (au-dessus de 1024px : `inset: 0`, masque horizontal seul, opacité 1 ; en
> dessous : pas de masque, opacité 0,6). Mais c'est du CSS refondu à la main, donc
> ça se regarde : `/` à **1440x900, 820x1180 et 390x844** — une par cadre. La
> largeur du milieu est celle qu'on ne regarde jamais, et c'est précisément celle
> qui a servi la mauvaise composition pendant deux sessions.
>
> #### 4. Ensuite seulement
>
> Au go de Mihai : fusion de la branche, puis les points M4 encore ouverts
> ci-dessous.
>
> ### ✅ 2026-07-30 (soir) — session M4 : les 6 pages sont construites (non déployées)
>
> Plan validé par Mihai (5 pages d'un coup, slugs FR partagés entre locales,
> **aucun montant publié** pour le MVP — « prix fixe annoncé avant le début »),
> puis exécuté en 12 commits sur `main`, de `95088ca` (messages) à la mise à
> jour de ce fichier. **Rien n'est poussé/tagué/déployé** — consigne explicite
> de Mihai : des commits, jamais de tag ni de release sans son accord.
>
> Ce qui existe maintenant (vérifié sur build de prod local, FR nu + `/en`) :
>
> - **`/services`** (index, 4 offres en rangées numérotées + preuves),
>   **`/services/applications-web`** (in-house + 3 récits de cas),
>   **`/services/ia`** (grille signal/résultat + bloc honnêteté),
>   **`/services/seo`** (méthode 4 étapes + méta-preuve « regardez cette page »),
>   **`/services/mvp-30-jours`** (timeline verticale, inclus/pas inclus, prix
>   fixe), **`/faq`** (12 questions, ids stables pour le mapping P01–P20).
> - JSON-LD : nœud `Service` en `@graph` à côté du WebPage sur les 4 pages
>   service ; `FAQPage.mainEntity` sur `/faq` construit depuis `pages.faq.items`
>   (source unique HTML + markup). **Sortie des 3 anciennes pages vérifiée
>   byte-identique.** `npm run seo:jsonld -- --site` : 18/18 URLs à 0 erreur,
>   contrôle négatif passé. Lint : baseline 4 inchangée (⚠️ 2 depuis la
>   phase 6 — voir plus haut).
> - Les 8 points de couture sont faits : redirect `services` retiré de `gone`
>   (`next.config.mjs`), ROUTES +6, `seo.pages.*` fr+en (le `ServicePage`
>   invalide → `CollectionPage`), sitemap 18 URLs, SITE_PATHS +6, llms.txt
>   +12 puces et offres liées, `CLIENT_NAMESPACES` += `pages.services`/`pages.faq`,
>   navbar + footer. Réponses FAQ dans le HTML accordéon fermé, 0 `opacity:0`
>   inline, copie intégrale SSR sur toutes les pages.
> - La taxonomie v1 de `pages.services` (18 sous-services, lorem) est **purgée**
>   des deux locales. Les composants v1 morts (`src/components/pages/services/*.jsx`
>   hors `v2/`, homepage v1) sont toujours là, orphelins — nettoyage possible
>   mais non fait.
>
> ### 📌 Points M4 encore ouverts (plus le point de départ — voir le 👉 plus haut)
>
> 1. **Revue visuelle par Mihai** : `npm run build && npm run start`, puis les
>    6 URLs ci-dessus sur `http://localhost:3000` (FR) et `/en/...` (EN), deux
>    breakpoints. Les ajustements visuels se font en dial-par-dial (habitude
>    établie).
> 2. **ENG-83 avant la mise en prod** : le relevé de citations est une photo
>    d'AVANT — s'il n'est pas fait, la mise en prod attend 2-3 jours, pas
>    l'inverse. Rappelé à Mihai en session M4 ; re-vérifier son statut Linear.
> 3. **Au go de Mihai seulement** : push, tag, déploiement ; puis resoumettre le
>    sitemap (GSC via MCP `gsc` + Bing), `npm run seo:indexnow`, demandes
>    d'indexation, et mettre à jour **ENG-91 / ENG-92 / ENG-95** dans Linear
>    (prose sans pipes — WAF).
> 4. **Réconciliation ENG-82** : quand Dorian livre `docs/geo-prompt-panel.md`,
>    mapper chaque `P01`–`P20` sur sa page/entrée FAQ (les items de
>    `pages.faq.items` ont un `id` stable prévu pour ça).
>
> ### ✅ 2026-07-30 — migration locale par défaut DÉPLOYÉE (v0.22.0)
>
> Mihai a obtenu l'accès GSC (ENG-110 avancée) et y a vu l'apex « Non indexée :
> Introuvable (404) ». Diagnostic, décision et relevé de release dans
> **`docs/geo-default-locale-plan.md`, section « EXÉCUTÉ le 2026-07-30 »**. En bref :
>
> - **`v0.22.0` est taguée, déployée et vérifiée en prod** (~09:20 UTC) : FR nu
>   à la racine (`/`, `/contact`, …), EN sous `/en`, `/fr/*` → **301**. Nouveau
>   module `src/seo/locale-url.js` = la règle unique de construction d'URL.
>   IndexNow soumis (HTTP 200, les 6 URLs nues).
>   Marqueur : `curl -s -o /dev/null -w '%{http_code}' https://hargile.com/fr`
>   → **301 = v0.22.0 en prod**.
> - ⚠️ **Les anciens marqueurs `curl …/fr` de ce fichier répondent 301
>   désormais** : lire `/` et `/en` à la place (ou `curl -L`).
> - **Le 404 de GSC était infra et est corrigé** : aucun router Traefik
>   n'écoutait le port 80. PR hargile-infra#174 mergée le 30/07 —
>   `http://hargile.com/` → 308 https. Le template `nodejs` a le même trou
>   pour les autres apps ; signalé à Alexis, à traiter au niveau template.
> - **Reste côté Mihai (navigateur)** : resoumettre `sitemap.xml` dans GSC et
>   Bing WMT ; « Demander une indexation » sur `hargile.com` dans GSC ;
>   (optionnel) supprimer la propriété GSC redondante `https://hargile.com/en/`
>   — la propriété domaine `hargile.com` couvre tout, suppression sans effet
>   sur l'indexation.
> - ⚠️ Ne rien conclure des rapports GSC/Bing avant que leurs crawls soient
>   postérieurs au 2026-07-30 ~09:20 UTC.
>
> ### État Linear / répartition (au soir du 30/07, avant la session M4)
>
> **ENG-91/92 : le code est fait (voir ci-dessus), les tickets passent à
> « livré » seulement après déploiement.** ENG-95 est avancée par le
> `FAQPage.mainEntity`. Répartition actée le 30/07 : **ENG-82 (les 20 prompts)
> chez Dorian** — `docs/geo-prompt-panel.md` n'existait pas encore en fin de
> session M4, la FAQ a été rédigée depuis les offres, à réconcilier. **ENG-84
> In Progress** : PR hargile-infra#176 (User-Agent dans les logs Traefik)
> attend le merge d'Alexis ; mesure ~1 semaine après (fenêtre Loki 7 j).
> ENG-87 **Done**, ENG-110 **Done** (GSC via MCP `gsc`, baseline
> `docs/geo-gsc-baseline-2026-07-30.md`, relevé comparatif ~mi-août).

---

Lire EN PREMIER, dans cet ordre :

1. ce fichier — état réel, périmètre, pièges ;
2. `docs/geo-plan.md` — la phase 2 est la suite ;
3. `docs/geo-bing-indexnow-runbook.md` — ce que Mihai doit faire au navigateur ;
4. `docs/homepage-code-review-plan.md` — le détail par item, avec ce qui est
   déjà livré marqué ✅ ; ne pas ré-auditer ;
5. `docs/homepage-performance-plan.md` §Verification — pièges de mesure.

## ✅ Code review faite, v0.21.0 taguée, déployée et vérifiée

La code review demandée par Mihai a été faite en ouverture de la 3e session du
29/07, sur `git diff v0.20.0..main` (9 commits, dont 6 de code). **Conclusion :
rien de bloquant.** Ne pas la refaire.

Ce qui a été vérifié sur un vrai build, et pas seulement relu :

- **Suppression de `src/app/robots.js`** — le risque « et si `next-sitemap` ne
  tournait pas dans l'image ? » est définitivement clos : `Dockerfile:15` fait
  `RUN npm run build`, npm enchaîne sur `postbuild`, et le
  `COPY … /app/public` du stage runner (`Dockerfile:27`) a lieu **après**.
  Le `robots.txt` servi en prod porte maintenant les lignes `Disallow: /api/`
  et `/admin/` — que la route morte n'a jamais servies.
- **`/llms.txt`** — build en `○` (prérendu statique), 200 `text/plain`. Point
  qui n'était pas écrit et qui compte : `src/proxy.js:4` teste `/\.(.*)$/`,
  donc le point dans `llms.txt` fait sauter le middleware — **pas** de
  redirection de locale. Les 6 URLs externes qu'il annonce répondent 200
  (portfolio, les 3 sites clients, LinkedIn, GitHub) : un lien mort là serait
  exactement la « source qui contredit les autres » que `@/seo/same-as` existe
  pour éviter.
- **Année du footer** — `© 2026` dans le HTML brut de `/fr` et `/en`.
- **JSON-LD** — 6 pages × 2 locales, 37 propriétés, 0 erreur, 0 avertissement,
  contrôle négatif vert. Le seul `"@type":"WebSite"` restant est le nœud
  `isPartOf` : c'est la forme correcte, pas un reste.
- **Garde-fou GEO** — 0 `opacity:0` inline (mesuré via node, pas `grep -P`),
  `<h1>` présent. bingbot / ClaudeBot / PerplexityBot / GPTBot → 200.
- **Lint** — 4 erreurs, la baseline exacte.

Deux détails relevés, aucun bloquant et aucun corrigé :

- `.cache/` n'est pas dans `.dockerignore`. Sans effet réel : la CI construit
  depuis un clone frais où le dossier n'existe pas.
- L'année du footer est l'année du **build**. Un build qui traverse le 31/12
  affichera l'année précédente dans le HTML brut jusqu'au build suivant.
  Toujours strictement mieux que le 2025 en dur d'avant.

**Déploiement : passé sans accroc**, contrairement à v0.18.0. Image construite,
PR `image-updates/auto` #172 ouverte à 15:45 UTC avec le bon diff d'une ligne
(`v0.20.0` → `v0.21.0`), checks réellement exécutés (les runners ARC étaient
vivants), auto-mergée à 15:47 UTC par `github-actions`, Flux a suivi. Aucune
intervention manuelle.

Les 5 marqueurs de prod passent :

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://hargile.com/llms.txt          # 200 ✅
curl -s https://hargile.com/fr | grep -c '"@type":"WebPage"'                   # 1 ✅
curl -s https://hargile.com/fr | grep -o '© [0-9]*'                            # © 2026 ✅
curl -s https://hargile.com/robots.txt | grep -c 'Disallow: /api/'             # 1 ✅
curl -s https://hargile.com/bfca279c73ec400f7b3ceef8e1e1483f.txt               # la clé ✅
```

**`npm run seo:indexnow` a été lancé après confirmation du déploiement** : les
6 URLs soumises, HTTP 202 (accepté, clé en cours de validation). **Ne pas le
relancer à chaque session** — il ne sert qu'après un changement de contenu réel.

## État au départ (vérifié le 2026-07-29)

- **v0.21.1 est taguée, déployée et vérifiée** — `public/BingSiteAuth.xml`,
  pour la vérification de propriété Bing.
  Marqueur : `curl -s -o /dev/null -w '%{http_code}\n' https://hargile.com/BingSiteAuth.xml`
  → **200 = v0.21.1 est en prod**.
- **v0.21.0 est taguée, déployée et vérifiée** (GEO phase 1 : `/llms.txt`,
  `WebPage`, robots.txt à source unique, année du footer, IndexNow).
  Marqueur : `curl -s -o /dev/null -w '%{http_code}\n' https://hargile.com/llms.txt`
  → **200 = v0.21.0 est en prod**. Confirmé le 2026-07-29.
- **v0.20.0 est taguée et déployée** (entité Organization + module NAP).
  Marqueur : `curl -s https://hargile.com/fr | grep -c '"alternateName":"HARGILE Tech Studio"'`
  → **> 0 = v0.20.0 est en prod**. Confirmé.
- **v0.19.2 est déployée et vérifiée en prod** (retrait du handle X mort) :
  plus aucune balise `twitter:site` / `twitter:creator`. Attention, au début de
  la session du 29/07 elle ne l'était **pas encore** — le bump infra venait de
  merger 3 min plus tôt. Un marqueur négatif juste après un tag veut souvent
  dire « en vol », pas « bloqué » : regarder l'heure du merge dans
  `hargile-infra` avant de conclure.
- **v0.19.1 vérifiée en prod** : 14 marqueurs `data-reveal-index`, **0
  `opacity:0` inline sur la copie** sur `/fr` et `/en`, `/fr/audit/result` →
  404, et **aucun fichier de police `-ext` demandé** (fix d'ordre
  `@font-face`).
- ✅ **PSI production, 8 runs sur v0.19.1 : médiane desktop 89, médiane
  mobile 94.** Baseline desktop 61. Objectif 90+ atteint, le plan perf est
  livré. **Il n'y a plus rien à gratter côté score** : les items restants
  (2.2, 3.x) sont qualité de code et accessibilité, pas perf.
- 🛑 **LIRE CECI AVANT DE REGARDER UN SCORE PSI. L'amplitude est de ±25 points
  sans le moindre changement de code.** Runs bruts : desktop 70 / 79 / 95 / 87 /
  97 / 91 / 71 / 93, mobile 82 / 98 / 97 / 84 / 93 / 95 / 71 / 97. Un run à
  71/71 et le suivant, **5 secondes plus tard**, à 93/97 — même build, mêmes
  octets, même serveur.
  **Ce qui bouge** : uniquement le TBT (30 % du score), mesuré de **40 ms à
  1 530 ms sur les mêmes octets**. À 1 530 ms il rapporte 0 de ses 30 points, ce
  qui plafonne le run vers 70. Tout le reste est stable sur tous les runs :
  FCP 0,3–0,9 s, LCP 0,5–1,4 s, CLS 0,017, serveur 10 ms.
  **La cause n'est PAS identifiée** — et surtout, ce n'est **pas** la boucle
  d'animation WebGL : elle est déjà gatée sur rasteriseur logiciel depuis la
  phase 1.1 (`cube-grid.jsx:102`, `ColorBends.jsx:206`). Hypothèses restantes et
  méthode dans `docs/tbt-variance-plan.md`.
  **Conséquence pratique** : un run PSI isolé sur ce site ne mesure pas le code.
  Médiane de 3 à 5 runs, ou rien. Le « 99/99 » qui a traîné une heure dans ces
  docs était un run isolé, pris pour argent comptant parce qu'il faisait
  plaisir — la règle des médianes avait été appliquée aux chiffres qui
  déplaisaient et levée pour celui-là. Ne pas s'en resservir comme baseline.
  **Ce qui compte vraiment, ce sont les données terrain (CrUX)** en haut du
  rapport PSI, pas le score labo : de vrais utilisateurs, avec de vrais GPU.
- 📄 **Un plan dédié existe : `docs/tbt-variance-plan.md`.** Tout le détail y
  est — les mesures, ce qui est **déjà écarté** (ne pas ré-enquêter : la boucle
  d'animation WebGL est déjà gatée depuis la phase 1.1, le conteneur froid, les
  polices, v0.19.1), les deux hypothèses restantes (compilation des shaders sous
  SwiftShader / coût d'hydratation), et une **phase 0 de mesure avant toute
  modification de code**. Le point clé : TBT va de 40 ms à 1 530 ms sur les
  mêmes octets, tout le reste est stable. **Commencer par regarder les données
  terrain CrUX**. **Vérifié le 2026-07-29 : CrUX ne renvoie AUCUNE donnée** pour
  hargile.com — trop peu de visiteurs Chrome réels pour que Google publie des
  métriques terrain. Donc les Core Web Vitals **ne peuvent pas** peser sur le
  référencement, et le score labo n'est que du diagnostic. Le plan conclut
  explicitement : **ne pas l'exécuter pour l'instant**, la contrainte de ce site
  est le trafic, pas les millisecondes. Priorité à `geo-plan.md` phase 1.
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

   🔑 **Et surtout : seul un tag `v*` peut déclencher un déploiement.**
   Vérifié le 2026-07-29 dans
   `hargile-infra/infrastructure/flux-image-automation/image-policies.yaml` :
   l'`ImagePolicy` de `hargile-website` est en **semver** (`range: '>=0.0.0'`).
   Un push de branche produit `:main`, `:latest`, `:sha-…` — **aucun n'est un
   tag semver, donc aucun n'est sélectionné**. Le commentaire du fichier le dit
   noir sur blanc.
   **Conséquence pratique : pousser sur `main` est sûr.** Ça construit l'image
   et ne déploie rien. C'est ce qui permet de faire relire du code poussé avant
   de décider d'une release. Ne pas confondre « poussé » et « en prod ».
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

## 🎯 GEO phase 1 — TERMINÉE côté code

Décidé le 2026-07-29. La perf est finie et **CrUX ne renvoie aucune donnée**
pour hargile.com : la contrainte de ce site est d'être trouvé, pas d'être
rapide. Tout ce qui suit sert ENG-74 (Urgent, assigné à Mihai) et ses
milestones M1–M5.

Récapitulatif de ce qui a été fait dans la 2e session du 29/07 — **ne pas
ré-auditer**, tout est vérifié en local (build + 6 pages + navigateur) :

- ✅ **ENG-109** — le `@type` de page est `WebPage` et non plus `WebSite`. On
  publiait un `WebSite` `isPartOf` un autre `WebSite` : deux entités de niveau
  site concurrentes au lieu d'un site + N pages. **Rien n'était invalide** (0
  erreur de validateur avant comme après), c'est bien pour ça que ça avait
  survécu — c'est un contresens de modélisation, pas un bug de syntaxe.
- ✅ **`/llms.txt`** — servi par `src/app/llms.txt/route.js`. Une **route**, pas
  un fichier de `public/`, pour que le NAP et les profils viennent de
  `@/lib/nap` et du nouveau `@/seo/same-as`. Attentes nulles, comme annoncé.
- ✅ **IndexNow (ENG-87, moitié code)** — clé publique dans
  `public/bfca279c73ec400f7b3ceef8e1e1483f.txt`, script `npm run seo:indexnow`.
  La clé **est publique par conception** (c'est le mécanisme de vérification du
  protocole) : ne pas la traiter comme un secret, ne pas la déplacer en env.
- ✅ **`robots.txt` ramené à une source unique.** `src/app/robots.js` déclarait
  `Disallow: /api/` et `/admin/` — **et n'a jamais servi un octet** : un fichier
  de `public/` masque une route App Router du même chemin, et `next-sitemap`
  écrit `public/robots.txt` au postbuild. Vérifié en prod. La route est
  supprimée, la policy est dans `next-sitemap.config.js`.
- ✅ **Année du footer** — le `useState` était seedé à 2025 et corrigé dans un
  effet ; le HTML brut annonçait donc 2025 pour toujours, et **aucun crawler IA
  n'exécute de JS**. Seed inliné au build via `NEXT_PUBLIC_BUILD_YEAR`.
- ✅ **Validateur JSON-LD réécrit dans le dépôt** (`npm run seo:jsonld -- --site
  http://localhost:3000`), avec contrôle négatif obligatoire — voir « Pièges ».
- ✅ **Test crawlers** — bingbot, GPTBot, OAI-SearchBot, ClaudeBot,
  PerplexityBot, meta-externalagent : **200 pour les six**, texte identique au
  mot près à un curl normal. Le « WAF test » d'ENG-74 M2 est répondu : rien
  n'est bloqué, il n'y a rien à débloquer.
- 📄 **§1.2 locale par défaut cadrée puis reportée** →
  `docs/geo-default-locale-plan.md`.

Curiosité relevée, **sans suite prévue** : les réponses servies aux
non-bots contiennent **deux fois** le même bloc `<style>` inline de 15,8 KB
(126 KB contre 109 KB pour bingbot). Ce n'est pas du contenu, la perf est close
et CrUX est vide — c'est noté pour que personne ne reparte enquêter sur l'écart
d'octets en croyant à du cloaking.

### ✅ 1. `docs/geo-entity-plan.md` — entité Organization — **LIVRÉ en v0.20.0**

Ne pas ré-auditer. Q4 tranchée (`foundingDate: "2025"`, année seule — Mihai a
répondu « environ un an et demi, genre février 2025 », donc l'année seule
absorbe l'incertitude ; corroboré par le premier commit du dépôt, 2025-03-09) et
Q5 tranchée (`areaServed` = Belgique).

Ce qui a changé, et qui compte pour la suite :

- **`src/lib/nap.js` est désormais la source unique** de l'adresse, du téléphone
  et de l'email. Footer, navbar et `build-json-ld.js` la consomment. **Toute
  nouvelle mention de l'adresse passe par là** — un littéral en dur réintroduit
  exactement le problème que l'item existait pour régler.
- Les clés `components.footer.address.line1` / `line2` **n'existent plus** ;
  `line3` est devenue `address.country` (seule partie traduite).
- La navbar codait « Belgium » en dur : le menu FR l'affichait en anglais. Corrigé.
- `priceRange` reste **volontairement absent**, donc le Rich Results Test sort
  **1 avertissement facultatif — c'est l'état voulu, pas un reste à faire**. Le
  site ne publie aucun prix ; inventer un « €€ » serait une affirmation que la
  copie ne soutient pas. Même logique que pour `identifier`/`aggregateRating`.
- Cet avertissement n'apparaît **que parce que** `@type` inclut
  `ProfessionalService` (sous-type de `LocalBusiness`). C'est le coût assumé du
  type, qui corrobore la catégorie GBP.

**Outil réutilisable, désormais dans le dépôt** : `scripts/validate-json-ld.mjs`
(`npm run seo:jsonld -- --site http://localhost:3000`). Il contrôle chaque
`@type` et chaque propriété contre le vocabulaire schema.org réel, télécharge
le dump une fois dans `.cache/` (gitignoré), et **refuse de rendre un verdict
si son contrôle négatif échoue**. Résultat courant : 37 propriétés, 0 erreur,
0 avertissement, sur les 6 pages et les 2 locales.

### 🗂️ État Linear au 2026-07-29 (fin de 3e session)

Mis à jour et commenté le jour même — **ne pas re-commenter ces issues sans lire
le commentaire existant**, il porte le détail vérifié :

| Issue | Statut |
| --- | --- |
| ENG-85 robots.txt crawlers IA | **Done** |
| ENG-86 CDN/WAF ne bloque pas les bots | **Done** |
| ENG-109 `@type` WebPage | **Done** |
| ENG-87 Sitemap/Bing/GSC/IndexNow | **In Progress** — bloquée par ENG-110 |
| ENG-95 JSON-LD | **In Progress** — reste dépend de M4 |
| ENG-110 accès GSC (Charles) | **Todo**, priorité High |
| ENG-82 · ENG-83 · ENG-84 (M1) | **Backlog** — c'est la session suivante |

⚠️ **Piège vécu en écrivant ces commentaires** : le WAF Cloudflare devant Linear
**rejette les commandes shell avec pipe** dans le corps d'un commentaire
(`curl … | grep …` est lu comme une injection). Le POST échoue avec une page
d'erreur Cloudflare, pas avec un message Linear. Reformuler en prose.

### 🟡 2. ENG-87 Bing/IndexNow — **la partie Bing est finie, l'issue reste ouverte**

⚠️ Ne pas la lire comme close : **ENG-87 est en `In Progress`, bloquée par
ENG-110.** Ses points 1 (sitemap), 2 (Bing WMT) et 4 (IndexNow) sont faits et
vérifiés ; son point 3 **Google Search Console** ne l'est pas, faute d'accès.
C'est la seule chose qui manque pour la clôturer.

📄 **`docs/geo-bing-indexnow-runbook.md`**, section « Relevé du 2026-07-29 ».

**La réponse : `hargile.com` EST dans l'index Bing, découverte le 25 mars 2025.**
C'était la question ouverte de tout l'item — l'hypothèse « aucune URL n'y est »
était sérieusement sur la table. `/fr` est *Indexed successfully*, crawl et
indexation autorisés, JSON-LD détecté, **« No SEO/GEO issues found »**.

Conséquence pour la phase 2 : les nouvelles pages atterriront dans un index qui
existe déjà et qui nous crawle, au lieu d'avoir à s'y faire une place. C'est
une bonne nouvelle, et elle change le cadrage.

Vérification de propriété faite par **fichier `BingSiteAuth.xml`** (v0.21.1), et
non par import GSC : la propriété Search Console de `hargile.com` appartient à
un collègue, et l'import Bing exige un OAuth depuis le compte Google qui la
détient. Le fichier statique évitait toute coordination. **À demander quand même
pour la phase 2 : un accès GSC nommé** — faire du SEO sans pouvoir ouvrir la
Search Console du site est un angle mort, indépendamment de Bing.

⚠️ **Le dernier crawl Bing (2026-07-28 18:48) précède les déploiements du 29/07.**
Ce qui est indexé est l'ancien HTML. Ne rien conclure des rapports Bing tant que
« Last crawl attempted » n'est pas postérieur au 2026-07-29 15:47 UTC.

### ✅ 3. `llms.txt` — livré

### 📄 4. §1.2 locale par défaut — **cadré, et volontairement reporté**

Voir **`docs/geo-default-locale-plan.md`**. Le point décisif, qui contredit ce
que ce fichier et `geo-plan.md` racontaient jusqu'ici : **`localePrefix` ne
ferait rien**. Ce dépôt n'utilise pas le middleware de next-intl — le routage de
locale est écrit à la main dans `src/proxy.js`, qui ne lit pas cette option.
Poser `as-needed` ferait générer des `href` non préfixés que `proxy.js`
redirigerait aussitôt : **une redirection de plus à chaque navigation interne**
pour en supprimer une sur l'apex. Strictement pire qu'aujourd'hui.

Le vrai coût, c'est une réécriture de `proxy.js` + six fichiers de construction
d'URL, dans un seul déploiement. Le vrai gain, c'est 44 ms sur un site dont
CrUX ne mesure rien. **Décision : le faire en même temps que la phase 2**,
quand l'espace d'URL change de toute façon — une seule vague de réindexation
au lieu de deux.

### ✅ 5. ENG-109 — `WebSite` → `WebPage` — livré

### Puis la vraie contrainte — phase 2

Le site n'a que **3 pages réelles** (`/fr`, `/fr/contact`,
`/fr/legal/privacy-policy`). `/fr/services` → 308, `/fr/about-us` → 307. Le plan
GEO est catégorique : « AI engines cite specific pages that answer specific
questions; a one-page site can only ever be cited for one thing. **This is the
dominant gap — everything else is tuning.** » La phase 1 rend l'entité
correctement décrite ; la phase 2 la rend citable. C'est du contenu, pas du
code, et ça mérite sa propre session.

👉 **L'ordre exact est arrêté** : voir « Ordre recommandé pour les prochaines
sessions » plus bas. Ne pas repartir de « la phase 2 » en général.

### Hors repo, mais c'est le levier

Le GBP existe (HARGILE Tech Studio, Rue Sterckx 5, 4,8★, 18 avis). Les moteurs
vérifient **l'accord entre sources indépendantes** : GBP, annuaires (Sortlist,
Clutch), profils sociaux. Aucun JSON-LD ne remplace ça. Vérifier que le GBP et
les annuaires affichent la même adresse et le même nom que le schéma.

## 🧭 Ordre recommandé pour les prochaines sessions

Arrêté le 2026-07-29 avec Mihai. La phase 1 a rendu l'entité correctement
décrite, ce qui ne sert à rien tant qu'il n'y a que 3 pages à décrire.

### Session suivante — M1 (une journée, sans une ligne de code)

⚠️ **M1 = ENG-82 + ENG-83 + ENG-84.** Les versions précédentes de ce fichier
n'en listaient que deux. Aucune des trois n'est du code : rien à builder, rien à
taguer, rien à déployer.

Et **M1 ne se referme pas ce jour-là** : ENG-82 et ENG-83 se terminent dans la
session, ENG-84 non — sa mesure n'est possible qu'une semaine après le
changement d'infra demandé au point 1. Annoncer « M1 fermée » en fin de session
serait faux.

#### 1. Minute 1 — envoyer la demande qui débloque ENG-84

ENG-84 veut compter le passage des crawlers IA dans les logs des 30 derniers
jours. Vérifié le 2026-07-29 dans `hargile-infra` — **ne pas ré-enquêter** :

- La stack existe : Loki + Promtail + Grafana. Promtail lit déjà le log d'accès
  JSON de Traefik (`/var/log/traefik/access.log`, job `traefik-access`) et le
  pousse dans Loki.
- **La rétention Loki est de 7 jours, pas 30** —
  `infrastructure/loki/helmrelease.yaml`, `retention_period: 168h`, avec un
  compactor qui supprime pour de bon. Les « 30 derniers jours » de l'issue sont
  impossibles par construction ; le plafond est une fenêtre glissante de 7 jours.
- 🛑 **Le User-Agent n'est journalisé nulle part.** Traefik jette les en-têtes de
  requête du log d'accès sauf mention explicite, et
  `infrastructure/traefik-config/helmchartconfig.yaml` (96 lignes) n'a aucune
  section `fields.headers`. **Il n'y a donc rien sur quoi filtrer, à aucune
  profondeur** : la donnée qu'ENG-84 veut compter n'a jamais été écrite. Ce
  n'est pas un problème de rétention, c'est un problème de collecte.

**La demande à Alexis, précise** — ajouter sous `logs.access` dans
`infrastructure/traefik-config/helmchartconfig.yaml` :

```yaml
fields:
  headers:
    defaultMode: drop
    names:
      User-Agent: keep
```

puis confirmer que l'étape `json` du scrape Promtail extrait bien le champ.
Aucun enjeu vie privée : l'IP client (`ClientHost`) est déjà journalisée, une
chaîne d'UA l'est moins.

**Conséquence sur l'ordre** : ENG-84 n'est pas « un diagnostic de 15 min à faire
en premier », c'est **une demande à envoyer en premier et une mesure à faire une
semaine plus tard** — le compteur ne démarre qu'une fois l'en-tête activé. En
attendant, le seul chiffre de crawl disponible reste Bing WMT (dernier crawl
connu : 2026-07-28 18:48).

#### 2. ENG-82 — figer les 20 prompts (~1 h 30)

**D'où viennent les faits** : `src/app/llms.txt/route.js`. C'est déjà
l'inventaire canonique et à source unique de ce que le studio vend — 4 offres
(apps web sur mesure pour PME, IA « là où elle change le résultat », SEO
automatisé, MVP en 30 jours à prix fixe) et 3 preuves (Ecole du Bonheur,
La Marquisette, VENIZI, détail dans `src/data/portfolio-data.js`).

⚠️ **Ne pas partir de `src/messages/fr.json`** : il porte encore la taxonomie de
services du v1 (dev / IA / analyse / maintenance), d'autres projets (AGVES,
I GO) et du lorem ipsum dans `our-solutions`. Écrire les prompts là-dessus,
c'est viser des choses que le site ne vend pas. Ne pas partir non plus de la
prose de `geo-plan.md` §2.1 : elle date du 28/07 et n'est pas la source.

**Forme** : des questions entières, telles qu'un prospect les tape, jamais des
mots-clés. Réparties sur quatre intentions pour ne pas sur-représenter la
première qui vient :

| Intention | Forme d'exemple |
| --- | --- |
| Découverte locale | « quelle agence peut développer une application web sur mesure pour une PME à Bruxelles » |
| Offre précise | « qui peut livrer un MVP en 30 jours en Belgique à prix fixe » |
| Stack / techno | « studio Next.js et Laravel en Belgique » |
| Décision / coût | « combien coûte une app web sur mesure en Belgique », « sur-mesure ou WordPress pour une PME » |

**Deux ajouts au-delà de ce que demande l'issue**, tous deux payants plus tard :

- **Taguer chaque prompt avec la page M4 censée y répondre** (`/services/mvp`,
  `/faq`, telle étude de cas…). ENG-91/92/93 tombent alors de la liste au lieu
  de s'écrire à l'aveugle — c'est exactement la raison pour laquelle ENG-82
  passe en premier.
- **Écrire les règles de gel dans le document** : identifiants `P01`–`P20`,
  jamais renumérotés, jamais reformulés ; les idées suivantes vont dans une
  section « candidats v2 » sous la ligne. Sans ça, le relevé d'ENG-97 cesse
  silencieusement d'être comparable.

**Langue : 13 FR / 7 EN.** `fr` est la locale par défaut, les clients sont
francophones, et l'espace de requêtes IA en français est nettement moins
disputé — tout en couvrant `/en`, qui existe et est indexé. 15/5 ou 12/8 se
défendent aussi ; ce qui compte est de fixer le ratio **avant** d'écrire, pas
prompt par prompt.

**Livrable** : `docs/geo-prompt-panel.md`, un commit
`docs(geo): fige les 20 prompts cibles (ENG-82)`, un commentaire sur ENG-82,
statut Done.

**Où vivent les deux documents de la session.** ENG-82 dit « document
partagé », ENG-83 « partagé avec l'équipe », sans dire où. **Le dépôt est la
source** : git horodate le gel et diffe contre le relevé M5. Si Dorian et
Charles ont besoin d'une surface lisible, une page Notion **miroir**, dont la
première ligne dit « copie — source : `docs/geo-prompt-panel.md` ». Pas deux
originaux : ce dépôt vient de perdre du temps sur exactement ça
(`public/robots.txt` masquant `src/app/robots.js`).

#### 3. ENG-83 — le relevé de citations initial

**Qui le passe** : Mihai et Dorian, sur des comptes gratuits. C'est le bon
instrument — c'est ce qu'un prospect utilise. Trois conditions pour que la
donnée survive au relevé M5 :

- **Se répartir par moteur, pas par prompt.** L'un prend ChatGPT + Copilot,
  l'autre Gemini + Perplexity + Claude : chaque colonne a alors des conditions
  constantes. Réparti par prompt, chaque colonne mélange deux comptes et deux
  historiques.
- **Déconnecté ou navigation privée, mémoire et instructions personnalisées
  coupées, un chat neuf par prompt.** Un compte gratuit avec historique
  personnalise quand même.
- **Noter qui a passé chaque ligne et quel modèle est apparu** — les offres
  gratuites changent de modèle sous le capot sans le dire.

⚠️ **Ne jamais utiliser la réponse de l'assistant de cette session comme point
de mesure « Claude ».** Ça mesurerait des données d'entraînement, pas la surface
de recherche et de citation. Il faut claude.ai avec la recherche web active, en
session neuve, comme les autres. Sur l'offre gratuite la recherche web n'est pas
toujours disponible : si elle est coupée, marquer la cellule comme telle plutôt
que d'enregistrer un faux « non cité ».

**Conditions à figer en en-tête du document**, sinon le relevé M5 mesure les
conditions et pas le travail : date, moteur + niveau de modèle, recherche web
on/off, déconnecté ou privé, mémoire off, région BE, langue du navigateur, un
chat neuf par prompt (aucune relance dans le même fil).

**Schéma de ligne** — plus riche que les 3 champs de l'issue, pour le même
effort de saisie :

```
prompt_id | moteur | cité O/N | position dans la réponse | URL exacte citée |
est-ce hargile.com ? | concurrents nommés, dans l'ordre | domaines sources
cités | extrait verbatim si cité | opérateur
```

🛑 **Mesurer le bruit, ne pas l'importer.** ENG-97 annonce que « la visibilité
IA fluctue de 5 à 7 points quand on rejoue les mêmes requêtes sans rien
changer ». C'est mot pour mot le piège du PSI dans ce dépôt : un run isolé pris
pour une baseline. Donc **rejouer un sous-ensemble fixe — 5 prompts × 2 moteurs
× 3 répétitions, une trentaine de cellules de plus** — pour mesurer la variance
réelle de ce site au lieu d'hériter d'un chiffre écrit ailleurs. Sans ce
plancher de bruit, aucun écart lu en M5 ne sera interprétable.

**Estimer en mesurant, pas en devinant.** Passer les 10 premières cellules,
chronométrer, extrapoler, **puis** décider entre les 100 complètes et un
périmètre réduit. Ordre de grandeur actuel : 3 à 5 h à deux, soit 1 h 30 à
2 h 30 chacun. Si le périmètre est réduit, **écrire noir sur blanc ce qui a été
abandonné** — jamais de troncature silencieuse.

**Attendu, à annoncer d'avance** : le compte de citations sera très
probablement 0/100 ou proche. Ce n'est pas un échec, c'est la baseline. La
valeur est dans les deux autres colonnes — **quels concurrents les moteurs
nomment, et quels domaines ils citent** (fiches Sortlist/Clutch, comparatifs).
C'est ce qui dit à quoi ressemble une bonne réponse sur ce marché, et ça
alimente directement la phase 3 (ENG-89, ENG-90).

**Livrables** : `docs/geo-citation-baseline-<date>.md` — nom daté, parce que
c'est une photo et qu'on ne l'édite plus après — et un CSV pour le diff d'ENG-97.

#### 4. Clôture de session

Statuts Linear pour ENG-82, ENG-83 et ENG-84 (celle-ci **reste ouverte**, en
attente d'Alexis puis de 7 jours de logs), et **réécrire l'en-tête de ce
fichier** pour pointer la session d'après : ENG-91 + la réécriture de la locale
par défaut dans le même déploiement, et le rappel de revenir mesurer ENG-84.
⚠️ Rappel : le WAF Cloudflare devant Linear rejette les commandes shell avec
pipe dans un corps de commentaire. Rédiger en prose.

### Puis M4 — la vraie contrainte, par ordre de valeur

4. **ENG-91 pages services** — une page par offre. Le plus fort levier de tout
   le backlog : chaque page devient une réponse citable à une question précise.
   👉 **Embarquer la réécriture de la locale par défaut dans le même
   déploiement** (`docs/geo-default-locale-plan.md`) : l'espace d'URL change de
   toute façon, autant n'avoir qu'une seule vague de réindexation. Ça touche
   `src/proxy.js` + six fichiers de construction d'URL — ce n'est pas anodin,
   lire le plan avant.
5. **ENG-92 FAQ** — alimentée directement par les 20 prompts d'ENG-82. Ajouter
   le `FAQPage` en JSON-LD par-dessus, ce qui avance ENG-95.
6. **ENG-93 études de cas** — les rapatrier depuis `portfolio.hargile.com`.
   Aujourd'hui la matière la plus citable du studio vit sur un sous-domaine qui
   ne renforce pas le domaine principal.

### En parallèle, hors repo — et ça pèse autant que le JSON-LD

7. **ENG-89** (propager la description canonique) et **ENG-90** (consolider les
   deux organisations GitHub). Les moteurs résolvent une entité en croisant des
   sources indépendantes. Deux organisations GitHub qui racontent des choses
   différentes, c'est exactement le désaccord entre sources que `@/lib/nap` et
   `@/seo/same-as` ont éliminé côté site. Aucun code requis.
8. **ENG-110** — accès Google Search Console pour `pmihai31@gmail.com`,
   assignée à Charles. Bloque la clôture d'ENG-87, et surtout : sans GSC, on
   écrira les pages de M4 sans jamais voir sur quelles requêtes elles
   atterrissent.

### ❌ Ce qu'il ne faut PAS rouvrir

**La perf.** `docs/tbt-variance-plan.md` conclut lui-même de ne pas l'exécuter :
CrUX ne renvoie **aucune** donnée pour hargile.com, donc les Core Web Vitals ne
peuvent pas peser sur le référencement, et un score PSI isolé varie de ±25
points sans le moindre changement de code. La contrainte de ce site est le
trafic, pas les millisecondes. Le plan perf est livré (médianes desktop 89 /
mobile 94 sur v0.19.1) et clos.

## Ce qui reste côté code — petit format, à prendre entre deux items de contenu

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
  servait toujours le build v0.18.0. **Puis DEUX fois de plus dans la session
  v0.20.0.** C'est le piège le plus récurrent du dépôt : purger le port est la
  première commande, pas une vérification après coup.)
- **`grep -P` ne marche pas dans ce shell** — il sort
  « `-P supports only unibyte and UTF-8 locales` » sur stderr, ne matche rien,
  et `wc -l` renvoie donc **0**. Un faux « tout va bien », exactement sur le
  garde-fou GEO `opacity:0`. Le 2026-07-29 ce 0 a d'abord été pris pour un
  succès. Utiliser node pour toute regex avec lookahead :
  `node -e "…(d.match(/style=\"[^\"]*\"/g)||[]).filter(s=>/opacity:0(?![.\d])/.test(s))…"`.
  Règle générale : **une commande de vérification qui échoue doit être bruyante**
  — vérifier le code de sortie, pas seulement le nombre affiché.
- **Un validateur qui renvoie « 0 erreur » ne vaut rien sans contrôle négatif —
  et le contrôle négatif ne vaut rien sans cas positif.** Vécu pour de bon le
  29/07 : la réécriture de `scripts/validate-json-ld.mjs` a indexé **zéro**
  classe et **zéro** propriété (le dump schema.org nomme ses termes
  `schema:Organization`, pas en URL complète), donc *tout* était « inconnu ».
  Les 3 cas censés produire une erreur sont passés au vert **pour la mauvaise
  raison**. Seuls les cas qui attendent un document **valide** l'ont révélé.
  Un jeu de tests négatifs doit donc toujours contenir au moins un cas positif.
  Le script refuse maintenant de rendre un verdict si son self-test échoue.
- **Un fichier de `public/` masque une route App Router du même chemin, en
  silence.** `src/app/robots.js` n'a jamais servi un octet parce que
  `next-sitemap` écrit `public/robots.txt` au postbuild. Deux sources dont une
  gagne sans le dire est pire que n'importe laquelle des deux seule : la morte
  se lit comme vivante, et l'éditer ne change rien tout en donnant l'impression
  du contraire. Corrigé, mais la règle vaut pour tout futur `sitemap.xml`,
  `manifest.webmanifest`, etc.
- **`cacheComponents` refuse `export const dynamic` dans une route**, avec une
  erreur de build franche. Ce n'est pas grave — une route qui ne lit rien de la
  requête est prérendue de toute façon (vérifier `○ /ma-route` dans la sortie de
  build).
- **Ne pas écrire de here-string PowerShell (`@'…'@`) dans l'outil Bash.** Le
  message de commit part en morceaux et git répond « pathspec 'Rich' did not
  match any file(s) ». Utiliser un heredoc `git commit -F - <<'EOF'`.
- **Vérifier qu'un commit est constructible avant de passer au suivant.** Le
  commit ENG-109 a d'abord embarqué un `import` vers un fichier encore non
  suivi par git : vert en local, cassé pour quiconque le récupère. `git status`
  après chaque `git add` partiel.
- **`validator.schema.org` et le Rich Results Test n'ont pas d'API publique
  utilisable** : le POST sort `numObjects: 0`. Les deux acceptent en revanche un
  **snippet collé** (onglet « Code » / « Code snippet »), donc aucun déploiement
  n'est nécessaire pour valider — récupérer le JSON-LD depuis `localhost:3000` et
  le coller.
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
