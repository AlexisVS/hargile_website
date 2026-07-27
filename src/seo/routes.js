/* pagePath (the seo.pages.* key) → the route actually served, without the locale
   prefix. This is NOT derivable by string substitution: `legal.privacy` lives at
   /legal/privacy-policy. The previous `pagePath.replace('.', '/')` produced
   /legal/privacy — a 404 — and shipped it as that page's canonical, as both of
   its hreflang alternates and as its JSON-LD url.

   Add an entry here for every new page. */
export const ROUTES = {
    'home': '',
    'contact': '/contact',
    'legal.privacy': '/legal/privacy-policy',
    'audit.result': '/audit/result',
};

/* Pages that must stay out of the index: one result page per prospect is thin,
   duplicated content and has no business ranking. */
export const NOINDEX_PAGES = new Set(['audit.result']);
