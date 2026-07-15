"use client"
import {useTranslations} from "next-intl";
import React from "react";
import {Radar} from "lucide-react";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider"
import {AuditButtonStyled} from "@/components/AuditButton.styled";

export const AuditButton = () => {
    const navigation = useSiteNavigation()
    const t = useTranslations('components.audit-button');

    if (navigation.isOpen) return null;

    return (
        <AuditButtonStyled onClick={() => navigation.setIsAuditModalOpen(true)} aria-label={'Open audit dialog'}>
            <div className="text-side">
                <span style={{fontWeight: 550}}>{t('title')}</span>
                <span>{t('description')}</span>
            </div>

            <Radar width={35} height={35} color={'var(--color-accent-blue-planet)'} strokeWidth={1.4}/>
        </AuditButtonStyled>
    )
}
