import styled from "styled-components";
import {motion} from "motion/react";

export const PageWrapper = styled.div`
    min-height: 100vh;
    color: white;
    position: relative;
    padding: 3rem 2rem;

    @media (min-width: 768px) {
        padding: 4rem;
    }
`;

export const ContentContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
`;

export const ProjectsSection = styled.section`
    margin-top: 2rem;
`;

export const SectionTitle = styled(motion.h2)`
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    margin-bottom: 2rem;
`;

export const ProjectsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem; /* Increased from 2rem to 3rem for more spacing */

    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 3rem; /* Consistent gap at different breakpoints */
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 3.5rem; /* Even more space between cards on larger screens */
    }
`;

export const CallToActionSection = styled(motion.section)`
    margin-top: 4rem;
    padding: 3rem;
    background: rgba(15, 10, 40, 0.7);
    border-radius: 12px;
    text-align: center;
`;

export const CTATitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1.5rem;
`;

export const CTADescription = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: #cbd5e1;
    max-width: 700px;
    margin: 0 auto 2rem;
`;

export const CTAButton = styled(motion.a)`
  display: inline-flex; /* Use inline-flex for better alignment if you add an icon */
  align-items: center;
  justify-content: center;

  /* Define accent color and its RGB components (fallback if CSS vars not set) */
  /* You can use a different accent for CTAs if desired, or reuse --color-accent-mihai */
  --cta-accent-color: var(
    --color-accent-cta,
    #6366f1
  ); /* Example: Indigo-500 */
  --cta-accent-color-rgb: var(--color-accent-cta-rgb, 99, 102, 241);

  /* Gradient background */
  background: linear-gradient(
    135deg,
    var(--cta-accent-color) 0%,
    color-mix(in srgb, var(--cta-accent-color) 75%, black 10%) 100%
  );
  color: white;
  font-size: 1rem; /* Your existing font-size */
  font-weight: 600; /* Your existing font-weight */
  padding: 0.85rem 2.25rem; /* Slightly more padding for a premium feel */
  border-radius: 9999px; /* Your existing pill shape */
  text-decoration: none; /* Remove default anchor underline */
  border: none; /* Remove default border if any */
  cursor: pointer;
  text-align: center; /* Ensure text is centered if not using flex for an icon */

  /* Smooth transitions for hover and active states */
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

  /* Subtle shadow for depth */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(var(--cta-accent-color-rgb), 0.25); /* Shadow with accent color tint */

  &:hover,
  &:focus-visible {
    /* Combine hover and focus-visible for similar effect */
    transform: translateY(-3px) scale(1.03); /* More pronounced lift and scale */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(var(--cta-accent-color-rgb), 0.35);
    /* Optional: Slightly change gradient or add brightness on hover */
    /* filter: brightness(1.1); */
  }

  &:active {
    transform: translateY(-1px) scale(0.98); /* Press down effect */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12),
      0 1px 6px rgba(var(--cta-accent-color-rgb), 0.2);
    /* filter: brightness(0.95); */
  }

  /* If used for something that can be "disabled" visually (though anchors don't have a disabled attribute) */
  /* You might add a class like .disabled manually */
  &.disabled {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* Modern focus state for accessibility (if not combined with hover) */
  /* If you separate focus-visible:
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--cta-accent-color-rgb), 0.5), // Outer ring
                0 4px 15px rgba(0, 0, 0, 0.1), 
                0 2px 8px rgba(var(--cta-accent-color-rgb), 0.25);
  }
  */
`;