import styled from "styled-components";

export const FooterLinkStyled = styled.a.attrs({
    className: 'fluid-type--1-5'
})`
    color: #fff;
    display: inline-block;
    text-decoration: none;
    font-weight: 200;
    

    &:hover {
        text-decoration: underline;
    }
`;
