import styled from "styled-components";

export const HeaderSection = styled.header`
    position: relative;
    margin-bottom: 1.5rem;
    margin-top: 0.5rem;
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

export const PageTitle = styled.h1`
    /* Exactly the homepage v2 section heading (.heading in
       v2-section.module.scss): same size, same flat off-white. */
    font-family: var(--font-headings);
    font-size: clamp(34px, 3.6vw, 56px);
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #ededed;
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;

    /* Doubled specificity: the legacy .content-container h1 rule out-ranks a
       single styled-components class and re-applies its grey text-shadow. */
    && {
        text-shadow: none;
    }
`;

export const TitleUnderline = styled.div`
    /* A slim fading rule instead of the old 4px block — quieter, more v2. */
    width: 140px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, #96b9f9, rgba(150, 185, 249, 0.05));
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
    /* v2 lead style — soft off-white, no blend mode (it washed out over black). */
    color: rgba(237, 237, 237, 0.68);
    font-weight: 300;
    line-height: 1.6;
    margin-bottom: 1rem;
    max-width: 65ch;
`;
