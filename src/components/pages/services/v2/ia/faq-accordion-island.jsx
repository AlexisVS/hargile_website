"use client";

/* FAQ accordion behaviour applied to server-rendered markup.

   Why an island rather than the stateful ui/faq-accordion: the section that
   owns this markup is a Server Component, so the collapse cannot come from
   React state. The rule both honour is the same one — the answers are ALWAYS
   in the server HTML and never leave the DOM. Here the resting state of the
   HTML is ALL OPEN, and this island's only job is to close all but the first
   once it mounts (grid-template-rows 1fr -> 0fr + overflow hidden). It never
   mounts copy; with JS off every answer stays visible.

   One open at a time, like ui/faq-accordion on /faq: opening a question closes
   the one that was open, so the block stays short however long the answers get.
   Clicking the open question closes it and leaves them all shut.

   Under prefers-reduced-motion nothing is collapsed at all — which also keeps
   it in step with the `grid-template-rows: 1fr !important` override in the
   stylesheet, that inline styles cannot beat. */

import {useEffect} from "react";

export default function FaqAccordion() {
    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ease = "grid-template-rows .45s cubic-bezier(.16,1,.3,1)";
        const cleanups = [];

        /* translateY(1px) is the icon's optical alignment from the stylesheet;
           it has to be repeated here because an inline transform replaces the
           declared one rather than adding to it. */
        const set = ({btn, panel, plus}, open, animate) => {
            if (!animate) panel.style.transition = "none";
            btn.setAttribute("aria-expanded", open ? "true" : "false");
            panel.setAttribute("aria-hidden", open ? "false" : "true");
            panel.style.gridTemplateRows = open ? "1fr" : "0fr";
            plus.style.transform = open ? "translateY(1px) rotate(45deg)" : "translateY(1px)";
            if (!animate) {
                requestAnimationFrame(() => {
                    panel.style.transition = reduced ? "none" : ease;
                });
            }
        };

        document.querySelectorAll("[data-accordion]").forEach((group) => {
            const rows = [...group.querySelectorAll("[data-faq]")]
                .map((item) => ({
                    btn: item.querySelector("[data-faq-btn]"),
                    panel: item.querySelector("[data-faq-panel]"),
                    plus: item.querySelector("[data-plus]"),
                }))
                .filter((row) => row.btn && row.panel && row.plus);

            rows.forEach((row, i) => {
                set(row, reduced || i === 0, false);

                const onClick = () => {
                    const opening = row.btn.getAttribute("aria-expanded") !== "true";
                    /* Close the others first, then set this one — so the group
                       never shows two open panels mid-transition. */
                    rows.forEach((other) => {
                        if (other !== row) set(other, false, true);
                    });
                    set(row, opening, true);
                };

                row.btn.addEventListener("click", onClick);
                cleanups.push(() => row.btn.removeEventListener("click", onClick));
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, []);

    return null;
}
