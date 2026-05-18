"use client"

import {useTranslations} from "next-intl";
import {useRef} from "react";
import {motion, useInView} from "motion/react";
import {
    ContentSection,
    ContentWrapper,
    CTAButton,
    CTASection,
    Description,
    FeatureCard,
    FeatureDescription,
    FeaturesGrid,
    FeatureTitle,
    HighlightItem,
    HighlightList,
    MainContent,
    SolutionContainer
} from "@/app/[locale]/(context)/(client)/solutions/multipass/MultiPassPageClient.styled";
import {Header} from "@/components/header/mainHeader";

export default function MultipassPageClient() {
    const t = useTranslations("pages.solutions.multipass");
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {once: true, amount: 0.2});

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.6, ease: "easeOut"},
        },
    };

    const features = [
        {
            id: "modules",
            title: t("features.modules.title"),
            description: t("features.modules.description"),
        },
        {
            id: "integration",
            title: t("features.integration.title"),
            description: t("features.integration.description"),
        },
        {
            id: "scalable",
            title: t("features.scalable.title"),
            description: t("features.scalable.description"),
        },
        {
            id: "reporting",
            title: t("features.reporting.title"),
            description: t("features.reporting.description"),
        },
        {
            id: "ui",
            title: t("features.ui.title"),
            description: t("features.ui.description"),
        },
    ];

    // Use highlights from translations with array mapping
    const highlights = t.raw("highlights");

    return (
        <SolutionContainer ref={sectionRef}>
            <ContentWrapper>
                <Header
                    title={t("title")}
                    subtitleRegular={t("subtitleRegular")}
                    subtitleHighlight={t("subtitleHighlight")}
                    description={t("description")}
                    showBackgroundBlur={true}
                />

                <MainContent>
                    <ContentSection
                        as={motion.div}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={containerVariants}
                    >
                        <Description variants={itemVariants}>
                            {t("paragraph1")}
                        </Description>

                        <HighlightList>
                            {highlights.map((highlight, index) => (
                                <HighlightItem
                                    key={index}
                                    as={motion.li}
                                    variants={itemVariants}
                                >
                                    {highlight}
                                </HighlightItem>
                            ))}
                        </HighlightList>

                        <Description variants={itemVariants}>
                            {t("paragraph2")}
                        </Description>
                    </ContentSection>

                    <FeaturesGrid>
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                custom={index}
                            >
                                <FeatureTitle>{feature.title}</FeatureTitle>
                                <FeatureDescription>{feature.description}</FeatureDescription>
                            </FeatureCard>
                        ))}
                    </FeaturesGrid>
                </MainContent>

                <CTASection>
                    <CTAButton href="/contact">
                        {t("cta")}
                    </CTAButton>
                </CTASection>
            </ContentWrapper>
        </SolutionContainer>
    );
}
