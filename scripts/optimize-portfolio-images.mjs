// Bulk-normalise portfolio screenshots for the recent-works cards.
// Drop raw captures (png/jpg/webp, any size) into ./raw-screenshots, run
// `npm run images:portfolio`, and each file comes out in
// public/images/portfolio as a kebab-cased .webp, downscaled to 1280px wide
// (2x the card's 640px max render width — enough for retina, never upscaled).
//
// Usage: node scripts/optimize-portfolio-images.mjs [input-dir]

import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1280;
const QUALITY = 80;
const EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

const inputDir = process.argv[2] ?? "raw-screenshots";
const outDir = path.join("public", "images", "portfolio");

const slugify = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

let entries;
try {
  entries = await readdir(inputDir);
} catch {
  console.error(`Input folder "${inputDir}" not found. Create it and drop your screenshots inside.`);
  process.exit(1);
}

const files = entries.filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()));
if (files.length === 0) {
  console.log(`No images found in "${inputDir}" (accepted: ${[...EXTENSIONS].join(", ")}).`);
  process.exit(0);
}

await mkdir(outDir, { recursive: true });

for (const file of files) {
  const src = path.join(inputDir, file);
  const slug = slugify(path.parse(file).name);
  const dest = path.join(outDir, `${slug}.webp`);

  const { size: rawSize } = await stat(src);
  const image = sharp(src);
  const { width, height } = await image.metadata();

  if (width < WIDTH) {
    console.warn(`⚠ ${file}: only ${width}px wide (target ${WIDTH}px) — kept as-is, may look soft on retina.`);
  }

  const info = await image
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest);

  console.log(
    `${file} (${width}×${height}, ${kb(rawSize)}) → ${path.posix.join("images", "portfolio", `${slug}.webp`)} (${info.width}×${info.height}, ${kb(info.size)})`
  );
}

console.log(`\n${files.length} image(s) written to ${outDir}. Update src/data/portfolio-data.js to point at them.`);
