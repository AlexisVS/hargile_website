// ServiceSection.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "motion/react";
import { DOT_COLORS } from "./constants";
import ServiceItem from "./ServiceItem";

/**
 * Renders a section of services with title, icon and list of items
 * Now with animations using motion/react
 */
const ServiceSection = ({ icon, title, items, position }) => {
  const isRight = position.includes("right");
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      x: isRight ? 50 : -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Animation for the title and icon container
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className={isRight ? "text-right" : "text-left"}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-center mb-6"
        style={{
          margin: "0 0 1.5rem 0",
          justifyContent: isRight ? "flex-end" : "flex-start",
        }}
        variants={headerVariants}
      >
        <motion.div
          className="mr-4"
          style={{ margin: isRight ? "0 0 0 1rem" : "0 1rem 0 0" }}
          animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        <motion.h3
          className="fluid-type-2 md:text-2xl font-bold text-white"
          style={{ margin: 0 }}
        >
          {title}
        </motion.h3>
      </motion.div>
      <div>
        {items.map((item, index) => (
          <ServiceItem
            key={index}
            color={DOT_COLORS[position]}
            text={item}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

ServiceSection.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  position: PropTypes.oneOf(Object.keys(DOT_COLORS)).isRequired,
};

export default ServiceSection;
