import styled from "styled-components";

export const FooterLinkStyled = styled.a.attrs({
    className: 'fluid-type--1-5'
})`
    color: #fff;
    margin-bottom: 0.5rem;
    display: block;
    text-decoration: none;
    font-weight: 200;
    

    &:hover {
        text-decoration: underline;
    }
`;
