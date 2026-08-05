"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import Process from "@/components/pages/services/v2/seo/process";
import MetaProof from "@/components/pages/services/v2/seo/meta-proof";
import MiniFaq from "@/components/pages/services/v2/shared/mini-faq";
import SiblingOffers from "@/components/pages/services/v2/shared/sibling-offers";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function ServiceSeoClient() {
    const t = useTranslations("pages.services.detail.seo.hero");

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
                backdrop={<WaveGridBackdrop composition="wave-188"/>}
            />
            <Process/>
            <MetaProof/>
            {/* VENIZI proof case pulled out for now — shared/proof-case.jsx and
                the seo.proofCase copy stay in place, so it comes back with one
                line. MetaProof stays: it demonstrates the method on this very
                page rather than showing a client site. */}
            <MiniFaq namespace="pages.services.detail.seo.faq"/>
            <SiblingOffers current="seo"/>
            <CtaBand/>
        </>
    );
}
