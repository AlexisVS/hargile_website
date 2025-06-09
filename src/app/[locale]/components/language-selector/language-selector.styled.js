import styled from 'styled-components';

export const LanguageSelectorContainer = styled.div.attrs({
    className: 'fluid-type-2-5'
})`
    position: relative;
    display: inline-block;
`;

export const SelectedLanguage = styled.button.attrs({
    className: 'fluid-type-1'
})`
    display: flex;
    align-items: center;
    color: var(--color-text-light);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    span {
        margin: 0 0.5rem;
    }

    svg {
        transition: transform 0.2s ease;

        &.rotated {
            transform: rotate(180deg);
        }
    }
`;

export const FlagIcon = styled.span`
    margin-right: 0.5rem;
`;

export const LanguageDropdown = styled.div`
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    width: max-content;
    border-radius: 0.375rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    z-index: 100;
    animation: fadeIn 0.2s ease;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const LanguageOption = styled.button.attrs({
    className: 'fluid-type-0'
})`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    background-color: ${props => props.$isactive ? 'rgba(147, 51, 234, 0.2)' : 'transparent'};
    color: var(--color-text-light);
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(147, 51, 234, 0.1);
    }

    span {
        margin-left: 0.5rem;
        word-break: keep-all;
        width: max-content;
    }
`;
