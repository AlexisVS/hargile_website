# Purger les assets « earth » de l'historique git

`.git` pèse 194 Mo dont **168,5 Mo (87 %) d'assets `earth` morts** : le modèle 3D,
ses textures 16k et les trois vidéos. Plus rien n'existe dans l'arbre de travail
depuis longtemps — c'est du poids purement historique, payé à chaque `git clone`.

Une réécriture d'historique le ramène à **11 Mo**. Elle n'a pas été poussée : le
dépôt est partagé (`github.com/AlexisVS/hargile_website`, 8 branches, plusieurs
contributeurs), et le `push --force` doit être coordonné.

## Ce que la réécriture fait

Supprime `public/textures/` et `public/videos/` de **tous** les commits. Ces deux
chemins n'ont jamais contenu autre chose que des assets earth — vérifié sur
l'ensemble de l'historique.

Vérifications déjà passées sur la réécriture préparée :

| Contrôle | Résultat |
|---|---|
| Taille `.git` | 194 Mo → **11 Mo** |
| Arbre de `main` | **identique bit à bit** (`870b9db…`) |
| Les 8 branches | seuls les chemins purgés diffèrent, rien d'autre |
| Commits | 747 → 745 |
| Assets earth restants | aucun |

Les 2 commits disparus sont `clean useless textures` et `rm fat useless texture` :
ils ne faisaient que supprimer les fichiers purgés. Une fois ceux-ci absents de
tout l'historique, ces commits ne font plus rien et sont retirés comme vides.
Aucun contenu n'est perdu.

⚠️ Les 3 branches qui n'existaient que sur origin (`NouveauMenu`,
`feat/locale-flip-perf-phase1`, `feat/perf-phase2-3`) sont réécrites elles aussi —
`filter-repo` les promeut en branches locales. C'est indispensable : une seule
branche non réécrite sur GitHub garderait les objets vivants côté serveur.

## Refaire la réécriture

```bash
pip install --user git-filter-repo          # déjà installé
export PATH="$PATH:$APPDATA/Python/Python39/Scripts"

git clone --no-hardlinks --mirror /c/Argent/HargileWebsite/hargile_website /tmp/rewrite
cd /tmp/rewrite
git filter-repo --path public/textures --path public/videos --invert-paths --force
```

`--no-hardlinks` n'est pas optionnel : sans lui le clone partage ses objets avec
le dépôt source, et le repack les touche.

## Avant de pousser

1. **Prévenir tout le monde** et faire pousser ou mettre de côté le travail en
   cours. Tout SHA antérieur change.
2. Vérifier que rien n'attend côté PR GitHub : les PR ouvertes référencent les
   anciens SHA et casseront.
3. Pousser toutes les branches d'un coup, sinon celles qui restent réintroduisent
   les objets :

```bash
cd /tmp/rewrite
git remote add origin https://github.com/AlexisVS/hargile_website.git
git push --force --all origin
git push --force --tags origin
```

4. **Chaque collaborateur re-clone.** Un `git pull` sur un ancien clone refusionne
   l'ancien historique et annule tout le gain. Il n'y a pas de raccourci propre.
5. GitHub ne récupère pas l'espace immédiatement ; ouvrir un ticket support pour
   forcer le `gc` si la taille affichée compte.

## Si on ne pousse pas

Rien ne casse. L'arbre de travail et le contexte Docker sont déjà allégés — seul
un `git clone` neuf paie encore les 168 Mo.
