import {useReducedMotion} from "motion/react";

/**
 * Shared scroll-reveal props for v2 homepage sections.
 * Returns a factory that produces motion props for a staggered fade/rise-in,
 * collapsing to a plain fade when the user prefers reduced motion.
 */
export function useReveal() {
    const reducedMotion = useReducedMotion();

    return (index = 0) => ({
        initial: reducedMotion ? {opacity: 0} : {opacity: 0, y: 16},
        whileInView: reducedMotion ? {opacity: 1} : {opacity: 1, y: 0},
        viewport: {once: true, amount: 0.2},
        transition: {duration: 0.5, ease: "easeOut", delay: index * 0.09},
    });
}
