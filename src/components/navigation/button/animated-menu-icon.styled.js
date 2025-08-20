import styled from "styled-components";

export const ContentStyled = styled.div`
    padding: 0;
    width: 22px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    .menu-bar-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .menu-bar-container.open .bar-top {
        transform: translateY(9px) rotate(45deg);
    }

    .menu-bar-container.open .bar-middle {
        opacity: 0;
        transform: scaleX(0);
    }

    .menu-bar-container.open .bar-bottom {
        transform: translateY(-9px) rotate(-45deg);
    }
`;

export const MenuBarStyled = styled.div`
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1px;
    transition: all 0.15s ease;
    transform-origin: center;
`;
