"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {OptimizedImage} from "@/components/optimizedImage";
import {usePathname} from "@/i18n/navigation";

/* Bridges the hero's "backdrop has painted" signal up to the full-screen loader,
   which lives at layout level (above the page content). The hero calls
   markHeroReady() once its WebGL canvas paints; the loader then draws its ring
   to completion and fades out.

   The loader only exists on the homepage — that's the only route with a hero to
   wait on. usePathname() from next-intl is locale-stripped, so the homepage is
   "/" for every locale. Elsewhere the loader never mounts, so other pages render
   with no overlay at all. A safety timeout still guarantees dismissal on the
   homepage even if a device never reports a canvas. */

const HeroLoadingContext = createContext({markHeroReady: () => {}});

export const useHeroLoading = () => useContext(HeroLoadingContext);

// Homepage backstop: dismiss even if no canvas ever reports in. Generous, since
// the hero on a cold load can legitimately take a moment.
const SAFETY_MS = 4000;
// Let the draw-on ring complete before the overlay fades, so it never cuts off
// mid-draw on a fast load. Matches the ring animation duration in loading.scss.
const RING_MS = 900;
const FADE_MS = 500;

export default function HeroLoadingProvider({children}) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    const [heroReady, setHeroReady] = useState(false);
    const [gone, setGone] = useState(false);

    const markHeroReady = useCallback(() => setHeroReady(true), []);

    // Backstop so the loader always dismisses on the homepage.
    useEffect(() => {
        if (!isHome) return;
        const t = setTimeout(() => setHeroReady(true), SAFETY_MS);
        return () => clearTimeout(t);
    }, [isHome]);

    // Once ready, let the ring finish, then fade, then unmount.
    const dismissing = heroReady;
    useEffect(() => {
        if (!dismissing) return;
        const t = setTimeout(() => setGone(true), RING_MS + FADE_MS);
        return () => clearTimeout(t);
    }, [dismissing]);

    const value = useMemo(() => ({markHeroReady}), [markHeroReady]);

    // Only the homepage shows the loader; other routes render instantly.
    const showLoader = isHome && !gone;

    return (
        <HeroLoadingContext.Provider value={value}>
            {showLoader && (
                <div className={`loading-container ${dismissing ? "fade-out" : ""}`}>
                    <svg
                        className="loading-svg"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="transparent"
                            strokeWidth="1"
                        />
                        {/* Draw-on progress ring: strokeDasharray is the full
                            circumference (pathLength=100) and the dashoffset
                            animates 100→0, so the stroke draws itself once around
                            the logo. Starts at 12 o'clock via the -90° rotation. */}
                        <path
                            className="loading-path"
                            d="M 50,50 m 0,-45 a 45,45 0 1,1 0,90 a 45,45 0 1,1 0,-90"
                            pathLength="100"
                            strokeDasharray="100"
                            strokeDashoffset="100"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <OptimizedImage
                        style={{
                            width: "20vh",
                            height: "auto",
                            mixBlendMode: "plus-lighter",
                            position: "absolute",
                        }}
                        width={750}
                        height={348}
                        src="/images/brand/brand-large-white.png"
                        alt="Brand Logo"
                        priority={true}
                        fetchpriority={"high"}
                    />
                </div>
            )}
            {children}
        </HeroLoadingContext.Provider>
    );
}
