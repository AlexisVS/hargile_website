"use client";

/* A number that counts to itself once, the first time it is seen.

   The final value is what the server renders — the count-up only replaces the
   text once the element is in view, so a client that runs no JS (and every AI
   answer-engine crawler) reads the real figure rather than 0. Same
   subtract-never-add rule as useReveal. Reduced motion skips the animation
   entirely and leaves the rendered value alone.

   Lifted out of index/hero-stats.jsx when the mvp scope section needed the same
   behaviour for its "30". One implementation, so the two places can never drift
   into two different easings. */

import {useEffect, useRef} from "react";

const DURATION = 900;

/* Writes textContent directly: the node never re-renders, so React and the
   animation are never fighting over the same text. */
const CountUp = ({to, className}) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

        let frame = 0;
        const observer = new IntersectionObserver(([entry], obs) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();

            const start = performance.now();
            const step = (now) => {
                const p = Math.min(1, (now - start) / DURATION);
                el.textContent = String(Math.round(to * (1 - (1 - p) ** 3)));
                frame = p < 1 ? requestAnimationFrame(step) : 0;
            };
            frame = requestAnimationFrame(step);
        }, {threshold: 0.6});

        observer.observe(el);

        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
            /* Unmounting mid-count must not leave a partial number behind. */
            el.textContent = String(to);
        };
    }, [to]);

    return <span ref={ref} className={className}>{to}</span>;
};

export default CountUp;
