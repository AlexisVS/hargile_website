import styled from 'styled-components';

export const LanguageSwitch = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
`;

export const LanguageCode = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 7px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    line-height: 1;
    color: ${({$active}) => ($active ? 'var(--color-accent-mihai)' : 'rgba(237, 237, 237, 0.45)')};
    transition: color 0.2s ease, background 0.2s ease;

    &:hover {
        color: ${({$active}) => ($active ? 'var(--color-accent-mihai)' : '#ededed')};
        background: rgba(255, 255, 255, 0.06);
    }

    &:focus-visible {
        outline: 2px solid rgba(150, 185, 249, 0.7);
        outline-offset: 2px;
    }
`;

export const LanguageDivider = styled.span`
    color: rgba(255, 255, 255, 0.18);
    font-size: 12px;
    user-select: none;
`;
