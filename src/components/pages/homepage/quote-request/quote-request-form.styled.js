import styled, { css } from "styled-components";
import React from "react";

export const PageWrapper = styled.div`
  min-height: 100vh;
  position: relative;
  contain-content: true;
  background-color: var(--color-background-section);

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
  max-width: 1400px;
  position: relative;
  z-index: 10;
  width: 100%;

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
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const ContactInfoColumn = styled.div`
  background-color: rgba(17, 12, 41, 0.6);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 0.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);

  @media (min-width: 768px) {
    background-color: rgba(17, 12, 41, 0.6);
  }

  .grid-cols-2 {
    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
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
  background-color: rgba(21, 16, 53, 0.8);
  border: 1px solid rgba(147, 51, 234, 0.1);
  border-radius: 0.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    background-color: rgba(21, 16, 53, 0.6);
  }

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
  margin-bottom: 1.5rem;
`;

export const InputLabel = styled.label.attrs({
  className: "fluid-type-0",
})`
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  padding-top: 1rem;
`;

export const RequiredMark = styled.span`
  color: #f87171;
`;

export const Input = styled.input`
  width: 100%;
  background-color: #19103b;
  color: white;
  border-radius: 0.375rem;
  padding: 1rem;
  outline: none;
  border: 1px solid
    ${(props) => (props.$hasError ? "#EF4444" : "rgba(107, 33, 168, 0.1)")}; // Use $hasError

  &:focus {
    border-color: var(--color-accent-mihai);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  background-color: #19103b;
  color: white;
  border-radius: 0.375rem;
  padding: 1rem;
  outline: none;
  border: 1px solid
    ${(props) => (props.$hasError ? "#EF4444" : "rgba(107, 33, 168, 0.1)")}; // Use $hasError

  &:focus {
    border-color: var(--color-accent-mihai);
  }
`;

export const SelectButton = styled.button.attrs({
  className: "fluid-type-0",
})`
  position: relative;
  appearance: none;
  width: 100%;
  background-color: #19103b;
  color: white;
  border-radius: 0.375rem;
  padding: 1rem 2.5rem 1rem 1rem;
  outline: none;
  /* FIXED: Added $ prefix to hasError prop */
  border: 1px solid ${(props) => (props.$hasError ? "#EF4444" : "rgba(107, 33, 168, 0.1)")};
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
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: #19103b;
  border: 1px solid rgba(107, 33, 168, 0.2);
  outline: none;
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
    background-color: #7e22ce;
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
    const colors = {
      yellow: "#FCD34DFF",
      blue: "#3B82F6",
      purple: "#8B5CF6",
      pink: "#EC4899",
      teal: "#14B8A6",
    };

    const color = colors[props.color] || colors.blue;
    const isChecked = props.checked;

    return `
      background-color: ${isChecked ? color : "#190f3a"};
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

  /* Define accent color and its RGB components (fallback if CSS vars not set) */
  --accent-color: var(
      --color-accent-mihai,
      #6366f1
  ); /* Indigo-500 as a fallback */
  --accent-color-rgb: var(--color-accent-mihai-rgb, 99, 102, 241);

  background: linear-gradient(
      135deg,
      var(--accent-color) 0%,
      color-mix(in srgb, var(--accent-color) 70%, #4f46e5) 100%
  ); /* Gradient with a slightly darker shade */
  color: white;
  font-weight: 600; /* Bolder */
  padding: 0.85rem 2rem; /* Slightly more padding */
  border-radius: 0.5rem; /* Softer radius */
  border: none; /* Remove default border */
  cursor: pointer;
  width: 100%;
  text-align: center;

  /* Smooth transitions for hover and active states */
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  /* Subtle shadow for depth */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1),
  0 2px 8px rgba(var(--accent-color-rgb), 0.2); /* Shadow with accent color tint */

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01); /* Slight lift and scale */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(var(--accent-color-rgb), 0.3); /* Enhanced shadow */
    /* You could also change the gradient slightly on hover if desired */
  }

  &:active:not(:disabled) {
    transform: translateY(0px) scale(0.99); /* Press down effect */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(var(--accent-color-rgb), 0.2);
  }

  &:focus-visible {
    /* Modern focus state for accessibility */
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.4),
      /* Outer ring */ 0 4px 15px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(var(--accent-color-rgb), 0.2);
  }

  &:disabled {
    background: linear-gradient(
        135deg,
        #6b7280 0%,
        #4b5563 100%
    ); /* Tailwind Gray-500 to Gray-600 */
    color: rgba(255, 255, 255, 0.5);
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
  color: #60a5fa;

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

