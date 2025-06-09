import styled from "styled-components";

export const CookieBanner = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(17, 12, 41, 0.95);
    backdrop-filter: blur(12px);
    color: var(--color-text-light);
    z-index: 100000;
    border-top: 1px solid rgba(147, 51, 234, 0.2);
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.25);
`;

export const BannerContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

export const BannerContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

export const BannerTitle = styled.h2.attrs({
    className: "fluid-type-1-5",
})`
    font-weight: 600;
    color: var(--color-text-light);
`;

export const BannerDescription = styled.p.attrs({
    className: "fluid-type-0",
})`
    color: rgba(255, 255, 255, 0.7);
    max-width: 70ch;
`;

export const ButtonGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`;

export const Button = styled.button`
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:focus-visible {
        outline: 2px solid var(--color-accent-mihai);
        outline-offset: 2px;
    }
`;

export const PrimaryButton = styled(Button)`
    background: linear-gradient(135deg, var(--color-accent-mihai) 0%, color-mix(in srgb, var(--color-accent-mihai) 70%, #4f46e5) 100%);
    color: var(--color-text-light);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.25);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(147, 51, 234, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const SecondaryButton = styled(Button)`
    background-color: rgba(75, 85, 99, 0.3);
    color: var(--color-text-light);
    border: 1px solid rgba(147, 51, 234, 0.2);

    &:hover {
        background-color: rgba(75, 85, 99, 0.5);
    }
`;

export const TertiaryButton = styled(Button)`
    background-color: rgba(55, 65, 81, 0.3);
    color: var(--color-text-light);

    &:hover {
        background-color: rgba(55, 65, 81, 0.5);
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
    border: 1px solid rgba(147, 51, 234, 0.2);

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(30, 20, 70, 0.2);
        border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(147, 51, 234, 0.3);
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
    border: 1px solid rgba(147, 51, 234, 0.15);
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
    background-color: rgba(147, 51, 234, 0.2);
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
    border-top: 1px solid rgba(147, 51, 234, 0.2);
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
        box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.5);
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
    border: 1px solid rgba(147, 51, 234, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-3px) rotate(15deg);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        background-color: rgba(147, 51, 234, 0.4);
    }

    svg {
        width: 1.5rem;
        height: 1.5rem;
    }
`;
