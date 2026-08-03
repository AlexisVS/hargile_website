"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import MadeInHouse from "@/components/pages/services/v2/web/made-in-house";
import CaseStudies from "@/components/pages/services/v2/web/case-studies";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function ServiceWebClient() {
    const t = useTranslations("pages.services.detail.web.hero");

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
                backdrop={<WaveGridBackdrop composition="wave-142"/>}
            />
            <MadeInHouse/>
            <CaseStudies/>
            <MiniFaq namespace="pages.services.detail.web.faq"/>
            <CtaBand/>
        </>
    );
}
