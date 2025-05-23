"use client"

import React, {memo, useEffect, useRef} from "react";
import {ContentStyled, MenuBarStyled} from "@/components/navigation/button/animated-menu-icon.styled";


const AnimatedMenuIcon = ({menuIconAnimationTime, width = '2.5vw', onCrashComplete, isOpen}) => {
    const animationRef = useRef(null);

    useEffect(() => {
        if (isOpen && typeof onCrashComplete === 'function') {
            const totalAnimationTime = menuIconAnimationTime * 3;
            const crashTime = totalAnimationTime * 0.7;
            const timer = setTimeout(() => {
                onCrashComplete();
            }, crashTime);

            return () => clearTimeout(timer);
        }
    }, [isOpen, menuIconAnimationTime, onCrashComplete]);

    return (
        <ContentStyled
            $width={width}
            $menuIconAnimationTime={menuIconAnimationTime}
            ref={animationRef}
        >
            <div className={`menu-bar-container ${isOpen ? "open" : ""}`}>
                <MenuBarStyled className="bar-top" $width="100%" $menuIconAnimationTime={menuIconAnimationTime}/>
                <MenuBarStyled className="bar-middle" $width="100%" $menuIconAnimationTime={menuIconAnimationTime}/>
                <MenuBarStyled className="bar-bottom" $width="100%" $menuIconAnimationTime={menuIconAnimationTime}/>
            </div>
        </ContentStyled>
    )
}

export default memo(AnimatedMenuIcon);
