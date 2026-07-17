import styled from "styled-components";

export const FooterContentStyled = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;

    @media (min-width: 550px) {
        /* Brand column keeps the address readable; the two link columns
           only take the width they need, so nothing stretches to the edge. */
        grid-template-columns: minmax(240px, 1.2fr) max-content max-content;
        column-gap: clamp(2rem, 7vw, 6rem);
        row-gap: 2rem;
    }
`;
