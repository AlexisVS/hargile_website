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
    MainContent,
    SolutionContainer
} from "@/app/[locale]/(context)/(client)/solutions/i-go/IGoPageClient.styled";
import {Header} from "@/components/header/mainHeader";

export default function IGoPageClient() {
    const t = useTranslations("pages.solutions.i-go");
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
            id: "database",
            title: t("features.database.title"),
            description: t("features.database.description"),
        },
        {
            id: "realtime",
            title: t("features.realtime.title"),
            description: t("features.realtime.description"),
        },
        {
            id: "collaborative",
            title: t("features.collaborative.title"),
            description: t("features.collaborative.description"),
        },
        {
            id: "navigation",
            title: t("features.navigation.title"),
            description: t("features.navigation.description"),
        },
        {
            id: "community",
            title: t("features.community.title"),
            description: t("features.community.description"),
        },
    ];

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
