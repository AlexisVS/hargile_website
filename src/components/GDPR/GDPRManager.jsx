'use client'

import {createContext, useContext, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useIsClient} from '@/hooks/useIsClient'
import {useLocalStorageState} from '@/hooks/useLocalStorageState'
import {
    AlwaysActiveTag,
    BannerContainer,
    BannerContent,
    BannerDescription,
    BannerTitle,
    ButtonGroup,
    CategoryDescription,
    CategoryHeader,
    CategoryTitle,
    CookieBanner,
    CookieCategory,
    ModalContainer,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalOverlay,
    ModalTitle,
    PrimaryButton,
    PrivacyText,
    SecondaryButton,
    SettingsButton,
    TertiaryButton,
    ToggleInput,
    ToggleSlider,
    ToggleSwitch
} from './gdpr.styled'
import {Link} from "@/i18n/navigation";

const RGPDContext = createContext(null)

export const useGDPR = () => {
    const context = useContext(RGPDContext)
    if (!context) {
        throw new Error('useRGPD must be used within a RGPDProvider')
    }
    return context
}

const defaultConsents = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
}

export default function GDPRManager({children}) {
    const t = useTranslations('components.gdpr')
    const [consents, setConsents] = useLocalStorageState('rgpd_consents', defaultConsents)
    const initialized = useIsClient();
    const hasStoredConsents = initialized && typeof window !== 'undefined' && window.localStorage.getItem('rgpd_consents') !== null;
    const [modalState, setModalState] = useState(hasStoredConsents ? 'closed' : 'banner')

    const updateConsent = (category, value) => {
        setConsents(prev => ({
            ...prev,
            [category]: value
        }))
    }

    const acceptAll = () => {
        setConsents({
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        })
        setModalState('closed')
    }

    const rejectAll = () => {
        setConsents({
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        })
        setModalState('closed')
    }

    const savePreferences = () => {
        setConsents(consents)
        setModalState('closed')
    }

    const isConsentGiven = (category) => {
        return consents[category]
    }

    const openPreferences = () => {
        setModalState('preferences')
    }

    const contextValue = {
        consents,
        updateConsent,
        acceptAll,
        rejectAll,
        savePreferences,
        isConsentGiven,
        openPreferences
    }

    if (!initialized) {
        return null
    }

    return (
        <RGPDContext.Provider value={contextValue}>
            {children}

            {modalState === 'banner' && (
                <CookieBanner role="dialog" aria-labelledby="cookie-consent-banner-title">
                    <BannerContainer>
                        <BannerContent>
                            <BannerTitle id="cookie-consent-banner-title">{t('title')}</BannerTitle>
                            <BannerDescription>{t('short-description')}</BannerDescription>
                        </BannerContent>
                        <ButtonGroup>
                            <TertiaryButton onClick={rejectAll}>
                                {t('rejectAll')}
                            </TertiaryButton>
                            <SecondaryButton onClick={() => setModalState('preferences')}>
                                {t('customize')}
                            </SecondaryButton>
                            <PrimaryButton onClick={acceptAll}>
                                {t('acceptAll')}
                            </PrimaryButton>
                        </ButtonGroup>
                    </BannerContainer>
                </CookieBanner>
            )}

            {modalState === 'preferences' && (
                <ModalOverlay role="dialog" aria-labelledby="cookie-preferences-title">
                    <ModalContainer>
                        <ModalContent>
                            <ModalTitle id="cookie-preferences-title">{t('title')}</ModalTitle>
                            <ModalDescription>{t('description')}</ModalDescription>

                            <CookieCategory>
                                <CategoryHeader>
                                    <CategoryTitle>{t('necessaryCookies.title')}</CategoryTitle>
                                    <AlwaysActiveTag>{t('necessaryCookies.alwaysActive')}</AlwaysActiveTag>
                                </CategoryHeader>
                                <CategoryDescription>{t('necessaryCookies.description')}</CategoryDescription>
                            </CookieCategory>

                            <CookieCategory>
                                <CategoryHeader>
                                    <CategoryTitle>{t('analyticsCookies.title')}</CategoryTitle>
                                    <ToggleSwitch>
                                        <ToggleInput
                                            type="checkbox"
                                            checked={consents.analytics}
                                            onChange={() => updateConsent('analytics', !consents.analytics)}
                                        />
                                        <ToggleSlider/>
                                    </ToggleSwitch>
                                </CategoryHeader>
                                <CategoryDescription>{t('analyticsCookies.description')}</CategoryDescription>
                            </CookieCategory>

                            <CookieCategory>
                                <CategoryHeader>
                                    <CategoryTitle>{t('marketingCookies.title')}</CategoryTitle>
                                    <ToggleSwitch>
                                        <ToggleInput
                                            type="checkbox"
                                            checked={consents.marketing}
                                            onChange={() => updateConsent('marketing', !consents.marketing)}
                                        />
                                        <ToggleSlider/>
                                    </ToggleSwitch>
                                </CategoryHeader>
                                <CategoryDescription>{t('marketingCookies.description')}</CategoryDescription>
                            </CookieCategory>

                            <CookieCategory>
                                <CategoryHeader>
                                    <CategoryTitle>{t('preferencesCookies.title')}</CategoryTitle>
                                    <ToggleSwitch>
                                        <ToggleInput
                                            type="checkbox"
                                            checked={consents.preferences}
                                            onChange={() => updateConsent('preferences', !consents.preferences)}
                                        />
                                        <ToggleSlider/>
                                    </ToggleSwitch>
                                </CategoryHeader>
                                <CategoryDescription>{t('preferencesCookies.description')}</CategoryDescription>
                            </CookieCategory>

                            <PrivacyText>
                                {t('privacyPolicy.description') + ' '}
                                <Link href={"/legal/privacy-policy"}>
                                    {t('privacyPolicy.link')}
                                </Link>
                            </PrivacyText>

                            <ModalFooter>
                                <TertiaryButton onClick={rejectAll}>
                                    {t('rejectAll')}
                                </TertiaryButton>
                                <SecondaryButton onClick={acceptAll}>
                                    {t('acceptAll')}
                                </SecondaryButton>
                                <PrimaryButton onClick={savePreferences}>
                                    {t('save')}
                                </PrimaryButton>
                            </ModalFooter>
                        </ModalContent>
                    </ModalContainer>
                </ModalOverlay>
            )}

            {modalState === 'closed' && (
                <SettingsButton onClick={openPreferences} aria-label={t('cookieSettings')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                        <path d="M8.5 8.5v.01"/>
                        <path d="M16 15.5v.01"/>
                        <path d="M12 12v.01"/>
                    </svg>
                </SettingsButton>
            )}
        </RGPDContext.Provider>
    )
}
