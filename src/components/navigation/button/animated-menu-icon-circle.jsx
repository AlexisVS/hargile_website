"use client"

import React, {memo, useEffect, useState} from "react";
import {AnimatedMenuIconCircleStyled} from "@/components/navigation/button/animated-menu-icon-circle.styled";


const AnimatedMenuIconCircle = ({width, menuIconAnimationTime, isOpen}) => {
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        setShouldAnimate(true);
    }, []);

    return (
        <AnimatedMenuIconCircleStyled
            viewBox="0 0 54 54"
            $width={width}
            $menuIconAnimationTime={menuIconAnimationTime}
            $isOpen={isOpen}
            $shouldAnimate={shouldAnimate}
        >
            <filter id="glowe" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(255, 255, 255, 0.6)"/>
            </filter>
            <circle className={isOpen ? 'open' : ''} cx="27" cy="27" r="25" filter={'url(#glowe)'}/>
            <circle className={isOpen ? 'open' : ''} cx="27" cy="27" r="25"/>
        </AnimatedMenuIconCircleStyled>
    )
}

export default memo(AnimatedMenuIconCircle);
