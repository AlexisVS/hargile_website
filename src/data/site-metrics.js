/* Measured numbers about this site, published on /services/seo.
 *
 * Everything here is a real measurement of the live site — nothing is
 * illustrative, and nothing may be rounded up. The page invites the reader to
 * re-run the tool, so a number that flatters us is a number that gets caught.
 *
 * HOW TO RE-MEASURE (do this after any deploy that changes the seo page, and
 * at least whenever `measuredOn` is more than a few months old):
 *
 *   npx lighthouse@12 "https://hargile.com/services/seo" \
 *     --chrome-flags="--headless=new" --output=json --output-path=./lh.json \
 *     --quiet --only-categories=performance,accessibility,best-practices,seo
 *
 * Then update `measuredOn` in the same commit as the numbers. The date is
 * printed on the page: stale numbers with a fresh date is the one failure mode
 * this file exists to prevent.
 *
 * lcpSeconds is currently above its 2.5 s target and is published that way on
 * purpose (2026-08-05). The section is built to show a miss rather than hide
 * it — see measured-proof.jsx. If it ever passes, the copy key `seo.measured.
 * note` needs rewriting, because it explicitly talks about the gap.
 */

export const LIGHTHOUSE = {
    measuredOn: "2026-08-05",
    url: "https://hargile.com/services/seo",
    formFactor: "mobile",
    tool: "Lighthouse 12",
};

/* Category scores, 0–100. Order is the order Lighthouse itself reports them. */
export const SCORES = [
    {key: "performance", value: 93},
    {key: "accessibility", value: 96},
    {key: "bestPractices", value: 100},
    {key: "seo", value: 100},
];

/* Field metrics against the thresholds Google publishes as "good".
   `over: true` means we are above the target — worse, and shown as such.

   ⚠️ PLUS AFFICHÉ DEPUIS LE 06/08/2026, ET C'EST PROVISOIRE. La section ne
   montre plus que les quatre scores, le temps que le LCP soit corrigé :
   publier un chiffre qu'on sait sur le point de bouger n'apprend rien à
   personne. Rien n'est supprimé ici — le bloc se remonte depuis git dès que le
   chantier LCP est fini. Voir l'en-tête de seo/measured-proof.jsx, qui porte
   le raisonnement complet et le coût éditorial du retrait. */
export const VITALS = [
    {key: "lcp", value: 3.0, target: 2.5, unit: "s", decimals: 1, over: true},
    {key: "cls", value: 0, target: 0.1, unit: "", decimals: 2, over: false},
    {key: "ttfb", value: 40, target: 600, unit: "ms", decimals: 0, over: false},
];
