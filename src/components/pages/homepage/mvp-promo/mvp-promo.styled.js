import styled from "styled-components";
import {Link} from "@/i18n/navigation";

export const PromoSection = styled.section`
    position: relative;
    width: 100%;
    padding: 4vh 0 12vh;
`;

export const PromoCard = styled.div`
    position: relative;
    overflow: hidden;
    border-radius: 1.5rem;
    padding: clamp(2rem, 5vw, 4rem);
    background: linear-gradient(135deg, rgba(150, 185, 249, 0.12), rgba(91, 141, 239, 0.04));
    border: 1px solid rgba(150, 185, 249, 0.25);
    backdrop-filter: blur(12px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);

    @media (min-width: 900px) {
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        gap: clamp(2rem, 4vw, 4rem);
        align-items: center;
    }
`;

export const Intro = styled.div`
    position: relative;
    z-index: 1;
`;

export const PromoTitle = styled.h2.attrs({className: 'fluid-type-3'})`
    color: var(--color-text-light);
    line-height: 1.05;
    margin: 0 0 1rem;

    .accent {
        background: linear-gradient(90deg, var(--color-accent-blue-planet), #5B8DEF);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        white-space: nowrap;
    }
`;

export const Lead = styled.p.attrs({className: 'fluid-type-1'})`
    color: var(--color-text-light);
    max-width: 46ch;
    font-weight: 200;
    margin: 0 0 2rem;
`;

export const CtaLink = styled(Link).attrs({className: 'fluid-type-1'})`
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.9rem 1.9rem;
    border-radius: 0.75rem;
    text-decoration: none;
    font-weight: 600;
    color: #071022;
    background: linear-gradient(90deg, var(--color-accent-blue-planet), #5B8DEF);
    box-shadow: 0 8px 24px rgba(91, 141, 239, 0.35);
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 34px rgba(91, 141, 239, 0.5);
    }

    .arrow {
        transition: transform 0.25s ease;
    }

    &:hover .arrow {
        transform: translateX(4px);
    }
`;

export const Timeline = styled.ol`
    position: relative;
    z-index: 1;
    list-style: none;
    margin: 2.5rem 0 0;
    padding: 0;
    display: grid;
    gap: 1rem;

    @media (min-width: 900px) {
        margin: 0;
    }
`;

export const Step = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 1.1rem;
    padding: 1.1rem 1.3rem;
    border-radius: 0.85rem;
    border: 1px solid rgba(150, 185, 249, 0.15);
    background: rgba(10, 16, 34, 0.5);
    transition: transform 0.25s ease, border-color 0.25s ease;

    &:hover {
        transform: translateX(4px);
        border-color: rgba(150, 185, 249, 0.4);
    }
`;

export const StepWeek = styled.span.attrs({className: 'fluid-type-0-5'})`
    flex-shrink: 0;
    min-width: 5rem;
    padding-top: 0.15rem;
    font-weight: 600;
    color: var(--color-accent-blue-planet);
`;

export const StepBody = styled.div`
    min-width: 0;
`;

export const StepTitle = styled.p.attrs({className: 'fluid-type-1'})`
    margin: 0 0 0.2rem;
    color: var(--color-text-light);
    font-weight: 500;
`;

export const StepText = styled.p.attrs({className: 'fluid-type-0-5'})`
    margin: 0;
    color: var(--color-text-light);
    opacity: 0.7;
`;
