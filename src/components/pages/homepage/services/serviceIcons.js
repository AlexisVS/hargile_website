// serviceIcons.jsx
import React from "react";
import { motion } from "framer-motion";
import { POSITIONS } from "./constants";
// Import from lucide-react
import {
  BrainCircuit,
  LaptopMinimalCheck,
  ChartNoAxesCombined,
  Globe,
} from "lucide-react";
// Import the BlurBackground component
import BlurBackground from "@/components/BlurBackground";

/**
 * Animation variants for the icon and blur
 */
const iconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.15,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const blurVariants = {
  initial: { scale: 1, opacity: 0.8 },
  hover: {
    scale: 1.2,
    opacity: 0.9,
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

/**
 * Creates a set of icons for the services section with animations
 * @param {boolean} isMobile - Whether the view is in mobile mode
 * @returns {Object} Object containing icons for each position
 */
export const getServiceIcons = (isMobile) => {
  const iconSize = isMobile ? 40 : 65;
  // Define colors for consistency
  const colors = {
    laptopColor: "#E56062",
    brainColor: "#10B981",
    chartColor: "#A855F7",
    globeColor: "#3B82F6",
  };

  // Create an animated icon wrapper component
  const AnimatedIcon = ({ children, color, intensity }) => (
    <motion.div
      style={{ position: "relative" }}
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        style={{ position: "relative", zIndex: 1 }}
        variants={iconVariants}
      >
        {children}
      </motion.div>
      <motion.div
        style={{ position: "absolute", top: 0, left: 0 }}
        variants={blurVariants}
      >
        <BlurBackground
          color={color}
          size={`${iconSize}px`}
        />
      </motion.div>
    </motion.div>
  );

  return {
    [POSITIONS.TOP_LEFT]: (
      <AnimatedIcon color={colors.globeColor} intensity={isMobile ? 4 : 6}>
        <Globe size={iconSize} color={colors.globeColor} strokeWidth="1px" />
      </AnimatedIcon>
    ),
    [POSITIONS.BOTTOM_LEFT]: (
      <AnimatedIcon color={colors.laptopColor} intensity={isMobile ? 4 : 6}>
        <LaptopMinimalCheck
          size={iconSize}
          color={colors.laptopColor}
          strokeWidth="1px"
        />
      </AnimatedIcon>
    ),
    [POSITIONS.TOP_RIGHT]: (
      <AnimatedIcon color={colors.brainColor} intensity={isMobile ? 4 : 6}>
        <BrainCircuit
          size={iconSize}
          color={colors.brainColor}
          strokeWidth="1px"
        />
      </AnimatedIcon>
    ),
    [POSITIONS.BOTTOM_RIGHT]: (
      <AnimatedIcon color={colors.chartColor} intensity={isMobile ? 4 : 6}>
        <ChartNoAxesCombined
          size={iconSize}
          color={colors.chartColor}
          strokeWidth="1px"
        />
      </AnimatedIcon>
    ),
  };
};
