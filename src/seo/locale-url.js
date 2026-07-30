import {SITE_URL} from '@/lib/site-url';
import {routing} from '@/i18n/routing';

/* Canonical URL scheme since the default-locale migration: French — the
   default locale — lives unprefixed at the root, English keeps its /en prefix.
   Every canonical, hreflang, JSON-LD url/@id and sitemap entry must be built
   through this helper; a hand-built `${SITE_URL}/${locale}${path}` reintroduces
   the /fr URLs this migration retired.

   The sitemap cannot import this module (next-sitemap.config.js is CommonJS) —
   it duplicates the rule inline. Change both together.

   The French home is `${SITE_URL}/`, with the trailing slash: a bare origin
   string is not a valid canonical form. */
export function localeUrl(locale, pathSuffix = '') {
    const path = `${locale === routing.defaultLocale ? '' : `/${locale}`}${pathSuffix}`;
    return path ? `${SITE_URL}${path}` : `${SITE_URL}/`;
}
