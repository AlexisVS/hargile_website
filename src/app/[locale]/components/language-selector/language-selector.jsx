'use client';

import {useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';
import {ChevronDown} from 'lucide-react';
import getCountryFlagEmoji from 'country-flag-icons/unicode';
import {
    FlagIcon,
    LanguageDropdown,
    LanguageOption,
    LanguageSelectorContainer,
    SelectedLanguage
} from './language-selector.styled';
import {usePathname, useRouter} from "@/i18n/navigation";

const LANGUAGES = [
    {locale: 'en', label: 'English', country: 'GB'},
    {locale: 'fr', label: 'Français', country: 'FR'},
    // Add more languages as needed
];

export default function LanguageSelector() {
    const currentLocale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter()
    const pathname = usePathname()
    // Find current language details
    const currentLanguage = LANGUAGES.find(lang => lang.locale === currentLocale) || LANGUAGES[0];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle language change using the provided setRequestLocale function
    const changeLanguage = (locale) => {
        if (locale !== currentLocale) {
            // Use the basic setRequestLocale function
            router.push(pathname, {
                locale: locale,
            });
        }
        setIsOpen(false);
    };

    return (
        <LanguageSelectorContainer ref={dropdownRef}>
            <SelectedLanguage onClick={() => setIsOpen(!isOpen)}>
                <FlagIcon className={'fluid-type-2-5'}>{getCountryFlagEmoji(currentLanguage.country)}</FlagIcon>
                {/*<span>{currentLanguage.label}</span>*/}
                <ChevronDown size={16} className={isOpen ? 'rotated' : ''}/>
            </SelectedLanguage>

            {isOpen && (
                <LanguageDropdown>
                    {LANGUAGES.map((language) => (
                        <LanguageOption
                            key={language.locale}
                            $isactive={`${language.locale === currentLocale}`}
                            onClick={() => changeLanguage(language.locale)}
                            data-locale={language.locale}
                        >
                            <FlagIcon className={'fluid-type-1-5'}>{getCountryFlagEmoji(language.country)}</FlagIcon>
                            <span>{language.label}</span>
                        </LanguageOption>
                    ))}
                </LanguageDropdown>
            )}
        </LanguageSelectorContainer>
    );
}
