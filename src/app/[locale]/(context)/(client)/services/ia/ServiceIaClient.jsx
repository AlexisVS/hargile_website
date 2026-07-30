"use client";

import {useTranslations} from "next-intl";
import InnerHero from "@/components/pages/services/v2/inner-hero/inner-hero";
import UseCases from "@/components/pages/services/v2/ia/use-cases";
import Honesty from "@/components/pages/services/v2/ia/honesty";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

export default function ServiceIaClient() {
    const t = useTranslations("pages.services.detail.ia.hero");

    return (
        <>
            <InnerHero eyebrow={t("eyebrow")} title={t("title")} answer={t("answer")}/>
            <UseCases/>
            <Honesty/>
            <MiniFaq namespace="pages.services.detail.ia.faq"/>
            <CtaBand/>
        </>
    );
}
