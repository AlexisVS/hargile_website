import styled from "styled-components";

export const SvgCircle = styled.svg`
    width: ${({$width}) => $width ? `calc(${$width} * 1.8)` : 'calc(30px * 1.8)'};
    height: ${({$width}) => $width ? `calc(${$width} * 1.8)` : 'calc(30px * 1.8)'};
    min-width: calc(30px * 1.8);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateZ(0) translate(-50%, -50%) ${({$isOpen}) => $isOpen ? 'scale(1)' : 'scale(1)'};
    overflow: visible;
    z-index: 99;
    pointer-events: none;
    backface-visibility: hidden;
    shape-rendering: geometricPrecision;
    will-change: transform;


    &.closed {
        transform: translateZ(0) translate(-50%, -50%) scale(1);
        transition: transform 300ms ease-in;
    }
`;

export const AnimatedCircle = styled.circle`
    fill: white;
    transform: translateZ(0);
    backface-visibility: hidden;
    shape-rendering: geometricPrecision;
    transition: r 800ms ease-in, opacity 600ms ease-in-out;
    r: ${({$r}) => $r}px;
    opacity: ${({$opacity}) => $opacity};
    will-change: transform;
`;

export const Ripple = styled.circle`
    transform: translateZ(0);
    backface-visibility: hidden;
    shape-rendering: geometricPrecision;
    fill: rgba(255, 255, 255, 0.3);
    transform-origin: center;
    opacity: ${({$opacity}) => $opacity};
    r: ${({$r}) => $r}px;
    animation: rippleEffect 1000ms ease-out;
    will-change: transform;


    @keyframes rippleEffect {
        0% {
            opacity: 0.7;
            r: 150;
        }
        100% {
            opacity: 0;
            r: 300;
        }
    }
`;
