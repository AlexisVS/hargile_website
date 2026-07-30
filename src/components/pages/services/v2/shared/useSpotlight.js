"use client";

/* Pointer position published as CSS custom properties — the shared hover-depth
   primitive for the M5 service pages (offer rows, proof cards, IA bento).
   One implementation, one radius, one alpha: see spotlight.module.scss.

   Nothing here touches React state, so a pointer moving across a row never
   re-renders anything — it writes four custom properties on one node inside a
   rAF and lets the compositor do the rest. The consumer decides what to do with
   them in CSS:
     --sx / --sy   pointer position in px, element-relative (spotlight centre)
     --tx / --ty   the same, normalised to -1..1 (tilt amount)

   Fine-pointer only. On touch there is no hover state to serve, and attaching
   pointermove to a dozen cards for nothing is exactly the kind of cost that
   shows up on a mid-range Android. */

import {useCallback} from "react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function useSpotlight() {
    /* A ref callback rather than an effect: React 19 takes the returned cleanup
       and calls it on detach, so listeners follow the node's life exactly, and
       one stable callback can be spread over a whole list of cards. */
    return useCallback((node) => {
        if (!node || !window.matchMedia(FINE_POINTER).matches) return undefined;

        let frame = 0;
        let clientX = 0;
        let clientY = 0;

        /* The rect is read here, one frame after the last write — never in the
           same task as setProperty, so this is not a forced synchronous layout. */
        const paint = () => {
            frame = 0;
            const rect = node.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const x = clientX - rect.left;
            const y = clientY - rect.top;
            node.style.setProperty("--sx", `${x}px`);
            node.style.setProperty("--sy", `${y}px`);
            node.style.setProperty("--tx", `${(x / rect.width) * 2 - 1}`);
            node.style.setProperty("--ty", `${(y / rect.height) * 2 - 1}`);
        };

        const onMove = (event) => {
            clientX = event.clientX;
            clientY = event.clientY;
            if (!frame) frame = requestAnimationFrame(paint);
        };

        /* Leave resets the tilt only — the spotlight fades out on its own via
           the :hover opacity transition, and moving --sx back to the centre
           mid-fade would drag the highlight across the card. */
        const onLeave = () => {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
            node.style.setProperty("--tx", "0");
            node.style.setProperty("--ty", "0");
        };

        node.addEventListener("pointermove", onMove, {passive: true});
        node.addEventListener("pointerleave", onLeave);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            node.removeEventListener("pointermove", onMove);
            node.removeEventListener("pointerleave", onLeave);
        };
    }, []);
}
