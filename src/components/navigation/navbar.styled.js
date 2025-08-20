import styled from "styled-components";
import {TransitionLink} from "@/components/TransitionLink";

export const StyledNavbar = styled.div`
    display: flex;
    position: fixed;
    width: 100vw;
    top: 0;
    left: 0;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 24px 1rem 12px;
    z-index: 1002;
    backdrop-filter: blur(12px);
    background: rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
    background: ${({$active}) => $active 
        ? 'radial-gradient(circle at 30% 40%, rgba(20, 20, 40, 0.8) 0%, rgba(10, 10, 20, 0.9) 70%)' 
        : 'rgba(0, 0, 0, 0)'};
    backdrop-filter: ${({$active}) => $active ? 'blur(25px) saturate(150%)' : 'blur(0px)'};
    -webkit-backdrop-filter: ${({$active}) => $active ? 'blur(25px) saturate(150%)' : 'blur(0px)'};
    z-index: 1001;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
        ". . ."
        "menu-label menu-items contact-info"
        ". . social-icons";
    padding: 100px 80px 60px 80px;
    gap: 40px;
    transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                backdrop-filter 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                visibility 0s linear ${({$visible}) => $visible ? '0s' : '0.8s'};
    opacity: ${({$visible}) => ($visible ? '1' : '0')};
    visibility: ${({$visible}) => ($visible ? 'visible' : 'hidden')};
    pointer-events: ${({$visible}) => ($visible ? 'auto' : 'none')};
    transform: ${({$visible}) => $visible ? 'scale(1)' : 'scale(0.98)'};
    backdrop-filter: ${({$visible}) => $visible 
        ? 'blur(25px) saturate(150%)' 
        : 'blur(5px) saturate(100%)'};
    -webkit-backdrop-filter: ${({$visible}) => $visible 
        ? 'blur(25px) saturate(150%)' 
        : 'blur(5px) saturate(100%)'};
    transform-origin: top right;
    
    &::before {
        content: '';
        position: absolute;
        top: 34px;
        right: 33px;
        width: 48px;
        height: 48px;
        background: radial-gradient(circle, rgba(100, 150, 255, 0.4) 0%, rgba(100, 150, 255, 0.1) 40%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        opacity: ${({$active}) => $active ? '0.8' : '0'};
        transform: ${({$active}) => $active ? 'scale(35)' : 'scale(1)'};
        transition: all 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: center;
        z-index: -1;
    }
    
    &::after {
        content: '';
        position: absolute;
        top: 34px;
        right: 33px;
        width: 48px;
        height: 48px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        opacity: ${({$active}) => $active ? '0.6' : '0'};
        transform: ${({$active}) => $active ? 'scale(50)' : 'scale(0.5)'};
        transition: all 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: center;
        z-index: -2;
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        grid-template-areas: 
            "menu-label"
            "menu-items"
            "contact-info"
            "social-icons";
        padding: 100px 20px 20px 20px;
        text-align: center;
        transform-origin: top center;
        justify-content: start;
        align-content: start;
        gap: 20px;
        height: 100vh;
        overflow-y: auto;
    }
`;


export const MenuItemsContainer = styled.div`
    grid-area: menu-items;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-self: center;
    
    @media (max-width: 768px) {
        gap: 12px;
        align-self: start;
        margin-top: 10px;
    }
`;

export const MenuLabel = styled.div`
    grid-area: menu-label;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999;
    align-self: center;
    writing-mode: vertical-lr;
    text-orientation: mixed;
    
    @media (max-width: 768px) {
        writing-mode: horizontal-tb;
        text-align: center;
    }
`;

export const ContactInfo = styled.div`
    grid-area: contact-info;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-self: center;
    text-align: right;
    
    @media (max-width: 768px) {
        text-align: center;
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
    margin-bottom: 20px;
    
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
    
    @media (max-width: 768px) {
        justify-self: center;
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
    backdrop-filter: blur(5px);
    
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

export const StyledLink = styled(TransitionLink)`
    text-decoration: none;
    color: #fff;
    font-size: clamp(3rem, 6vw, 4rem);
    cursor: pointer;
    font-weight: 400;
    text-transform: capitalize;
    line-height: 0.9;
    transition: all 0.2s ease;
    
    &:hover {
        color: var(--color-accent-mihai);
        transform: translateX(10px);
    }
    
    @media (max-width: 768px) {
        font-size: clamp(2.5rem, 12vw, 4rem);
        text-align: center;
        
        &:hover {
            transform: translateX(0) scale(1.02);
        }
    }
`;

export const Spacer = styled.div`
    width: 100%;
`;
