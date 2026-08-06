"use client";

/* How the price is set. No amount anywhere by decision (2026-08-05, Mihai) —
   same rule as mvp/fixed-price.jsx: the citable claim is the mechanism, not a
   range. If ranges are published later they belong in the messages, not here.

   06/08 (Mihai): nothing in this section is boxed. Heading, paragraph, the
   three commitments across one row, the three trades, then the note — one
   column of statements, held apart by space alone. The deliverables grid right
   above is already a hard-edged figure; a frame here made the page two boxes in
   a row, and a frame around the trades alone made them look like a footnote.

   The trades sit BETWEEN the commitments and the note, not after it. That is
   where they answer something: the row above says what the price does, the
   trades say who does the work, and the note closes by pointing at the MVP
   offer — which says "la même méthode" and therefore has to come after the
   method, for a reader without CSS as much as for anyone else.

   They are named ONCE, in their heading. They used to be named there and again
   as a title over each paragraph — the same three words twice on one screen —
   so the paragraphs now run as a single line under the heading, unlabelled, and
   their per-trade `title` keys left the messages with them.

   ⚠️ That heading names the three trades and stops there. It does not say the
   price covers all three, tempting as the sentence is now that they share a
   section: maintenance is an ongoing relationship the copy explicitly leaves
   open ("vous restez par choix"), so writing that it is included would be a new
   commercial claim invented by a layout change. If it is true, it needs to be
   decided and written, not implied by adjacency.

   Reveal budget: 0 heading, 1 paragraph, 2 commitments, 3 trades heading,
   4 trades, 5 note. */

import {useTranslations} from "next-intl";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import {useReveal} from "@/components/pages/homepage/v2/useReveal";
import styles from "./price-method.module.scss";

const COLS = ["design", "build", "maintain"];

const PriceMethod = () => {
    const t = useTranslations("pages.services.detail.web.priceMethod");
    const reveal = useReveal();

    return (
        <section className={section.section}>
            <div className={section.container}>
                <h2 className={section.heading} {...reveal(0)}>{t("title")}</h2>
                <p className={styles.text} {...reveal(1)}>{t("text")}</p>

                {/* Still a list: the row is a layout, not a change of kind —
                    three parallel conditions on one commitment, not steps. */}
                <ul className={styles.points} {...reveal(2)}>
                    {t.raw("points").map((point) => <li key={point}>{point}</li>)}
                </ul>

                <h3 className={styles.craftTitle} {...reveal(3)}>{t("cols.title")}</h3>
                {/* A list, and marked like one: three trades read as three
                    items, the same shape as the commitments above. */}
                <ul className={styles.craftList} {...reveal(4)}>
                    {COLS.map((col) => (
                        <li key={col}>{t(`cols.${col}.text`)}</li>
                    ))}
                </ul>

                <p className={styles.note} {...reveal(5)}>{t("note")}</p>
            </div>
        </section>
    );
};

export default PriceMethod;
