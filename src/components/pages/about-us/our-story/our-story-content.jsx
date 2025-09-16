"use client";

import {useTranslations} from "next-intl";
import {
    ContentWrapper,
    GetInTouchButton,
    SectionContainer,
    StoryLegend,
    StoryText,
    TextContainer,
} from "./our-story.styled";
import {motion, useInView} from "framer-motion";
import React, {useRef} from "react";
import {TransitionLink} from "@/components/TransitionLink";

const OurStoryContent = () => {
    const t = useTranslations("pages.about-us.sections.our-story");
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {once: true, amount: 0.2});

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.6, ease: "easeOut"}
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
                <TextContainer>
                    <motion.div variants={itemVariants}>
                        <StoryText>{t("paragraph1").split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line === '' && <br/>}
                                <span>{line}</span>
                            </React.Fragment>
                        ))}</StoryText>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <StoryText>{t("paragraph2").split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line === '' && <br/>}
                                <span>{line}</span>
                            </React.Fragment>
                        ))}</StoryText>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <StoryLegend>{t("paragraph3").split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line === '' && <br/>}
                                <span>{line}</span>
                            </React.Fragment>
                        ))}</StoryLegend>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <GetInTouchButton as={TransitionLink} href="/contact">
                            {t("getInTouch")}
                        </GetInTouchButton>
                    </motion.div>
                </TextContainer>
            </ContentWrapper>
        </SectionContainer>
    );
};

export default OurStoryContent;