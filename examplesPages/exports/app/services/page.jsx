import Link from 'next/link';
import { css } from '../../lib/css';
import { SiteHeader, SiteFooter } from '../../components/SiteChrome';
import ServicesMotion from '../../components/ServicesMotion';

export const metadata = {
  title: 'Services — HARGILE',
  description:
    "Studio technique indépendant à Bruxelles : applications web sur mesure, intelligence artificielle, référencement et MVP en 30 jours.",
};

// 'spine' | 'pile' | 'velocity' — one signature moment per page.
const SIGNATURE = 'spine';

const OFFERS = [
  {
    n: '01',
    href: '/services/applications-web',
    title: 'Applications web sur mesure',
    body: "Outils métier, portails clients, back-offices. Conçus, construits et maintenus par la même équipe, avec une mise en production dès les premières semaines.",
    indent: 'clamp(16px,3.2vw,60px)',
  },
  {
    n: '02',
    href: '/services/ia',
    title: 'Intelligence artificielle',
    body: "Assistants internes, extraction de documents, recherche sémantique. Branchés sur vos données réelles, évalués sur vos cas, pas sur une démonstration.",
    indent: 'clamp(16px,6vw,120px)',
  },
  {
    n: '03',
    href: '/services/seo',
    title: 'Référencement & visibilité',
    body: "SEO technique, contenu structuré, données lisibles par les moteurs comme par les réponses génératives. Mesuré au trafic qualifié, pas aux impressions.",
    indent: 'clamp(16px,4vw,80px)',
  },
  {
    n: '04',
    href: '/services/mvp-30-jours',
    title: 'MVP en 30 jours',
    body: "Une idée, un périmètre écrit, une mise en ligne. Trente jours calendaires, prix fixe, et un produit que vos utilisateurs peuvent réellement essayer.",
    indent: 'clamp(16px,8vw,164px)',
  },
];

const PROOFS = [
  {
    slot: 'capture — portail de commandes',
    kicker: 'Retail · 50 points de vente',
    title: 'Commandes centralisées pour un réseau de boutiques',
    body: "Un back-office unique remplace onze tableurs. Délai de traitement divisé par trois.",
  },
  {
    slot: 'capture — suivi de chantier',
    kicker: 'Architecture · 24 chantiers',
    title: 'Suivi de chantier photo et rapports automatiques',
    body: "Les visites de site produisent le rapport client avant le retour au bureau.",
  },
  {
    slot: 'capture — tableau de bord temps réel',
    kicker: 'Fintech B2B · MVP 30 jours',
    title: 'Tableau de bord de trésorerie en temps réel',
    body: "Mis en ligne en trente jours, puis étendu à deux nouveaux marchés.",
  },
];

const STATS = [
  { to: 30, label: 'jours pour un MVP' },
  { to: 50, label: 'boutiques équipées' },
  { to: 4, label: 'offres, un studio' },
];

const GRADIENT =
  'background:linear-gradient(135deg,#fff,#dce7fd,#96b9f9);-webkit-background-clip:text;background-clip:text;color:transparent';

const VELOCITY_WORDS = [
  'Applications web',
  'Intelligence artificielle',
  'Référencement',
  'MVP 30 jours',
];

