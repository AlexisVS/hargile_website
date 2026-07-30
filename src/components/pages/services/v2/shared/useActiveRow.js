"use client";

/* Which row is "at reading height" — the scroll state behind the sticky numeral
   spine on /services.

   One IntersectionObserver with a 10%-tall band across the middle of the
   viewport, rather than a scroll listener recomputing rects every frame: the
   only thing that changes is a small integer, and it changes four times per
   page. When nothing is in the band (between two rows, or the section scrolled
   past) the last value holds, so the spine never blanks.

   Rows are read by their data-row-index, so the observer needs no array of
   nodes and re-mounting a row cannot desynchronise the mapping. */

import {useCallback, useEffect, useRef, useState} from "react";

const BAND = "-45% 0px -45% 0px";

export function useActiveRow() {
    const [activeIndex, setActiveIndex] = useState(0);
    const observerRef = useRef(null);

    const getObserver = useCallback(() => {
        if (observerRef.current) return observerRef.current;

        observerRef.current = new IntersectionObserver((entries) => {
            /* Furthest-down row wins: scrolling down, the row entering the band
               takes over from the one leaving it; scrolling up, the one leaving
               is the higher index and is already out, so the lower one wins. */
            let next = null;
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const index = Number(entry.target.dataset.rowIndex);
                if (Number.isNaN(index)) continue;
                if (next === null || index > next) next = index;
            }
            if (next !== null) setActiveIndex(next);
        }, {rootMargin: BAND, threshold: 0});

        return observerRef.current;
    }, []);

    /* Ref callback with a cleanup — React 19 calls it on detach, so a row's
       observation follows the node's life exactly (same shape as useSpotlight). */
    const registerRow = useCallback((node) => {
        if (!node) return undefined;
        const observer = getObserver();
        observer.observe(node);
        return () => observer.unobserve(node);
    }, [getObserver]);

    useEffect(() => () => {
        observerRef.current?.disconnect();
        observerRef.current = null;
    }, []);

    return {activeIndex, registerRow};
}
