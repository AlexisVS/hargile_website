import styled from "styled-components";
import {Link} from "@/i18n/navigation";

export const StyledNavbar = styled.div`
    display: flex;
    position: fixed;
    /* left/right rather than width: 100vw — 100vw includes the scrollbar gutter and
       overflows by its width once the page scrolls. */
    top: 0;
    left: 0;
    right: 0;
    justify-content: center;
    align-items: center;
    /* The bar itself stays full-bleed so its blur/tint spans the viewport; the inner
       NavbarInner is what carries the measure. */
    padding: 1rem 0;
    z-index: 1002;
    /* At the top of the page the bar is fully transparent, so the hero backdrop
       runs edge-to-edge with no seam under it. The blur/tint only fades in once
       content starts scrolling beneath it. */
    backdrop-filter: ${({$scrolled}) => ($scrolled ? 'blur(20px) saturate(180%)' : 'none')};
    -webkit-backdrop-filter: ${({$scrolled}) => ($scrolled ? 'blur(20px) saturate(180%)' : 'none')};
    background: ${({$scrolled}) => ($scrolled ? 'rgba(0, 0, 0, 0.3)' : 'transparent')};
    transition: background 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                backdrop-filter 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    @media (max-width: 768px) {
        padding: 1rem 0;
    }
`;

/* Carries the shared measure so the logo starts on the same line as the hero
   headline and every section below — see --container-max in global.scss. */
export const NavbarInner = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: var(--container-max);
    padding: 0 var(--container-gutter);
    box-sizing: border-box;
