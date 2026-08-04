"use client";

/* Bento hover spotlight — sets --mx / --my on the hovered card and flags it
   with data-hover="1"; the visible gradient lives in ia-offre-section.module.scss.

   Cards are found by [data-bento-card] rather than by class: the section is
   styled with a CSS Module, so the class name is hashed at build time and a
   literal selector would silently match nothing.

   Renders nothing. Off on touch and under prefers-reduced-motion. */

import {useEffect} from "react";

export default function BentoSpotlight() {
    useEffect(() => {
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!fine || reduced) return;

        const cleanups = [];
        document.querySelectorAll("[data-bento-card]").forEach((card) => {
            const move = (e) => {
                const b = card.getBoundingClientRect();
                card.style.setProperty("--mx", `${e.clientX - b.left}px`);
                card.style.setProperty("--my", `${e.clientY - b.top}px`);
            };
            const enter = () => card.setAttribute("data-hover", "1");
            const leave = () => card.removeAttribute("data-hover");
            card.addEventListener("pointermove", move);
            card.addEventListener("pointerenter", enter);
            card.addEventListener("pointerleave", leave);
            cleanups.push(() => {
                card.removeEventListener("pointermove", move);
                card.removeEventListener("pointerenter", enter);
                card.removeEventListener("pointerleave", leave);
                card.removeAttribute("data-hover");
            });
        });
        return () => cleanups.forEach((fn) => fn());
    }, []);

    return null;
}