export default function ServicesPage() {
  const showSpine = SIGNATURE === 'spine' || SIGNATURE === 'pile';
  return (
    <div style={css('background:#080c16;color:#ededed')}>
      <SiteHeader current="/services" />

      <section style={css('width:min(1440px,92vw);margin:0 auto;padding:clamp(72px,12vh,150px) 0 clamp(60px,9vh,110px);position:relative')}>
        <div style={css('display:flex;align-items:baseline;gap:16px;margin-bottom:clamp(28px,5vh,56px)')}>
          <span style={css('width:44px;height:1px;background:rgba(150,185,249,.6)')} />
          <span style={css('font-family:Outfit,sans-serif;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:rgba(237,237,237,.64)')}>
            Services
          </span>
        </div>

        <h1 data-reveal style={css(`font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.03em;line-height:.92;font-size:clamp(52px,10.4vw,178px);margin:0;text-wrap:balance;${GRADIENT}`)}>
          Sur mesure,
          <br />
          puis maintenu.
        </h1>

        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(32px,5vw,88px);margin-top:clamp(40px,7vh,80px);align-items:start')}>
          {/* Non-negotiable 3: the 40–60 word answer comes first in the DOM. */}
          <p data-reveal style={css('margin:0;font-size:clamp(16px,1.25vw,19px);line-height:1.65;color:rgba(237,237,237,.68);max-width:62ch')}>
            HARGILE est un studio technique indépendant basé à Bruxelles. Nous concevons et
            développons des applications web sur mesure pour les PME : outils métier, portails
            clients, automatisations et intégrations d&apos;intelligence artificielle. Quatre offres,
            un seul interlocuteur, des livraisons courtes et un code dont vos équipes gardent la
            maîtrise.
          </p>
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:24px;border-left:1px solid rgba(255,255,255,.10);padding-left:clamp(20px,3vw,40px)')}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div data-count data-to={s.to} style={css('font-family:Outfit,sans-serif;font-size:clamp(34px,3.4vw,48px);letter-spacing:-.02em;color:#ededed')}>
                  {s.to}
                </div>
                <div style={css('font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(237,237,237,.62);margin-top:8px')}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {SIGNATURE === 'velocity' && (
        <div style={css('border-top:1px solid rgba(255,255,255,.10);border-bottom:1px solid rgba(255,255,255,.10);padding:clamp(18px,2.6vh,30px) 0;overflow:hidden;white-space:nowrap')}>
          <div data-velocity style={css('display:inline-flex;gap:clamp(28px,4vw,64px);will-change:transform')}>
            {[...VELOCITY_WORDS, ...VELOCITY_WORDS].map((w, i) => (
              <span key={`${w}-${i}`} style={css('display:inline-flex;gap:clamp(28px,4vw,64px);font-family:Outfit,sans-serif;font-size:clamp(38px,6vw,92px);letter-spacing:-.03em;color:rgba(237,237,237,.14)')}>
                {w}
                <span style={{ color: '#96b9f9' }}>·</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <section
        data-offers
        style={css('width:min(1440px,92vw);margin:0 auto;padding:clamp(60px,10vh,130px) 0 clamp(50px,8vh,110px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:clamp(24px,4vw,72px);align-items:start')}
      >
        {showSpine && (
          <div style={css('position:sticky;top:16vh;align-self:start')}>
            <div style={css('font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:rgba(237,237,237,.62)')}>
              Quatre offres
            </div>
            <div data-spine style={css(`font-family:Outfit,sans-serif;font-weight:300;letter-spacing:-.04em;line-height:.8;font-size:clamp(140px,19vw,280px);margin-top:12px;transition:opacity .35s cubic-bezier(.16,1,.3,1);${GRADIENT}`)}>
              01
            </div>
            <div data-spine-label style={css('font-family:Outfit,sans-serif;font-size:clamp(18px,1.6vw,24px);letter-spacing:-.02em;color:rgba(237,237,237,.68);margin-top:8px;transition:opacity .35s')}>
              {OFFERS[0].title}
            </div>
            <p style={css('margin:28px 0 0;font-size:15px;line-height:1.7;color:rgba(237,237,237,.62);max-width:34ch')}>
              Chaque offre est un engagement de livraison, pas un catalogue. Vous parlez à
              l&apos;équipe qui écrit le code.
            </p>
          </div>
        )}

        <div style={css('display:flex;flex-direction:column;border-bottom:1px solid rgba(255,255,255,.10)')}>
          {OFFERS.map((o) => (
            <Link
              key={o.n}
              href={o.href}
              data-row
              data-reveal
              data-label={o.title}
              style={css(`position:relative;display:block;padding:clamp(30px,4.4vh,54px) clamp(16px,2vw,32px) clamp(30px,4.4vh,54px) ${o.indent};border-top:1px solid rgba(255,255,255,.10);color:#ededed;transition:transform .6s cubic-bezier(.16,1,.3,1),opacity .6s cubic-bezier(.16,1,.3,1);will-change:transform`)}
            >
              <span data-spot style={css('position:absolute;inset:0;opacity:0;transition:opacity .45s;pointer-events:none;background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(150,185,249,.11),transparent 68%)')} />
              <div style={css('position:relative;display:flex;gap:clamp(16px,2.4vw,40px);align-items:baseline;flex-wrap:wrap')}>
                <span style={css('font-family:Outfit,sans-serif;font-size:13px;letter-spacing:.14em;color:#96b9f9')}>{o.n}</span>
                <div style={css('flex:1 1 300px;min-width:0')}>
                  <h2 style={css('margin:0;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.02em;font-size:clamp(26px,2.9vw,42px);line-height:1.08')}>
                    {o.title}
                  </h2>
                  <p style={css('margin:14px 0 0;font-size:15px;line-height:1.7;color:rgba(237,237,237,.66);max-width:52ch')}>
                    {o.body}
                  </p>
                </div>
                <span data-chev style={css('font-family:Outfit,sans-serif;font-size:22px;color:#96b9f9;transition:transform .45s cubic-bezier(.16,1,.3,1);align-self:center')}>
                  ›
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={css('width:min(1440px,92vw);margin:0 auto;padding:clamp(50px,8vh,110px) 0')}>
        <div style={css('display:flex;align-items:end;justify-content:space-between;gap:32px;flex-wrap:wrap;margin-bottom:clamp(32px,5vh,64px)')}>
          <h2 data-reveal style={css('margin:0;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.03em;font-size:clamp(34px,5vw,76px);line-height:1;max-width:22ch')}>
            Trois preuves, pas trois promesses.
          </h2>
          <Link className="hg-pill" href="/realisations" style={css('display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:12px 22px;font-size:13px;color:#ededed')}>
            Toutes les réalisations <span style={{ color: '#96b9f9' }}>›</span>
          </Link>
        </div>
        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:clamp(18px,2vw,28px)')}>
          {PROOFS.map((p) => (
            <article key={p.title} className="hg-card" data-reveal style={css('border:1px solid rgba(255,255,255,.10);padding:14px;will-change:transform')}>
              <div style={css('aspect-ratio:4/3;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 2px,transparent 2px 9px);border:1px solid rgba(255,255,255,.09);display:flex;align-items:center;justify-content:center;padding:20px')}>
                <span style={css('font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.08em;color:rgba(237,237,237,.5);text-align:center')}>
                  {p.slot}
                </span>
              </div>
              <div style={css('padding:22px 8px 10px')}>
                <div style={css('font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(237,237,237,.62)')}>{p.kicker}</div>
                <h3 style={css('margin:10px 0 0;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.02em;font-size:22px;line-height:1.2')}>
                  {p.title}
                </h3>
                <p style={css('margin:12px 0 0;font-size:14px;line-height:1.7;color:rgba(237,237,237,.64)')}>{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={css('width:min(1440px,92vw);margin:clamp(40px,7vh,90px) auto clamp(60px,9vh,120px);border:1px solid rgba(255,255,255,.12);padding:clamp(36px,6vw,88px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(28px,4vw,64px);align-items:center')}>
        <div>
          <h2 style={css(`margin:0;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.03em;font-size:clamp(32px,4.4vw,64px);line-height:1.02;${GRADIENT}`)}>
            Un projet, une heure, une réponse franche.
          </h2>
          <p style={css('margin:20px 0 0;font-size:16px;line-height:1.7;color:rgba(237,237,237,.66);max-width:52ch')}>
            Décrivez le problème. Nous revenons avec un périmètre, un délai et un prix — ou avec la
            raison pour laquelle ce n&apos;est pas pour nous.
          </p>
        </div>
        <div style={css('display:flex;gap:14px;flex-wrap:wrap;justify-content:flex-end')}>
          <Link className="hg-pill hg-pill--accent" href="/contact" style={css('display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(150,185,249,.45);border-radius:999px;padding:16px 30px;font-size:14px;color:#ededed')}>
            Prendre rendez-vous <span style={{ color: '#96b9f9' }}>›</span>
          </Link>
          <Link className="hg-pill hg-pill--quiet" href="/faq" style={css('display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:16px 30px;font-size:14px;color:rgba(237,237,237,.8)')}>
            Lire la FAQ
          </Link>
        </div>
      </section>

      <SiteFooter />
      <ServicesMotion variant={SIGNATURE} />
    </div>
  );
}
