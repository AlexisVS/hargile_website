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
import {SiGithub, SiGooglemaps, SiInstagram, SiYoutube} from "@icons-pack/react-simple-icons";
import {LucideLinkedin} from "lucide-react";
import {
    Brand,
    NavbarMenuButtons,
    NavbarNavigation,
    Spacer,
    StyledLink,
    StyledNavbar,
    MenuItemsContainer,
    MenuLabel,
    MenuLogo,
    ContactInfo,
    ContactEmail,
    ContactPhone,
    ContactAddress,
    SocialIcons,
    SocialIcon
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
    console.log('Menu is open:', isOpen);
    const router = useRouter();
    const navbarRef = useRef(null);
    const brandRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const t = useTranslations('components.menu');
    const {setIsTransitioning, setTransitionState} = usePageTransition();
    const [isMounted, setIsMounted] = useState(false);

    useMenuItems(isOpen);
    const {navigationVisible, backgroundActive} = useNavigationVisibility(isOpen);

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
                    $active={backgroundActive}
                    $visible={navigationVisible}
                    data-lenis-prevent
                >
                    
                    <MenuLogo onClick={triggerHomeTransitionAnimation} aria-label="Go to home page">
                        <OptimizedImage
                            width={750}
                            height={348}
                            src="/images/brand/brand-large-white.png"
                            alt="Hargile Logo"
                            style={{
                                width: "16rem",
                                height: "auto",
                            }}
                            priority={false}
                        />
                    </MenuLogo>
                    
                    <MenuLabel>MENU</MenuLabel>
                    
                    <MenuItemsContainer>
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
                    </MenuItemsContainer>
                    
                    <ContactInfo>
                        <ContactEmail href="mailto:contact@hargile.com">
                            contact@hargile.com
                        </ContactEmail>
                        <ContactPhone href="mailto:charles.dl@hargile.com">
                            charles.dl@hargile.com
                        </ContactPhone>
                        <ContactAddress>
                            Rue Sterckx 5, bt. 28<br/>
                            1060 Saint-Gilles<br/>
                            Belgium
                        </ContactAddress>
                    </ContactInfo>
                    
                    <SocialIcons>
                        <SocialIcon href="https://www.instagram.com/hargile_is/" target="_blank" aria-label="Instagram">
                            <SiInstagram size="22px" />
                        </SocialIcon>
                        <SocialIcon href="https://www.linkedin.com/company/hargile" target="_blank" aria-label="LinkedIn">
                            <LucideLinkedin size="22px" />
                        </SocialIcon>
                        <SocialIcon href="https://www.youtube.com/@HARGILEinnovativesolutions" target="_blank" aria-label="YouTube">
                            <SiYoutube size="22px" />
                        </SocialIcon>
                        <SocialIcon href="https://maps.app.goo.gl/RuYC96MNXGnuPrpM7" target="_blank" aria-label="Location">
                            <SiGooglemaps size="22px" />
                        </SocialIcon>
                        <SocialIcon href="https://github.com/HARGILE-innovative-solutions" target="_blank" aria-label="GitHub">
                            <SiGithub size="22px" />
                        </SocialIcon>
                    </SocialIcons>
                </NavbarNavigation>
            </StyledNavbar>

            {navbarHeight > 0 && <Spacer style={{height: `${navbarHeight}px`}}/>}
        </>
    );
};

export default memo(Navbar);
