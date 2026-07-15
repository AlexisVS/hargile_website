"use client";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {useIsClient} from "@/hooks/useIsClient";


const HeroSection = () => {
    const t = useTranslations("pages.homepage.sections.hero");
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

                        <p style={{
                            maxWidth: '65ch',
                            textAlign: 'justify',
                            fontWeight: '200',
                        }} className={'fluid-type-1'}>{t('paragraph')}</p>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
