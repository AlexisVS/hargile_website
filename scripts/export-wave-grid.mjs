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
//   node scripts/export-wave-grid.mjs --page=contact 7   # contact form backdrop
//   node scripts/export-wave-grid.mjs --page=home     # homepage hero, wide
//   node scripts/export-wave-grid.mjs --page=home 7   # homepage, variant 7
//   node scripts/export-wave-grid.mjs --page=phone    # homepage hero, phone frame
//   node scripts/export-wave-grid.mjs --page=tablet   # homepage hero, 641-1023px band
//
// Output: public/images/wave-grid/{curated,wave-7,home,home-wave-7,home-phone,
//         home-tablet,…}.{avif,webp}
// For the poster hero, point the `composition` prop on WaveGridBackdrop at the
// base name you keep — `wave-70` derives its own -phone and -tablet frames, so
// one name ships all three (/services takes DEFAULT_COMPOSITION, /faq passes
// its own). For the homepage, HOME_IMAGE / PHONE_IMAGE / TABLET_IMAGE in
// hero-backdrop.jsx.
//
// The `services*` targets write page-neutral names (`wave-70`, not
// `wave-70-faq`) because a composition belongs to a QUIET ZONE, not to a page,
// and /services and /faq share theirs. That is why exporting a /faq image
// through --page=services is correct rather than a shortcut.
//
// `home`, `phone` and `tablet` are the SAME hero at three aspects, and all three
// are shipped — none is a fallback for another. Re-export ALL THREE when the
// composition changes.
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
   lets object-fit: cover reproduce the camera's own reframing at nearby aspects.
   2560 wide covers a 1280px CSS hero at 2x. */
const WIDE = {w: 2560, h: 1600};

/* The phone render, and the reason it is a separate size rather than the same
   image cropped. `cover` reproduces the camera's reframing over a modest range
   of aspects; a 390x844 phone is 0.46:1 against the wide frame's 1.6:1, which
   keeps roughly its middle 29% and throws the rest away. Composing at the served
   aspect is the only way the phone gets a frame that was laid out for it.

   1170x2532 is a 390x844 CSS viewport at 3x — the common iPhone size, and the
   tallest common ratio, so shorter phones crop slightly rather than letterbox. */
const PHONE = {w: 1170, h: 2532};

/* The 641-1023px band: tablets and half-screen desktop windows. It used to
   borrow the wide frame, which is a two-column composition cropped by `cover`
   into a nearly-square window — the quiet zone ends up down the left while the
   layout there has already stacked into one full-width column, so the copy sits
   half over dark and half over lit.

   The phone frame cannot cover it either, and that was measured rather than
   assumed: at 0.8:1 `cover` keeps only the middle ~40% of the 0.46:1 phone
   render, and that middle is exactly its quiet band — all the light lives in the
   top and bottom thirds and is cropped away. It renders as a dead plate.

   0.8:1 is the geometric mean of the band's measured extremes: the hero
   backdrop runs 0.695 at 820x1180 and 0.938 at 1000x700, so this splits the
   worst-case crop evenly rather than favouring one end. 1600x2000 is ~2x at the
   768px-wide end and ~1.6x at the 1000px end. */
