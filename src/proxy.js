import {NextResponse} from 'next/server';
import {routing} from '@/i18n/routing';

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(req) {
    // Skip middleware for static files, API routes, and Next.js internal routes
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return;
    }

    // Get the preferred locale from cookie or use the default
    const preferredLocale = req.cookies.get('NEXT_LOCALE')?.value;
    const locale = preferredLocale && routing.locales.includes(preferredLocale)
        ? preferredLocale
        : routing.defaultLocale;

    // Root path - redirect to the locale
    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    // Check for locale confusion - e.g., /en/fr or /en/nl
    const pathParts = req.nextUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
        const firstPart = pathParts[0];
        const secondPart = pathParts[1];

        // If first part is a valid locale and second part is also in our locale list
        if (
            routing.locales.includes(firstPart) &&
            routing.locales.includes(secondPart)
        ) {
            // Redirect to default locale with the rest of the path
            const newPath = `/${locale}/${pathParts.slice(2).join('/')}`;
            return NextResponse.redirect(new URL(newPath, req.url));
        }
    }

    // Handle default locale and missing locale
    const pathnameIsMissingLocale = !routing.locales.some(
        locale => req.nextUrl.pathname.startsWith(`/${locale}/`) || req.nextUrl.pathname === `/${locale}`
    );

    if (pathnameIsMissingLocale || req.nextUrl.locale === 'default') {
        return NextResponse.redirect(
            new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
        );
    }
}
