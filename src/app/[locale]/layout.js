import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {generateSharedMetadata} from './shared-metadata';
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

        <html lang={locale || null}>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="theme-color" content="#000000"/>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <link rel="apple-touch-icon" href="/logo192.png"/>
            <meta name="robots" content="index, follow"/>
            <link rel="alternate" hrefLang="x-default" href={process.env.NEXT_PUBLIC_SITE_URL + '/fr'}/>
            <link rel="alternate" hrefLang="fr" href={process.env.NEXT_PUBLIC_SITE_URL + '/fr'}/>
            <link rel="alternate" hrefLang="en" href={process.env.NEXT_PUBLIC_SITE_URL + '/en'}/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
        </head>
        <body style={{overflowX: 'hidden', minHeight: '100vh'}} suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <ClientGDPRWrapper/>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
