"use client"
import React from "react";
import {Mail} from "lucide-react";
import {useTranslations} from "next-intl";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import {usePathname} from "@/i18n/navigation";
import {ContactButtonStyled} from "@/components/ContactButton.styled";

export const ContactButton = () => {
    const navigation = useSiteNavigation();
    const t = useTranslations('components.contact-button');
    // Locale-stripped pathname: "/contact" on every locale.
    const pathname = usePathname();

    // Hide while the fullscreen hamburger menu is open, and on the contact
    // page itself where the button would be redundant.
    if (navigation.isOpen || pathname === "/contact") return null;

    return (
        <ContactButtonStyled href="/contact" aria-label={t('title')}>
            <Mail size={18} strokeWidth={2}/>
            <span>{t('title')}</span>
        </ContactButtonStyled>
    );
};
