'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import {useAnimation} from 'motion/react';
import {
    AuditContainer,
    ContentWrapper,
    DetailItem,
    DetailsList,
    DetailText,
    DetailTitle,
    FeatureIcon,
    FeatureItem,
    FeaturesList,
    FeatureText,
    SectionDescription,
    SectionTitle,
} from './digital-audit.styled';

const DigitalAuditSection = () => {
    const t = useTranslations('pages.homepage.sections.digital-audit');
    const controls = useAnimation();

    const features = [
        {id: 'speed', icon: '⚡', text: t.raw('features.speed')},
        {id: 'seo', icon: '🔍', text: t.raw('features.seo')},
        {id: 'ux', icon: '📱', text: t.raw('features.ux')},
        {id: 'security', icon: '🔒', text: t.raw('features.security')}
    ];

    const details = [
        {id: 'performance', title: t.raw('details.performance.title'), text: t.raw('details.performance.text')},
        {id: 'seo', title: t.raw('details.seo.title'), text: t.raw('details.seo.text')},
        {id: 'security', title: t.raw('details.security.title'), text: t.raw('details.security.text')},
        {id: 'accessibility', title: t.raw('details.accessibility.title'), text: t.raw('details.accessibility.text')},
        {id: 'mobile', title: t.raw('details.mobile.title'), text: t.raw('details.mobile.text')},
        {id: 'bestPractices', title: t.raw('details.bestPractices.title'), text: t.raw('details.bestPractices.text')}
    ];

    return (
        <AuditContainer>
            <ContentWrapper>
                <SectionTitle>
                    {t('title')}
                    <span className="accent">{t('titleAccent')}</span>
                </SectionTitle>

                <SectionDescription dangerouslySetInnerHTML={{__html: t.raw('description')}}/>

                <FeaturesList>
                    {features.map((feature) => (
                        <FeatureItem key={feature.id}>
                            <FeatureIcon>{feature.icon}</FeatureIcon>
                            <FeatureText dangerouslySetInnerHTML={{__html: feature.text}}/>
                        </FeatureItem>
                    ))}
                </FeaturesList>

                <SectionDescription>
                    <strong>{t('whyImportant.title')}</strong> {t('whyImportant.text')}
                </SectionDescription>

                <h3 className={'fluid-type-2-5'} style={{marginBottom: '3.5rem', marginTop: '5rem'}}>{t('moreInfo.title')}</h3>
                <DetailsList>
                    {details.map((detail) => (
                        <DetailItem key={detail.id}>
                            <DetailTitle>{detail.title}</DetailTitle>
                            <DetailText dangerouslySetInnerHTML={{__html: detail.text}}/>
                        </DetailItem>
                    ))}
                </DetailsList>
            </ContentWrapper>
        </AuditContainer>
    );
};

export default DigitalAuditSection;
