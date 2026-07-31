import Link from 'next/link';
import { css } from '../lib/css';

const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/studio', label: 'Studio' },
  { href: '/faq', label: 'FAQ' },
];

export function SiteHeader({ current = '/services' }) {
  return (
    <header style={css('position:sticky;top:0;z-index:60;backdrop-filter:blur(14px);background:rgba(8,12,22,.72);border-bottom:1px solid rgba(255,255,255,.09)')}>
      <div style={css('width:min(1440px,92vw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:32px;height:72px')}>
        <Link href="/" style={css('font-family:Outfit,sans-serif;font-weight:500;letter-spacing:.18em;font-size:14px;color:#ededed')}>
          HARGILE
        </Link>
        <nav className="hg-nav" style={css('display:flex;gap:clamp(14px,2.4vw,34px);align-items:center;font-size:13px;letter-spacing:.01em')}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? 'page' : undefined}
              style={{ color: current === item.href ? '#ededed' : 'rgba(237,237,237,.64)' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="hg-pill" href="/contact" style={css('display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:10px 20px;font-size:13px;color:#ededed')}>
          Parler du projet <span style={{ color: '#96b9f9' }}>›</span>
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const col = 'display:flex;flex-direction:column;gap:10px;font-size:13px';
  const head = 'font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(237,237,237,.5)';
  const link = { color: 'rgba(237,237,237,.72)' };
  return (
    <footer style={css('border-top:1px solid rgba(255,255,255,.10)')}>
      <div style={css('width:min(1440px,92vw);margin:0 auto;padding:clamp(40px,6vh,72px) 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:clamp(24px,3vw,48px)')}>
        <div>
          <div style={css('font-family:Outfit,sans-serif;font-weight:500;letter-spacing:.18em;font-size:13px')}>HARGILE</div>
          <p style={css('margin:14px 0 0;font-size:13px;line-height:1.7;color:rgba(237,237,237,.62);max-width:30ch')}>
            Studio technique indépendant. Bruxelles, Belgique.
          </p>
        </div>
        <div style={css(col)}>
          <span style={css(head)}>Services</span>
          <Link href="/services/applications-web" style={link}>Applications web</Link>
          <Link href="/services/ia" style={link}>Intelligence artificielle</Link>
          <Link href="/services/seo" style={link}>Référencement</Link>
          <Link href="/services/mvp-30-jours" style={link}>MVP 30 jours</Link>
        </div>
        <div style={css(col)}>
          <span style={css(head)}>Studio</span>
          <Link href="/studio" style={link}>À propos</Link>
          <Link href="/realisations" style={link}>Réalisations</Link>
          <Link href="/faq" style={link}>FAQ</Link>
          <Link href="/contact" style={link}>Contact</Link>
        </div>
        <div style={css(col)}>
          <span style={css(head)}>Langue</span>
          <Link href="/" style={{ color: '#96b9f9' }}>Français</Link>
          <Link href="/en/services" style={link}>English</Link>
        </div>
      </div>
      <div style={css('width:min(1440px,92vw);margin:0 auto;padding:24px 0;border-top:1px solid rgba(255,255,255,.09);font-size:12px;color:rgba(237,237,237,.5);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap')}>
        <span>© 2026 HARGILE</span>
        <span>Bruxelles</span>
      </div>
    </footer>
  );
}
