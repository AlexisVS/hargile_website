"use client"

import React, {memo} from "react";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import AnimatedMenuCircle from "@/components/navigation/button/animated-menu-circle";
import AnimatedMenuIcon from "@/components/navigation/button/animated-menu-icon";
import {useMenuCrashState} from "@/hooks/useMenuCrashState";
import {BoxStyled} from "@/components/navigation/button/navbar-button.styled";


const NavbarButton = ({width = '2vw'}) => {
    const {isOpen, toggleMenu} = useSiteNavigation();

    return (
        <BoxStyled onClick={toggleMenu} aria-label="Menu button">
            <AnimatedMenuIcon
                width={width}
                menuIconAnimationTime={200}
                onCrashComplete={() => {}}
                isOpen={isOpen}
            />
        </BoxStyled>
    )
}

export default memo(NavbarButton);
