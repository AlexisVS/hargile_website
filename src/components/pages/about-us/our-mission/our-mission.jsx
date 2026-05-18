// src/components/pages/about-us/our-mission/our-mission.jsx
"use client";

import {useTranslations} from "next-intl";
import React, {useRef} from "react";
import {motion, useInView} from "motion/react";
import {
    ConnectorLine,
    ContentWrapper,
    Description,
    IconContainer,
    MainTitle,
    SectionContainer,
    TitleWrapper,
    ValueDescription,
    ValueItem,
    ValuesContainer,
    ValueTitle
} from "./our-mission.styled";
import {
    Cpu,
    HandHeart,
    Heart, HeartHandshake,
    Lightbulb,
    LightbulbIcon,
    Megaphone, Recycle, Shield,
    Sparkle,
    SparklesIcon,
    TrendingUp,
    User
} from "lucide-react";

const OurMission = () => {
    const t = useTranslations("pages.about-us.sections.our-mission");
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {once: true, amount: 0.2});

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const titleVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.6, ease: "easeOut"}
        }
    };

    const valueVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.8, ease: "easeOut"}
        }
    };

    return (
        <SectionContainer ref={sectionRef}>
            <ContentWrapper
                as={motion.div}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <TitleWrapper variants={titleVariants} as={motion.div}>
                    <MainTitle>{t("title")}</MainTitle>
                </TitleWrapper>

                {/*<motion.div variants={titleVariants}>*/}
                {/*    <HighlightedText>{t("highlighted")}</HighlightedText>*/}
                {/*    <SubheadingText>{t("subheading")}</SubheadingText>*/}
                {/*</motion.div>*/}

                <motion.div variants={titleVariants}>
                    <Description>{t("description").split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line === '' && <br/>}
                            <span>{line}</span>
                        </React.Fragment>
                    ))}</Description>
                </motion.div>

                <ValuesContainer>
                    <ValueItem as={motion.div} variants={valueVariants}>
                        <IconContainer>
                            <Cpu size={32} strokeWidth={1.5}/>
                        </IconContainer>
                        <div>
                            <ValueTitle>{t("values.technic.title")}</ValueTitle>
                            <ValueDescription>{t("values.technic.description")}</ValueDescription>
                        </div>
                    </ValueItem>

                    <ConnectorLine/>

                    <ValueItem as={motion.div} variants={valueVariants}>
                        <IconContainer>
                            <TrendingUp size={32} strokeWidth={1.5}/>
                        </IconContainer>
                        <div>
                            <ValueTitle>{t("values.vision.title")}</ValueTitle>
                            <ValueDescription>{t("values.vision.description")}</ValueDescription>
                        </div>
                    </ValueItem>

                    <ConnectorLine/>

                    <ValueItem as={motion.div} variants={valueVariants}>
                        <IconContainer>
                            <SparklesIcon size={32} strokeWidth={1.5}/>
                        </IconContainer>
                        <div>
                            <ValueTitle>{t("values.creativity.title")}</ValueTitle>
                            <ValueDescription>{t("values.creativity.description")}</ValueDescription>
                        </div>
                    </ValueItem>

                    <ConnectorLine/>

                    <ValueItem as={motion.div} variants={valueVariants}>
                        <IconContainer>
                            <HandHeart size={32} strokeWidth={1.5}/>
                        </IconContainer>
                        <div>
                            <ValueTitle>{t("values.human.title")}</ValueTitle>
                            <ValueDescription>{t("values.human.description")}</ValueDescription>
                        </div>
                    </ValueItem>

                    <ConnectorLine/>

                    <ValueItem as={motion.div} variants={valueVariants}>
                        <IconContainer>
                            <HeartHandshake size={32} strokeWidth={1.5}/>
                        </IconContainer>
                        <div>
                            <ValueTitle>{t("values.partnership.title")}</ValueTitle>
                            <ValueDescription>{t("values.partnership.description")}</ValueDescription>
                        </div>
                    </ValueItem>
                </ValuesContainer>
            </ContentWrapper>
        </SectionContainer>
    );
};

export default OurMission;
