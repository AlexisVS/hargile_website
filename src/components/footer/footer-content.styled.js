import styled from "styled-components";

export const FooterContentStyled = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 1.25rem;

    @media (min-width: 400px) {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 0.75rem;
        row-gap: 1.5rem;
    }

    @media (min-width: 550px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr);
    }
`;
