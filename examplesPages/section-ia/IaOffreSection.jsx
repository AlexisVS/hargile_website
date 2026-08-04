import Link from 'next/link';
import FaqAccordion from './FaqAccordion';

/* Layout only — no colors, no font declarations, no borders.
   Every element carries a `hg-*` class hook: apply your own tokens
   (hairlines, gradient headline, muted text, pill CTA) in your stylesheet.
   Inline styles here are strictly structural: grid spans, gaps, padding rhythm,
   flex alignment, min-heights. Safe to delete none of them; safe to restyle all. */

const USE_CASES = [
  {
    n: '01',
    span: 4,
    title: 'Automatisation du back-office',
    signal: "Vos équipes recopient des données d'un outil à l'autre.",
    result: "Des heures récupérées chaque semaine, et moins d'erreurs de saisie.",
  },
  {
    n: '02',
    span: 2,
    title: 'Contenu & visibilité',
    signal: "Vous savez quoi dire, mais jamais le temps de le publier.",
    result: "Une présence régulière, alimentée par vos vrais savoir-faire.",
  },
  {
    n: '03',
    span: 2,
    title: 'Support client',
    signal: "Les mêmes questions reviennent, et les réponses attendent.",
    result: "Des réponses immédiates aux questions courantes, l'équipe concentrée sur les cas qui comptent.",
  },
  {
    n: '04',
    span: 4,
    title: 'Exploitation de vos données',
    signal: "Les chiffres existent, mais personne ne les regarde.",
    result: "Des décisions appuyées sur vos données, pas sur l'intuition.",
  },
];

const FAQ = [
  {
    q: "Nos données partent-elles chez un fournisseur d'IA ?",
    a: "C'est défini avant toute intégration : quelles données sortent de chez vous, vers quel fournisseur, avec quel contrat. Quand une donnée est sensible, on privilégie des solutions qui la gardent chez vous. Rien n'est branché sans que vous sachiez exactement ce qui circule.",
  },
  {
    q: "Faut-il tout automatiser d'un coup ?",
    a: "Non. On commence par le cas d'usage au meilleur rapport résultat/effort — souvent une automatisation ciblée — et on mesure avant d'élargir. L'IA se déploie par étapes, pas en big bang.",
  },
  {
    q: 'Et si le modèle ou le fournisseur change ?',
    a: "On conçoit l'intégration pour que le fournisseur reste remplaçable : les modèles évoluent vite, votre produit ne doit pas être marié à l'un d'eux. Et comme pour tout ce qu'on livre, le code vous appartient.",
  },
  {
    q: 'Par où commence-t-on ?',
    a: "Par une conversation sur vos processus, pas sur la technologie. On identifie ensemble une tâche mesurable où l'IA peut faire une différence, on la met en place, et on juge sur le résultat.",
  },
];

const OTHER_OFFERS = [
  { href: '/services/applications-web', title: 'Applications web sur mesure', note: 'Conçues, codées et maintenues chez nous.' },
  { href: '/services/seo', title: 'SEO', note: 'Votre visibilité, automatisée.' },
  { href: '/services/mvp-30-jours', title: 'MVP en 30 jours', note: "De l'idée au produit en un mois, à prix fixe." },
];

