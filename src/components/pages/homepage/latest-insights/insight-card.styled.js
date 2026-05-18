import styled from "styled-components";
import {OptimizedImage} from "@/components/optimizedImage";
import {Link} from "@/i18n/navigation";

export const CardContainer = styled(Link)`
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 0.75rem;
    overflow: hidden;
    height: 100%;
    text-decoration: none;
    transform: translateY(50px);
    opacity: ${({$opacity}) => $opacity};
    transition: transform 0.6s ease-out, opacity 0.6s ease-out, box-shadow 0.3s ease;

    &.card-visible {
        transform: translateY(0);
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
`;

export const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 60%;
    overflow: hidden;
`;

export const CardImage = styled(OptimizedImage)`
    object-fit: cover;
    transition: transform 0.6s ease;

    ${CardContainer}:hover & {
        transform: scale(1.05);
    }
`;

export const CardContent = styled.div`
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

export const Category = styled.span.attrs({
    className: 'fluid-type--1'
})`
    text-transform: uppercase;
    font-weight: 600;
    color: var(--color-text-light);
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
`;

export const CardTitle = styled.h3.attrs({
    className: 'fluid-type-1'
})`
    color: var(--color-text-light);
    margin-bottom: 1rem;
`;
