"use client";

import {useEffect, useRef, useState} from 'react';

export const useNavigationVisibility = (isOpen) => {
    const [menuItemDisplayed, setMenuItemDisplayed] = useState(false);
    const [navigationVisible, setNavigationVisible] = useState(false);
    const [backgroundActive, setBackgroundActive] = useState(false);
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

        // REMOVED: document.body.style.overflow = isOpen ? "hidden" : "auto";
        // Let the ScrollManager handle this instead

        if (isOpen) {
            setMenuItemDisplayed(true);
            setNavigationVisible(true);
            setBackgroundActive(true);
        } else {
            // Calculate timing based on actual number of menu items
            const menuItems = document.querySelectorAll('.navbar__navigation__item');
            const totalItems = menuItems.length;
            const staggerDelay = 60;
            const animationDuration = 300;
            
            // Last item starts at (totalItems-1) * staggerDelay and takes animationDuration to complete
            const totalMenuItemsAnimationTime = (totalItems - 1) * staggerDelay + animationDuration;
            
            // Keep background colors/blur active until menu items are gone
            const backgroundTimer = setTimeout(() => {
                setBackgroundActive(false);
            }, totalMenuItemsAnimationTime + 50);

            // Then start fading the background opacity
            const visibilityTimer = setTimeout(() => {
                setNavigationVisible(false);
            }, totalMenuItemsAnimationTime + 100);

            const hideTimer = setTimeout(() => {
                setMenuItemDisplayed(false);
            }, totalMenuItemsAnimationTime + 1000);

            timers.current.push(backgroundTimer, visibilityTimer, hideTimer);
        }
    }, [isOpen]);

    return {menuItemDisplayed, navigationVisible, backgroundActive};
};
