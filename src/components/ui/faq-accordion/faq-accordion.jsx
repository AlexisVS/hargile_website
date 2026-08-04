"use client";

/* Accessible FAQ accordion — the only collapse pattern allowed on the site.
   The answers are ALWAYS in the server HTML: collapsing is a CSS
   grid-template-rows transition, never conditional React mounting — an AI
   crawler that runs no JS must read every answer (docs/geo-plan.md §1.5,
   docs/m4-content-session-prompt.md piège 7). aria-hidden keeps screen
   readers consistent with aria-expanded; the text still ships in the HTML. */

import {useId, useState} from "react";
import styles from "./faq-accordion.module.scss";

const PlusIcon = ({open}) => (
    <svg
        className={`${styles.icon} ${open ? styles.iconOpen : ""}`}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
    >
        <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
);

/**
 * items: [{q, a}] — read from the messages with t.raw(), the same source
 * build-json-ld.js uses for FAQPage.mainEntity, so markup and copy cannot drift.
 * reveal: optional useReveal() dispenser from the parent section; index is
 * reset per accordion so the shared 1-8 stagger loop is never outgrown.
 * headingLevel: the q wrapper tag, h3 by default.
 * defaultOpenIndex: which item rests open (null — all closed — by default).
 * The collapse is CSS either way, so this changes nothing for a crawler.
 */
const FaqAccordion = ({items, reveal, headingLevel: Heading = "h3", defaultOpenIndex = null}) => {
    const baseId = useId();
    const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

    return (
        <div className={styles.list}>
            {items.map(({q, a}, i) => {
                const open = openIndex === i;
                const buttonId = `${baseId}-q${i}`;
                const panelId = `${baseId}-a${i}`;
                const revealProps = reveal ? reveal(Math.min(i, 8)) : {};

                /* The row wrapper carries no class: it held the hairline that
                   is gone, and is now just the grid child .list spaces. */
                return (
                    <div key={q} {...revealProps}>
                        <Heading className={styles.q}>
                            <button
                                type="button"
                                id={buttonId}
                                className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
                                aria-expanded={open}
                                aria-controls={panelId}
                                onClick={() => setOpenIndex(open ? null : i)}
                            >
                                <span className={styles.qText}>{q}</span>
                                <PlusIcon open={open}/>
                            </button>
                        </Heading>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            aria-hidden={!open}
                            className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
                        >
                            <div className={styles.panelInner}>
                                <p className={styles.a}>{a}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FaqAccordion;
