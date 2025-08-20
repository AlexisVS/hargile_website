"use client";

import {createContext, useContext, useEffect, useState} from 'react';
import {Link, useRouter} from "@/i18n/navigation";

// Simple transition timing variables
export const TRANSITION_DURATION = 150; // milliseconds
export const BLACK_SCREEN_DURATION = 50; // milliseconds

const PageTransitionContext = createContext({
    isTransitioning: false,
    transitionState: 'idle', // 'idle', 'exiting', 'entering'
    setIsTransitioning: () => {
    },
    setTransitionState: () => {
    },
    timing: {
        TRANSITION_DURATION,
        BLACK_SCREEN_DURATION,
    }
});

export const usePageTransition = () => {
    return useContext(PageTransitionContext);
};

export const PageTransitionProvider = ({children}) => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionState, setTransitionState] = useState('idle');

    return (
        <PageTransitionContext.Provider value={{
            isTransitioning,
            transitionState,
            setIsTransitioning,
            setTransitionState
        }}>
            {children}
        </PageTransitionContext.Provider>
    );
};

export const TransitionLink = ({href, children, className, onClick, ...props}) => {
    const router = useRouter();
    const {setIsTransitioning, setTransitionState} = usePageTransition();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleClick = (e) => {
        if (!isMounted) return;

        e.preventDefault();

        if (onClick) {
            onClick(e);
        }

        // Start exit animation
        setIsTransitioning(true);
        setTransitionState('exiting');

        // Wait for exit animation to complete before navigation
        setTimeout(() => {
            router.push(href);

            // Add a delay to show black screen
            setTimeout(() => {
                setTransitionState('entering');

                // Reset states after entry completes
                setTimeout(() => {
                    setIsTransitioning(false);
                    setTransitionState('idle');
                }, TRANSITION_DURATION);
            }, BLACK_SCREEN_DURATION);
        }, TRANSITION_DURATION);
    };

    if (!isMounted) {
        return (
            <Link href={href} className={className} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <a href={href} onClick={handleClick} className={className} {...props}>
            {children}
        </a>
    );
};
