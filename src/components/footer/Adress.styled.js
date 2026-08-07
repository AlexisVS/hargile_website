import styled from "styled-components";

/* Single muted line in the bottom bar: street · city · country · email */
export const Address = styled.address.attrs({
    className: 'fluid-type--1',
})`
    font-style: normal;
    color: rgba(255, 255, 255, 0.7);

    a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
            color: #96b9f9;
        }
    }
`;
