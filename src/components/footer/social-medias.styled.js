import styled from "styled-components";

export const SocialContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
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
`
