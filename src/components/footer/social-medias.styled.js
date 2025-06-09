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
    gap: 1rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    font-weight: 200;

    &:hover {
        text-decoration: underline;
    }
`

