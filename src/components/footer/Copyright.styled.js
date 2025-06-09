import styled from "styled-components";

export const Copyright = styled.div`
    color: rgba(255, 255, 255, 0.7);
    order: 1;
    text-align: center;

    @media (min-width: 640px) {
        order: 2;
        text-align: right;
    }
`;
