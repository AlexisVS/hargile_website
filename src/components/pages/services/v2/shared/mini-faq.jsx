"use client";

/* Short offer-specific FAQ closing each service page. Plain HTML only: the
   FAQPage JSON-LD lives on /faq alone — one markup home per question — and
   these questions are deliberately distinct from the /faq set. Ends on a
   link to the full FAQ instead of duplicating it.

   Heading and the way out on the left, accordion on the right, first answer
   resting open — the layout /services/ia used to hand-roll. It now mounts this
   too: a client component inside a Server Component still ships every answer in
   the first HTML response (measured on /services/applications-web and
   /services/seo), so the GEO guard in docs/geo-plan.md §1.5 holds, and the page
   loses the open-then-collapse layout shift the island cost it.

   `bare` drops the <section> wrapper for that case: /services/ia is one long
   section that owns its own rhythm, so the block only needs its grid. */

import {useTranslations} from "next-intl";
import CtaLink from "@/components/ui/cta-link/cta-link";
import FaqAccordion from "@/components/ui/faq-accordion/faq-accordion";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./mini-faq.module.scss";

/**
 * namespace: the page's faq subtree, e.g. "pages.services.detail.mvp.faq"
 * bare: drop the <section> wrapper, for a page that already owns its section.
 *       Layout only — the heading stays an h2 either way. It used to drop to
 *       h3 under `bare`, which made /services/ia the one page where the FAQ
 *       was a sub-point of the block above it rather than a topic of its own.
 */
const MiniFaq = ({namespace, bare = false}) => {
    const t = useTranslations(namespace);
    const shared = useTranslations("pages.services.shared.miniFaq");
    const reveal = useReveal();

    const block = (
        <div className={styles.faq}>
            <div {...reveal(0)}>
                <h2 className={`${section.heading} ${styles.title}`}>{shared("title")}</h2>
                <div className={styles.allWrap}>
                    <CtaLink href="/faq" variant="ghost" size="sm">
                        {shared("allLink")}
                    </CtaLink>
                </div>
            </div>
            <div {...reveal(1)}>
                <FaqAccordion
                    items={t.raw("items")}
                    defaultOpenIndex={0}
                    headingLevel={bare ? "h4" : "h3"}
                />
            </div>
        </div>
    );

    if (bare) return block;

    return (
        <section className={section.section}>
            <div className={section.container}>{block}</div>
        </section>
    );
};

export default MiniFaq;
