import styled from "styled-components";

export const PageContainer = styled.div`
    min-height: 100vh;
    color: #ededed;
    position: relative;
    overflow: hidden;
    /* No own background — the body's black shows through, like the homepage.
       A local one painted a visible column against the page edges. Break out
       of .content-container's side padding so the inner container's gutters
       line up exactly with the homepage's. */
    margin-inline: calc(50% - 50vw);
`;

export const ContentWrapper = styled.div`
    /* Same measure as the homepage v2 sections. */
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 2rem var(--container-gutter);
    position: relative;
    z-index: 10;
    box-sizing: border-box;

    @media (min-width: 768px) {
        padding: 3rem var(--container-gutter);
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 2rem;
    }
`;

// Header section
export const Header = styled.header`
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (min-width: 768px) {
        grid-column: 1 / 3;
    }
`;

export const Title = styled.h1`
    /* Exactly the homepage v2 section heading (.heading in
       v2-section.module.scss): same size, same flat off-white. */
    font-family: var(--font-headings);
    font-size: clamp(34px, 3.6vw, 56px);
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #ededed;
    margin: 0;

    /* Doubled specificity: the legacy .content-container h1 rule out-ranks a
       single styled-components class and re-applies its grey text-shadow. */
    && {
        text-shadow: none;
    }
`;

export const TitleUnderline = styled.div`
    width: 140px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, #96b9f9, rgba(150, 185, 249, 0.05));
    margin-top: 0.75rem;
    margin-bottom: 1rem;
`;

export const LastUpdate = styled.p.attrs({
    className: "fluid-type--1",
})`
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.5rem;
`;

export const MenuButton = styled.button`
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
        display: none;
    }
`;

export const Sidebar = styled.aside`
    background: linear-gradient(155deg, rgba(56, 74, 122, 0.22), rgba(24, 33, 58, 0.35), rgba(12, 17, 32, 0.55));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: ${(props) => (props.$menuOpen ? "block" : "none")};

    @media (min-width: 768px) {
        display: block !important;
        position: sticky;
        top: 2rem;
        max-height: calc(100vh - 4rem);
        overflow-y: auto;
    }
`;

export const SidebarTitle = styled.h2.attrs({
    className: "fluid-type-0",
})`
    color: white;
    margin-bottom: 1rem;
`;

// Using data-active instead of active prop
export const NavItem = styled.a`
    display: block;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    color: white;
    text-decoration: none;
    transition: background-color 0.2s ease;
    background-color: ${(props) =>
            props["data-active"] === "true"
                    ? "rgba(150, 185, 249, 0.14)"
                    : "transparent"};
    border-left: ${(props) =>
            props["data-active"] === "true"
                    ? "3px solid var(--color-accent-mihai)"
                    : "3px solid transparent"};

    &:hover {
        background-color: rgba(150, 185, 249, 0.07);
    }
`;

// Main content section
export const MainContent = styled.main``;

export const Section = styled.section`
    background: linear-gradient(155deg, rgba(56, 74, 122, 0.22), rgba(24, 33, 58, 0.35), rgba(12, 17, 32, 0.55));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 2rem;
    margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2.attrs({
    className: "fluid-type-2",
})`
    color: white;
    margin-bottom: 1.5rem;
`;

export const SubSectionTitle = styled.h3.attrs({
    className: "fluid-type-1",
})`
    color: #96b9f9;
    margin: 1.5rem 0 1rem 0;
`;

export const Paragraph = styled.p.attrs({
    className: "fluid-type-0",
})`
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 1rem;
`;

export const BulletList = styled.ul`
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
`;

export const BulletItem = styled.li.attrs({
    className: "fluid-type-0",
})`
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 0.5rem;

    &::before {
        content: "• ";
        color: var(--color-accent-mihai);
    }
`;

// Action buttons
export const ActionButtons = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:first-child {
        background-color: #96b9f9;
        color: #0a0a12;
        border: none;

        &:hover {
            background-color: #b8cdfb;
            box-shadow: 0 0 24px rgba(150, 185, 249, 0.3);
        }
    }

    &:last-child {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
    }
`;
