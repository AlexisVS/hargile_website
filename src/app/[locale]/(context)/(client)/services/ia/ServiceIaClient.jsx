"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import UseCases from "@/components/pages/services/v2/ia/use-cases";
import Honesty from "@/components/pages/services/v2/ia/honesty";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import SiblingOffers from "@/components/pages/services/v2/shared/sibling-offers";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function ServiceIaClient() {
    const t = useTranslations("pages.services.detail.ia.hero");

    return (
        <>
            <PosterHero
                /* The hub pages' poster hero, now shared by all four detail
                   pages: same box, no eyebrow, no aside — the argument for each
                   of those is in poster-hero.jsx and holds for all six. The
                   eyebrow key stays in the messages files; this is a layout
                   call, not a copy deletion.

                   The composition below is the only thing that differs between
                   the six backdrops. Changing this number means exporting all
                   three of its frames first (docs/wave-grid.md). */
                title={t("title")}
                answer={t("answer")}
                backdrop={<WaveGridBackdrop composition="wave-312"/>}
            />
            <UseCases/>
            <Honesty/>
            <MiniFaq namespace="pages.services.detail.ia.faq"/>
            <SiblingOffers current="ia"/>
            <CtaBand/>
        </>
    );
}
