// pnpm media:stills
// Extracts the gallery stills from the master film. For each timestamp in
// CLAUDE.md section 9 it scores every frame within half a second with
// ffmpeg's blurdetect filter and keeps the sharpest one.
//
// Output: 1920x1080 high-quality JPGs in public/media/stills. next/image serves
// them as AVIF and WebP at 1x and 2x, with explicit width and height.
// Also writes content/stills.generated.json and a labelled contact sheet in
// .media-out for review.
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ensureDir, ffmpeg, localOut, masterFilm, publicMedia, root } from "./lib.mjs";

// Scene and requested time in seconds, in film order. Starts from the list in
// CLAUDE.md section 9, with three swaps approved on 2026-10-13 for variety:
// dining 0:27 -> 0:28, gursha 0:40 -> 0:34, tej 0:54 -> 0:52.
const TARGETS = [
  ["patio", 2],
  ["patio", 6],
  ["coffee", 10],
  ["coffee", 14],
  ["dining", 19],
  ["dining", 24],
  ["dining", 28],
  ["gursha", 32],
  ["gursha", 34],
  ["gursha", 37],
  ["bar", 44],
  ["bar", 49],
  ["tej", 52],
  ["tej", 58],
];
const WINDOW = 0.5;
const WIDTH = 1920;
const HEIGHT = 1080;

const src = masterFilm();
const outDir = ensureDir(resolve(publicMedia, "stills"));

/** Returns { time, blur } for the sharpest frame (lowest blur score) in the window. */
function sharpestFrame(t) {
  const start = Math.max(0, t - WINDOW);
  const log = ffmpeg(
    [
      "-ss",
      String(start),
      "-t",
      String(WINDOW * 2),
      "-i",
      src,
      "-vf",
      "blurdetect,metadata=print:file=-",
      "-f",
      "null",
      "-",
    ],
    { quiet: false },
  );
  return parseFrames(log, start);
}

function parseFrames(text, start) {
  const frames = [];
  let pts = null;
  for (const line of text.split("\n")) {
    const time = line.match(/pts_time:([\d.]+)/);
    if (time) pts = Number(time[1]);
    const blur = line.match(/lavfi\.blur=([\d.]+)/);
    if (blur && pts !== null) frames.push({ time: start + pts, blur: Number(blur[1]) });
  }
  if (frames.length === 0) throw new Error(`No frames scored near ${start + WINDOW}s`);
  return frames.reduce((best, f) => (f.blur < best.blur ? f : best));
}

const manifest = [];
for (const [scene, t] of TARGETS) {
  const id = `${scene}-${String(t).padStart(2, "0")}`;
  const best = sharpestFrame(t);
  const file = resolve(outDir, `${id}.jpg`);
  ffmpeg([
    "-ss",
    best.time.toFixed(3),
    "-i",
    src,
    "-frames:v",
    "1",
    "-vf",
    `scale=${WIDTH}:${HEIGHT}`,
    "-q:v",
    "2",
    file,
  ]);
  manifest.push({
    id,
    scene,
    requested: t,
    chosen: Number(best.time.toFixed(3)),
    blur: Number(best.blur.toFixed(3)),
    src: `/media/stills/${id}.jpg`,
    width: WIDTH,
    height: HEIGHT,
  });
  console.log(`  ${id}: ${t}s -> ${best.time.toFixed(2)}s (blur ${best.blur.toFixed(2)})`);
}

writeFileSync(
  resolve(root, "content/stills.generated.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log("Wrote content/stills.generated.json");

// Contact sheet for review: 4 columns, each still labelled with its id and time.
const font = "/System/Library/Fonts/Supplemental/Arial.ttf";
const inputs = manifest.flatMap((m) => ["-i", resolve(outDir, `${m.id}.jpg`)]);
const label = (m) =>
  existsSync(font)
    ? `,drawtext=fontfile=${font}:text='${m.id}  ${m.chosen.toFixed(2)}s':x=12:y=12:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6`
    : "";
const cells = manifest.map((m, i) => `[${i}:v]scale=480:270${label(m)}[c${i}]`).join(";");
const blanks = 16 - manifest.length;
const pads = Array.from({ length: blanks }, (_, i) => `color=c=0x0e241b:s=480x270:d=1[b${i}]`).join(
  ";",
);
const all = [
  ...manifest.map((_, i) => `[c${i}]`),
  ...Array.from({ length: blanks }, (_, i) => `[b${i}]`),
].join("");
const sheet = resolve(ensureDir(localOut), "stills-contact-sheet.jpg");
ffmpeg([
  ...inputs,
  "-filter_complex",
  `${cells};${pads};${all}xstack=inputs=16:grid=4x4[out]`,
  "-map",
  "[out]",
  "-frames:v",
  "1",
  "-q:v",
  "3",
  sheet,
]);
console.log(`Wrote contact sheet: .media-out/stills-contact-sheet.jpg`);
