import styled from "styled-components";

export const FooterContainerStyled = styled.footer`
    color: #fff;
    position: relative;
    padding: 1rem 20px 2rem;

    @media (min-width: 1024px) {
        /* Centred with a max-width instead of wide viewport-relative gutters,
           so the content keeps its shape on ultrawide screens. */
        max-width: 1360px;
        margin: 0 auto;
        padding: 1rem 48px 4rem;
    }
`;
