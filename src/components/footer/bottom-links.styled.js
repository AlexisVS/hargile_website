import styled from "styled-components";

export const BottomLinksStyled = styled.div`
    display: flex;
    gap: 1.5rem;

    @media (max-width: 640px) {
        flex-wrap: wrap;
        gap: 1rem;
    }
`;
