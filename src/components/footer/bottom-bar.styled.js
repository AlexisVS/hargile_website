import styled from "styled-components";

export const BottomBarStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 2rem;
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    row-gap: 1.5rem;

    @media (min-width: 640px) {
        gap: 1rem;
        flex-direction: row;
    }
`;
