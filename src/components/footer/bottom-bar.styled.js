import styled from "styled-components";

export const BottomBarStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 2rem;
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    row-gap: 1.5rem;

    @media (min-width: 640px) {
        gap: 1rem;
        flex-direction: row;
    }

    /* Three columns rather than space-between, because space-between does not
       centre anything: it shares out the leftover space, so the middle item
       lands off-centre by half the difference between the two flanks (measured
       at 1440px: address 249px, copyright 212px, offers pushed 18px right).
       Equal minmax(0, 1fr) flanks put the middle column on the page's centre
       line, where it lines up with the nav above it.

       900px is where the three stop fitting: 787px of content plus gaps in a
       bar that is the viewport less 40px of padding. */
    @media (min-width: 900px) {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: baseline;

        > *:last-child {
            justify-self: end;
        }
    }
`;
