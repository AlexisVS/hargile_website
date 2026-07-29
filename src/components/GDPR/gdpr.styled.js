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
    padding: 1.3rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        /* Tall enough that the bar fully covers the floating contact button
           (fixed bottom: 24px, ~45px tall) while it's open — the banner stacks
           above it, so the button shouldn't peek out over the top edge. */
        padding: 1.5rem 2rem;
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
    background-color: rgba(4, 5, 10, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
    padding: 1rem;
`;

/* Header and footer stay put; only ModalBody scrolls. The whole subtree carries
   data-lenis-prevent (set on the overlay in GDPRManager) — without it Lenis
   swallows the wheel event at the root and scrolls the page behind the modal. */
export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: rgba(10, 10, 18, 0.94);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 0.875rem;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
    max-width: 620px;
    width: 100%;
    max-height: min(88vh, 46rem);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ModalHeader = styled.div`
    padding: 1.6rem 1.75rem 1.15rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    flex-shrink: 0;
`;

export const ModalBody = styled.div`
    padding: 1.25rem 1.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    overflow-y: auto;
    /* Stops the scroll from chaining to the page once the list bottoms out. */
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.16);
        border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.26);
    }
`;

export const ModalTitle = styled.h2`
    font-size: 1.1rem;
    line-height: 1.3;
    color: var(--color-text-light);
    font-weight: 600;
    text-shadow: none;
`;

export const ModalDescription = styled.p`
    font-size: 13.5px;
    font-weight: 300;
    line-height: 1.5;
    color: rgba(237, 237, 237, 0.7);
    text-shadow: none;
    margin: 0;
`;

export const CookieCategory = styled.div`
    background-color: rgba(255, 255, 255, 0.025);
    border-radius: 0.625rem;
    padding: 0.9rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    transition: border-color 0.2s ease, background-color 0.2s ease;

    &:hover {
        border-color: rgba(150, 185, 249, 0.3);
        background-color: rgba(255, 255, 255, 0.04);
    }
`;

export const CategoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.4rem;
`;

export const CategoryTitle = styled.h3`
    font-size: 14px;
    line-height: 1.3;
    color: var(--color-text-light);
    font-weight: 500;
    text-shadow: none;
`;

export const AlwaysActiveTag = styled.span`
    font-size: 11px;
    letter-spacing: 0.02em;
    color: rgba(237, 237, 237, 0.65);
    padding: 0.2rem 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 1rem;
    font-weight: 400;
    white-space: nowrap;
`;

export const CategoryDescription = styled.p`
    font-size: 13px;
    font-weight: 300;
    line-height: 1.5;
    color: rgba(237, 237, 237, 0.6);
    text-shadow: none;
    margin: 0;
`;

export const PrivacyText = styled.p`
    font-size: 13px;
    font-weight: 300;
    line-height: 1.5;
    color: rgba(237, 237, 237, 0.6);
    text-shadow: none;
    margin: 0.25rem 0 0;

    a {
        color: #96b9f9;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const ModalFooter = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.15rem 1.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
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
    background-color: rgba(10, 10, 18, 0.8);
    color: rgba(237, 237, 237, 0.75);
    padding: 0.65rem;
    border-radius: 50%;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;

    &:hover {
        color: var(--color-text-light);
        border-color: rgba(150, 185, 249, 0.45);
        background-color: rgba(255, 255, 255, 0.06);
    }

    &:focus-visible {
        outline: 2px solid rgba(150, 185, 249, 0.7);
        outline-offset: 2px;
    }

    svg {
        width: 1.25rem;
        height: 1.25rem;
    }
`;
