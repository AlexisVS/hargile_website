import styled from "styled-components";

export const AnimatedMenuIconCircleStyled = styled.svg`
    width: calc(${({$width}) => $width} * 1.8);
    min-width: calc(30px * 1.8);
    position: absolute;
    overflow: initial;
    transition: width 200ms ease-in-out;
    z-index: 99;
    transform: translateZ(0);
    backface-visibility: hidden;
    shape-rendering: geometricPrecision;
    will-change: transform;

    .open {
        animation: growth 1080ms ease-in
    }

    @keyframes growth {
        0% {
            opacity: 0;
        }
        10% {
            transform: scale(1) translateX(0%) translateY(0%) translateZ(0);
        }
        35% {
            transform: scale(1.5) translateX(-16.5%) translateY(-16.5%) translateZ(0);
        }
        50% {
            transform: scale(1) translateX(0%) translateY(0%) translateZ(0);
        }
        90% {
            opacity: 1;
        }
    }

    circle {
        transform: translateZ(0);
        backface-visibility: hidden;
        shape-rendering: geometricPrecision;
        fill: none;
        stroke: white;
        stroke-width: 2;
        stroke-dasharray: 157;
        stroke-dashoffset: ${({$isOpen}) => ($isOpen ? "0" : "157")};
        transition: ${({$shouldAnimate}) => ($shouldAnimate ? "stroke-dashoffset 1s 550ms ease-in-out stroke-dasharray 1s 550ms ease-in-out" : "none")};
        will-change: transform;
    }
`
