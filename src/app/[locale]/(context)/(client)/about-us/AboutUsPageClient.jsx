"use client"

import React from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header/mainHeader";
import OurStoryContent from '@/components/pages/about-us/our-story/our-story-content';
import OurTeam from "@/components/pages/about-us/our-team/our-team";
import OurMission from "@/components/pages/about-us/our-mission/our-mission";
import OurCommitment from "@/components/pages/about-us/our-commitment/our-commitment";
import {
  PageWrapper,
  ContentContainer,
  SectionsWrapper,
} from "./AboutUsPageClient.styled";

export default function AboutUsPageClient() {
    const t = useTranslations("pages.about-us");

    return (
        <PageWrapper>
            <ContentContainer>
                <Header
                    titleAs={"h1"}
                    title={t("sections.our-story.title")}
                    subtitleRegular={t("sections.our-story.subtitle")}
                    subtitleHighlight=""
                    description=""
                    showBackgroundBlur={true}
                />

                <SectionsWrapper>
                    <OurStoryContent/>
                    <OurTeam/>
                    <OurMission/>
                    <OurCommitment/>
                </SectionsWrapper>
            </ContentContainer>
        </PageWrapper>
    );
}
