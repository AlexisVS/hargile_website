"use client";

import {useEffect, useReducer, useRef} from 'react';

const initialState = {
    menuItemDisplayed: false,
    navigationVisible: false,
    backgroundActive: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'OPEN':
            return {menuItemDisplayed: true, navigationVisible: true, backgroundActive: true};
        case 'HIDE_BACKGROUND':
            return {...state, backgroundActive: false};
        case 'HIDE_NAVIGATION':
            return {...state, navigationVisible: false};
        case 'HIDE_ITEMS':
            return {...state, menuItemDisplayed: false};
        default:
            return state;
    }
};

export const useNavigationVisibility = (isOpen) => {
    const [state, dispatch] = useReducer(reducer, initialState);
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

        // Prevent body scroll but allow menu to scroll when menu is open
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
            document.body.style.top = `-${window.scrollY}px`;
            dispatch({type: 'OPEN'});
        } else {
            const scrollY = document.body.style.top;
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.top = "";
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }

            // Calculate timing based on actual number of menu items
            const menuItems = document.querySelectorAll('.navbar__navigation__item');
            const totalItems = menuItems.length;
            const staggerDelay = 60;
            const animationDuration = 300;

            // Last item starts at (totalItems-1) * staggerDelay and takes animationDuration to complete
            const totalMenuItemsAnimationTime = (totalItems - 1) * staggerDelay + animationDuration;

            // Keep background colors/blur active until menu items are gone
            const backgroundTimer = setTimeout(() => {
                dispatch({type: 'HIDE_BACKGROUND'});
            }, totalMenuItemsAnimationTime + 50);

            // Then start fading the background opacity
            const visibilityTimer = setTimeout(() => {
                dispatch({type: 'HIDE_NAVIGATION'});
            }, totalMenuItemsAnimationTime + 100);

            const hideTimer = setTimeout(() => {
                dispatch({type: 'HIDE_ITEMS'});
            }, totalMenuItemsAnimationTime + 1000);

            timers.current.push(backgroundTimer, visibilityTimer, hideTimer);
        }
    }, [isOpen]);

    return state;
};
