"use client";

import {useEffect, useRef, useState} from 'react';

export const useNavigationVisibility = (isOpen) => {
    const [menuItemDisplayed, setMenuItemDisplayed] = useState(false);
    const [navigationVisible, setNavigationVisible] = useState(false);
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
        } else {
            // Calculate timing based on actual number of menu items
            const menuItems = document.querySelectorAll('.navbar__navigation__item');
            const totalItems = menuItems.length;
            const staggerDelay = 60;
            const animationDuration = 300;
            
            // Last item starts at (totalItems-1) * staggerDelay and takes animationDuration to complete
            const totalMenuItemsAnimationTime = (totalItems - 1) * staggerDelay + animationDuration;
            
            // Keep background fully visible until ALL menu items are completely gone
            const visibilityTimer = setTimeout(() => {
                setNavigationVisible(false);
            }, totalMenuItemsAnimationTime + 100); // Wait extra time to ensure last item is fully gone

            const hideTimer = setTimeout(() => {
                setMenuItemDisplayed(false);
            }, totalMenuItemsAnimationTime + 700); // Background fade duration + cleanup

            timers.current.push(visibilityTimer, hideTimer);
        }
    }, [isOpen]);

    return {menuItemDisplayed, navigationVisible};
};
