import styled, {keyframes} from "styled-components";
import {DOT_COLORS} from "./constants";
import {Link} from "@/i18n/navigation";

export const orbit1 = keyframes`
    0% {
        transform: rotate(0deg) translate(110px);
    }
    100% {
        transform: rotate(360deg) translate(110px);
    }
`;

export const orbit2 = keyframes`
    0% {
        transform: rotate(90deg) translate(110px);
    }
    100% {
        transform: rotate(450deg) translate(110px);
    }
`;

export const orbit3 = keyframes`
    0% {
        transform: rotate(180deg) translate(110px);
    }
    100% {
        transform: rotate(540deg) translate(110px);
    }
`;

export const orbit4 = keyframes`
    0% {
        transform: rotate(270deg) translate(110px);
    }
    100% {
        transform: rotate(630deg) translate(110px);
    }
`;

export const ButtonContainer = styled.div`
    position: relative;
    width: 300px;
    height: 300px;
    margin: 40px auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledLink = styled(Link).attrs({
    className: "fluid-type-0-5",
})`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    text-decoration: none;
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    backdrop-filter: blur(14px);
    border: 2px solid rgba(212, 175, 55, 0.7);
    color: var(--color-text);
    font-weight: 450;
    cursor: pointer;
    z-index: 5;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 999px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;

    &:hover {
        border-color: rgba(212, 175, 55, 0.9);
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
    }
`;

// Base de toutes les planètes
export const Planet = styled.div`
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
`;


export const Planet1 = styled(Planet)`
    background-color: ${DOT_COLORS.topLeft};
    box-shadow: 0 0 25px 5px ${DOT_COLORS.topLeft};
    animation: ${orbit1} 15s linear infinite;
`;

export const Planet2 = styled(Planet)`
    background-color: ${DOT_COLORS.bottomLeft};
    box-shadow: 0 0 25px 5px ${DOT_COLORS.bottomLeft};
    animation: ${orbit2} 25s linear infinite;
`;

export const Planet3 = styled(Planet)`
    background-color: ${DOT_COLORS.topRight};
    box-shadow: 0 0 25px 5px ${DOT_COLORS.topRight};
    animation: ${orbit3} 20s linear infinite;
`;

export const Planet4 = styled(Planet)`
    background-color: ${DOT_COLORS.bottomRight};
    box-shadow: 0 0 25px 5px ${DOT_COLORS.bottomRight};
    animation: ${orbit4} 30s linear infinite;
`;
