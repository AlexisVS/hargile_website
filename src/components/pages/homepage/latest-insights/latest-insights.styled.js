// src/components/pages/homepage/latest-insights/latest-insights.styled.js
import styled from "styled-components";
import {Link} from "@/i18n/navigation";
import {motion} from "motion/react";

export const SectionContainer = styled.section`
    position: relative;
    margin-top: 12vh;
    width: 100%;
    min-height: 90vh;
    padding: 8vh 0;
    overflow: hidden;

    @media (min-width: 1024px) {
        padding: 8vh 0;
    }
`;

export const ContentWrapper = styled(motion.div)`
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    z-index: 1;
    position: relative;

    @media screen and (min-width: 1432px) {
        max-width: 70vw;
    }
`;

export const SectionHeader = styled(motion.div)`
    margin-bottom: 5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    @media screen and (min-width: 1400px){
        align-items: flex-end;
    }
`;

export const SectionSubHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;


export const SectionTitle = styled.h2.attrs({
    className: 'fluid-type-5'
})`
    margin-bottom: 1rem;
    color: var(--color-text-light);
`;

export const SectionSubtitle = styled.p.attrs({
    className: 'fluid-type-1'
})`
    color: var(--color-text-secondary);
    max-width: 40ch;
    margin-left: 4px;
`;

export const InsightsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: calc(14vh - 2vw);
    position: relative;
    z-index: 2;

    /* Container for the parallax cards with preserved 3D space */

    .parallax-card-container {
        will-change: transform;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        transition: transform 0.1s ease-out;
        position: relative;
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

export const ViewAllLink = styled(Link)`
    margin-top: calc(2vw + 12vh);
    align-self: flex-start;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    z-index: 3;
    width: max-content;
    display: flex;
    color: var(--color-text-light);
    font-weight: 500;
    text-decoration: none;
    position: relative; /* Allow for absolute positioning of pseudo-elements */

    &:after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 1px;
        background-color: var(--color-text-light);
        transition: width 0.3s ease;
    }

    &:hover {
        transform: translateX(5px);

        &:after {
            width: 100%;
        }
    }
`;
