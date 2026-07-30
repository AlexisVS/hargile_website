"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import HeroStats from "@/components/pages/services/v2/index/hero-stats";
import OffersIndex from "@/components/pages/services/v2/index/offers-index";
import ProofStrip from "@/components/pages/services/v2/index/proof-strip";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";

export default function ServicesIndexClient() {
    const t = useTranslations("pages.services.index");

    return (
        <>
            <PosterHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                answer={t("hero.answer")}
                aside={<HeroStats/>}
            />
            <OffersIndex/>
            <ProofStrip/>
            <CtaBand variant="box" secondary={{href: "/faq", label: t("ctaSecondary")}}/>
        </>
    );
}
