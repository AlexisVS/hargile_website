"use client"

import React, {memo} from "react";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import AnimatedMenuCircle from "@/components/navigation/button/animated-menu-circle";
import AnimatedMenuIcon from "@/components/navigation/button/animated-menu-icon";
import {useMenuCrashState} from "@/hooks/useMenuCrashState";
import {BoxStyled} from "@/components/navigation/button/navbar-button.styled";


const NavbarButton = ({width = '2vw'}) => {
    const {isOpen, toggleMenu} = useSiteNavigation();
    const menuIconAnimationTime = 300;
    const {crashTriggered, handleCrashComplete} = useMenuCrashState(isOpen);

    return (
        <BoxStyled onClick={toggleMenu} aria-label="Menu button">
            <AnimatedMenuCircle
                width={width}
                menuIconAnimationTime={menuIconAnimationTime}
                crashTriggered={crashTriggered}
                isOpen={isOpen}
            />
            <AnimatedMenuIcon
                width={width}
                menuIconAnimationTime={menuIconAnimationTime}
                onCrashComplete={handleCrashComplete}
                isOpen={isOpen}
            />
            {/*<AnimatedMenuIconCircle*/}
            {/*    menuIconAnimationTime={menuIconAnimationTime}*/}
            {/*    width={width}*/}
            {/*    isOpen={isOpen}*/}
            {/*/>*/}
            {/*<CrossRippleEffect*/}
            {/*    crashTriggered={crashTriggered}*/}
            {/*    isOpen={isOpen}*/}
            {/*    width={width}*/}
            {/*/>*/}
        </BoxStyled>
    )
}

export default memo(NavbarButton);
