import styled, { css, keyframes } from "styled-components";
import React from "react";
import { Link } from "@/i18n/navigation";

export const PageWrapper = styled.div`
  min-height: 100vh;
  position: relative;
  contain-content: true;
  /* No own background: it painted a visible column against the pure-black
     body. The page black comes from the body, like the homepage. Break out of
     .content-container's side padding (same trick as the v2 sections) so the
     inner container's gutters line up exactly with the homepage's. */
  margin-inline: calc(50% - 50vw);
  /* Slide up under the fixed navbar so the bends reach the very top and the
     navbar frosts the colour instead of sitting as a black band above it —
     same move as the homepage hero. FormContainer re-adds the offset. */
  margin-top: calc(-1 * var(--navbar-height, 68px));
`;

/* Full-bleed WebGL bends behind the form — colour-matched to the homepage
   hero, reaching the very top so the transparent navbar frosts it like on
   the homepage. */
export const BendsBackdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* Full opacity + the hero's near-black backing so the bands read at exactly
     the same brightness as the homepage: the canvas renders with alpha, so the
     troughs land on this floor rather than the page's slightly-lifted black. */
  opacity: 1;
  background: #010104;
`;

export const BackgroundBlur = styled.div`
  position: absolute;
  top: 25vh;
  left: calc(50% - 30rem);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color:var(--color-accent-mihai);;
  opacity: 0.4;
  filter: blur(30px);
  transform: scale(6);
  z-index: 0;
`;

export const FormContainer = styled.div`
  /* Same measure as the homepage v2 sections (.container in
     v2-section.module.scss): shared max width and gutters. */
  max-width: var(--container-max);
  margin: 0 auto;
  padding: clamp(20px, 2.5vw, 32px) var(--container-gutter);
  /* The wrapper slides under the fixed navbar — keep the copy clear of it. */
  padding-top: calc(clamp(20px, 2.5vw, 32px) + var(--navbar-height, 68px));
  position: relative;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
`;

export const HeaderSection = styled.div`
  margin-bottom: 3rem;
  padding: 0 1rem;
`;

export const PageTitle = styled.h1.attrs({
  className: "fluid-type-4",
})`
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

export const TitleUnderline = styled.div`
  width: 30%;
  height: 2px;
  background-color:var(--color-accent-mihai);;
  margin-bottom: 1.5rem;
`;

export const SubTitle = styled.h2.attrs({
  className: "fluid-type-2",
})`
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  margin-top: 1rem;

  span {
    color:var(--color-accent-mihai);;
  }
`;

export const Description = styled.p.attrs({
  className: "fluid-type-0",
})`
  color: white;
  line-height: 1.6;
  margin-bottom: 1rem;
  width: 100%; /* Default width for mobile */

  /* Media query for desktop/larger screens */
  @media (min-width: 768px) {
    width: 40%;
  }
`;


export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  /* Grid items default to min-width:auto, letting a long value typed in an
     auto-growing slot input widen the whole column past the viewport. */
  > * {
    min-width: 0;
  }
`;

export const ContactInfoColumn = styled.div`
  /* No card at all — the fields sit directly on the page black, underline
     style. Spacing does the structuring instead of a surface. */
  background: none;
  border: none;
  border-radius: 0;
  padding: 0;

  .grid-cols-2 {
    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
    }
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .relative {
    position: relative;
  }