export default function IaOffreSection() {
  return (
    <section className="hg-ia">
      {/* ---------- Titre ---------- */}
      <h2 className="hg-ia__title" style={{ margin: 0, maxWidth: '20ch' }}>
        Quatre endroits où l&apos;IA gagne sa place.
      </h2>

      {/* ---------- Bento asymétrique : 4 / 2 — 2 / 4 sur six colonnes ---------- */}
      <div
        className="hg-bento"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 'clamp(12px, 1.4vw, 20px)',
          marginTop: 'clamp(28px, 4vh, 56px)',
        }}
      >
        {USE_CASES.map((c) => {
          const wide = c.span === 4;
          return (
            <article
              key={c.n}
              className="hg-bento__card"
              data-span={c.span}
              style={{
                gridColumn: `span ${c.span}`,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 24,
                overflow: 'hidden',
                padding: wide ? 'clamp(22px, 2.6vw, 44px)' : 'clamp(22px, 2.6vw, 36px)',
                minHeight: wide ? 'clamp(220px, 26vh, 300px)' : undefined,
              }}
            >
              {/* spotlight de hover : positionné par --mx / --my */}
              <span className="hg-bento__spot" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
                <h3 className={wide ? 'hg-bento__h hg-bento__h--lg' : 'hg-bento__h'} style={{ margin: 0 }}>
                  {c.title}
                </h3>
                <span className="hg-bento__num" style={{ flex: '0 0 auto' }}>{c.n}</span>
              </div>

              {/* large : signal et résultat côte à côte — étroite : empilés */}
              <div
                className="hg-bento__pair"
                style={
                  wide
                    ? { position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 20 }
                    : { position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }
                }
              >
                <p className="hg-signal" style={{ margin: 0 }}>
                  <span className="hg-label">Le signal —</span> {c.signal}
                </p>
                <p className="hg-result" style={{ margin: 0, paddingLeft: 18 }}>
                  <span className="hg-label hg-label--accent">Le résultat —</span> {c.result}
                </p>
              </div>
            </article>
          );
        })}

        {/* contre-argument : pleine largeur, casse le rythme du bento */}
        <article
          className="hg-bento__counter"
          style={{
            gridColumn: 'span 6',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(24px, 3vw, 56px)',
            alignItems: 'center',
            padding: 'clamp(24px, 3.4vw, 56px)',
          }}
        >
          <h3 className="hg-bento__counter-h" style={{ margin: 0, maxWidth: '18ch' }}>
            Et quand l&apos;IA n&apos;est pas la réponse ?
          </h3>
          <p className="hg-bento__counter-p" style={{ margin: 0, maxWidth: '56ch' }}>
            On vous le dit. Une intégration IA n&apos;a de valeur que si elle change un résultat qui
            compte pour vous — pas pour suivre une tendance. Si un script simple, un meilleur process
            ou rien du tout fait l&apos;affaire, c&apos;est ce qu&apos;on recommandera. C&apos;est
            aussi ça, être un partenaire technique.
          </p>
        </article>
      </div>

      {/* ---------- FAQ : intitulé à gauche, accordéon à droite ---------- */}
      <div
        className="hg-faq"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(24px, 4vw, 72px)',
          marginTop: 'clamp(36px, 5vh, 72px)',
          alignItems: 'start',
        }}
      >
        <div>
          <h3 className="hg-faq__h" style={{ margin: 0 }}>Questions fréquentes</h3>
          <Link className="hg-pill" href="/faq" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
            Toutes les questions <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div className="hg-faq__list" data-accordion>
          {FAQ.map((item) => (
            <div key={item.q} className="hg-faq__item" data-faq>
              <button type="button" className="hg-faq__btn" data-faq-btn aria-expanded="true"
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, padding: '20px 0', textAlign: 'left', background: 'transparent', border: 0, cursor: 'pointer' }}>
                {item.q}
                <span className="hg-faq__plus" data-plus aria-hidden="true" style={{ flex: '0 0 auto' }}>+</span>
              </button>
              {/* la réponse reste dans le DOM une fois replié : 1fr -> 0fr */}
              <div className="hg-faq__panel" data-faq-panel style={{ display: 'grid', gridTemplateRows: '1fr' }}>
                <div style={{ overflow: 'hidden' }}>
                  <p className="hg-faq__a" style={{ margin: '0 0 20px', maxWidth: '64ch' }}>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Autres offres : lignes pleine largeur (reprise de 1b) ---------- */}
      <div className="hg-others" style={{ marginTop: 'clamp(36px, 5vh, 72px)', paddingTop: 'clamp(24px, 3vh, 44px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap', marginBottom: 6 }}>
          <span className="hg-kicker">Les autres offres</span>
          <Link className="hg-link" href="/services">Voir les quatre offres ›</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {OTHER_OFFERS.map((o) => (
            <Link key={o.href} className="hg-others__row" href={o.href}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap', padding: '20px 0' }}>
              <span className="hg-others__title">{o.title}</span>
              <span className="hg-others__note">{o.note}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ---------- CTA ---------- */}
      <div
        className="hg-cta"
        style={{
          marginTop: 'clamp(28px, 4vh, 56px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(24px, 3vw, 56px)',
          alignItems: 'center',
        }}
      >
        <div>
          <h3 className="hg-cta__h" style={{ margin: 0 }}>Parlons de votre projet.</h3>
          <p className="hg-cta__p" style={{ margin: '16px 0 0', maxWidth: '52ch' }}>
            Racontez-nous où vous en êtes ; on vous dit ce qu&apos;on ferait, et à quel prix.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link className="hg-pill hg-pill--accent" href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Nous contacter <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>

      {/* îlot client : replie l'accordéon (état de repos du HTML = tout ouvert)
          et gère le spotlight --mx/--my. Ne rend rien. */}
      <FaqAccordion />
    </section>
  );
}
