// Shared helpers for the media pipeline (ARCHITECTURE.md section 6).
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const publicMedia = resolve(root, "public/media");
export const localOut = resolve(root, ".media-out");

/** Load .env.local if present, without overriding variables already set. */
export function loadEnv() {
  const file = resolve(root, ".env.local");
  if (existsSync(file)) process.loadEnvFile(file);
}

/** Absolute path of the master film, from KOBA_MASTER_FILM. Exits with a clear message if missing. */
export function masterFilm() {
  loadEnv();
  const path = process.env.KOBA_MASTER_FILM;
  if (!path) fail("KOBA_MASTER_FILM is not set. Add it to .env.local (see .env.example).");
  if (!existsSync(path)) fail(`KOBA_MASTER_FILM points to a file that doesn't exist:\n  ${path}`);
  return path;
}

export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Run ffmpeg with the given arguments. Returns everything it printed (stdout, then stderr). */
export function ffmpeg(args, { quiet = true } = {}) {
  const result = spawnSync(
    ffmpegPath,
    ["-hide_banner", ...(quiet ? ["-loglevel", "error"] : []), "-y", ...args],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  if (result.status !== 0) fail(`ffmpeg failed:\n${result.stderr}`);
  return `${result.stdout}${result.stderr}`;
}

export function sizeMB(file) {
  return statSync(file).size / (1024 * 1024);
}

export function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}
