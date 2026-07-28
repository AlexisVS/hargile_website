import "@/app/styles/global.scss";
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {generateSharedMetadata} from './shared-metadata';
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import ClientGDPRWrapper from "@/components/GDPR/ClientGDPRWrapper";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}) {
    return generateSharedMetadata(await params);
}

export default async function LocaleLayout({children, params}) {
    const {locale} = await params;

    setRequestLocale(locale);

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (

        <html lang={locale}>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="theme-color" content="#000000"/>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            {/* The @font-face rules live in a render-blocking CSS chunk
                (_font-family.scss), so without preload the woff2 discovery costs
                three sequential round trips. Latin subsets only — the -ext files
                are unicode-range-gated and would download bytes the page never
                paints. Same-origin, so preload (not preconnect) is the fix. */}
            <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous"
                  href="/fonts/outfit/Outfit-VF-latin.woff2"/>
            <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous"
                  href="/fonts/manrope/Manrope-VF-latin.woff2"/>
            {/* No hreflang, robots or manifest tags here. They were page-agnostic:
                every page advertised the homepage as its fr/en/x-default alternate,
                contradicting the correct per-page ones from generate-page-metadata.
                robots + manifest are emitted by Next's metadata system instead
                (shared-metadata.js / app/manifest.js). */}
        </head>
        <body style={{minHeight: '100vh'}} suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
                <ClientGDPRWrapper/>
            </NextIntlClientProvider>
        </StyledComponentsRegistry>
        </body>
        </html>
    );
}
