import styled from "styled-components";

export const PageWrapper = styled.div`
    min-height: 100vh;
    color: white;
    position: relative;
    padding: 3rem 2rem;

    @media (min-width: 768px) {
        padding: 4rem;
    }
`;

export const ContentContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
`;

export const SectionsWrapper = styled.div`
    margin-top: 2rem;
`;