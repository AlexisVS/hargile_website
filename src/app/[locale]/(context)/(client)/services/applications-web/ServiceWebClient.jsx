"use client";

import {useTranslations} from "next-intl";
import InnerHero from "@/components/pages/services/v2/inner-hero/inner-hero";
import MadeInHouse from "@/components/pages/services/v2/web/made-in-house";
import CaseStudies from "@/components/pages/services/v2/web/case-studies";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

export default function ServiceWebClient() {
    const t = useTranslations("pages.services.detail.web.hero");

    return (
        <>
            <InnerHero eyebrow={t("eyebrow")} title={t("title")} answer={t("answer")}/>
            <MadeInHouse/>
            <CaseStudies/>
            <MiniFaq namespace="pages.services.detail.web.faq"/>
            <CtaBand/>
        </>
    );
}
