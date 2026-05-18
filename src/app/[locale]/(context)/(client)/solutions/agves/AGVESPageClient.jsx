"use client";

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
} from "@/app/[locale]/(context)/(client)/solutions/agves/AGVESPageClient.styled";
import {Header} from "@/components/header/mainHeader";

export default function AGVESPageClient() {
    const t = useTranslations("pages.solutions.agves");
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
            id: "wallet",
            title: t("features.wallet.title"),
            description: t("features.wallet.description"),
        },
        {
            id: "access",
            title: t("features.access.title"),
            description: t("features.access.description"),
        },
        {
            id: "communication",
            title: t("features.communication.title"),
            description: t("features.communication.description"),
        },
        {
            id: "finance",
            title: t("features.finance.title"),
            description: t("features.finance.description"),
        },
        {
            id: "dashboard",
            title: t("features.dashboard.title"),
            description: t("features.dashboard.description"),
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
