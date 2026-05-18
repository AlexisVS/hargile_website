"use client"

import React, {memo, useEffect, useReducer, useRef} from "react";
import {AnimatedCircle, Ripple, SvgCircle} from "@/components/navigation/button/animated-menu-circle.styled";


const INITIAL_STATE = {
    radius: 150,
    opacity: 0,
    showRipple: false,
    gaussianBlur: 2,
};

const reducer = (state, patch) => ({...state, ...patch});

const AnimatedMenuCircle = ({width, menuIconAnimationTime, crashTriggered = false, isOpen}) => {
    const timersRef = useRef([]);
    const [circleState, dispatch] = useReducer(reducer, INITIAL_STATE);

    const growDelay = crashTriggered ? 100 : menuIconAnimationTime;

    useEffect(() => {
        const clearAll = () => {
            timersRef.current.forEach((t) => clearTimeout(t));
            timersRef.current = [];
        };
        clearAll();

        if (isOpen && crashTriggered) {
            dispatch({showRipple: true, opacity: 1});

            timersRef.current.push(setTimeout(() => {
                dispatch({radius: 30000, gaussianBlur: 5});
            }, 900));

            timersRef.current.push(setTimeout(() => {
                dispatch({showRipple: false});
            }, 900));
        } else if (isOpen) {
            dispatch({opacity: 0});

            timersRef.current.push(setTimeout(() => {
                dispatch({opacity: 1});
                timersRef.current.push(setTimeout(() => {
                    dispatch({radius: 30000});
                }, 550));
                timersRef.current.push(setTimeout(() => {
                    dispatch({gaussianBlur: 5});
                }, 750));
            }, 40));
        } else {
            dispatch({radius: 150, gaussianBlur: 2});

            timersRef.current.push(setTimeout(() => {
                dispatch({opacity: 0});
            }, 150));
        }

        return clearAll;
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
                            in="SourceAlpha"
                            stdDeviation={circleState.gaussianBlur}
                            result="blur"
                        />
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(255, 255, 255, 1)"/>
                    </filter>
                </defs>

                <AnimatedCircle
                    cx="150"
                    cy="150"
                    $r={circleState.radius}
                    $opacity={circleState.opacity}
                    filter="url(#glowEffect)"
                />
                {circleState.showRipple && (
                    <Ripple
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
