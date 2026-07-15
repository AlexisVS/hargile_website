"use client"
import React from "react";
import {Mail} from "lucide-react";
import {useTranslations} from "next-intl";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import {ContactButtonStyled} from "@/components/ContactButton.styled";

export const ContactButton = () => {
    const navigation = useSiteNavigation();
    const t = useTranslations('components.contact-button');

    // Hide while the fullscreen hamburger menu is open.
    if (navigation.isOpen) return null;

    return (
        <ContactButtonStyled href="/contact" aria-label={t('title')}>
            <Mail size={18} strokeWidth={2}/>
            <span>{t('title')}</span>
        </ContactButtonStyled>
    );
};
