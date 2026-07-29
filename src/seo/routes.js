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
};

/* Pages that must stay out of the index. Empty since the audit result page was
   removed, but generate-page-metadata still consults it — add a pagePath here
   rather than hand-writing a robots directive on the page. */
export const NOINDEX_PAGES = new Set();
