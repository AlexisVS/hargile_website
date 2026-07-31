"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import HeroStats from "@/components/pages/services/v2/index/hero-stats";
import OffersIndex from "@/components/pages/services/v2/index/offers-index";
import ProofStrip from "@/components/pages/services/v2/index/proof-strip";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function ServicesIndexClient() {
    const t = useTranslations("pages.services.index");

    return (
        <>
            <PosterHero
                /* No eyebrow here on purpose: it read "Services" directly above a
                   headline on the /services route, so it labelled the page twice.
                   /faq still runs one. The key stays in the messages files — this
                   is a layout call, not a copy deletion. */
                title={t("hero.title")}
                answer={t("hero.answer")}
                aside={<HeroStats/>}
                backdrop={<WaveGridBackdrop/>}
            />
            <OffersIndex/>
            <ProofStrip/>
            <CtaBand variant="box" secondary={{href: "/faq", label: t("ctaSecondary")}}/>
        </>
    );
}
