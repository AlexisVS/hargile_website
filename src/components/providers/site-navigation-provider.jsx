"use client";

import {createContext, useCallback, useContext, useState} from "react";

const SiteNavigationContext = createContext(null);

export const SiteNavigationProvider = ({children}) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsOpen(prevState => !prevState);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <SiteNavigationContext.Provider
            value={{
                currentSection,
                setCurrentSection,
                isOpen,
                setIsOpen,
                toggleMenu,
                closeMenu
            }}>
            {children}
        </SiteNavigationContext.Provider>
    );
};

export const useSiteNavigation = () => {
    const context = useContext(SiteNavigationContext);
    if (!context) {
        throw new Error("useSiteNavigation must be used within a SiteNavigationProvider");
    }
    return context;
};
