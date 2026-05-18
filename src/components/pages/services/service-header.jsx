import React from "react";
import {useTranslations} from "next-intl";
import {motion} from "motion/react";
import {
    Description,
    Divider,
    HeaderContainer,
    MainTitle,
    SubtitleBold,
    SubtitleItalic
} from "@/components/pages/services/service-header.styled";


const ServicesHeader = () => {
    const t = useTranslations("pages.services");

    const headerVariants = {
        hidden: {opacity: 0, y: -20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <HeaderContainer as={motion.div} initial="hidden" animate="visible" variants={headerVariants}>
            <MainTitle>{t("mainTitle")}</MainTitle>
            <Divider/>
            <SubtitleItalic>{t("subtitleItalic")}</SubtitleItalic>
            <SubtitleBold>{t("subtitleBold")}</SubtitleBold>
            <Description>{t("description")}</Description>
        </HeaderContainer>
    );
};

export default ServicesHeader;
