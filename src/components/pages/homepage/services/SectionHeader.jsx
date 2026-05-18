// SectionHeader.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "motion/react";

/**
 * Renders the header for a section with title and subtitle
 * Now with animations using motion/react
 */
const SectionHeader = ({ title, subtitle }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const subtitleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 text-center"
      style={{ margin: "0 auto", marginBottom: "6rem" }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.h2
        className="fluid-type-4"
        style={{ margin: "0 0 1rem 0" }}
        variants={titleVariants}
      >
        {title}
      </motion.h2>
      <motion.p
        className="text-white fluid-type-1 md:text-lg"
        style={{ margin: 0 }}
        variants={subtitleVariants}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default SectionHeader;
