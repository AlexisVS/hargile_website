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
    /* Dark glass rather than the bright gradient — the corner pill shouldn't
       compete with the hero CTAs for attention. */
    color: #c8d8f8;
    background: rgba(10, 14, 26, 0.72);
    border: 1px solid rgba(150, 185, 249, 0.45);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(6px);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(150, 185, 249, 0.8);
        box-shadow: 0 8px 22px rgba(91, 141, 239, 0.3);
    }
`;
