// src/components/pages/homepage/recent-works/recent-works.styled.js
// Styles copied from your Portfolio Page for perfect consistency

import styled from "styled-components";
import { motion } from "framer-motion";

export const RecentWorksSection = styled.section`
  color: white;
  position: relative;
  padding: 4rem 2rem; /* Consistent padding */

  @media (min-width: 768px) {
    padding: 6rem 4rem;
  }
`;

export const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const SectionTitle = styled.h2`
  font-size: 2.25rem; /* Larger title for the homepage section */
  font-weight: 700;
  color: white;
  text-align: center; /* Center the title */
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: 4rem;
  }
`;

// This is the key part - an exact copy of your portfolio grid style
export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 3.5rem;
  }
`;

// A nice button, similar to your portfolio CTA button
export const ViewAllButton = styled(motion.a)`
  display: inline-block;
  --cta-accent-color: #6366f1;
  --cta-accent-color-rgb: 99, 102, 241;

  background: linear-gradient(
    135deg,
    var(--cta-accent-color) 0%,
    color-mix(in srgb, var(--cta-accent-color) 75%, black 10%) 100%
  );
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 0.85rem 2.25rem;
  border-radius: 9999px;
  text-decoration: none;
  border: none;
  cursor: pointer;

  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(var(--cta-accent-color-rgb), 0.25);

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(var(--cta-accent-color-rgb), 0.35);
  }
`;
