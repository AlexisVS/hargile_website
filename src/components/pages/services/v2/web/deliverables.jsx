"use client";

/* What you receive — the four things that are yours at the end of a project.

   This is the page's answer to "concretely, what do I get?", and it is
   deliberately a list of objects rather than of qualities: maquettes, a repo, a
   live site, the accounts. Nothing here is a figure we cannot show.

   V3, 05/08 (Mihai): the 01–04 numerals are gone. Four objects handed over at
   once are not a sequence — nothing is done first or last — so numbering them
   was ordering information the content does not have, and the lead already
   states the count in words. What names each cell now is the object itself: the
   title's opening words take the accent (titleLead), the qualifier stays plain.
   The colour lands on the noun rather than on a shape beside it.

   Shared-line bento rather than four hairline columns, same recipe as the IA
   use cases: the four are cut out of one figure. It also keeps this section
   from rhyming with the editorial split that follows it — the two neighbours
   now read as two different objects, which is the whole point of the pair.

   The grid reveals as ONE block. Staggering the cells would slide their shared
   borders apart mid-animation, and a figure that comes apart while it arrives
   reads as a rendering bug. Budget: 0 heading, 1 lead, 2 grid. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import {useSpotlight} from "@/components/pages/services/v2/shared/useSpotlight";
import spotlight from "@/components/pages/services/v2/shared/spotlight.module.scss";
import styles from "./deliverables.module.scss";

const ITEMS = ["design", "code", "live", "keys"];

const Deliverables = () => {
    const t = useTranslations("pages.services.detail.web.deliverables");
    const reveal = useReveal();
    /* One stable ref callback spread over all four cells — see useSpotlight. */
    const spot = useSpotlight();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={section.lead} {...reveal(1)}>{t("lead")}</p>
                <div className={styles.bento} {...reveal(2)}>
                    {ITEMS.map((key) => (
                        <article key={key} className={`${styles.cell} ${spotlight.spot}`} ref={spot}>
                            {/* One heading, two spans: the accented opener and
                                the qualifier are the same sentence, so the text
                                a crawler reads is unchanged. */}
                            <h3 className={styles.cellTitle}>
                                <span className={styles.titleLead}>{t(`items.${key}.titleLead`)}</span>{" "}
                                {t(`items.${key}.titleRest`)}
                            </h3>
                            <p className={styles.cellText}>{t(`items.${key}.text`)}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Deliverables;
