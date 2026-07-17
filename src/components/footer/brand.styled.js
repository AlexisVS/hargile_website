import styled from "styled-components";

export const BrandStyled = styled.a`
    font-family: var(--font-headings);
    font-weight: 700;
    font-size: 1.6rem;
    letter-spacing: 0.14em;
    color: #ededed;
    text-decoration: none;
    text-shadow: none;
    margin-bottom: 1.25rem;
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
