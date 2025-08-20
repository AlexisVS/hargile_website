import styled from "styled-components";

export const SocialContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const SocialLinkIcon = styled.a.attrs({
    className: 'fluid-type--1-5'
})`
    text-decoration: none;
    color: inherit;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    font-weight: 200;
    word-break: break-word;

    &:hover {
        text-decoration: underline;
    }
    
    @media (max-width: 399px) {
        gap: 0.375rem;
        margin-bottom: 0.25rem;
        font-size: 0.8125rem;
    }
    
    @media (min-width: 400px) and (max-width: 549px) {
        gap: 0.5rem;
        margin-bottom: 0.375rem;
        font-size: 0.875rem;
    }
`

