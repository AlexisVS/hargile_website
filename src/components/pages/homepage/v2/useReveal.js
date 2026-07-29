"use client";

import {useCallback, useEffect, useRef} from "react";
import styles from "./reveal.module.scss";

/* Matches motion's old `viewport: {amount: 0.2}` — an element reveals once a
   fifth of it has crossed into the viewport. */
const THRESHOLD = 0.2;

/**
 * Shared one-shot scroll reveal for the v2 homepage sections.
 *
 * Not motion's `initial`/`whileInView` any more: those serialize `opacity: 0`
 * into the server HTML, so every client that doesn't run JS — most AI
 * answer-engine crawlers, i.e. exactly what docs/geo-plan.md targets — read a
 * transparent page below the hero. Here the SSR HTML *is* the finished state
 * and JS only subtracts: the observer's first pass parks whatever is still
 * off-screen (nothing anyone can see), and each element fades back in as it
 * scrolls into view. Same move the hero copy already makes, one level up.
 *
 * Elements already on screen when JS boots are deliberately left as they are
 * rather than hidden and re-revealed — the reader has them; popping them out to
 * animate them back would be worse than no animation. On this page everything
 * below the hero starts off-screen, so that's the rare path.
 *
 * Timing, stagger and the reduced-motion fallback live in reveal.module.scss —
 * nothing here writes an inline style, which is the whole point.
 *
 * Usage: `<h2 className={section.heading} {...reveal(0)}>`, where the argument
 * is the element's rank in its section's stagger.
 */
export function useReveal() {
    const observerRef = useRef(null);

    const getObserver = useCallback(() => {
        if (observerRef.current) return observerRef.current;

        observerRef.current = new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                const el = entry.target;
                if (!entry.isIntersecting) {
                    // First pass, below the fold: park it until it's scrolled to.
                    el.classList.add(styles.pending);
                    continue;
                }
                // Nothing parked means it was on screen from the start — leave it.
                if (el.classList.contains(styles.pending)) {
                    el.classList.remove(styles.pending);
                    el.classList.add(styles.revealIn);
                }
                observer.unobserve(el);
            }
        }, {threshold: THRESHOLD});

        return observerRef.current;
    }, []);

    /* One stable ref callback for every element in the section: React only
       re-runs it when the node itself changes, so nothing is observed twice on
       re-render. Detach is the disconnect below. */
    const register = useCallback((node) => {
        if (node) getObserver().observe(node);
    }, [getObserver]);

    useEffect(() => () => {
        observerRef.current?.disconnect();
        observerRef.current = null;
    }, []);

    return (index = 0) => ({
        ref: register,
        "data-reveal-index": index,
    });
}
