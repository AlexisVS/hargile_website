"use client";

import {useTranslations} from "next-intl";
import {projectsData} from "@/data/portfolio-data";
import InnerHero from "@/components/pages/services/v2/inner-hero/inner-hero";
import WeekTimeline from "@/components/pages/services/v2/mvp/week-timeline";
import Included from "@/components/pages/services/v2/mvp/included";
import FixedPrice from "@/components/pages/services/v2/mvp/fixed-price";
import ProofCase from "@/components/pages/services/v2/shared/proof-case";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

const MARQUISETTE = projectsData.find((p) => p.id === 25);

export default function ServiceMvpClient() {
    const t = useTranslations("pages.services.detail.mvp.hero");

    return (
        <>
            <InnerHero eyebrow={t("eyebrow")} title={t("title")} answer={t("answer")}/>
            <WeekTimeline/>
            <Included/>
            <FixedPrice/>
            <ProofCase namespace="pages.services.detail.mvp" project={MARQUISETTE}/>
            <MiniFaq namespace="pages.services.detail.mvp.faq"/>
            <CtaBand/>
        </>
    );
}
