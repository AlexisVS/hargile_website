// src/components/sections/OurSolutions/index.jsx
"use client";

import {useTranslations} from "next-intl";
import {CardsContainer, ContentWrapper, SectionContainer, SectionTitle} from "./our-solutions.styled";
import SolutionCard from "./solution-card";

const OurSolutions = () => {
    const t = useTranslations("pages.homepage.sections.our-solutions");

    const solutions = [
        {
            id: 'your-prject',
            title: t("solutions.your-project.title"),
            description: t("solutions.your-project.description"),
            iconSrc: '',
            link: '/services',
            subtitle: t("solutions.your-project.subtitle"),
        },
        {
            id: 'multipass',
            title: t("solutions.multipass.title"),
            description: t('solutions.multipass.description'),
            iconSrc: '',
            link: '/solutions/multipass',
            subtitle: t('solutions.multipass.subtitle'),
        },

        {
            id: "i-go",
            title: t("solutions.i-go.title"),
            description: t("solutions.i-go.description"),
            iconSrc: "/images/solutions/i-go-icon.svg",
            link: "/solutions/i-go",
            subtitle: t("solutions.i-go.subtitle"),
        },
        {
            id: "agves",
            title: t("solutions.agves.title"),
            description: t("solutions.agves.description"),
            iconSrc: "/images/solutions/agves-icon.svg",
            link: "/solutions/agves",
            subtitle: t("solutions.agves.subtitle"),
        },
    ];

    return (
        <SectionContainer className="our-solutions">
            <ContentWrapper>
                <SectionTitle>{t("title")}</SectionTitle>
                <p style={{maxWidth: '60ch'}} className={'fluid-type-1'}>{t('description')}</p>
                <p style={{maxWidth: '64ch', textAlign: 'justify'}} className={'fluid-type-1'}>{t('paragraph')}</p>

                <CardsContainer>
                    {solutions.map((solution) => (
                        <SolutionCard
                            key={solution.id}
                            id={solution.id}
                            title={solution.title}
                            description={solution.description}
                            iconSrc={solution.iconSrc}
                            link={solution.link}
                            subtitle={solution.subtitle}
                        />
                    ))}
                </CardsContainer>
            </ContentWrapper>
        </SectionContainer>
    );
};

export default OurSolutions;
