"use client"

import {useEffect, useRef} from 'react';
import anime from 'animejs';

export const useMenuItems = (isOpen) => {
    const menuItemsAnimation = useRef(null);
    const timers = useRef([]);

    const clearTimers = () => {
        timers.current.forEach(timer => clearTimeout(timer));
        timers.current = [];
    };

    useEffect(() => {
        return () => clearTimers();
    }, []);

    useEffect(() => {
        clearTimers();

        if (isOpen) {
            anime.set('.navbar__navigation__item', {
                translateY: 20,
                opacity: 0
            });

            menuItemsAnimation.current = anime({
                targets: '.navbar__navigation__item',
                translateY: 0,
                opacity: 1,
                duration: 400,
                easing: 'easeOutQuart',
                delay: (el, i) => 300 + (i * 100)
            });
        } else {
            if (menuItemsAnimation.current) {
                menuItemsAnimation.current.pause();
            }

            // Reverse order closing - last item disappears first
            const menuItems = document.querySelectorAll('.navbar__navigation__item');
            const totalItems = menuItems.length;

            menuItemsAnimation.current = anime({
                targets: '.navbar__navigation__item',
                translateY: 20,
                opacity: 0,
                duration: 300,
                easing: 'easeInQuart',
                delay: (el, i) => (totalItems - 1 - i) * 60
            });
        }
    }, [isOpen]);
};
