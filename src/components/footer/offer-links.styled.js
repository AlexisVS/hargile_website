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

/* The site accent at full strength — $accent-mihai / #96b9f9, the same light
   blue CtaLink carries — brightening to #b8cdfb on hover, which is the step
   the buttons use too. Deliberately not dimmed with an alpha: at 0.78 over the
   near-black bottom bar the accent composites down to a muted slate and stops
   reading as the site's blue at all. It is the only colour in this bar, where
   everything else is low-alpha white, so the one row of real destinations no
   longer reads as more small print. */
export const OfferLinkStyled = styled.a`
    color: #96b9f9;
    display: inline-block;
    text-decoration: none;
    font-weight: 200;
    font-size: 0.9375rem;
    transition: color 0.2s;

    &:hover {
        color: #b8cdfb;
    }

    /* The link is the target: 44px tall, text unmoved. */
    @media (max-width: 699px) {
        display: flex;
        align-items: center;
        min-height: 44px;
        font-size: 1rem;
    }
`;
