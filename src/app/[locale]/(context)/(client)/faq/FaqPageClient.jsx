"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import FaqIndex from "@/components/pages/faq/faq-index";
import FaqGroups from "@/components/pages/faq/faq-groups";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

export default function FaqPageClient() {
    const t = useTranslations("pages.faq");

    return (
        <>
            <PosterHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                answer={t("hero.answer")}
                aside={<FaqIndex/>}
            />
            <FaqGroups/>
            <CtaBand variant="box" secondary={{href: "/services", label: t("ctaSecondary")}}/>
        </>
    );
}
