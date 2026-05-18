// ServiceItem.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "motion/react";

/**
 * Renders a single service item with a colored dot and text
 * Now with animations using motion/react
 */
const ServiceItem = ({ color, text, index }) => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
      },
    },
  };

  // Animation for the dot
  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.1 + 0.1,
      },
    },
    hover: {
      scale: 1.5,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
        repeatDelay: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center mb-4"
      style={{ margin: "0 0 1rem 0" }}
      variants={itemVariants}
      whileHover="hover"
    >
      <motion.div
        className="w-3 h-3 rounded-full mr-4"
        style={{
          backgroundColor: color,
          margin: "0 1rem 0 0",
          width: "0.75rem",
          height: "0.75rem",
        }}
        variants={dotVariants}
        whileHover={{ scale: 1.5 }}
      />
      <motion.span
        className="text-white fluid-type-1 md:text-lg"
        style={{ margin: 0 }}
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

ServiceItem.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default ServiceItem;
