// Render a hero wave grid to a still image.
//
// The grid is a single frame that never changes, so shipping three.js (~150 kB
// gzipped, plus parsing it, building 2304 instances, compiling two shader
// programs and running a shadow pass) to draw it once is a bad trade against
// ~20 kB of AVIF. This script is how the image gets made: it drives the real
// component in a real browser — the only way to run WebGL — and writes the
// canvas out as AVIF + WebP.
//
// Two pages use the grid and each needs its own image: they have different quiet
// zones and different copy layouts, so one export cannot serve both. --page
// picks which, and each writes under its own name so they can't overwrite each
// other.
//
// Usage:
//   npm run dev                                       # in another terminal
//   node scripts/export-wave-grid.mjs                 # /services, curated
//   node scripts/export-wave-grid.mjs 7 32            # /services, variants 7 and 32
//   node scripts/export-wave-grid.mjs --page=home     # homepage wave hero
//   node scripts/export-wave-grid.mjs --page=home 7   # homepage, variant 7
//
// Output: public/images/wave-grid/{curated,wave-7,home,home-wave-7,…}.{avif,webp}
// For /services, point DEFAULT_IMAGE in wave-grid-backdrop.jsx at whichever one
// you keep; for the homepage, HOME_IMAGE in hero-backdrop.jsx.
//
// Neither target uses a dedicated export component. That is deliberate: the
// exported image has to be the composition the live canvas draws, and a second
// mounting of WaveGrid is exactly how the two would drift apart. The homepage
// target's route renders the real homepage for the same reason.
//
// Requires agent-browser (npm i -g agent-browser) — a headless browser is
// unavoidable for WebGL, and this keeps a ~300 MB Puppeteer download out of the
// project's dependencies for a script that runs a handful of times a year.

import {execFile} from "node:child_process";
import {existsSync} from "node:fs";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {promisify} from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

/* 1.6:1 matches REF_ASPECT in wave-grid.jsx — the ratio at which the live
   camera's field-of-view lock engages. Exporting at exactly that ratio is what
   lets object-fit: cover reproduce the camera's own reframing at every other
   aspect. 2560 wide covers a 1280px CSS hero at 2x. */
const WIDTH = 2560;
const HEIGHT = 1600;

const ORIGIN = process.env.EXPORT_ORIGIN ?? "http://localhost:3000";
const OUT_DIR = path.join("public", "images", "wave-grid");

/* Where each page's grid lives, and what its files are called.
   `curated` is the name of the hand-composed default; variants get a suffix.

   ⚠️ The homepage target drives /preview/home-wave and NOT `/`, even though the
   two render the same hero from the same component. Repointing it at `/` was
   tried and reverted: `agent-browser open` never returned on `/` and no image
   was written, where the preview route captures in about half a minute. The
   likely difference is the branded loader overlay, which HeroLoadingProvider
   mounts on `/` and `/contact` only — but the cause was not pinned down. So the
   preview route is load-bearing for this script; do not delete it as a duplicate
   of `/` without re-testing this. */
const TARGETS = {
    services: {path: "/services", curated: "curated", variant: (v) => `wave-${v}`},
    home: {path: "/preview/home-wave", curated: "home", variant: (v) => `home-wave-${v}`},
};

// The page renders with alpha so the CSS background shows through; flattened
// here to the same $background-dark, since an image has nothing behind it.
const BACKGROUND = "#080c16";

const AVIF = {quality: 62, effort: 6};
const WEBP = {quality: 82};

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

/* Locating agent-browser without going through a shell.

   On Windows npm installs a global CLI as a .cmd shim. execFile cannot run a
   batch file, and routing through cmd.exe is worse than it looks: Node cannot
   safely quote an argument containing & for cmd, so the ?export=…&wave=N URL
   gets truncated at the ampersand and the command hangs on a half-parsed line.
   (`shell: true` has the same flaw plus DEP0190.)

   The shim is only a wrapper around a plain .js entry sitting in the same bin
   directory's node_modules, so find the shim on PATH and hand the JS straight to
   node. No shell, so argument quoting stops mattering entirely. */
const findBrowser = () => {
    if (process.platform !== "win32") return {cmd: "agent-browser", pre: []};

    for (const dir of (process.env.PATH ?? "").split(path.delimiter).filter(Boolean)) {
        if (!existsSync(path.join(dir, "agent-browser.cmd"))) continue;
        const entry = path.join(dir, "node_modules", "agent-browser", "bin", "agent-browser.js");
        if (existsSync(entry)) return {cmd: process.execPath, pre: [entry]};
    }
    return null;
};

