// src/components/OptimizedImage.jsx
"use client";

import Image from "next/image";

/* sizes must describe the RENDERED width, not the viewport: it's what the browser
   multiplies by DPR to pick a srcset bucket. The old hardcoded 100vw made a phone
   at 3x DPR request the w=1200 variant for a 16rem logo. */
export const OptimizedImage = ({style, src, alt, width = 1200, height = 800, priority = false, sizes = "(max-width: 768px) 100vw, 50vw"}) => {
    return (
        <Image
            /* was Tailwind's `rounded-lg`; inlined when Tailwind was dropped —
               it was the last utility class left in the live tree. Caller styles
               come last so they can still override the radius. */
            style={{borderRadius: "0.5rem", ...style}}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
        />
    );
};
