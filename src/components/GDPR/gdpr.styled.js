import styled from "styled-components";

export const CookieBanner = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /* Near-black to match the site chrome — the old rgba(17, 12, 41) read as purple. */
    background-color: rgba(10, 10, 18, 0.92);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    color: var(--color-text-light);
    z-index: 100000;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.3);
`;

export const BannerContainer = styled.div`
    max-width: 1360px;
    margin: 0 auto;
    padding: 0.85rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        padding: 0.85rem 2rem;
    }
`;

export const BannerContent = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`;

/* Kept in the DOM for aria-labelledby, hidden visually to keep the bar to one line. */
export const BannerTitle = styled.h2`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

export const BannerDescription = styled.p`
    font-size: 13.5px;
    font-weight: 300;
    line-height: 1.5;
    color: rgba(237, 237, 237, 0.7);
    max-width: 68ch;
    text-shadow: none;
    margin: 0;
`;

export const ButtonGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`;

export const Button = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
    border: 1px solid transparent;

    &:focus-visible {
        outline: 2px solid rgba(150, 185, 249, 0.7);
        outline-offset: 2px;
    }
`;

export const PrimaryButton = styled(Button)`
    background: #96b9f9;
    color: #0a0a12;
    font-weight: 600;

    &:hover {
        background: #b8cdfb;
        box-shadow: 0 0 24px rgba(150, 185, 249, 0.3);
    }
`;

export const SecondaryButton = styled(Button)`
    background-color: transparent;
    color: var(--color-text-light);
    border-color: rgba(255, 255, 255, 0.16);

    &:hover {
        border-color: rgba(150, 185, 249, 0.45);
        background-color: rgba(255, 255, 255, 0.04);
    }
`;

export const TertiaryButton = styled(Button)`
    background-color: transparent;
    color: rgba(237, 237, 237, 0.65);

    &:hover {
        color: var(--color-text-light);
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
    padding: 1rem;
`;

export const ModalContainer = styled.div`
    background-color: rgba(17, 12, 41, 0.85);
    backdrop-filter: blur(16px);
    border-radius: 1rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid rgba(150, 185, 249, 0.2);

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(30, 20, 70, 0.2);
        border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(150, 185, 249, 0.3);
        border-radius: 8px;
    }
`;

export const ModalContent = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const ModalTitle = styled.h2.attrs({
    className: "fluid-type-2",
})`
    color: var(--color-text-light);
    font-weight: 600;
`;

export const ModalDescription = styled.p.attrs({
    className: "fluid-type-0",
})`
    color: rgba(255, 255, 255, 0.8);
`;

export const CookieCategory = styled.div`
    background-color: rgba(30, 20, 70, 0.3);
    border-radius: 0.75rem;
    padding: 1.25rem;
    border: 1px solid rgba(150, 185, 249, 0.15);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
`;

export const CategoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
`;

export const CategoryTitle = styled.h3.attrs({
    className: "fluid-type-1",
})`
    color: var(--color-text-light);
    font-weight: 600;
`;

export const AlwaysActiveTag = styled.span.attrs({
    className: "fluid-type--1",
})`
    background-color: rgba(150, 185, 249, 0.2);
    color: var(--color-text-light);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-weight: 500;
`;

export const CategoryDescription = styled.p.attrs({
    className: "fluid-type-0",
})`
    color: rgba(255, 255, 255, 0.7);
`;

export const PrivacyText = styled.p.attrs({
    className: "fluid-type-0",
})`
    color: rgba(255, 255, 255, 0.7);

    a {
        color: var(--color-accent-mihai);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(150, 185, 249, 0.2);
`;

export const ToggleSwitch = styled.label`
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
`;

export const ToggleInput = styled.input`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
`;

export const ToggleSlider = styled.div`
    width: 2.75rem;
    height: 1.5rem;
    background-color: rgba(75, 85, 99, 0.5);
    transition: 0.3s;
    border-radius: 1rem;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 0.125rem;
        left: 0.125rem;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background-color: white;
        transition: 0.3s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    ${ToggleInput}:checked + & {
        background-color: var(--color-accent-mihai);
    }

    ${ToggleInput}:checked + &::after {
        transform: translateX(1.25rem);
    }

    ${ToggleInput}:focus-visible + & {
        box-shadow: 0 0 0 2px rgba(150, 185, 249, 0.5);
    }
`;

export const SettingsButton = styled.button`
    position: fixed;
    bottom: 1.5rem;
    left: 1.5rem;
    z-index: 40;
    background-color: rgba(17, 12, 41, 0.75);
    color: var(--color-text-light);
    padding: 0.75rem;
    border-radius: 50%;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(150, 185, 249, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-3px) rotate(15deg);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        background-color: rgba(150, 185, 249, 0.4);
    }

    svg {
        width: 1.5rem;
        height: 1.5rem;
    }
`;
