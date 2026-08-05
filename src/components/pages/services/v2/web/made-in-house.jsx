"use client";

/* The in-house argument, now carried by the counting grid: 23 delivered sites,
   each a link the reader can check in a click, the counters beside them and the
   ownership promise under those.

   The designed / built / maintained columns used to sit here and have moved to
   price-method.jsx (Mihai, 05/08): with the grid in place this section was a
   drawing plus three paragraphs, and the reading load landed on the one section
   that was meant to be looked at rather than read. The lead still says the three
   words — the section states them, the price section develops them.

   The ownership strip stays in this section, but it no longer closes it: it
   sits under the counters, in the column beside the grid, because the grid is
   three rows tall and the three numbers are not. It fills that column rather
   than leaving a hole in it — and "your code, your data" reads well right after
   "23 delivered, 15 industries", which is what it is a promise about.

   The board proposed moving it out entirely, into "Ce que vous recevez"
   (proposal 3A). That still holds and this does not close it: 3A is not built,
   and moving the copy to a section that does not exist yet would delete a
   published claim on the way.

   Reveal budget: 0 heading, 1 lead, 2 grid, 3 counters, 4 ownership. Eight is
   the last index reveal.module.scss staggers — anything added here has to take a
   place, not a ninth slot. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import DeliveredGrid from "./delivered-grid";
import styles from "./made-in-house.module.scss";

const MadeInHouse = () => {
    const t = useTranslations("pages.services.detail.web.madeInHouse");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={section.lead} {...reveal(1)}>{t("lead")}</p>
                <DeliveredGrid
                    reveal={reveal}
                    aside={
                        <div className={styles.ownership} {...reveal(4)}>
                            <h3 className={styles.ownTitle}>{t("ownership.title")}</h3>
                            <p className={styles.ownText}>{t("ownership.text")}</p>
                        </div>
                    }
                />
            </div>
        </section>
    );
};

export default MadeInHouse;
