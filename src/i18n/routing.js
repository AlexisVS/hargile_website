import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'fr'],
    defaultLocale: 'fr',
    /* French lives unprefixed at the root, English keeps /en. This option only
       drives the hrefs that createNavigation() generates (<Link>, router.push);
       the actual request routing lives in src/proxy.js, which must stay in
       agreement with it — see docs/geo-default-locale-plan.md. */
    localePrefix: 'as-needed'
});
