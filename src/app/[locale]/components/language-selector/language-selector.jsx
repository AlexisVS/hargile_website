'use client';

import {Fragment} from 'react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";
import {LanguageCode, LanguageDivider, LanguageSwitch} from './language-selector.styled';

/* Flagless segmented switch — with two locales a dropdown (and flags, which
   conflate country and language) is more chrome than the choice deserves.
   The locale list comes straight from the i18n routing config, so adding a
   locale there is enough. */
export default function LanguageSelector() {
    const currentLocale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (locale) => {
        if (locale !== currentLocale) {
            router.push(pathname, {locale});
        }
    };

    return (
        <LanguageSwitch aria-label="Language">
            {routing.locales.map((locale, i) => (
                <Fragment key={locale}>
                    {i > 0 && <LanguageDivider aria-hidden="true">/</LanguageDivider>}
                    <LanguageCode
                        type="button"
                        $active={locale === currentLocale}
                        aria-current={locale === currentLocale ? 'true' : undefined}
                        onClick={() => changeLanguage(locale)}
                    >
                        {locale}
                    </LanguageCode>
                </Fragment>
            ))}
        </LanguageSwitch>
    );
}
