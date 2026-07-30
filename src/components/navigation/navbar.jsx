"use client";

import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import NavbarButton from "@/components/navigation/button/navbar-button";
import {useSiteNavigation} from "@/components/providers/site-navigation-provider";
import {useRouter} from "@/i18n/navigation";
import {OptimizedImage} from "@/components/optimizedImage";
import {useMenuItems} from "@/hooks/useMenuItems";
import {useNavigationVisibility} from "@/hooks/useNavigationVisibility";
import {useIsClient} from "@/hooks/useIsClient";
import {useTranslations} from "next-intl";
import LanguageSelector from "@/app/[locale]/components/language-selector/language-selector";
import {SiGithub, SiInstagram} from "@icons-pack/react-simple-icons";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import {NAP, napCityLine} from "@/lib/nap";
import {
    Brand,
    NavbarMenuButtons,
    NavbarNavigation,
    Spacer,
    StyledLink,
    StyledNavbar,
    NavbarInner,
    MenuItemsContainer,
    MenuLabel,
    ContactInfo,
    ContactEmail,
    ContactPhone,
    ContactAddress,
    SocialIcons,
    SocialIcon
} from "@/components/navigation/navbar.styled";
const menuItems = [
    {path: '/', id: 'home'},
    {path: '/services', id: 'services'},
    {path: '/faq', id: 'faq'},
    {path: '/contact', id: 'contact'},
];

const Navbar = () => {
    const {isOpen, closeMenu} = useSiteNavigation();
    const router = useRouter();
    const navbarRef = useRef(null);
    const brandRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const t = useTranslations('components.menu');
    // The country line is shared with the footer — one translated string, one source.
    const tAddress = useTranslations('components.footer');
    const isMounted = useIsClient();

    useMenuItems(isOpen);
    const {navigationVisible, backgroundActive} = useNavigationVisibility(isOpen);

    useEffect(() => {
        const updateNavbarHeight = () => {
            if (navbarRef.current) {
                const height = navbarRef.current.offsetHeight;
                document.documentElement.style.setProperty('--navbar-height', `${height}px`);
            }
        };

        updateNavbarHeight();
        window.addEventListener('resize', updateNavbarHeight);

        return () => {
            window.removeEventListener('resize', updateNavbarHeight);
        };
    }, []);

    // Transparent while pinned at the top; tinted once content scrolls under it.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);


    const triggerHomeTransitionAnimation = useCallback((e) => {
        e.preventDefault();
        if (!isMounted) return;
        if (isOpen) closeMenu();
        router.push('/');
    }, [isMounted, isOpen, closeMenu, router]);

    const handleMenuItemClick = useCallback(() => {
        closeMenu();
    }, [closeMenu]);

    return (
        <>
            <StyledNavbar ref={navbarRef} $scrolled={scrolled || isOpen}>
                {/* Only the bar's own row is measured — NavbarNavigation is the
                    full-screen menu panel and stays outside, or it would be boxed
                    into the container width. */}
                <NavbarInner>
                    <Brand
                        ref={brandRef}
                        as="a"
                        href="/"
                        onClick={triggerHomeTransitionAnimation}
                    >
                        {/* Rendered width lives in Brand's img rule (16rem, 13rem
                            on mobile) — sizes mirrors it so srcset picks a small
                            variant instead of a viewport-width one. */}
                        <OptimizedImage
                            width={750}
                            height={348}
                            src="/images/brand/brand-large-white.png"
                            alt="Brand Logo"
                            sizes="(max-width: 768px) 13rem, 16rem"
                            priority={true}
                            fetchpriority={'high'}
                        />
                    </Brand>

                    <NavbarMenuButtons>
                        <LanguageSelector/>
                        <NavbarButton/>
                    </NavbarMenuButtons>
                </NavbarInner>

                <NavbarNavigation
                    className="navbar-navigation"
                    $active={backgroundActive}
                    $visible={navigationVisible}
                    data-lenis-prevent
                >
                    
                    
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
                    
                    {/* Same NAP source as the footer and the JSON-LD entity.
                        The country used to be a hardcoded "Belgium" here, which
                        showed in English on the French nav. */}
                    <ContactInfo>
                        <ContactEmail href={`mailto:${NAP.email}`}>
                            {NAP.email}
                        </ContactEmail>
                        <ContactPhone href={`tel:${NAP.phone}`}>
                            {NAP.phoneDisplay}
                        </ContactPhone>
                        <ContactAddress>
                            {NAP.street}<br/>
                            {napCityLine}<br/>
                            {tAddress('address.country')}
                        </ContactAddress>
                    </ContactInfo>
                    
                    <SocialIcons>
                        <SocialIcon href="https://www.instagram.com/hargile_tech_studio/" target="_blank" aria-label="Instagram">
                            <SiInstagram size="22px" />
                        </SocialIcon>
                        <SocialIcon href="https://www.linkedin.com/company/hargile" target="_blank" aria-label="LinkedIn">
                            <LinkedinIcon size="22px" />
                        </SocialIcon>
                        <SocialIcon href="https://github.com/HARGILE-tech-studio" target="_blank" aria-label="GitHub">
                            <SiGithub size="22px" />
                        </SocialIcon>
                    </SocialIcons>
                </NavbarNavigation>
            </StyledNavbar>

            {/* Always rendered, sized by the same CSS var the measuring effect
                keeps up to date — the SSR paint then already reserves the
                navbar's space instead of the page jumping down on hydration. */}
            <Spacer style={{height: "var(--navbar-height, 68px)"}}/>
        </>
    );
};

export default memo(Navbar);