`;

export const ServiceTypesColumn = styled.div`
  background: linear-gradient(155deg, rgba(56, 74, 122, 0.32), rgba(24, 33, 58, 0.45), rgba(12, 17, 32, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  padding: 2.5rem;
  backdrop-filter: blur(20px) saturate(115%);
  -webkit-backdrop-filter: blur(20px) saturate(115%);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;

  .service-options {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
`;

export const SectionTitle = styled.h3.attrs({
  className: "fluid-type-1",
})`
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const InputLabel = styled.label.attrs({
  className: "fluid-type-0",
})`
  display: block;
  color: rgba(237, 237, 237, 0.65);
  margin-bottom: 0.1rem;
`;

export const RequiredMark = styled.span`
  color: #96b9f9;
`;

export const Input = styled.input`
  /* Underline style: transparent field, a single hairline below. The focus
     accent is a box-shadow doubling the line so nothing shifts. */
  width: 100%;
  background: transparent;
  color: #ededed;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid
    ${(props) => (props.$hasError ? "#EF4444" : "rgba(255, 255, 255, 0.16)")};
  padding: 0.85rem 2px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &::placeholder {
    color: rgba(237, 237, 237, 0.3);
  }

  &:focus {
    border-bottom-color: var(--color-accent-mihai);
    box-shadow: 0 1px 0 var(--color-accent-mihai);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  background: transparent;
  color: #ededed;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid
    ${(props) => (props.$hasError ? "#EF4444" : "rgba(255, 255, 255, 0.16)")};
  padding: 0.85rem 2px;
  outline: none;
  resize: vertical;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &::placeholder {
    color: rgba(237, 237, 237, 0.3);
  }

  &:focus {
    border-bottom-color: var(--color-accent-mihai);
    box-shadow: 0 1px 0 var(--color-accent-mihai);
  }
`;

export const SelectButton = styled.button.attrs({
  className: "fluid-type-0",
})`
  position: relative;
  appearance: none;
  width: 100%;
  background: transparent;
  color: #ededed;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${(props) => (props.$hasError ? "#EF4444" : "rgba(255, 255, 255, 0.16)")};
  padding: 0.85rem 2.5rem 0.85rem 2px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  span.text-content {
    display: block;
    width: calc(100% - 2rem);
    text-align: center;
  }

  .icon {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding-right: 0.75rem;
    color: white;
    pointer-events: none;

    .icon-up,
    .icon-down {
      height: 1.25rem;
      width: 1.25rem;
      transition: transform 0.2s ease;
    }
  }

  &:focus {
    border-color: var(--color-accent-mihai);
  }
`;

export const DropdownContainer = styled.div`
  position: absolute;
  z-index: 10;
  margin-top: 0.25rem;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  background-color: #0c1222;
  border: 1px solid rgba(150, 185, 249, 0.25);
  outline: none;
  overflow: hidden;
`;

export const DropdownItem = styled.button.attrs({
  className: "fluid-type-1",
})`
  display: block;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  width: 100%;
  text-align: center;

  &:hover {
    background-color: rgba(150, 185, 249, 0.16);
    color: white;
  }
`;

export const ServiceDescription = styled.p.attrs({
  className: "fluid-type-0",
})`
  color: white;
  margin-bottom: 1rem;
`;


// Create a React component to handle prop filtering
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  cursor: pointer;
  background-color: var(--bg-color, transparent);

  &:hover {
    background-color: var(--bg-hover-color, rgba(75, 85, 99, 0.1));
  }
`;

export const Checkbox = styled.button.attrs((props) => {
  // Filter out custom props that shouldn't be passed to the DOM
  const { checked, color, ...domProps } = props;
  return {
    ...domProps,
    type: props.type || "button",
  };
})`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;

  ${(props) => {
    /* Keys are legacy names from ServicesSection's config; the values are all
       remapped into the brand blue family so the form reads as one palette. */
    const colors = {
      yellow: "#96b9f9",
      blue: "#5B8DEF",
      purple: "#2563eb",
      pink: "#0EA5E9",
      teal: "#4F46E5",
    };

    const color = colors[props.color] || colors.blue;
    const isChecked = props.checked;

    return `
      background-color: ${isChecked ? color : "rgba(8, 12, 24, 0.8)"};
      border: 1px solid ${isChecked ? color : color};
    `;
  }}
`;

export const CheckMark = styled.svg`
  height: 1rem;
  width: 1rem;
  color: white;
`;

export const CheckboxLabel = styled.label.attrs({
  className: "fluid-type-0",
})`
  color: white;
  cursor: pointer;
  padding-left: 0.25rem;
  margin-bottom: 0;
`;

export const SubmitButton = styled.button`
  margin-top: auto; /* Pushes to bottom if in a flex column like ServiceTypesColumn */

  /* Site CTA — the shared pill-outline treatment (see components/ui/cta-link):
     hairline full-round border, no fill, blue as text + border only. Hover
     just brightens and washes; the chevron's 2px nudge is the only motion. */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: transparent;
  color: #96b9f9;
  font-size: 15px;
  font-family: inherit;
  font-weight: 600;
  padding: 13px 26px;
  border-radius: 999px;
  border: 1px solid rgba(150, 185, 249, 0.55);
  cursor: pointer;
  width: fit-content;
  min-width: 220px;
  justify-self: start;
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  svg {
    width: 12px;
    height: 12px;
    flex: 0 0 auto;
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) {
    color: #b8cdfb;
    border-color: rgba(150, 185, 249, 0.85);
    background: rgba(150, 185, 249, 0.07);

    svg {
      transform: translateX(2px);
    }
  }

  &:focus-visible {
    outline: 2px solid rgba(150, 185, 249, 0.7);
    outline-offset: 2px;
  }

  &:disabled {
    color: rgba(237, 237, 237, 0.45);
    border-color: rgba(237, 237, 237, 0.18);
    background: transparent;
    cursor: not-allowed;
  }
`;

export const PrivacyNote = styled.div.attrs({
  className: "fluid-type-1",
})`
  margin-top: 1.1rem;
  color: white;
  padding: 0 1rem;
`;

export const PrivacyLink = styled(Link)`
  color: #96b9f9;
`;

export const RequiredNote = styled.p`
  margin-top: 0.4rem;
`;

/* ─── Conversational prose form ──────────────────────────────────────────────
   The form reads as a sentence you complete; inputs are inline slots inside
   large Outfit type, underlined like the site's hairline language. */

/* One shared scale for every conversational element — the global fluid-type
   rules on p/label would otherwise fragment the sizes. */
const proseType = css`
  font-family: var(--font-headings);
  font-weight: 300;
  font-size: clamp(1.5rem, 1.15rem + 1.8vw, 2.4rem);
  line-height: 1.45;
`;

export const ProseBlock = styled.div`
  ${proseType};
  color: rgba(237, 241, 250, 0.92);
  max-width: 52ch;
`;

export const ProseLine = styled.p`
  /* Explicit inherit: the global p rule would otherwise reset the size. */
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
  margin: 0 0 0.15em;
`;

export const SlotInput = styled.input`
  display: inline-block;
  font: inherit;
  color: #dbe7ff;
  background: transparent;
  border: none;
  border-bottom: 1px solid
    ${(props) =>
      props.$hasError
        ? "rgba(248, 137, 141, 0.75)"
        : "rgba(150, 185, 249, 0.35)"};
  border-radius: 0;
  padding: 0 0.15em 0.05em;
  margin: 0 0.1em;
  min-width: ${(props) => props.$minCh || 8}ch;
  max-width: 100%;
  /* Auto-grow with the typed text where supported; the ch min-width is the
     fallback everywhere else. */
  field-sizing: content;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: rgba(237, 241, 250, 0.32);
  }

  &:focus {
    outline: none;
    border-bottom-color: rgba(150, 185, 249, 0.9);
  }
`;

export const ProseMessage = styled.div`
  margin-top: 1.1rem;

  label {
    display: block;
    ${proseType};
    color: rgba(237, 241, 250, 0.92);
    margin-bottom: 0.5rem;
  }
`;

export const ProseTextArea = styled.textarea`
  width: 100%;
  min-height: 5.5rem;
  resize: vertical;
  font-family: var(--font-primary);
  font-size: 1rem;
  line-height: 1.6;
  color: #edf1fa;
  padding: 1rem 1.25rem;
  background: rgba(10, 14, 26, 0.5);
  border: 1px solid
    ${(props) =>
      props.$hasError
        ? "rgba(248, 137, 141, 0.6)"
        : "rgba(150, 185, 249, 0.28)"};
  border-radius: 0.75rem;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: border-color 0.2s ease;

  &::placeholder {
    color: rgba(237, 241, 250, 0.32);
  }

  &:focus {
    outline: none;
    border-color: rgba(150, 185, 249, 0.8);
  }
`;

/* Blue accent star after each required slot — visible even once the
   placeholder (and its hint) is gone. */
export const SlotRequiredMark = styled.sup`
  color: #96b9f9;
  font-size: 0.55em;
  margin-left: 0.1em;
  user-select: none;
`;

export const ProseErrorList = styled.ul`
  list-style: none;
  margin: 1rem 0 0;
  padding: 0.75rem 1.25rem;
  width: fit-content;

  /* Same glass recipe as the error status banner — one visual system. */
  background: rgba(24, 13, 18, 0.72);
  border: 1px solid rgba(248, 137, 141, 0.4);
  border-radius: 0.75rem;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  font-family: var(--font-primary);
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 202, 205, 0.95);

  li {
    margin: 0.15rem 0;
    display: flex;
    align-items: baseline;
    gap: 0.5em;

    &::before {
      content: "·";
      color: rgba(248, 137, 141, 0.8);
      font-weight: 700;
    }
  }
`;


const statusReveal = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const StatusMessageDisplay = styled.div`
    margin-top: 1.5rem;
    padding: 0.85rem 1.5rem;
    border-radius: 0.75rem;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 500;

    /* Same dark glass body as the site chrome (ContactButton); the state only
       tints the hairline border and text, never fills the card. */
    background: ${(props) =>
            props.$success === true
                    ? "rgba(13, 20, 34, 0.72)"
                    : props.$success === false
                            ? "rgba(24, 13, 18, 0.72)"
                            : "rgba(10, 14, 26, 0.72)"};

    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);

    border: 1px solid ${(props) =>
            props.$success === true
                    ? "rgba(150, 185, 249, 0.45)"
                    : props.$success === false
                            ? "rgba(248, 137, 141, 0.4)"
                            : "rgba(148, 163, 184, 0.3)"};

    color: ${(props) =>
            props.$success === true
                    ? "rgba(203, 222, 255, 0.95)"
                    : props.$success === false
                            ? "rgba(255, 202, 205, 0.95)"
                            : "rgba(226, 232, 240, 0.9)"};

    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);

    /* display:none (not visibility) so the empty banner reserves no space
       between the submit button and the privacy note. */
    display: ${(props) => (props.$show ? "block" : "none")};
    animation: ${statusReveal} 0.3s ease-out;
`;

