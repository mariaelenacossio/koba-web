// pnpm media:hero
// Cuts the first 8 seconds of the master film into a muted hero loop
// (WebM VP9 and MP4 H.264, each under 3MB) plus the poster frame.
import { resolve } from "node:path";
import { ensureDir, fail, ffmpeg, localOut, masterFilm, publicMedia, sizeMB } from "./lib.mjs";

const MAX_MB = 3;
const src = masterFilm();
const out = ensureDir(publicMedia);
const passlog = resolve(ensureDir(localOut), "hero-vp9");
const scale = "scale=1600:-2,fps=30";

console.log("Encoding hero.mp4 ...");
ffmpeg([
  "-t",
  "8",
  "-i",
  src,
  "-an",
  "-vf",
  scale,
  "-c:v",
  "libx264",
  "-profile:v",
  "high",
  "-crf",
  "27",
  "-maxrate",
  "2.4M",
  "-bufsize",
  "4.8M",
  "-preset",
  "slow",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  resolve(out, "hero.mp4"),
]);

console.log("Encoding hero.webm (two-pass VP9) ...");
const vp9 = [
  "-t",
  "8",
  "-i",
  src,
  "-an",
  "-vf",
  scale,
  "-c:v",
  "libvpx-vp9",
  "-b:v",
  "2M",
  "-maxrate",
  "2.6M",
  "-row-mt",
  "1",
  "-deadline",
  "good",
  "-passlogfile",
  passlog,
];
ffmpeg([...vp9, "-pass", "1", "-cpu-used", "4", "-f", "webm", "/dev/null"]);
ffmpeg([...vp9, "-pass", "2", "-cpu-used", "2", resolve(out, "hero.webm")]);

console.log("Writing hero-poster.jpg (first frame, 1920px) ...");
ffmpeg([
  "-i",
  src,
  "-frames:v",
  "1",
  "-vf",
  "scale=1920:-2",
  "-q:v",
  "2",
  resolve(out, "hero-poster.jpg"),
]);

for (const name of ["hero.mp4", "hero.webm"]) {
  const mb = sizeMB(resolve(out, name));
  console.log(`  ${name}: ${mb.toFixed(2)} MB`);
  if (mb > MAX_MB) fail(`${name} is ${mb.toFixed(2)} MB, over the ${MAX_MB} MB budget.`);
}
console.log(`  hero-poster.jpg: ${sizeMB(resolve(out, "hero-poster.jpg")).toFixed(2)} MB`);
