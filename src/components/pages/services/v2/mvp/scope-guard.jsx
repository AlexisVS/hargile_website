"use client";

/* The boundary that holds the 30 days.

   A promise this sharp is only credible if it says what it excludes, so this
   sits right after the fixed-price statement: the price does not move because
   the scope does not, and here is who holds each end of that.

   The "30" behind the copy is the page's one count-up — WeekTimeline already
   owns the page's one scroll-linked moment, and two of those would be a
   competition rather than a rhythm. It is aria-hidden: the number is in the
   heading of the timeline above and in the copy here, so screen readers are
   not made to hear it a third time as a bare digit.

   No figure here that the studio cannot stand behind: 30 is the offer itself. */

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
            <div className={section.container}>
                <div className={styles.frame} {...reveal(0)}>
                    <span className={`${section.numXl} ${section.numGhost} ${styles.num}`} aria-hidden="true">
                        <CountUp to={30}/>
                    </span>
                    <div className={styles.body}>
                        <h2 className={styles.title}>{t("title")}</h2>
                        <p className={styles.text}>{t("text")}</p>
                        <ul className={styles.points}>
                            {t.raw("points").map((point) => <li key={point}>{point}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScopeGuard;
