"use client"
import React from "react";
import {useTranslations} from "next-intl";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import {usePathname} from "@/i18n/navigation";
import CtaLink from "@/components/ui/cta-link/cta-link";
import styles from "@/components/ContactButton.module.scss";

export const ContactButton = () => {
    const navigation = useSiteNavigation();
    const t = useTranslations('components.contact-button');
    // Locale-stripped pathname: "/contact" on every locale.
    const pathname = usePathname();

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
        <div className={styles.dock}>
            <CtaLink href="/contact" variant="primary" size="sm" aria-label={t('title')}>
                <span className={styles.full} aria-hidden="true">{t('title')}</span>
                <span className={styles.short} aria-hidden="true">{t('short')}</span>
            </CtaLink>
        </div>
    );
};
