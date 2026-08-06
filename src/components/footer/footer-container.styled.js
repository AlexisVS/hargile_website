import styled from "styled-components";

export const FooterContainerStyled = styled.footer`
    color: #fff;
    position: relative;
    /* Full-bleed out of .content-container's gutter — the same escape every v2
       page section makes. Without it the footer centres inside a box that is
       already inset by 6vw, so its first column lands well right of the navbar
       logo (~37px at 1440px) whatever max-width it carries. body hides
       overflow-x, so the negative margin never creates a scrollbar. */
    margin-inline: calc(50% - 50vw);
    padding: 1rem 0 2rem;

    @media (min-width: 1024px) {
        padding-bottom: 4rem;
    }
`;

/* The shared measure, same as NavbarInner and every section's .container, so
   the brand starts on the line the navbar logo and the page copy start on. */
export const FooterInnerStyled = styled.div`
    width: 100%;
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--container-gutter);
    box-sizing: border-box;
`;
