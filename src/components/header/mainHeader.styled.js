import styled from "styled-components";

export const HeaderSection = styled.header`
    position: relative;
    margin-bottom: 3rem;
    margin-top: 2rem;
`;

export const BackgroundBlur = styled.div`
    position: absolute;
    top: 15vh;
    left: calc(50% - 35rem);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--color-accent-mihai);
    opacity: 0.4;
    filter: blur(40px);
    transform: scale(6);
    z-index: -10;
`;

export const TitleWrapper = styled.div`
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
`;

export const PageTitle = styled.h1.attrs({
    className: "fluid-type-5",
})`
    color: var(--color-text-light);
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;
`;

export const TitleUnderline = styled.div`
    width: 80%;
    height: 4px;
    background: var(--color-accent-mihai);
    margin-bottom: 1.5rem;
`;

export const SubtitleContainer = styled.div`
    margin-bottom: 1.5rem;
`;

export const SubTitle = styled.h2`
    margin-bottom: 1rem;
    line-height: 1.3;

    .regular {
        display: block;
        color: var(--color-text-light);
        font-weight: 600;
    }

    .highlight {
        display: block;
        color: var(--color-accent-mihai);
        font-weight: 600;
    }
`;

export const SubtitleRegular = styled.span.attrs({
    className: "fluid-type-3",
})``;

export const SubtitleHighlight = styled.span.attrs({
    className: "fluid-type-3",
})``;

export const Description = styled.p.attrs({
    className: "fluid-type-1-5",
})`
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
    max-width: 65ch;
    mix-blend-mode: plus-lighter;
`;
