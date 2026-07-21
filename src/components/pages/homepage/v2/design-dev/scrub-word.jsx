"use client";

import {motion, useTransform} from "motion/react";

/**
 * One word of scroll-scrubbed text: brightens from dim to full as the shared
 * scroll progress crosses its [start, end] slice. Collapses to static text
 * under reduced motion.
 */
const ScrubWord = ({word, progress, start, end, reduced, className}) => {
    const opacity = useTransform(progress, [start, end], [0.16, 1]);
    return (
        <motion.span className={className} style={reduced ? undefined : {opacity}}>
            {word}{" "}
        </motion.span>
    );
};

export default ScrubWord;
