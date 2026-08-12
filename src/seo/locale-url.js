import {SITE_URL} from '@/lib/site-url';
import {routing} from '@/i18n/routing';

/* Canonical URL scheme since the default-locale migration: French — the
   default locale — lives unprefixed at the root, English keeps its /en prefix.
   Every canonical, hreflang, JSON-LD url/@id and sitemap entry must be built
   through this helper; a hand-built `${SITE_URL}/${locale}${path}` reintroduces
   the /fr URLs this migration retired.

   The sitemap cannot import this module (next-sitemap.config.js is CommonJS) —
   it duplicates the rule inline. Change both together.

   The French home is the bare origin, no trailing slash. It used to return
   `${SITE_URL}/` on the reasoning that a bare origin is not a valid canonical
   form — but an empty path and "/" are the same URL per RFC 3986, and Google
   treats them as one. The slash only ever created a disagreement: Next.js
   normalises the canonical and the HTML hreflang to the bare origin whatever
   this returns, while JSON-LD ships the raw string, so the home page went out
   declaring `"url":"https://hargile.com"` and `"url":"https://hargile.com/"`
   in the same document. One form, and it is the one the framework emits. */
export function localeUrl(locale, pathSuffix = '') {
    return `${SITE_URL}${locale === routing.defaultLocale ? '' : `/${locale}`}${pathSuffix}`;
}
