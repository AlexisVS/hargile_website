import styled from "styled-components";

export const BottomLinksStyled = styled.div`
    display: flex;
    gap: 1.5rem;

    /* Still a wrapping row on mobile — stacking one per line made the footer
       twice as tall for the same links. The thumb gets its 44px from the height
       of each link instead (see FooterLinkStyled), which is why row-gap is 0:
       the padding already separates the lines. */
    @media (max-width: 699px) {
        flex-wrap: wrap;
        column-gap: 1.25rem;
        row-gap: 0;
    }
`;
