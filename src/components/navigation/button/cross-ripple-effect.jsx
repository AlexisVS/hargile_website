"use client"

import React, {memo, useEffect, useRef} from "react";
import {CrossRippleContainer} from "@/components/navigation/button/cross-ripple-effect.styled";


export const CrossRippleEffect = ({width = '5.5vw', crashTriggered = false, isOpen}) => {
    const containerRef = useRef(null);
    const rippleCountRef = useRef(0);
    const animationsRef = useRef([]);
    const baseWidth = typeof width === 'string' ?
        parseInt(width.replace(/[^\d.]/g, '')) * 5 : 12; // Convert to numeric value

    useEffect(() => {
        if (crashTriggered && isOpen && containerRef.current) {
            createCrossRipples();
        }

        return () => {
            animationsRef.current.forEach(animation => {
                if (animation) {
                    animation.cancel();
                }
            });
            animationsRef.current = [];
        };
    }, [crashTriggered, isOpen, baseWidth]);

    const createCrossRipples = () => {
        if (!containerRef.current) return;

        // Clear any existing ripples
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        rippleCountRef.current = 2;
        animationsRef.current = [];

        // Create 3 sets of cross ripples with different delays
        createRippleSet(2);
    };

    const createRippleSet = (setIndex) => {
        if (!containerRef.current) return;

        // Create ripples for both diagonals of the cross
        const ripple1 = document.createElement('div');
        ripple1.className = `diagonal-ripple diagonal-ripple-${rippleCountRef.current}`;
        containerRef.current.appendChild(ripple1);

        const ripple2 = document.createElement('div');
        ripple2.className = `diagonal-ripple diagonal-ripple-${rippleCountRef.current + 1}`;
        containerRef.current.appendChild(ripple2);

        // Style the ripples
        [ripple1, ripple2].forEach((ripple, index) => {
            const rotation = index === 0 ? 45 : 135;
            ripple.style.position = 'absolute';
            ripple.style.top = '50%';
            ripple.style.left = '50%';
            ripple.style.width = `${baseWidth * 5}px`;
            ripple.style.height = `${Math.max(2, baseWidth * 0.08)}px`;
            ripple.style.background = 'rgba(255, 255, 255, 0.1)';
            ripple.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) translateZ(0)`;
            ripple.style.transformOrigin = 'center';
            ripple.style.opacity = '0.3';
            ripple.style.borderRadius = `${Math.max(1, baseWidth * 0.04)}px`;
            ripple.style.boxShadow = '0 0 0px 0px rgba(255, 255, 255, 1)';
            ripple.style.backfaceVisibility = 'hidden';
            ripple.style.willChange = 'transform';
            ripple.setAttribute('shape-rendering', 'geometricPrecision')

            // Create and start the animation
            const animation = ripple.animate([
                {
                    opacity: 0.4,
                    boxShadow: '0 0 1px 2px rgba(255, 255, 255, 1)'
                },
                {
                    opacity: 1,
                    boxShadow: '0 0 20px calc(0.3vh) rgba(255, 255, 255, 0.2)'
                }
            ], {
                duration: 300,
                easing: 'cubic-bezier(0.215, 0.65, 0.355, 1)',
                fill: 'forwards',
                delay: 1
            });

            animationsRef.current.push(animation);

            animation.onfinish = () => {
                if (containerRef.current && containerRef.current.contains(ripple)) {
                    containerRef.current.removeChild(ripple);
                }
            };

            rippleCountRef.current += 1
        });
    };

    return (
        <CrossRippleContainer ref={containerRef}/>
    );
};

export default memo(CrossRippleEffect);
