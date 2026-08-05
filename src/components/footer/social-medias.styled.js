import styled from "styled-components";

export const SocialContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;

    /* The 44px boxes below carry their own spacing — keeping 1.5rem on top of
       them would push the icons apart for no reason. Pulled left so the row
       still starts on the same line as the links above it. */
    @media (max-width: 699px) {
        gap: 0.25rem;
        margin-left: -10px;
    }
`

/* Icon-only link: the name lives in aria-label/title, the icon is the whole
   target, so the row stays compact next to the contact block. */
export const SocialLinkIcon = styled.a`
    color: inherit;
    display: flex;
    align-items: center;
    opacity: 0.75;
    transition: opacity 160ms ease;

    &:hover,
    &:focus-visible {
        opacity: 1;
    }

    /* A 22px icon is a 22px target. On mobile the box grows around it to the
       44px minimum — the icon itself does not change size, so the row looks
       identical. */
    @media (max-width: 699px) {
        justify-content: center;
        min-width: 44px;
        min-height: 44px;
    }
`
