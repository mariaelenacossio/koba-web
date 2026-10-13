// pnpm media:film:upload
// Uploads .media-out/koba-film.mp4 (from `pnpm media:film`) to Vercel Blob and
// records its public URL in content/media.generated.json for the film player.
//
// Auth: Vercel's OIDC flow, not a static read-write token. `vercel env pull`
// provides BLOB_STORE_ID and a short-lived VERCEL_OIDC_TOKEN; @vercel/blob reads
// both and refreshes the token in development using your `vercel login`
// session and the linked project in .vercel/project.json.
//
// The film is played straight from <video src>, so the store must be public.
// A private store only serves blobs through an authenticated function.
import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { head, put } from "@vercel/blob";
import { fail, loadEnv, localOut, root, sizeMB } from "./lib.mjs";

const ONE_YEAR = 60 * 60 * 24 * 365;

loadEnv();
if (!process.env.BLOB_STORE_ID || !process.env.VERCEL_OIDC_TOKEN) {
  fail(
    "Missing Blob credentials. Run `vercel env pull .env.vercel` in this folder and merge\n" +
      "BLOB_STORE_ID and VERCEL_OIDC_TOKEN into .env.local.",
  );
}

const file = resolve(localOut, "koba-film.mp4");
if (!existsSync(file)) fail("No .media-out/koba-film.mp4 yet. Run `pnpm media:film` first.");

// The film is cached for a year, so its URL carries a short content hash:
// a new encode gets a new URL, and re-uploading the same file is a no-op.
const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 10);
const PATHNAME = `film/koba-film-${hash}.mp4`;
const total = sizeMB(file);
console.log(`Uploading koba-film.mp4 (${total.toFixed(1)} MB) to ${PATHNAME} ...`);
let blob;
try {
  blob = await put(PATHNAME, createReadStream(file), {
    access: "public",
    contentType: "video/mp4",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: ONE_YEAR,
    multipart: true,
    // A stream has no known total, so the SDK's percentage stays at 0.
    // Report bytes sent against the file size instead.
    onUploadProgress: ({ loaded }) =>
      process.stdout.write(`\r  ${(loaded / 1048576).toFixed(1)} of ${total.toFixed(1)} MB`),
  });
} catch (error) {
  fail(
    `Upload failed: ${error.message}\n` +
      "If the store is private, connect a public Blob store to the project instead (see ARCHITECTURE.md section 6).",
  );
}
process.stdout.write("\n");

const meta = await head(blob.url);
const record = {
  film: {
    url: blob.url,
    pathname: blob.pathname,
    contentType: meta.contentType,
    size: meta.size,
    uploadedAt: meta.uploadedAt,
  },
};
writeFileSync(
  resolve(root, "content/media.generated.json"),
  `${JSON.stringify(record, null, 2)}\n`,
);
console.log(`Uploaded: ${blob.url}`);
console.log("Wrote content/media.generated.json");
