"use client";

/* Which of the three wave-grid frames a page is drawing: "phone", "tablet" or
   "wide".

   Both heroes need this and both need it to mean the same thing, so it lives
   here rather than once per page. What they do NOT share is where the bands sit:
   the homepage switches to a canvas at 1024px, while /services stacks to one
   column at 860px and serves an image at every width. Those are layout facts
   about each page, so they are arguments — the rule is shared, the edges are not.

   ⚠️ The two resolution paths are deliberately different, and that is the whole
   design. An export answers from the ASPECT it asked for; a browser answers from
   its WIDTH. They have to agree, and this is the only way they can: a flag can
   disagree with a preview, an aspect cannot. So `?wave=N` at a given width
   previews exactly what the matching export writes. */

import {useEffect, useState} from "react";

/* Aspect thresholds, sitting between the three export ratios (0.46, 0.80 and
   1.60 — see PHONE/TABLET/WIDE in scripts/export-wave-grid.mjs), so each export
   lands well inside its own band rather than near an edge.

   These are shared by both pages even though the width breakpoints are not. An
   export is a shape, and a 0.8:1 render is the tablet composition whichever hero
   asked for it. */
export const frameForAspect = (w, h) => {
    const aspect = w / h;
    if (aspect < 0.6) return "phone";
    if (aspect < 1.15) return "tablet";
    return "wide";
};

/* Returns null while unresolved, and callers must render nothing until it
   lands. Defaulting to any of the three instead would mount the wrong one for a
   beat — on the homepage that means paying for the three.js parse the still
   exists to avoid, which is the entire point.

   Two queries rather than one so they partition the range at exactly the same
   edges the <source> media queries use. Those have to stay in step: a mismatch
   leaves a strip of viewport being handed an image composed for a frame it
   isn't, which nothing else will tell you about. */
export const useWaveFrame = ({exportSize = null, phoneMax, tabletMax}) => {
    const [frame, setFrame] = useState(null);

    useEffect(() => {
        const phone = window.matchMedia(`(max-width: ${phoneMax}px)`);
        const tablet = window.matchMedia(`(max-width: ${tabletMax}px)`);
        const sync = () => setFrame(phone.matches ? "phone" : tablet.matches ? "tablet" : "wide");
        sync();
        phone.addEventListener("change", sync);
        tablet.addEventListener("change", sync);
        return () => {
            phone.removeEventListener("change", sync);
            tablet.removeEventListener("change", sync);
        };
    }, [phoneMax, tabletMax]);

    if (exportSize) return frameForAspect(exportSize.w, exportSize.h);
    return frame;
};
