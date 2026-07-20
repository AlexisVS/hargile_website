import styled, { css } from "styled-components";
import React from "react";

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
  padding: clamp(28px, 3.5vw, 48px) var(--container-gutter);
  /* The wrapper slides under the fixed navbar — keep the copy clear of it. */
  padding-top: calc(clamp(28px, 3.5vw, 48px) + var(--navbar-height, 68px));
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
  gap: 1.25rem;
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
  color: #f87171;
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

export const SubmitButton = styled.button.attrs({
  className: "fluid-type-0", // Keep your responsive font class
})`
  margin-top: auto; /* Pushes to bottom if in a flex column like ServiceTypesColumn */
  /* Ensure space above if content before it is dynamic */

  /* v2 CTA — same treatment as the hero's primary button. Compact, not
     full-width: it sits left-aligned like the homepage CTA row. */
  background: #96b9f9;
  color: #0a0a12;
  font-weight: 600;
  padding: 0.85rem 3rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  width: fit-content;
  min-width: 220px;
  justify-self: start;
  text-align: center;
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background: #b8cdfb;
    transform: translateY(-2px);
    box-shadow: 0 0 36px rgba(150, 185, 249, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 0 18px rgba(150, 185, 249, 0.25);
  }

  &:focus-visible {
    outline: 2px solid rgba(150, 185, 249, 0.7);
    outline-offset: 2px;
  }

  &:disabled {
    background: rgba(237, 237, 237, 0.18);
    color: rgba(237, 237, 237, 0.45);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const PrivacyNote = styled.div.attrs({
  className: "fluid-type-1",
})`
  margin-top: 1.5rem;
  color: white;
  padding: 0 1rem;
`;

export const PrivacyLink = styled.a`
  color: #96b9f9;
`;

export const RequiredNote = styled.p`
  margin-top: 0.75rem;
`;


export const StatusMessageDisplay = styled.div`
    margin-top: 1.5rem; /* Space above the message */
    padding: 1rem 1.5rem; /* Padding inside */
    border-radius: 0.75rem; /* Rounded corners */
    text-align: center;
    font-size: 0.95rem;
    font-weight: 500;
    color: white; /* Default text color */

    /* Glassmorphism effect */
    background-color: ${(props) =>
            props.$success === true
                    ? "rgba(40, 167, 69, 0.65)" /* Greenish glass for success */
                    : props.$success === false
                            ? "rgba(220, 53, 69, 0.65)" /* Reddish glass for error */
                            : "rgba(50, 50, 80, 0.65)"}; /* Neutral/blueish glass for other states */

    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px); /* Safari support */

    /* FIXED: Added $ prefix to success props */
    border: 1px solid ${(props) =>
            props.$success === true
                    ? "rgba(40, 167, 69, 0.8)"
                    : props.$success === false
                            ? "rgba(220, 53, 69, 0.8)"
                            : "rgba(100, 100, 150, 0.5)"};

    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    /* Animation for appearing (optional) */
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    opacity: ${(props) => (props.$show ? 1 : 0)};
    transform: ${(props) => (props.$show ? "translateY(0)" : "translateY(-10px)")};
    visibility: ${(props) =>
            props.$show
                    ? "visible"
                    : "hidden"}; /* Ensure it's not interactable when hidden */
`;

