import styled from "styled-components";

export const FooterContentStyled = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 1.75rem;

    @media (min-width: 700px) {
        /* One bar: brand — nav — socials, vertically centred. The nav sits in
           the middle and absorbs future site links. */
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        column-gap: 3rem;
    }
`;
