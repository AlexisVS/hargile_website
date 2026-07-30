# GSC — baseline du jour de la migration (2026-07-30)

> Photo prise via l'API URL Inspection (MCP `gsc`, propriété
> `sc-domain:hargile.com`, accès `siteFullUser`) **le jour même du déploiement
> de v0.22.0** (~09:20 UTC), quelques heures après. Toutes les dates de crawl
> sont **antérieures à la migration** : ce tableau décrit l'état *avant*, c'est
> exactement sa valeur. Ne pas l'éditer — le relevé de comparaison se fait dans
> un nouveau fichier daté (prévu ~2026-08-13).

| URL | Verdict | Couverture | Dernier crawl |
| --- | --- | --- | --- |
| `https://hargile.com/` | **PASS** | Submitted and indexed | 2026-07-27 |
| `https://hargile.com/contact` | NEUTRAL | URL is unknown to Google | jamais |
| `https://hargile.com/legal/privacy-policy` | NEUTRAL | Page with redirect | 2026-06-14 |
| `https://hargile.com/en` | NEUTRAL | Duplicate, Google chose different canonical than user | 2026-07-28 |
| `https://hargile.com/en/contact` | NEUTRAL | Crawled — currently not indexed | 2026-04-08 |
| `https://hargile.com/en/legal/privacy-policy` | NEUTRAL | Alternate page with proper canonical tag | 2026-05-10 |

Rich results : aucun sur les 6 (attendu — pas de FAQ/HowTo ; l'Organization
JSON-LD n'est pas un « rich result » au sens de ce rapport).

## Lecture

- **L'apex `https://` était en fait déjà indexé** (crawl 27/07, à l'époque du
  307). Le « Non indexée : Introuvable (404) » vu dans l'interface GSC le matin
  même portait sur la variante **`http://`** — celle que le fix port 80
  (hargile-infra#174) a réglée. Les deux diagnostics étaient donc compatibles.
- `/contact` « unknown to Google » : normal, l'URL est née le matin même.
  Sitemap resoumis + demande d'indexation faites le 30/07.
- `/legal/privacy-policy` « page with redirect » : état d'avant (la forme nue
  redirigeait vers `/fr/...`). Sert 200 depuis v0.22.0 → doit basculer en
  indexée au prochain crawl.
- `/en` « duplicate, canonical différente » : sous l'ancien schéma Google
  hésitait entre `/en` et une autre URL. Les signaux post-migration (hreflang,
  canonical, sitemap tous alignés sur le schéma nu) devraient trancher.
  **C'est la ligne à surveiller en priorité au relevé d'août.**
- `/en/contact` « crawled, not indexed » (avril) et `/en/legal/privacy-policy`
  « alternate » : consolidation classique de pages hreflang peu visitées.
  Pas d'action ; observer.

## Ce qui a été fait le 30/07 (contexte du relevé)

v0.22.0 (FR nu à la racine, `/fr/*` → 301), fix port 80, sitemap resoumis
(GSC : lecture le jour même, 6 pages découvertes ; Bing WMT : resoumis),
IndexNow HTTP 200, demandes d'indexation manuelles sur l'apex et les pages FR.

## Reproduire le relevé

MCP `gsc` → `batch_url_inspection` sur `sc-domain:hargile.com` avec les 6 URLs
canoniques. Le serveur est configuré au niveau utilisateur
(`~/.claude.json`, secrets dans `C:\Users\Mihai\.claude\gsc\` — **jamais dans
le dépôt**). En mode test OAuth, re-consentement navigateur ~hebdomadaire.
