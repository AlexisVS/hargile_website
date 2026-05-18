import styled from "styled-components";
import {Link} from "@/i18n/navigation";

export const CardContainer = styled.div`
    position: relative;
    backdrop-filter: blur(8px);
    background-color: color-mix(in srgb, black 40%, var(--color-background-card));
    border-radius: 0.5rem;
    overflow: hidden;
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
    }
`;

export const CardContent = styled.div`
    position: relative;
    padding: 1.5rem;
    display: grid;
    backdrop-filter: blur(8px);
    grid-template-areas:
                        "title title"
                        "subtitle subtitle"
                        "body body"
                        "button button";
    grid-template-columns: max-content 1fr;
    grid-template-rows: max-content max-content 1fr max-content;
    grid-column-gap: 16px;
    justify-content: flex-start;
    min-height: 100%;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: calc(12 * 1% * 1.618);
        height: 4px;
        background-color: var(--color-accent-mihai);
    }
`;

export const IconContainer = styled.div`
    grid-area: icon;
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    background-color: var(--color-primary-light);
    color: var(--color-primary);
`;

export const CardTitle = styled.h3.attrs({
    className: 'fluid-type-1-5'
})`
    grid-area: title;
    color: var(--color-text-light);
    margin-bottom: 0.5rem;
    font-weight: 600;
`;

export const CardSubtitle = styled.h4.attrs({
    className: 'fluid-type-0'
})`
    grid-area: subtitle;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
    font-weight: 400;
`;

export const CardDescription = styled.p.attrs({
    className: 'fluid-type-0'
})`
    grid-area: body;
    color: var(--color-text-light);
    margin-bottom: 1.5rem;
    flex-grow: 1;
    text-align: justify;
`;

export const LearnMoreLink = styled(Link)`
    grid-area: button;
    display: flex;
    align-items: center;
    color: var(--color-text-light);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    gap: 8px;

    svg {
        margin-left: 0.5rem;
    }
`;
