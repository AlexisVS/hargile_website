import styled from "styled-components";

export const AuditContainer = styled.section`
    position: relative;
    width: 100%;
    min-height: 80vh;
    padding: 8vh 0;
    overflow: hidden;
    background-color: var(--color-background-section);
`;

export const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
`;

export const SectionTitle = styled.h2.attrs({
    className: 'fluid-type-4'
})`
    margin-bottom: 2rem;
    color: var(--color-text-light);

    .accent {
        color: var(--color-accent-mihai);
        display: inline;
    }
`;

export const SectionDescription = styled.p.attrs({
    className: 'fluid-type-1'
})`
    color: var(--color-text-light);
    margin-bottom: 2rem;
    max-width: 80ch;

    strong {
        font-weight: 600;
    }
`;

export const FeaturesList = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 3rem 0;
    max-width: max-content;
    padding-left: 0;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

`;

export const FeatureItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: rgba(17, 12, 41, 0.4);
    border: 1px solid rgba(147, 51, 234, 0.1);
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    backdrop-filter: blur(6px);

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
`;

export const FeatureIcon = styled.span`
    font-size: 1.75rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
`;

export const FeatureText = styled.span.attrs({
    className: 'fluid-type-0-5'
})`
    color: var(--color-text-light);
`;

export const DetailsList = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media screen and (min-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (min-width: 1920px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const DetailItem = styled.div`
    background-color: rgba(17, 12, 41, 0.2);
    border: 1px solid rgba(147, 51, 234, 0.1);
    border-radius: 0.75rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    backdrop-filter: blur(6px);
    padding: 1.8rem 2rem;
    max-width: 800px;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    &:last-child {
        border-bottom: none;
    }
`;

export const DetailTitle = styled.h3.attrs({
    className: 'fluid-type-1-5'
})`
    color: var(--color-accent-mihai);
    margin-bottom: 1rem;
    font-weight: 600;
`;

export const DetailText = styled.p.attrs({
    className: 'fluid-type-0-5'
})`
    color: var(--color-text-light);
    text-align: justify;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 0;
`;
