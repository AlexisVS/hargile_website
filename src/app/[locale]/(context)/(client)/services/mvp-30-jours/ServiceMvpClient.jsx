"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import WeekTimeline from "@/components/pages/services/v2/mvp/week-timeline";
import Included from "@/components/pages/services/v2/mvp/included";
import FixedPrice from "@/components/pages/services/v2/mvp/fixed-price";
import ScopeGuard from "@/components/pages/services/v2/mvp/scope-guard";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import SiblingOffers from "@/components/pages/services/v2/shared/sibling-offers";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function ServiceMvpClient() {
    const t = useTranslations("pages.services.detail.mvp.hero");

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
                backdrop={<WaveGridBackdrop composition="wave-97"/>}
            />
            <WeekTimeline/>
            <Included/>
            <FixedPrice/>
            {/* Directly after the price, because it is the same argument seen
                from the other end: the price holds because the scope does.
                The La Marquisette proof case stays on disk with its copy
                (shared/proof-case.jsx) — one line brings it back. */}
            <ScopeGuard/>
            <MiniFaq namespace="pages.services.detail.mvp.faq"/>
            <SiblingOffers current="mvp"/>
            <CtaBand/>
        </>
    );
}
