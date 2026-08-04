"use client";

/* Scroll-linked horizontal drift — the offer names on /services.

   One rAF for the whole section, not one per element: the hook takes a ref on
   the container, collects everything carrying data-drift once, and writes a
   single transform per node per frame. Nothing runs between scrolls — there is
   no ambient loop here, the movement only exists while the reader moves.

   Direction comes from the DOM (data-drift="left" | "right") so the component
   stays declarative and this file never learns the layout. Progress is -1..1
   measured from the viewport centre: the name enters the screen offset against
   its travel, crosses zero at reading height, and finishes offset the other
   way. It is a drift, not an entrance — the copy is never displaced far enough
   to read as "arriving".

   Same shape as useSpotlight: a ref callback whose return value is the
   cleanup, so listeners follow the node's life exactly. */

import {useCallback} from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

/* Full drift, and the smaller one below the mirror breakpoint — at phone width
   36px of travel on a 46px name is a wobble, not a drift. */
const DISTANCE = 36;
const DISTANCE_NARROW = 12;
const NARROW = 768;

export function useScrollDrift() {
    return useCallback((node) => {
        if (!node || window.matchMedia(REDUCED).matches) return undefined;

        const targets = Array.from(node.querySelectorAll("[data-drift]"));
        if (!targets.length) return undefined;

        let frame = 0;

        const paint = () => {
            frame = 0;
            const view = window.innerHeight;
            if (!view) return;
            const distance = window.innerWidth < NARROW ? DISTANCE_NARROW : DISTANCE;

            for (const el of targets) {
                const rect = el.getBoundingClientRect();
                /* Centre of the element against centre of the viewport, over
                   the span where the two can meet: +1 just below the fold,
                   0 at reading height, -1 just above it. */
                const span = (view + rect.height) / 2;
                const offset = rect.top + rect.height / 2 - view / 2;
                const progress = Math.max(-1, Math.min(1, offset / span));
                const dir = el.dataset.drift === "left" ? -1 : 1;
                const x = -progress * distance * dir;
                el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
            }
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };

        paint();
        /* capture: true so a scroll inside any ancestor still reaches us, and
           passive so it never blocks the compositor. */
        window.addEventListener("scroll", onScroll, {passive: true, capture: true});
        window.addEventListener("resize", onScroll, {passive: true});

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll, {capture: true});
            window.removeEventListener("resize", onScroll);
            /* Leave nothing behind on a node React may reuse. */
            for (const el of targets) el.style.transform = "";
        };
    }, []);
}
