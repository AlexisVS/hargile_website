// src/components/pages/about-us/our-mission/our-mission.styled.js
import styled from "styled-components";

export const SectionContainer = styled.section`
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 8vh 0;
    overflow: hidden;

    @media (min-width: 768px) {
        padding: 10vh 0;
    }

    @media (min-width: 1200px) {
        padding: 12vh 0;
    }
`;

export const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    z-index: 1;
    position: relative;

    @media (max-width: 768px) {
        margin: 0 auto;
    }
`;

export const TitleWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const MainTitle = styled.h2.attrs({
    className: 'fluid-type-4'
})`
    color: var(--color-text-light);
    margin-bottom: 1.5rem;
    font-weight: 600;
`;

export const HighlightedText = styled.h3.attrs({
    className: 'fluid-type-3'
})`
    color: var(--color-accent-mihai); /* Hargile blue accent */
    margin: 0;
    font-weight: 600;
    line-height: 1.2;

    @media (max-width: 768px) {
        text-align: center;
        width: 100%;
    }
`;

export const SubheadingText = styled.h3.attrs({
    className: 'fluid-type-3'
})`
    color: var(--color-text-light);
    margin-bottom: 2.5rem;
    font-weight: 400;
    line-height: 1.3;

    @media (max-width: 768px) {
        text-align: center;
        width: 100%;
    }
`;

export const Description = styled.p.attrs({
    className: 'fluid-type-0-5'
})`
    color: var(--color-text-light);
    opacity: 0.9;
    margin-bottom: 5rem;
    line-height: calc(var(--line-height-base) * 1.1);
    text-align: center;

    @media (min-width: 768px) {
        max-width: 74%;
        text-align: left;
    }
`;

export const ValuesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
`;

export const ValueItem = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    
    @media (min-width: 768px) {
        align-items: center;
    }
`;

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    backdrop-filter: blur(4px);
    background-color: rgba(255, 255, 255, 0.02);
    color: var(--color-text-light);
    flex-shrink: 0;
`;

export const ValueTitle = styled.h4.attrs({
    className: 'fluid-type-1-5'
})`
    color: var(--color-text-light);
    margin-bottom: 0.5rem;
    font-weight: 600;
`;

export const ValueDescription = styled.p.attrs({
    className: 'fluid-type-1'
})`
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
`;

export const ConnectorLine = styled.div`
    width: 2px;
    height: 2.5rem;
    background-color: var(--color-accent-mihai);
    margin-left: 32px;

    @media (max-width: 768px) {
        display: none;
    }
`;
