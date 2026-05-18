// src/components/pages/homepage/recent-works/work-card.styled.js
import styled from "styled-components";
import {OptimizedImage} from "@/components/optimizedImage";
import {Link} from "@/i18n/navigation";

export const CardContainer = styled(Link)`
    position: relative;
    display: block;
    height: 100%;
    border-radius: 0.75rem;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    color: var(--color-text-light);

    &:hover {
        transform: translateY(-5px);
    }
`;

export const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    overflow: hidden;
`;

export const CardImage = styled(OptimizedImage)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
`;

export const CardContent = styled.div`
    padding: 1.5rem;
`;

export const CardTitle = styled.h3.attrs({
    className: 'fluid-type-2-5'
})`
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-light);
`;

export const CardDescription = styled.p.attrs({
    className: 'fluid-type-0-5'
})`
    color: var(--color-text-secondary);
    margin: 0;
`;
