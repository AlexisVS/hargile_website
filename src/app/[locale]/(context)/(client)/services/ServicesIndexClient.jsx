"use client";

import {useTranslations} from "next-intl";
import InnerHero from "@/components/pages/services/v2/inner-hero/inner-hero";
import OffersIndex from "@/components/pages/services/v2/index/offers-index";
import ProofStrip from "@/components/pages/services/v2/index/proof-strip";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

export default function ServicesIndexClient() {
    const t = useTranslations("pages.services.index.hero");

    return (
        <>
            <InnerHero eyebrow={t("eyebrow")} title={t("title")} answer={t("answer")}/>
            <OffersIndex/>
            <ProofStrip/>
            <CtaBand/>
        </>
    );
}
