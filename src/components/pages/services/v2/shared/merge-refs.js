/* Two ref callbacks on one node — useReveal's observer and useSpotlight's
   listeners both want the same element.

   Memoise the result (useMemo on the input refs), or React detaches and
   re-attaches every render, which would re-observe and re-listen each time.

   React 19 note: this always returns a cleanup, so React takes the cleanup path
   and never calls the merged callback with null. Refs that expect a null call on
   detach must do their teardown in the cleanup they return — useReveal already
   ignores null and disconnects its observer on unmount, so it is unaffected. */

export const mergeRefs = (...refs) => (node) => {
    const cleanups = refs.map((ref) => {
        if (typeof ref === "function") return ref(node);
        if (ref && typeof ref === "object") ref.current = node;
        return undefined;
    });

    return () => {
        for (const cleanup of cleanups) {
            if (typeof cleanup === "function") cleanup();
        }
    };
};
