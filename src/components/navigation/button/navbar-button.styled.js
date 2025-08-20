import styled from "styled-components";

export const BoxStyled = styled.button`
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    pointer-events: all;
    z-index: 100;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    backdrop-filter: blur(10px);
    transition: all 0.15s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
    }
    
    &:active {
        transform: scale(0.98);
    }
`
