"use client"
import React, {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import {usePathname} from "@/i18n/navigation";
import CtaLink from "@/components/ui/cta-link/cta-link";
import styles from "@/components/ContactButton.module.scss";

/* Reading is scrolling down, so the pill leaves while you read and comes back
   the moment you reverse — which is when someone is looking for a way to act
   rather than consuming. It also stays out of the first screenful entirely:
   every hero already carries its own contact CTA, so up there the floating one
   is pure duplication. */
const REVEAL_AT = 0.9;   // of a viewport height
const JITTER = 8;        // px of momentum that must not flip it

export const ContactButton = () => {
    const navigation = useSiteNavigation();
    const t = useTranslations('components.contact-button');
    // Locale-stripped pathname: "/contact" on every locale.
    const pathname = usePathname();
    const [hidden, setHidden] = useState(true);

    /* Every hook runs before the early return below — bailing out first would
       change the hook order between renders. */
    useEffect(() => {
        let last = window.scrollY;
        let frame = 0;

        const read = () => {
            frame = 0;
            const y = window.scrollY;
            const moved = y - last;

            if (y < window.innerHeight * REVEAL_AT) {
                setHidden(true);
                last = y;
                return;
            }
            if (Math.abs(moved) < JITTER) return;

            setHidden(moved > 0);
            last = y;
        };

        const onScroll = () => {
            // One read per frame: scroll fires far more often than it paints.
            if (frame) return;
            frame = requestAnimationFrame(read);
        };

        // A route change lands at the top of the new page, so re-read rather
        // than carrying the previous page's state across.
        read();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [pathname]);

    // Hide while the fullscreen hamburger menu is open, and on the contact
    // page itself where the button would be redundant.
    if (navigation.isOpen || pathname === "/contact") return null;

    // The site's CtaLink, primary at the compact step: same hairline pill,
    // same blue, same chevron as the contact CTA that closes every page. The
    // leading mail icon went with the old styled-component — no other button
    // on the site carries one, and the chevron is the shared affordance.
    //
    // Two labels, swapped in CSS rather than by measuring the viewport in JS:
    // a media query has no hydration mismatch to get wrong, and this renders
    // identically on the server. The accessible name stays the full phrase via
    // aria-label, so the short one is only ever the visual label.
    return (
        <div className={`${styles.dock} ${hidden ? styles.hidden : ""}`}>
            <CtaLink href="/contact" variant="primary" size="sm" aria-label={t('title')}>
                <span className={styles.full} aria-hidden="true">{t('title')}</span>
                <span className={styles.short} aria-hidden="true">{t('short')}</span>
            </CtaLink>
        </div>
    );
};
