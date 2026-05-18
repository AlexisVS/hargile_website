import styled from "styled-components";
import {motion} from "motion/react";
import {Link} from "@/i18n/navigation";

export const SolutionContainer = styled.section`
  position: relative;
  width: 100%;
  padding: 8vh 0;
  overflow: hidden;
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin: 4rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const FeatureCard = styled(motion.div)`
  background: rgba(13, 16, 45, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(123, 30, 233, 0.15);
  border-radius: 1rem;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

export const FeatureTitle = styled.h3.attrs({
    className: "fluid-type-1-5",
})`
  color: var(--color-text-light);
  margin-bottom: 1rem;
  font-weight: 600;
`;

export const FeatureDescription = styled.p.attrs({
    className: "fluid-type-0",
})`
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 4rem;
`;

export const ContentSection = styled(motion.div)`
  max-width: 100%;
`;

export const Description = styled.p.attrs({
    className: "fluid-type-1",
})`
    color: var(--color-text-light);
    line-height: 1.8;
    margin-bottom: 2rem;
    max-width: 80ch;
    z-index: 1;
`;

export const CTASection = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

export const CTAButton = styled(Link)`
  display: inline-block;
  background: transparent;
  color: var(--color-text);
  padding: 1rem 2.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid var(--color-text);
  backdrop-filter: blur(8px);

  &:hover {
    background: var(--color-text);
    color: var(--color-background);
    transform: translateY(-2px);
  }
`;
