"use client";

import {useTranslations} from "next-intl";
import {projectsData} from "@/data/portfolio-data";
import InnerHero from "@/components/pages/services/v2/inner-hero/inner-hero";
import Process from "@/components/pages/services/v2/seo/process";
import MetaProof from "@/components/pages/services/v2/seo/meta-proof";
import ProofCase from "@/components/pages/services/v2/shared/proof-case";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

const VENIZI = projectsData.find((p) => p.id === 23);

export default function ServiceSeoClient() {
    const t = useTranslations("pages.services.detail.seo.hero");

    return (
        <>
            <InnerHero eyebrow={t("eyebrow")} title={t("title")} answer={t("answer")}/>
            <Process/>
            <MetaProof/>
            <ProofCase namespace="pages.services.detail.seo" project={VENIZI}/>
            <MiniFaq namespace="pages.services.detail.seo.faq"/>
            <CtaBand/>
        </>
    );
}
