"use client";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {ReadMore} from "@/components/ReadMore";

const HeroSection = () => {
    const t = useTranslations("pages.homepage.sections.hero");

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="container mx-auto px-4 xl:-translate-y-1/6">
                <div className="flex">
                    <div className="w-full md:w-1/2 lg:w-4/5">
                        <h1 className="fluid-type-3">
                            {t("headline.line1")}
                            <br/>
                            {t("headline.line2")}
                            <br/>
                            {t("headline.line3")}
                        </h1>
                        <p
                            className="mb-8  w-full md:w-1/2 lg:w-3/5 fluid-type-1"
                            style={{fontWeight: "200"}}
                        >
                            {t("description")}
                        </p>
                        <button className="flex items-center bg-transparent text-white font-bold">
                            <p className="fluid-type-2">{t("ctaButton")}</p>
                            <Image
                                src="/icons/arrows/maximize 01.svg"
                                alt={t("arrowAlt")}
                                width={30}
                                height={30}
                                className="ml-2 mb-3"
                                style={{marginBottom: 3 + "rem", marginLeft: 1 + "rem"}}
                            />
                        </button>

                        <ReadMore
                            id={'home-hero-paragraph'}
                            text={t('paragraph')}
                            amountOfWords={16}
                            classNames={"fluid-type-1"}
                        />

                    </div>
                </div>
            </div>
            <blockquote style={{
                paddingLeft: 0,
                textShadow: '0 0 8px black',
                mixBlendMode: "plus-lighter",
                color: 'var(--color-accent-blue-planet)',
            }} className={'w-full text-center fluid-type-2 italic'}>{t('quote')}</blockquote>
        </div>
    );
};

export default HeroSection;