const TABLET = {w: 1600, h: 2000};

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
    services: {path: "/services", size: WIDE, curated: "curated", variant: (v) => `wave-${v}`},
    /* /services at the two one-column frames. Same route, same aspect-driven
       switch as the homepage pair below — wave-grid-backdrop.jsx reads the
       requested aspect through useWaveFrame and picks its band quiet zone.

       The variant suffix goes LAST (`wave-7-phone`, not `phone-wave-7`) so all
       three frames of one composition sort together in the directory listing,
       which is how you notice one of them wasn't re-exported. */
    "services-phone": {
        path: "/services", size: PHONE,
        curated: "curated-phone", variant: (v) => `wave-${v}-phone`,
    },
    "services-tablet": {
        path: "/services", size: TABLET,
        curated: "curated-tablet", variant: (v) => `wave-${v}-tablet`,
    },
    /* The contact form's backdrop. A third page with its own frames rather than
       a fourth consumer of the `services*` ones, and the reason is the quiet
       zone as always: /services and /faq and the four detail pages share one
       because they share a copy geometry, while /contact damps nothing at all
       (the form covers the frame — see contact-backdrop.jsx). A render with the
       hero's quiet ellipse baked in would put a dead patch under the form's
       left-hand labels.

       Measured, the box runs the same aspects as the heroes — 0.462 at 390x844,
       0.800 at 800x1000, 1.521 at 1440x900 — because both are viewport boxes.
       So PHONE/TABLET/WIDE are reused as-is; only the seeds and the damping
       differ. */
    contact: {path: "/contact", size: WIDE, curated: "contact", variant: (v) => `contact-${v}`},
    "contact-phone": {
        path: "/contact", size: PHONE,
        curated: "contact-phone", variant: (v) => `contact-${v}-phone`,
    },
    "contact-tablet": {
        path: "/contact", size: TABLET,
        curated: "contact-tablet", variant: (v) => `contact-${v}-tablet`,
    },
    home: {path: "/preview/home-wave", size: WIDE, curated: "home", variant: (v) => `home-wave-${v}`},
    /* Same route as `home` — the composition switch is the export ASPECT, not a
       flag. hero-backdrop.jsx maps the requested aspect onto one of three
       frames (see frameForAspect there), which is the same rule a browser window
       at that width follows, so `?wave=N` at phone or tablet width previews
       exactly what these write. A dedicated flag could disagree with the
       preview; an aspect cannot. */
    phone: {path: "/preview/home-wave", size: PHONE, curated: "home-phone", variant: (v) => `home-phone-${v}`},
    tablet: {path: "/preview/home-wave", size: TABLET, curated: "home-tablet", variant: (v) => `home-tablet-${v}`},
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

/* Our own browser session, rather than agent-browser's `default`.

   Found the hard way: agent-browser keeps one daemon per session name, and two
   processes touching `default` at once fails with

     A daemon for session 'default' started concurrently with different daemon
     configuration.

   — but only sometimes. The rest of the time the two just fight over the same
   browser and `open` never returns, which reads as this script hanging rather
   than as a conflict. That is exactly what happened: an export running here
   while someone drove agent-browser by hand in another terminal.

   A dedicated name makes the two independent, so exporting no longer depends on
   nobody else using the tool at the same time. It is also why the teardown below
   closes THIS session and not `--all`: `--all` would kill a session somebody else
   is in the middle of. */
const SESSION = "wave-export";

/* No single agent-browser command should take two minutes. A whole capture runs
   in about thirty seconds, so this only ever fires on the wedge described under
   SESSION — and firing is the entire point.

   Without it, a wedged daemon makes `open` wait forever: execFile has no default
   timeout, so the script sits there having printed its header and nothing else.
   That reads as "the export is slow" (the AVIF encode genuinely is) or as "the
   page is broken", and both send you looking in the wrong place. It cost a
   session once already. Fail loudly instead, and say what to do about it. */
const COMMAND_TIMEOUT = 120_000;

const browser = async (...args) => {
    if (!BIN) throw new Error("agent-browser not found. Install it with: npm i -g agent-browser");
    try {
        // 20 MB: a 2560x1600 PNG data URL runs to about 3.3 MB, well past the default.
        const {stdout} = await run(BIN.cmd, [...BIN.pre, "--session", SESSION, ...args], {
            maxBuffer: 20 * 1024 * 1024,
            timeout: COMMAND_TIMEOUT,
        });
        return stdout;
    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error("agent-browser not found. Install it with: npm i -g agent-browser");
        }
        // execFile marks a timeout kill with `killed`, not with a code.
        if (error.killed) {
            throw new Error(
                `agent-browser ${args[0]} timed out after ${COMMAND_TIMEOUT / 1000}s.\n`
                + "Almost always an orphaned daemon rather than the page. Clear it with:\n"
                + "  agent-browser close --all\n"
                + "then kill any chrome.exe whose command line contains agent-browser-chrome-\n"
                + "(a temp profile dir — never your own browser), and run this again alone.",
            );
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
    const {w, h} = target.size;
    const url = `${ORIGIN}${target.path}?export=${w}x${h}${query}`;
    await browser("open", url);

    // The chunk is lazily imported, then the scene builds and compiles shaders.
    // Poll instead of a flat sleep so a fast machine isn't punished and a slow
    // one isn't cut off mid-compile.
    const want = `${w}x${h}`;
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
console.log(`Exporting ${target.size.w}x${target.size.h} from ${ORIGIN}${target.path}\n`);

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
    // Leaving the session open would hold a browser process after the script
    // exits. Closes only our own session — see SESSION above for why not --all.
    await browser("close").catch(() => {});
}

console.log(`\nWritten to ${OUT_DIR}`);
