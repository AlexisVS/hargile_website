import styled, {createGlobalStyle} from "styled-components";

/* Mounted only by the privacy-policy page, so these rules never reach any other
   route. Printing a legal page has to escape the site chrome: the navbar, the
   footer and the floating contact button would otherwise each claim ink, and
   the dark theme would print white text on a black flood. */
export const PrintStyles = createGlobalStyle`
    @media print {
        @page {
            margin: 16mm;
        }

        /* Everything keeps its box but stops painting; the policy is then
           lifted out of the flow so the hidden chrome costs no sheets. */
        body * {
            visibility: hidden;
        }

        #privacy-policy-print-root,
        #privacy-policy-print-root * {
            visibility: visible;
        }

        #privacy-policy-print-root {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }

        html,
        body {
            background: #fff !important;
            overflow: visible !important;
        }

        /* The policy is lifted out of the flow, so the chrome's reserved height
           would otherwise trail a blank sheet behind it. */
        .page-content {
            min-height: 0;
        }

        .content-container {
            padding: 0;
        }

        #privacy-policy-print-root,
        #privacy-policy-print-root *,
        #privacy-policy-print-root *::before {
            color: #111 !important;
            background: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }
    }
`;

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

    @media print {
        min-height: 0;
        overflow: visible;
        margin-inline: 0;
    }
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

    @media print {
        display: block;
        max-width: none;
        padding: 0;
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

    @media print {
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

    /* The in-page nav is dead weight on paper: every section is printed. */
    @media print {
        display: none !important;
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

/* Every section stays mounted and the inactive ones are hidden in CSS rather
   than unmounted, so a print run can reveal the whole policy — the reader
   asked for the document, not for the tab they happened to leave open. */
export const Section = styled.section`
    background: linear-gradient(155deg, rgba(56, 74, 122, 0.22), rgba(24, 33, 58, 0.35), rgba(12, 17, 32, 0.55));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 2rem;
    margin-bottom: 2rem;
    display: ${(props) => (props.$active ? "block" : "none")};

    @media print {
        display: block;
        border: none;
        border-radius: 0;
        padding: 0;
        margin-bottom: 2.5rem;
    }
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

    @media print {
        display: none;
    }
`;

/* The site's pill-outline treatment, matching components/ui/cta-link: hairline
   border, transparent body, blue as text and border for the primary action and
   a neutral hairline for the secondary. These were the only filled buttons on
   the site — a solid blue slab and a grey slab with a glow — which made the one
   page a visitor reaches for a legal document the page that looked like a
   different product.

   Not the CtaLink component itself: these are <button>s that print and export,
   not links. The leading icon stays for the same reason — these label a tool,
   they are not the CTA whose shared affordance is the trailing chevron. */
export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 13px 26px;
    border-radius: 999px;
    background: transparent;
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;

    &:focus-visible {
        outline: 2px solid rgba(150, 185, 249, 0.7);
        outline-offset: 2px;
    }

    &:first-child {
        color: #96b9f9;
        font-weight: 600;
        border: 1px solid rgba(150, 185, 249, 0.55);

        &:hover {
            color: #b8cdfb;
            border-color: rgba(150, 185, 249, 0.85);
            background: rgba(150, 185, 249, 0.07);
        }
    }

    &:last-child {
        color: rgba(237, 237, 237, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.16);

        &:hover {
            color: #ededed;
            border-color: rgba(255, 255, 255, 0.35);
            background: rgba(255, 255, 255, 0.04);
        }
    }
`;
