import styled from "styled-components";

export const FooterLinkStyled = styled.a.attrs({
    className: 'fluid-type--1-5'
})`
    color: #fff;
    display: inline-block;
    text-decoration: none;
    font-weight: 200;
    transition: color 0.2s;

    &:hover {
        color: #96b9f9;
    }

    /* Stacked on mobile (see BottomLinksStyled), so the row is the target: the
       link fills the column's width and the padding brings it to the 44px
       minimum. Nothing is added visually — the target grows, the text does not
       move. */
    @media (max-width: 699px) {
        display: flex;
        align-items: center;
        min-height: 44px;
    }
`;
