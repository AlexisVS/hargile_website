import styled from "styled-components";

/* Brand + tagline stack so the pair centres as one unit in the footer bar */
export const BrandBlockStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

/* Same voice as the hero eyebrow (.eyebrow in hero.module.scss): brand blue,
   uppercase, wide tracking — scaled down to footer size. */
export const BrandTaglineStyled = styled.span`
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #96b9f9;
`;

export const BrandStyled = styled.a`
    font-family: var(--font-headings);
    font-weight: 700;
    font-size: 1.6rem;
    letter-spacing: 0.14em;
    color: #ededed;
    text-decoration: none;
    text-shadow: none;
    width: max-content;
    transition: color 0.25s;

    &:hover {
        color: #96b9f9;
    }

    &:focus-visible {
        outline: 2px solid rgba(150, 185, 249, 0.7);
        outline-offset: 3px;
        border-radius: 4px;
    }
`;