const BIN = findBrowser();

const browser = async (...args) => {
    if (!BIN) throw new Error("agent-browser not found. Install it with: npm i -g agent-browser");
    try {
        // 20 MB: a 2560x1600 PNG data URL runs to about 3.3 MB, well past the default.
        const {stdout} = await run(BIN.cmd, [...BIN.pre, ...args], {maxBuffer: 20 * 1024 * 1024});
        return stdout;
    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error("agent-browser not found. Install it with: npm i -g agent-browser");
        }
        throw error;
    }
};

const evalInPage = async (js) =>
    JSON.parse((await browser("eval", "-b", Buffer.from(js).toString("base64"))).trim());

/* Two separate evals: readiness is polled with a cheap check, and the 3.3 MB
   data URL is fetched once the canvas is confirmed at full size. Measured, the
   difference is small — 0.32 s against 0.53 s per call, so a full 40-poll wait
   costs about 8 s extra, not the minutes an earlier version of this script
   appeared to hang for. That hang was the shell invocation (see findBrowser),
   not this. Kept split because reading the buffer only once it is known good is
   the clearer contract, not as a performance fix. */
const READY = `(() => {
  const c = document.querySelector('canvas');
  return c ? (c.width + 'x' + c.height) : 'none';
})()`;

/* Read the canvas rather than screenshotting the page: a screenshot would carry
   the navbar, the cookie banner and whatever else is painted over the hero, and
   would be capped at the browser window's size. toDataURL returns exactly the
   pixels three.js drew, at the dimensions we asked for — and works only because
   ?export= turns on preserveDrawingBuffer. */
const GRAB = `document.querySelector('canvas').toDataURL('image/png')`;

const capture = async (target, name, query) => {
    const url = `${ORIGIN}${target.path}?export=${WIDTH}x${HEIGHT}${query}`;
    await browser("open", url);

    // The chunk is lazily imported, then the scene builds and compiles shaders.
    // Poll instead of a flat sleep so a fast machine isn't punished and a slow
    // one isn't cut off mid-compile.
    const want = `${WIDTH}x${HEIGHT}`;
    let ready = false;
    for (let attempt = 0; attempt < 40 && !ready; attempt++) {
        await new Promise((r) => setTimeout(r, 500));
        ready = (await evalInPage(READY)) === want;
    }
    if (!ready) throw new Error(`${name}: canvas never reached ${want}`);

    const dataUrl = await evalInPage(GRAB);
    const png = Buffer.from(dataUrl.split(",")[1], "base64");
    const base = sharp(png).flatten({background: BACKGROUND});

    const avif = await base.clone().avif(AVIF).toBuffer();
    const webp = await base.clone().webp(WEBP).toBuffer();

    await writeFile(path.join(OUT_DIR, `${name}.avif`), avif);
    await writeFile(path.join(OUT_DIR, `${name}.webp`), webp);

    console.log(`  ${name.padEnd(12)} avif ${kb(avif.length).padStart(7)}   webp ${kb(webp.length).padStart(7)}`);
};

const args = process.argv.slice(2);
const pageArg = args.find((a) => a.startsWith("--page="))?.slice("--page=".length) ?? "services";
const variants = args.filter((a) => !a.startsWith("--"));

// hasOwn, not a plain lookup: --page=constructor would otherwise resolve to
// something off Object.prototype and walk straight past the guard below.
const target = Object.hasOwn(TARGETS, pageArg) ? TARGETS[pageArg] : null;
if (!target) {
    throw new Error(`Unknown --page=${pageArg}. Expected one of: ${Object.keys(TARGETS).join(", ")}`);
}

await mkdir(OUT_DIR, {recursive: true});
console.log(`Exporting ${WIDTH}x${HEIGHT} from ${ORIGIN}${target.path}\n`);

try {
    if (variants.length === 0) {
        await capture(target, target.curated, "");
    } else {
        for (const v of variants) {
            if (!/^\d+$/.test(v)) throw new Error(`Not a variant number: ${v}`);
            await capture(target, target.variant(v), `&wave=${v}`);
        }
    }
} finally {
    // Leaving the session open would hold a browser process after the script exits.
    await browser("close", "--all").catch(() => {});
}

console.log(`\nWritten to ${OUT_DIR}`);
