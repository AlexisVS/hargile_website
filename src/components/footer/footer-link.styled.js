import styled from "styled-components";

/* Same size and weight as the offer links in the bottom bar — the two rows are
   the footer's two sets of destinations and only their colour should separate
   them. They did not match before: this carried `fluid-type--1-5`, a class the
   scale never generates (_config.scss defines -1 and -0-5, not -1-5), so these
   links fell back to inherited body size while the offers sat at a fixed 15px.
   Sized explicitly here rather than reaching for another scale step. */
export const FooterLinkStyled = styled.a`
    color: #fff;
    display: inline-block;
    text-decoration: none;
    font-size: 0.9375rem;
    font-weight: 500;
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
        font-size: 1rem;
    }
`;