`;

export const Brand = styled.button`
    cursor: pointer;
    background: transparent;
    border: none;
    transition: all 0.2s ease;
    position: relative;
    z-index: 1004;

    &:hover {
        box-shadow: none;
        transform: scale(1.02);
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const NavbarMenuButtons = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    align-items: center;
`;

export const NavbarNavigation = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
    /* Dark base re-tinted toward the hero color-bend blues (#2563eb / #96b9f9)
       instead of the old purple-leaning mix, so the open menu reads as the same
       theme as the hero backdrop. Kept dark for white-text legibility. */
    background: ${({$active}) => $active
        ? `
            linear-gradient(135deg,
                #050a18 0%,
                #0c1730 25%,
                #12244a 50%,
                #0a1428 75%,
                #04060f 100%
            )
          `
        : 'rgba(0, 0, 0, 0)'};

    /* Subtle glow overlay, drawn from the same two bend blues rather than indigo. */
    ${({$active}) => $active && `
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background:
                radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.14) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(150, 185, 249, 0.10) 0%, transparent 50%),
                radial-gradient(circle at 40% 70%, rgba(37, 99, 235, 0.07) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
    `}
    backdrop-filter: ${({$active}) => $active ? 'blur(35px) saturate(200%)' : 'blur(0px)'};
    -webkit-backdrop-filter: ${({$active}) => $active ? 'blur(35px) saturate(200%)' : 'blur(0px)'};
    z-index: 1001;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr auto;
    /* Two columns: the links sit in the first one, whose left edge is the
       shared container measure — same x as the navbar logo. The vertical MENU
       label lives in the side margin (absolutely positioned, see MenuLabel). */
    grid-template-areas:
        ". ."
        "menu-items contact-info"
        ". social-icons";
    padding: 100px calc((100% - var(--container-max)) / 2 + var(--container-gutter)) 60px;
    gap: 40px;
    /* Asymmetric timing: opening snaps the panel in fast (0.3s), so it's fully
       opaque before the items start their staggered entrance — panel and item
       fades overlapping is what read as the items animating twice. Closing
       takes 0.55s so the whole panel melts away with the items. */
    transition: opacity ${({$visible}) => ($visible ? '0.3s' : '0.55s')} cubic-bezier(0.25, 0.46, 0.45, 0.94),
                transform ${({$visible}) => ($visible ? '0.3s' : '0.55s')} cubic-bezier(0.25, 0.46, 0.45, 0.94),
                backdrop-filter ${({$visible}) => ($visible ? '0.3s' : '0.55s')} cubic-bezier(0.25, 0.46, 0.45, 0.94),
                visibility 0s linear ${({$visible}) => $visible ? '0s' : '0.55s'};
    opacity: ${({$visible}) => ($visible ? '1' : '0')};
    visibility: ${({$visible}) => ($visible ? 'visible' : 'hidden')};
    pointer-events: ${({$visible}) => ($visible ? 'auto' : 'none')};
    transform: ${({$visible}) => $visible ? 'scale(1)' : 'scale(0.98)'};
    backdrop-filter: ${({$visible}) => $visible 
        ? 'blur(35px) saturate(200%)' 
        : 'blur(10px) saturate(120%)'};
    -webkit-backdrop-filter: ${({$visible}) => $visible 
        ? 'blur(35px) saturate(200%)' 
        : 'blur(10px) saturate(120%)'};
    transform-origin: top right;
    
    
    &::after {
        content: '';
        position: absolute;
        top: 34px;
        right: 33px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        opacity: ${({$visible}) => $visible ? '0.6' : '0'};
        transform: ${({$visible}) => $visible ? 'scale(50)' : 'scale(0.5)'};
        transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: center;
        z-index: -2;
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto auto;
        grid-template-areas:
            "menu-items menu-label"
            "contact-info contact-info"
            "social-icons social-icons";
        padding: 100px 20px 40px 20px;
        text-align: left;
        transform-origin: top center;
        justify-content: start;
        align-content: start;
        gap: 20px;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior-x: none;
        overscroll-behavior-y: contain;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
    }
`;


export const MenuItemsContainer = styled.div`
    grid-area: menu-items;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-self: center;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
        gap: 12px;
        align-self: start;
        margin-top: 10px;
        text-align: left;
    }
`;

export const MenuLabel = styled.div`
    /* Desktop: out of the grid flow, in the side margin the container measure
       leaves free — the links then start exactly on the logo's line. */
    position: absolute;
    left: 28px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999;
    writing-mode: vertical-lr;
    text-orientation: mixed;
    z-index: 1;

    @media (max-width: 768px) {
        position: relative;
        top: auto;
        left: auto;
        transform: none;
        grid-area: menu-label;
        writing-mode: vertical-lr;
        text-orientation: mixed;
        align-self: center;
        margin-left: 30px;
        margin-top: 0;
        justify-self: end;
    }
`;

export const ContactInfo = styled.div`
    grid-area: contact-info;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-self: center;
    text-align: right;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
        text-align: left;
        margin-top: 15px;
        gap: 6px;
    }
`;

export const ContactEmail = styled.a`
    color: var(--color-accent-mihai);
    text-decoration: none;
    font-size: 16px;
    font-weight: 400;
    
    &:hover {
        text-decoration: underline;
    }
`;

export const ContactPhone = styled.a`
    color: var(--color-accent-mihai);
    text-decoration: none;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 5px;
    
    &:last-of-type {
        margin-bottom: 20px;
    }
    
    &:hover {
        text-decoration: underline;
    }
`;

export const ContactAddress = styled.div`
    color: #ccc;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
`;

export const SocialIcons = styled.div`
    grid-area: social-icons;
    display: flex;
    gap: 20px;
    align-self: end;
    justify-self: end;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
        justify-self: start;
        align-self: end;
        margin-top: 10px;
        gap: 12px;
        margin-bottom: 10px;
    }
`;

export const SocialIcon = styled.a`
    color: #999;
    font-size: 24px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    backdrop-filter: blur(15px) saturate(150%);
    -webkit-backdrop-filter: blur(15px) saturate(150%);
    
    &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        width: 38px;
        height: 38px;
        font-size: 20px;
    }
`;

export const CloseButton = styled.button`
    position: fixed;
    top: 34px;
    right: 33px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    color: white;
    font-size: 18px;
    font-weight: 300;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1002;
    backdrop-filter: blur(10px);
    
    @media (max-width: 768px) {
        right: 24px;
        top: 12px;
    }
`;

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    font-size: clamp(3rem, 6vw, 4rem);
    cursor: pointer;
    font-weight: 400;
    text-transform: capitalize;
    line-height: 0.9;
    /* NOT 'transition: all': the open/close hook drives opacity and transform
       via inline styles, and a CSS transition on those replayed every inline
       reset as its own animation — the "items animate twice" bug. The hover
       shift uses padding instead of transform for the same reason. */
    transition: color 0.2s ease, padding-left 0.2s ease;

    &:hover {
        color: var(--color-accent-mihai);
        padding-left: 10px;
    }

    @media (max-width: 768px) {
        font-size: clamp(2.5rem, 12vw, 4rem);
        text-align: left;
    }
`;

export const Spacer = styled.div`
    width: 100%;
`;
