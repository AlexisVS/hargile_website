"use client";

import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import NavbarButton from "@/components/navigation/button/navbar-button";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import {useRouter} from "@/i18n/navigation";
import {OptimizedImage} from "@/components/optimizedImage";
import {useMenuItems} from "@/hooks/useMenuItems";
import {useNavigationVisibility} from "@/hooks/useNavigationVisibility";
import {useTranslations} from "next-intl";
import LanguageSelector from "@/app/[locale]/components/language-selector/language-selector";
import {
    Brand,
    NavbarMenuButtons,
    NavbarNavigation,
    Spacer,
    StyledLink,
    StyledNavbar
} from "@/components/navigation/navbar.styled";
import {BLACK_SCREEN_DURATION, TRANSITION_DURATION, usePageTransition} from '@/components/TransitionLink';

const menuItems = [
    {path: '/services', id: 'services'},
    {path: '/about-us', id: 'our-dna'},
    {path: '/contact', id: 'contact'},
    {path: '/portfolio', id: 'portfolio'},
    {path: '/solutions/agves', id: 'agves'},
    {path: '/solutions/i-go', id: 'i-go'},
    {path: '/solutions/multipass', id: 'multipass'},
];

const Navbar = () => {
    const {isOpen, closeMenu} = useSiteNavigation();
    const router = useRouter();
    const navbarRef = useRef(null);
    const brandRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const t = useTranslations('components.menu');
    const {setIsTransitioning, setTransitionState} = usePageTransition();
    const [isMounted, setIsMounted] = useState(false);

    useMenuItems(isOpen);
    const {navigationVisible} = useNavigationVisibility(isOpen);

    useEffect(() => {
        setIsMounted(true);

        const updateNavbarHeight = () => {
            if (navbarRef.current) {
                const height = navbarRef.current.offsetHeight;
                setNavbarHeight(height);
                document.documentElement.style.setProperty('--navbar-height', `${height}px`);
            }
        };

        updateNavbarHeight();
        window.addEventListener('resize', updateNavbarHeight);

        return () => {
            window.removeEventListener('resize', updateNavbarHeight);
            setIsMounted(false);
        };
    }, []);


    const triggerHomeTransitionAnimation = useCallback((e) => {
        e.preventDefault();

        if (!isMounted) return;

        if (brandRef.current) {
            brandRef.current.classList.add('transition');

            setIsTransitioning(true);
            setTransitionState('exiting');

            if (isOpen) {
                closeMenu();
            }

            setTimeout(() => {
                router.push('/');

                setTimeout(() => {
                    setTransitionState('entering');

                    setTimeout(() => {
                        if (brandRef.current) {
                            brandRef.current.classList.remove('transition');
                        }
                        setIsTransitioning(false);
                        setTransitionState('idle');
                    }, TRANSITION_DURATION || 600);
                }, BLACK_SCREEN_DURATION || 400);
            }, TRANSITION_DURATION || 600);
        }
    }, [isMounted, isOpen, closeMenu, router, setIsTransitioning, setTransitionState]);

    const handleMenuItemClick = useCallback(() => {
        closeMenu();
    }, [closeMenu]);

    return (
        <>
            <StyledNavbar ref={navbarRef}>
                <Brand
                    ref={brandRef}
                    as="a"
                    href="/"
                    onClick={triggerHomeTransitionAnimation}
                >
                    <OptimizedImage
                        width={750}
                        height={348}
                        src="/images/brand/brand-large-white.png"
                        alt="Brand Logo"
                        style={{
                            width: "calc(100px + 6vw)",
                        }}
                        priority={true}
                        fetchpriority={'high'}
                    />
                </Brand>

                <NavbarMenuButtons>
                    <LanguageSelector/>
                    <NavbarButton/>
                </NavbarMenuButtons>

                <NavbarNavigation
                    className="navbar-navigation"
                    $active={isOpen}
                    $visible={navigationVisible}
                    data-lenis-prevent
                >
                    {menuItems.map((item, index) => (
                        <StyledLink
                            onClick={handleMenuItemClick}
                            key={index}
                            className="navbar__navigation__item"
                            href={item.path}
                        >
                            {t(item.id)}
                        </StyledLink>
                    ))}
                </NavbarNavigation>
            </StyledNavbar>

            {navbarHeight > 0 && <Spacer style={{height: `${navbarHeight}px`}}/>}
        </>
    );
};

export default memo(Navbar);
