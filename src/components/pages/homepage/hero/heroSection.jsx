"use client";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import {useEffect, useState} from "react";
import {AuditLink} from "@/components/pages/homepage/hero/heroSection.styled";
import {useIsClient} from "@/hooks/useIsClient";


const HeroSection = () => {
    const t = useTranslations("pages.homepage.sections.hero");
    const navigation = useSiteNavigation()
    const isClient = useIsClient();
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        if (!isClient) return;
        const check = () => setIsMobile(window.innerWidth <= 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [isClient]);

    const titleSize = isMobile ? 'fluid-type-3' : 'fluid-type-4';

    return (
        <section className="min-h-screen flex flex-col justify-center">
            <div className="container">
                <div className="flex">
                    <div className="w-full md:w-4/6 lg:w-4/5">
                        <h1 className={titleSize}>
                            {t("headline.line1") + ' '}
                            <br/>
                            {t("headline.line2")}
                            <br/>
                            {t("headline.line3")}
                        </h1>
                        <p
                            className="mb-8  w-full lg:w-3/5 fluid-type-1"
                            style={{fontWeight: "200"}}
                        >
                            {t("description")}
                        </p>
                        <AuditLink
                            aria-label={'Open audit modal'}
                            onClick={() => navigation.setIsAuditModalOpen(true)}
                            className="flex items-center bg-transparent text-white font-bold no-underline cursor-pointer"
                        >
                            <p className="fluid-type-2" style={{
                                textDecoration: 'underline',

                            }}>{t("ctaButton")}</p>
                            <Image
                                src="/icons/arrows/maximize 01.svg"
                                alt={t("arrowAlt")}
                                width={30}
                                height={30}
                                className="ml-2 mb-3"
                                style={{marginBottom: "3rem", marginLeft: "1rem"}}
                            />
                        </AuditLink>

                        <p style={{
                            maxWidth: '65ch',
                            textAlign: 'justify',
                            fontWeight: '200',
                        }} className={'fluid-type-1'}>{t('paragraph')}</p>

                    </div>
                </div>
            </div>
            <blockquote style={{
                paddingLeft: 0,
                textShadow: '0 0 8px black',
                mixBlendMode: "plus-lighter",
                color: 'var(--color-accent-blue-planet)',
            }} className={'w-full text-center fluid-type-2 italic'}>{t('quote')}</blockquote>
        </section>
    );
};

export default HeroSection;
