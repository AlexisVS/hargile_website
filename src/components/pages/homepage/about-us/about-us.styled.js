// src/components/pages/homepage/about-us/about-us.styled.js
import styled from "styled-components";
import { Link } from "@/i18n/navigation";
import {TransitionLink} from "@/components/TransitionLink";

export const SectionContainer = styled.section`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: calc(15vh + 3vw);
    padding-top: calc(15vh + 8vw);
    justify-content: center;
    overflow: hidden;

    @media screen and (min-width: 1600px ) {
        flex-direction: row;
        justify-content: space-between;
    }
`;

export const ContentWrapper = styled.div`
    width: 100%;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;

    @media (min-width: 768px) {
        width: 75%;
    }

    @media (min-width: 1440px) {
        width: 55%;
    }
`;

export const MainTitle = styled.h1.attrs({
    className: 'fluid-type-5'
})`
    color: var(--color-text-light);
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;
`;

export const TitleWrapper = styled.div`
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
`;

export const SubtitleContainer = styled(TransitionLink)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    text-decoration: none;
    margin-bottom: 0.5rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    width: max-content;
    transition: color 600ms ease-in-out, border-color 600ms ease-in-out, text-underline-color 600ms ease-in-out;

    & > * {
        transition: color 600ms ease-in-out, border-color 600ms ease-in-out, text-underline-color 600ms ease-in-out;
    }

    &:hover > * {
        border-color: var(--color-accent-mihai);
        text-underline-color: var(--color-accent-mihai);
        transition: color 300ms ease-in-out, border-color 300ms ease-in-out, text-underline-color 300ms ease-in-out;

        svg {
            color: var(--color-accent-mihai);
            transition: color 300ms ease-in-out;
        }
    }
`;

export const Subtitle = styled("span").attrs({
    className: 'fluid-type-1'
})`
    text-decoration: none;
    display: block;
    position: relative;
    text-wrap: balance;
    transition: color 300ms ease-in-out;

    &:hover {
        color: var(--color-text-secondary);
        transition: color 300ms ease-in-out;
    }

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0;
        height: 1px;
        background-color: var(--color-accent-mihai);
        transition: width 0.3s ease-in-out, color 0.3s ease-in-out;
    }

    &.animate-underline::after {
        animation: underlineAnimation 0.8s forwards 0.5s;
    }

    @keyframes underlineAnimation {
        0% {
            width: 0;
        }
        100% {
            width: 100%;
        }
    }
`;

export const SectionTitle = styled.h2.attrs({
    className: 'fluid-type-3'
})`
    margin-bottom: 1.5rem;
    font-weight: 700;
`;

export const Description = styled.p.attrs({
    className: 'fluid-type-0'
})`
    color: var(--color-text-light);
    line-height: 1.6;
    margin-bottom: 3rem;
    max-width: 600px;
`;

export const Conclusion = styled.p.attrs({
    className: 'fluid-type-0'
})`
    color: var(--color-text-light);
    line-height: 1.6;
    margin-bottom: 3rem;
    max-width: 600px;
    text-align: justify;
`;

export const StyledLi = styled.li.attrs({
    className: 'fluid-type-0'
})`
    color: var(--color-text-light);
    line-height: 1.6;
    padding-left: 10px

`;

export const PlusIcon = styled.div`
    width: 40px;
    height: 40px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 2px solid var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    transition: color 300ms ease-in-out;


    @media (max-width: 768px) {
        width: 35px;
        height: 35px;
    }
`;

export const SectionWrapper = styled.div`
    margin-bottom: 3rem;
`;

export const ValueItem = styled.div`
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 2rem;
    transition: transform 0.3s ease;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.75rem;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, color-mix(in srgb, var(--color-accent-mihai), transparent 20%) 100%);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        transition: all 0.3s ease;
    }

    &:hover {
        transform: translateX(6px);
    }

    &:hover::before {
        width: 10px;
        height: 10px;
        box-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
    }
`;

export const ValueTitle = styled.dt.attrs({
    className: 'fluid-type-1-5'
})`
  font-weight: bold;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  ${ValueItem}:hover & {
    color: var(--color-accent-mihai);
  }
`;

export const ValueDescription = styled.dd.attrs({
    className: 'fluid-type-0-5'
})`
    transition: color 0.3s ease;
    max-width: 60ch;
`;

export const DefinitionList = styled.dl`
    width: max-content;
`;

export const ValuesContainer = styled.div`
    width: 100%;
    height: fill-available;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    @media (min-width: 1600px) {
        justify-content: flex-end;
    }


`;
