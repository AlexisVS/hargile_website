/* Detects a software WebGL rasterizer (SwiftShader, llvmpipe, …) so the
   animated backdrops can fall back to a single static frame. Headless Chrome —
   i.e. Lighthouse — and machines without hardware acceleration (VMs, remote
   desktop, blocklisted drivers) all land here; a per-frame render loop on the
   CPU is what turned a decorative backdrop into 13 s of main-thread work.

   Takes an existing context (renderer.getContext()) — never creates a
   throwaway one, a context is too expensive to burn on a probe. */
export function isSoftwareRenderer(gl) {
    if (!gl) return false;

    let renderer = "";
    try {
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        renderer = info
            ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER);
    } catch {
        return false;
    }

    // Unknown renderer string → assume hardware; false negatives only cost
    // animation, false positives would freeze it for real GPUs.
    return /swiftshader|llvmpipe|softpipe|software/i.test(String(renderer || ""));
}
