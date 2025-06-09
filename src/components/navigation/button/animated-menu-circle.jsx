"use client"

import React, {memo, useEffect, useRef} from "react";
import {AnimatedCircle, Ripple, SvgCircle} from "@/components/navigation/button/animated-menu-circle.styled";


const AnimatedMenuCircle = ({width, menuIconAnimationTime, crashTriggered = false, isOpen}) => {
    const circleRef = useRef(null);
    const rippleRef = useRef(null);
    const filterRef = useRef(null);
    const timerRef = useRef(null);

    const circleState = useRef({
        radius: 150,
        opacity: 0,
        showRipple: false,
        gaussianBlur: 2,
    });

    const growDelay = crashTriggered ? 100 : menuIconAnimationTime;

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const state = circleState.current;

        if (isOpen && crashTriggered) {
            state.showRipple = true;
            state.opacity = 1;

            if (circleRef.current) {
                circleRef.current.setAttribute('opacity', '1');
            }

            if (rippleRef.current) {
                rippleRef.current.style.display = 'block';
            }

            timerRef.current = setTimeout(() => {
                state.radius = 30000;
                state.gaussianBlur = 5;

                if (circleRef.current) {
                    circleRef.current.setAttribute('r', '30000');
                }

                if (filterRef.current) {
                    filterRef.current.setAttribute('stdDeviation', '5');
                }
            }, 900);

            setTimeout(() => {
                state.showRipple = false;
                if (rippleRef.current) {
                    rippleRef.current.style.display = 'none';
                }
            }, 900);
        } else if (isOpen) {
            state.opacity = 0;

            if (circleRef.current) {
                circleRef.current.setAttribute('opacity', '0');
            }

            timerRef.current = setTimeout(() => {
                state.opacity = 1;
                if (circleRef.current) {
                    circleRef.current.setAttribute('opacity', '1');
                }

                setTimeout(() => {
                    state.radius = 30000;
                    if (circleRef.current) {
                        circleRef.current.setAttribute('r', '30000');
                    }
                }, 550);

                setTimeout(() => {
                    state.gaussianBlur = 5;
                    if (filterRef.current) {
                        filterRef.current.setAttribute('stdDeviation', '5');
                    }
                }, 750);
            }, 40);
        } else {
            state.radius = 150;
            state.gaussianBlur = 2;

            if (circleRef.current) {
                circleRef.current.setAttribute('r', '150');
            }

            if (filterRef.current) {
                filterRef.current.setAttribute('stdDeviation', '2');
            }

            timerRef.current = setTimeout(() => {
                state.opacity = 0;
                if (circleRef.current) {
                    circleRef.current.setAttribute('opacity', '0');
                }
            }, 150);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isOpen, menuIconAnimationTime, crashTriggered]);

    return (
        <>
            <SvgCircle
                viewBox="0 0 300 300"
                $width={width}
                $growDelay={growDelay}
                $isOpen={isOpen}
                className={isOpen ? "open" : "closed"}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur
                            ref={filterRef}
                            in="SourceAlpha"
                            stdDeviation={circleState.current.gaussianBlur}
                            result="blur"
                        />
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(255, 255, 255, 1)"/>
                    </filter>
                </defs>

                <AnimatedCircle
                    ref={circleRef}
                    cx="150"
                    cy="150"
                    $r={circleState.current.radius}
                    $opacity={circleState.current.opacity}
                    filter="url(#glowEffect)"
                />
                {circleState.current.showRipple && (
                    <Ripple
                        ref={rippleRef}
                        cx="150"
                        cy="150"
                        $opacity={0.9}
                        $r={0}
                    />
                )}
            </SvgCircle>
        </>
    );
};

export default memo(AnimatedMenuCircle);
