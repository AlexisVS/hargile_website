"use client";

import {useTranslations} from "next-intl";
import InnerHero from "@/components/pages/services/v2/inner-hero/inner-hero";
import FaqGroups from "@/components/pages/faq/faq-groups";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

export default function FaqPageClient() {
    const t = useTranslations("pages.faq.hero");

    return (
        <>
            <InnerHero eyebrow={t("eyebrow")} title={t("title")} answer={t("answer")}/>
            <FaqGroups/>
            <CtaBand/>
        </>
    );
}
