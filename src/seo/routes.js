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
    'services': '/services',
    /* French slugs shared across locales (like /contact): the target market is
       French-speaking and the EN pages carry them as-is under /en/services/….
       The dotted keys stay short and stable — the slug can change, the key
       must not (it names the seo.pages.* message subtree). */
    'services.web': '/services/applications-web',
    'services.seo': '/services/seo',
    'faq': '/faq',
};

/* Pages that must stay out of the index. Empty since the audit result page was
   removed, but generate-page-metadata still consults it — add a pagePath here
   rather than hand-writing a robots directive on the page. */
export const NOINDEX_PAGES = new Set();
