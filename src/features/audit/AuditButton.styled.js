import styled from "styled-components";

export const AuditButtonStyled = styled.button.attrs({
    className: 'fluid-type-0-5'
})`
    cursor: pointer;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(6px);
    position: fixed;
    bottom: 24px;
    right: 24px;
    height: max-content;
    padding: 12px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    border: 1px solid var(--color-accent-blue-planet);
    gap: 1rem;
    z-index: 100;

    .text-side {
        color: var(--color-accent-blue-planet);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .image-side {
        width: 75px;
        height: 75px;
    }
`
