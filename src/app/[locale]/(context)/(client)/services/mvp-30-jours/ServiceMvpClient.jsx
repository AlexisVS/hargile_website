"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import WeekCalendar from "@/components/pages/services/v2/mvp/week-calendar";
import Included from "@/components/pages/services/v2/mvp/included";
import FixedPrice from "@/components/pages/services/v2/mvp/fixed-price";
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
            {/* Le calendrier horizontal a remplacé la timeline verticale le
                2026-08-05 : il montre la durée relative des phases, ce que
                trois puces de même taille ne pouvaient pas faire. La timeline
                et ses styles restent sur le disque (mvp/week-timeline.jsx),
                sur les mêmes clés de traduction — un import la remet. */}
            <WeekCalendar/>
            <Included/>
            <FixedPrice/>
            {/* « La limite qui tient la promesse » (mvp/scope-guard.jsx) a été
                démontée le 2026-08-05 : deux de ses trois puces redisaient les
                lignes « pas dans les 30 jours » de Included, et la troisième —
                le décideur joignable — est déjà la réponse mot pour mot de la
                question 2 de la mini-FAQ ci-dessous. Le composant, ses styles
                et ses clés `mvp.scope` restent intacts sur le disque, comme
                proof-case et week-timeline : un import le remet.
                La Marquisette (shared/proof-case.jsx) est dormante de même. */}
            <MiniFaq namespace="pages.services.detail.mvp.faq"/>
            <SiblingOffers current="mvp"/>
            <CtaBand/>
        </>
    );
}
