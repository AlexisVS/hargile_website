import Link from 'next/link';
import { css } from '../../lib/css';
import { SiteHeader, SiteFooter } from '../../components/SiteChrome';
import FaqAccordion from '../../components/FaqAccordion';

export const metadata = {
  title: 'FAQ — HARGILE',
  description:
    "Comment nous travaillons, ce que coûte un projet, en combien de temps il sort et ce qu'il devient une fois livré.",
};

const GRADIENT =
  'background:linear-gradient(135deg,#fff,#dce7fd,#96b9f9);-webkit-background-clip:text;background-clip:text;color:transparent';

const GROUPS = [
  {
    id: 'g1',
    n: '01',
    title: 'Travailler avec HARGILE',
    items: [
      {
        q: 'Comment se déroule un premier échange ?',
        a: "Un appel d'une heure, sans support commercial. Vous décrivez le problème et les contraintes ; nous posons des questions et repartons avec assez de matière pour écrire un périmètre. Vous recevez sous trois jours un document avec ce que nous ferions, en combien de temps et pour quel prix.",
      },
      {
        q: 'Qui travaille réellement sur mon projet ?',
        a: "Les deux personnes que vous rencontrez au premier appel. Nous ne sous-traitons pas le développement et nous ne passons pas le projet à une équipe junior après la signature. Si un spécialiste externe est nécessaire, il est nommé dans la proposition.",
      },
      {
        q: 'Travaillez-vous avec des entreprises hors de Belgique ?',
        a: "Oui, en français, néerlandais ou anglais, sur les fuseaux européens. Nous demandons un point hebdomadaire en visio et au moins une rencontre physique quand le projet dépasse trois mois.",
      },
      {
        q: 'Refusez-vous des projets ?',
        a: "Régulièrement. Quand un outil existant fait déjà le travail, quand le budget ne couvre pas le périmètre, ou quand personne côté client ne peut décider. Nous le disons au premier appel plutôt qu'au troisième mois.",
      },
    ],
  },
  {
    id: 'g2',
    n: '02',
    title: 'Budget & délais',
    items: [
      {
        q: 'Combien coûte une application sur mesure ?',
        a: "La plupart de nos projets se situent entre 25 000 € et 90 000 €. Un MVP en trente jours est à prix fixe. Nous chiffrons toujours par périmètre écrit, jamais au forfait horaire déguisé.",
      },
      {
        q: 'Le prix fixe du MVP couvre quoi exactement ?',
        a: "Le périmètre signé avant le jour un : les écrans listés, l'authentification, la mise en production et une semaine de corrections après le lancement. Tout ce qui arrive en cours de route entre dans une seconde phase, chiffrée séparément.",
      },
      {
        q: 'Que se passe-t-il si le projet dérape ?',
        a: "Nous livrons toutes les deux semaines, en production. Un dérapage se voit donc au bout de quinze jours, pas de six mois : nous réduisons le périmètre plutôt que la qualité, et la décision vous revient.",
      },
      {
        q: 'Quels sont les délais de démarrage ?',
        a: "Deux à six semaines selon la période. Nous ne prenons jamais plus de deux projets en parallèle, ce qui allonge l'attente mais raccourcit la livraison.",
      },
    ],
  },
  {
    id: 'g3',
    n: '03',
    title: 'Technique & maintenance',
    items: [
      {
        q: 'À qui appartient le code ?',
        a: "À vous, dès le premier commit, sur votre dépôt. Pas de licence, pas de plateforme propriétaire, pas de clause qui vous empêche de partir avec un autre prestataire.",
      },
      {
        q: 'Quelle stack utilisez-vous ?',
        a: "TypeScript, React et Next.js côté interface, PostgreSQL côté données, hébergement européen. Des choix volontairement ennuyeux : n'importe quelle équipe peut reprendre le projet après nous.",
      },
      {
        q: 'Comment gérez-vous les données et le RGPD ?',
        a: "Hébergement dans l'Union européenne, chiffrement au repos et en transit, registre des traitements fourni à la livraison. Pour les projets IA, nous précisons quel modèle voit quelles données, et ce qui ne sort jamais de votre infrastructure.",
      },
      {
        q: 'Et après la livraison ?',
        a: "Un contrat de maintenance mensuel : correctifs, mises à jour de sécurité, surveillance et une réserve d'heures d'évolution. Sans contrat, vous gardez le code et la documentation, et nous restons joignables à la demande.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div style={css('background:#080c16;color:#ededed')}>
      <SiteHeader current="/faq" />

      <section style={css('width:min(1440px,92vw);margin:0 auto;padding:clamp(64px,11vh,140px) 0 clamp(40px,7vh,90px)')}>
        <div style={css('display:flex;align-items:baseline;gap:16px;margin-bottom:clamp(24px,4vh,48px)')}>
          <span style={css('width:44px;height:1px;background:rgba(150,185,249,.6)')} />
          <span style={css('font-family:Outfit,sans-serif;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:rgba(237,237,237,.64)')}>
            FAQ
          </span>
        </div>
        <h1 style={css(`margin:0;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.03em;line-height:.94;font-size:clamp(48px,9vw,150px);${GRADIENT}`)}>
          Douze
          <br />
          questions.
        </h1>
        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(32px,5vw,88px);margin-top:clamp(36px,6vh,72px);align-items:start')}>
          <p style={css('margin:0;font-size:clamp(16px,1.25vw,19px);line-height:1.65;color:rgba(237,237,237,.68);max-width:62ch')}>
            Les réponses que nous donnons le plus souvent en premier rendez-vous : comment nous
            travaillons, ce que coûte un projet, en combien de temps il sort, et ce qu&apos;il
            devient une fois livré. Si votre question n&apos;est pas ici, écrivez-nous — nous
            répondons en une journée ouvrée.
          </p>
          <div style={css('border-left:1px solid rgba(255,255,255,.10);padding-left:clamp(20px,3vw,40px);display:flex;flex-direction:column;gap:14px;font-size:13px')}>
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} style={css('display:flex;justify-content:space-between;gap:16px;color:rgba(237,237,237,.72)')}>
                <span>{g.title}</span>
                <span style={{ color: '#96b9f9' }}>{g.n}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {GROUPS.map((g, gi) => (
        <section
          key={g.id}
          id={g.id}
          style={css(`width:min(1440px,92vw);margin:0 auto;padding:clamp(30px,5vh,60px) 0 ${gi === GROUPS.length - 1 ? 'clamp(50px,8vh,100px)' : 'clamp(30px,5vh,60px)'};display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(24px,4vw,72px);align-items:start`)}
        >
          <div style={css('position:sticky;top:16vh;align-self:start')}>
            <div style={css(`font-family:Outfit,sans-serif;font-weight:300;letter-spacing:-.04em;line-height:.8;font-size:clamp(96px,13vw,190px);${GRADIENT}`)}>
              {g.n}
            </div>
            <h2 style={css('margin:14px 0 0;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.02em;font-size:clamp(22px,2vw,30px);line-height:1.15')}>
              {g.title}
            </h2>
          </div>

          <div data-accordion style={css('border-bottom:1px solid rgba(255,255,255,.10)')}>
            {g.items.map((item) => (
              <div key={item.q} data-faq style={css('border-top:1px solid rgba(255,255,255,.10)')}>
                <button
                  type="button"
                  className="hg-faq-btn"
                  data-faq-btn
                  aria-expanded="true"
                  style={css('width:100%;background:transparent;border:0;padding:clamp(20px,3vh,30px) 0;display:flex;gap:20px;align-items:baseline;justify-content:space-between;text-align:left;color:#ededed;cursor:pointer;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.01em;font-size:clamp(17px,1.55vw,23px);line-height:1.3')}
                >
                  {item.q}
                  <span data-plus style={css('color:#96b9f9;font-size:20px;transition:transform .4s cubic-bezier(.16,1,.3,1);flex:0 0 auto')}>
                    +
                  </span>
                </button>
                {/* Answer stays in the DOM when collapsed (grid 1fr -> 0fr). */}
                <div data-faq-panel style={css('display:grid;grid-template-rows:1fr;transition:grid-template-rows .45s cubic-bezier(.16,1,.3,1)')}>
                  <div style={css('overflow:hidden')}>
                    <p style={css('margin:0 0 clamp(20px,3vh,30px);font-size:15px;line-height:1.75;color:rgba(237,237,237,.66);max-width:66ch')}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section style={css('width:min(1440px,92vw);margin:0 auto clamp(60px,9vh,120px);border:1px solid rgba(255,255,255,.12);padding:clamp(32px,5vw,72px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(24px,4vw,56px);align-items:center')}>
        <h2 style={css('margin:0;font-family:Outfit,sans-serif;font-weight:400;letter-spacing:-.03em;font-size:clamp(28px,3.6vw,52px);line-height:1.05')}>
          Votre question n&apos;y est pas ?
        </h2>
        <div style={css('display:flex;gap:14px;flex-wrap:wrap;justify-content:flex-end')}>
          <Link className="hg-pill hg-pill--accent" href="/contact" style={css('display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(150,185,249,.45);border-radius:999px;padding:16px 30px;font-size:14px;color:#ededed')}>
            Nous écrire <span style={{ color: '#96b9f9' }}>›</span>
          </Link>
          <Link className="hg-pill hg-pill--quiet" href="/services" style={css('display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:16px 30px;font-size:14px;color:rgba(237,237,237,.8)')}>
            Voir les services
          </Link>
        </div>
      </section>

      <SiteFooter />
      <FaqAccordion />
    </div>
  );
}
