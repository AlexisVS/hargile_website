// src/components/pages/about-us/our-team/our-team.styled.js
import styled from "styled-components";

export const SectionContainer = styled.section`
    position: relative;
    width: 100%;
    padding: 8vh 0;
    display: flex;
    justify-content: center;
    overflow: hidden;

    @media (min-width: 768px) {
        padding: 10vh 0;
    }

    @media (min-width: 1200px) {
        padding: 12vh 0;
    }
`;

export const TitleWrapper = styled.div`
    text-align: center;
    margin-bottom: 4rem;
    line-break: unset;

    @media (min-width: 768px) {
        margin-bottom: 6rem;
    }
`;

export const SectionTitle = styled.h2.attrs({
    className: 'fluid-type-5'
})`
    color: var(--color-text-light);
    font-weight: 600;
    line-break: unset;;
`;

export const TeamGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, minmax(295px, 15vw));
    justify-content: stretch;
    gap: calc(4vw + 1vh);
    width: 100%;
    margin: 0 auto;

    @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(295px, 30vw));
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(295px, 15vw));
        max-width: 80vw;
    }
`;
