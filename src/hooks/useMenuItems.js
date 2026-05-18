"use client"

import {useEffect, useRef} from 'react';
import {animate, stagger} from 'motion/react';

// easeOutQuart and easeInQuart cubic-bezier equivalents
const EASE_OUT_QUART = [0.25, 1, 0.5, 1];
const EASE_IN_QUART = [0.5, 0, 0.75, 0];

export const useMenuItems = (isOpen) => {
    const menuItemsAnimation = useRef(null);

    useEffect(() => {
        const items = document.querySelectorAll('.navbar__navigation__item');
        if (items.length === 0) return;

        // Cancel any in-flight animation before starting a new one
        if (menuItemsAnimation.current) {
            menuItemsAnimation.current.stop?.();
            menuItemsAnimation.current = null;
        }

        if (isOpen) {
            // Reset starting state (no animation), then fade in with stagger
            items.forEach((el) => {
                el.style.transform = 'translateY(20px)';
                el.style.opacity = '0';
            });

            menuItemsAnimation.current = animate(
                items,
                {transform: 'translateY(0px)', opacity: 1},
                {
                    duration: 0.4,
                    ease: EASE_OUT_QUART,
                    delay: stagger(0.1, {startDelay: 0.3}),
                },
            );
        } else {
            // Closing: reverse order — last item disappears first
            menuItemsAnimation.current = animate(
                items,
                {transform: 'translateY(20px)', opacity: 0},
                {
                    duration: 0.3,
                    ease: EASE_IN_QUART,
                    delay: stagger(0.06, {from: 'last'}),
                },
            );
        }

        return () => {
            if (menuItemsAnimation.current) {
                menuItemsAnimation.current.stop?.();
            }
        };
    }, [isOpen]);
};
