"use client";

/* The boundary that holds the 30 days.

   A promise this sharp is only credible if it says what it excludes, so this
   sits right after the fixed-price statement: the price does not move because
   the scope does not, and here is who holds each end of that.

   The "30" behind the copy is the page's one count-up, and since the vertical
   timeline gave way to the calendar (2026-08-05) it is the only moving thing
   here beyond the reveals — which is the right amount for a page whose
   argument is restraint. It is aria-hidden: the number is already in the
   section heading above and in the copy here, so screen readers are not made
   to hear it a third time as a bare digit.

   No figure here that the studio cannot stand behind: 30 is the offer itself.

   Unframed since 2026-08-05. Without a box to sit in, the numeral stops being
   a decoration in a corner and becomes the ground the copy is written over —
   which is the right relationship, since the whole section is about what that
   number costs. It is clipped by the wrapper rather than allowed to widen the
   page. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import CountUp from "@/components/pages/services/v2/shared/count-up";
import styles from "./scope-guard.module.scss";

const ScopeGuard = () => {
    const t = useTranslations("pages.services.detail.mvp.scope");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={`${section.container} ${styles.wrap}`}>
                <span className={`${section.numXl} ${section.numGhost} ${styles.num}`} aria-hidden="true">
                    <CountUp to={30}/>
                </span>
                <div className={styles.body}>
                    <h2 className={`${section.heading} ${styles.title}`} {...reveal(0)}>{t("title")}</h2>
                    <p className={styles.text} {...reveal(1)}>{t("text")}</p>
                    <ul className={styles.points} {...reveal(2)}>
                        {t.raw("points").map((point) => <li key={point}>{point}</li>)}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ScopeGuard;
