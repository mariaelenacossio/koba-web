// pnpm media:film
// Compresses the full 60s film for Vercel Blob (it's too large for the repo).
import { resolve } from "node:path";
import { ensureDir, ffmpeg, localOut, masterFilm, sizeMB } from "./lib.mjs";

const src = masterFilm();
const film = resolve(ensureDir(localOut), "koba-film.mp4");

console.log("Encoding koba-film.mp4 (1080p H.264, AAC audio) ...");
ffmpeg([
  "-i",
  src,
  "-vf",
  "scale=1920:-2",
  "-c:v",
  "libx264",
  "-profile:v",
  "high",
  "-crf",
  "24",
  "-maxrate",
  "2.5M",
  "-bufsize",
  "5M",
  "-preset",
  "slow",
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-movflags",
  "+faststart",
  film,
]);
console.log(`  .media-out/koba-film.mp4: ${sizeMB(film).toFixed(2)} MB`);

// The film poster is the dining-room still (public/media/stills/dining-19.jpg),
// so the film and the hero don't open on the same frame. No separate file.
