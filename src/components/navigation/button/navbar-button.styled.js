import styled from "styled-components";

export const BoxStyled = styled.button`
    position: relative;
    /* Borderless, smaller hit area. Kept square and the icon flex-centered so the
       bars sit dead-centre — no circle/backdrop to throw the optical centre off. */
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    pointer-events: all;
    z-index: 1003;
    background: transparent;
    border: none;
    border-radius: 8px;
    transition: opacity 0.15s ease, transform 0.15s ease;

    &:hover {
        opacity: 0.7;
    }

    &:active {
        transform: scale(0.94);
    }
`
