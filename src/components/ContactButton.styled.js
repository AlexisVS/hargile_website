import styled from "styled-components";
import {Link} from "@/i18n/navigation";

export const ContactButtonStyled = styled(Link).attrs({
    className: 'fluid-type-0-5'
})`
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1.35rem;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 600;
    color: #071022;
    background: linear-gradient(90deg, var(--color-accent-blue-planet), #5B8DEF);
    border: 1px solid rgba(150, 185, 249, 0.5);
    box-shadow: 0 8px 24px rgba(91, 141, 239, 0.4);
    backdrop-filter: blur(6px);
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(91, 141, 239, 0.55);
    }
`;
