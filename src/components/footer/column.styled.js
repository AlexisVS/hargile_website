import styled from "styled-components";

export const ColumnStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: max-content;
    max-width: 100%;
    
    @media (max-width: 399px) {
        width: 100%;
    }
    
    @media (min-width: 400px) and (max-width: 549px) {
        width: max-content;
        max-width: 100%;
    }
`;
