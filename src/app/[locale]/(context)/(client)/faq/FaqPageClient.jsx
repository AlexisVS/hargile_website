"use client";

import {useTranslations} from "next-intl";
import PosterHero from "@/components/pages/services/v2/shared/poster-hero";
import FaqIndex from "@/components/pages/faq/faq-index";
import FaqGroups from "@/components/pages/faq/faq-groups";
import CtaBand from "@/components/pages/services/v2/shared/cta-band";
import WaveGridBackdrop from "@/components/pages/services/v2/shared/wave-grid-backdrop";

export default function FaqPageClient() {
    const t = useTranslations("pages.faq");

    return (
        <>
            <PosterHero
                /* No eyebrow, matching /services — the two hub pages share this
                   hero and should read as a pair. The reason differs from its
                   sibling's, though: there the eyebrow labelled the page twice,
                   here it is consistency. Dropping the prop also drops the top
                   padding a step (.tight in poster-hero), which is what actually
                   lines the two headlines up. The key stays in the messages
                   files — this is a layout call, not a copy deletion.

                   The backdrop shares /services' geometry but not its
                   composition: with the eyebrow gone the two heroes have
                   identical copy geometry, so the quiet zone and the three
                   frames carry over unchanged — but Mihai picked wave 70 here
                   off the ?wave= switch so the hub pages read as a pair rather
                   than as a repeat. Changing this number means exporting all
                   three of its frames first. */
                title={t("hero.title")}
                answer={t("hero.answer")}
                aside={<FaqIndex/>}
                backdrop={<WaveGridBackdrop composition="wave-70"/>}
            />
            <FaqGroups/>
            <CtaBand variant="box" secondary={{href: "/services", label: t("ctaSecondary")}}/>
        </>
    );
}
