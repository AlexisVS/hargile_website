"use client";

/* Site-wide CTA link — the pill-outline style picked from the button lab.
   Renders next-intl's Link for internal routes, a plain <a> for hashes, and a
   new-tab <a> when `external` is set. Chevron is part of the identity and is
   always rendered. */

import {Link} from "@/i18n/navigation";
import styles from "./cta-link.module.scss";

const Chevron = () => (
    <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
            d="M6 3.5 10.5 8 6 12.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CtaLink = ({href, variant = "primary", size, external = false, className, children, ...rest}) => {
    const cls = [
        styles.cta,
        styles[variant] ?? styles.primary,
        size === "sm" ? styles.sm : null,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const content = (
        <>
            {children}
            <Chevron/>
        </>
    );

    if (external) {
        return (
            <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
                {content}
            </a>
        );
    }

    if (typeof href === "string" && href.startsWith("#")) {
        return (
            <a href={href} className={cls} {...rest}>
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className={cls} {...rest}>
            {content}
        </Link>
    );
};

export default CtaLink;
