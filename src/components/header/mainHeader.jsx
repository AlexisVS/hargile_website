"use client";

import React from "react";
import {motion} from "framer-motion";
import {
    BackgroundBlur,
    Description,
    HeaderSection,
    PageTitle,
    SubTitle,
    SubtitleContainer,
    SubtitleHighlight,
    SubtitleRegular,
    TitleUnderline,
    TitleWrapper
} from "@/components/header/mainHeader.styled";

// Styled components for the header


/**
 * A reusable header component that can be used across different pages
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Main title text
 * @param props.titleAs - markup
 * @param {string} props.subtitleRegular - Regular text portion of subtitle
 * @param {string} props.subtitleHighlight - Highlighted text portion of subtitle
 * @param {string} props.description - Description text
 * @param {boolean} props.showUnderline - Whether to show the underline (default: true)
 * @param {boolean} props.showBackgroundBlur - Whether to show the background blur effect (default: false)
 * @returns {JSX.Element} Header component
 */
export function Header(
    {
        title,
        titleAs = motion.h1,
        subtitleRegular = "",
        subtitleHighlight = "",
        description = "",
        showUnderline = true,
        showBackgroundBlur = false,
    }) {
    return (
        <HeaderSection>
            {showBackgroundBlur && <BackgroundBlur/>}

            <TitleWrapper>
                <PageTitle as={titleAs}>{title}</PageTitle>
                {showUnderline && <TitleUnderline/>}
            </TitleWrapper>

            {(subtitleRegular || subtitleHighlight) && (
                <SubtitleContainer>
                    <SubTitle>
                        {subtitleRegular && (
                            <SubtitleRegular className="regular">
                                {subtitleRegular}
                            </SubtitleRegular>
                        )}
                        {subtitleHighlight && (
                            <SubtitleHighlight className="highlight">
                                {subtitleHighlight}
                            </SubtitleHighlight>
                        )}
                    </SubTitle>
                </SubtitleContainer>
            )}

            {description && <Description>{description}</Description>}
        </HeaderSection>
    );
}

export {
    HeaderSection,
    BackgroundBlur,
    TitleWrapper,
    PageTitle,
    TitleUnderline,
    SubtitleContainer,
    SubTitle,
    SubtitleRegular,
    SubtitleHighlight,
    Description,
};
