"use client";

import {useEffect, useRef} from "react";
import {useLenis} from "lenis/react";
import {usePathname} from "@/i18n/navigation";

/* Next resets window scroll on navigation, but two things fight it here:
   Lenis keeps its own scroll position across routes, and the menu-close
   handler (useNavigationVisibility) restores the previous page's offset after
   the body unlock. Both can leave a freshly opened page mid-scroll — this
   forces every route change to land at the top.
   The locale-aware usePathname is deliberate: it doesn't change on language
   switches, so those keep the reader's position. Initial mount is skipped so
   browser scroll restoration on refresh still works. */
const ScrollToTop = () => {
    const pathname = usePathname();
    const lenis = useLenis();
    const previous = useRef(null);

    useEffect(() => {
        if (previous.current !== null && previous.current !== pathname) {
            lenis?.scrollTo(0, {immediate: true, force: true});
            window.scrollTo(0, 0);
        }
        previous.current = pathname;
    }, [pathname, lenis]);

    return null;
};

export default ScrollToTop;
