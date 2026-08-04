"use client";

/* Hero only. Everything below it — the four use cases, the "and when AI isn't
   the answer" counter-argument, the FAQ, the sibling offers and the closing
   CTA — now lives in ia-offre-section.jsx, which is a Server Component and so
   is mounted from page.jsx rather than from here. */

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function ServiceIaClient() {
    const t = useTranslations("pages.services.detail.ia.hero");

    return (
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
    );
}
