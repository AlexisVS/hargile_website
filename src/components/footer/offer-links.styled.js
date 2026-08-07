import styled from "styled-components";

/* The four offer pages, in the bottom bar. They are not in the nav above
   because that nav is site sections and these are one level below it. This is
   the only place where every page links to every offer, which is what a crawler
   needs to stop treating them as leaves of a single hub.

   Two shapes, one breakpoint. Wide: the middle column of the bar, between the
   address and the copyright — `order: -1` and the full basis are overridden, so
   the DOM order (address, offers, copyright) is what shows. Narrow: the three
   no longer fit on a line, so the offers take a row of their own back, above
   the other two rather than wrapping below them. */
export const OfferLinksStyled = styled.nav`
    order: -1;
    flex: 0 0 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.5rem;
    margin-bottom: 0.5rem;

    /* Row on mobile too: four names side by side stay compact where four rows
       would double the height of the bottom bar. The tap target comes from the
       link's own height, so row-gap can stay at 0. */
    @media (max-width: 699px) {
        column-gap: 1.25rem;
        row-gap: 0;
        margin-bottom: 0.25rem;
    }

    /* The bar becomes a three-column grid at this width (BottomBarStyled), so
       the order flip and the full basis both have to go — order still applies
       to grid items, flex-basis does not. */
    @media (min-width: 900px) {
        order: 0;
        flex: 0 1 auto;
        justify-content: center;
        margin-bottom: 0;
    }
`;

/* The site accent, #96b9f9, carried at 0.78 so the four names read as links
   without outshouting the address and the copyright flanking them. It is the
   only colour in the bottom bar: everything else there is white at a low
   alpha, which left the one row of real destinations looking like more small
   print. Full accent on hover, where the underline already fires. */
export const OfferLinkStyled = styled.a`
    color: rgba(150, 185, 249, 0.78);
    display: inline-block;
    text-decoration: none;
    font-weight: 200;
    font-size: 0.9375rem;
    transition: color 0.2s;

    &:hover {
        color: #96b9f9;
        text-decoration: underline;
    }

    /* The link is the target: 44px tall, text unmoved. The contrast also goes
       up a step — at arm's length on a phone, a dimmed accent over this
       background is a guess rather than a link. */
    @media (max-width: 699px) {
        display: flex;
        align-items: center;
        min-height: 44px;
        font-size: 1rem;
        color: #96b9f9;
    }
`;
