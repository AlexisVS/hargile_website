import {NextResponse} from 'next/server';
import {routing} from '@/i18n/routing';

const PUBLIC_FILE = /\.(.*)$/;

/* URL scheme (default-locale migration, docs/geo-default-locale-plan.md):
   French — the default locale — lives UNPREFIXED at the root. English keeps
   its /en prefix. Concretely:

     /            → 200, French home (internal rewrite to /fr, invisible)
     /contact     → 200, French contact
     /en/contact  → 200, English contact (served as-is)
     /fr/contact  → 301 → /contact (old indexed URLs must not 404)

   The unprefixed form is served with a REWRITE, not a redirect: the apex must
   answer 200 with the French page itself. Google never indexes a URL that
   redirects — the 307 the apex used to send is exactly why Search Console
   reported hargile.com as "not indexed".

   Deliberately no NEXT_LOCALE cookie handling anymore: `/` is the canonical
   x-default page and must serve the same French content to everyone.
   Auto-redirecting visitors by stored preference from an x-default URL is what
   Google explicitly advises against; the language switcher is the way to /en. */
export async function proxy(req) {
    const {pathname, search} = req.nextUrl;

    // Skip static files, API routes, and Next.js internal routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return;
    }

    const segments = pathname.split('/').filter(Boolean);
    const [first, second] = segments;

    // Old default-locale URLs: /fr and /fr/* → permanent redirect, unprefixed.
    // (Dead pages like /fr/services never reach this point: next.config.mjs
    // redirects() runs before the proxy and 301s them straight to `/`.)
    if (first === routing.defaultLocale) {
        const rest = segments.slice(1).join('/');
        return NextResponse.redirect(new URL(`/${rest}${search}`, req.url), 301);
    }

    if (routing.locales.includes(first)) {
        // Locale confusion (/en/fr/contact, /en/en): collapse onto the first
        // locale rather than silently serving a nested 404.
        if (routing.locales.includes(second)) {
            const rest = segments.slice(2).join('/');
            return NextResponse.redirect(
                new URL(`/${first}${rest ? `/${rest}` : ''}${search}`, req.url),
                301
            );
        }
        // /en/* — served as-is
        return;
    }

    // Unprefixed path → French, via internal rewrite (URL bar and canonical
    // stay unprefixed; the [locale] segment still receives 'fr').
    return NextResponse.rewrite(
        new URL(`/${routing.defaultLocale}${pathname === '/' ? '' : pathname}${search}`, req.url)
    );
}
