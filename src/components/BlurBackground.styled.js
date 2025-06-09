import styled from "styled-components";

export const StyledBlur = styled.div`
    position: absolute;
    width: ${props => props.$width || '200px'};
    height: ${props => props.$height || '200px'};
    background: ${props => props.$color || 'var(--color-primary)'};
    opacity: ${props => props.$opacity || '0.5'};
    filter: blur(${props => props.$blur || '100px'});
    border-radius: 50%;
    z-index: ${props => props.$zIndex || '-1'};
    top: ${props => props.$top || 'auto'};
    left: ${props => props.$left || 'auto'};
    right: ${props => props.$right || 'auto'};
    bottom: ${props => props.$bottom || 'auto'};
    transform: ${props => props.$transform || 'none'};
`;
