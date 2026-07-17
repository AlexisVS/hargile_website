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

            // Close choreography: the panel's opacity fade (0.55s, see
            // NavbarNavigation) starts while the items are still staggering
            // out, so everything melts away as one motion. The gradient
            // background is NOT transitionable (gradient → transparent snaps),
            // so it only gets removed once the panel is fully invisible —
            // removing it earlier was the visible "awkward" pop.
            const PANEL_FADE_START = 150;
            const PANEL_FADE_DURATION = 550;

            const visibilityTimer = setTimeout(() => {
                dispatch({type: 'HIDE_NAVIGATION'});
            }, PANEL_FADE_START);

            const backgroundTimer = setTimeout(() => {
                dispatch({type: 'HIDE_BACKGROUND'});
            }, PANEL_FADE_START + PANEL_FADE_DURATION + 100);

            const hideTimer = setTimeout(() => {
                dispatch({type: 'HIDE_ITEMS'});
            }, PANEL_FADE_START + PANEL_FADE_DURATION + 100);

            timers.current.push(backgroundTimer, visibilityTimer, hideTimer);
        }
    }, [isOpen]);

    return state;
};
