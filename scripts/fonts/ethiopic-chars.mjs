import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/*
  Every Ethiopic character the site uses. The subset fonts are built from
  this list (pnpm fonts:ethiopic), and a unit test checks it against the
  fonts so new Amharic copy can't fall back to a system font unnoticed.
*/

export const SOURCE_DIRS = ["app", "components", "content", "lib", "emails"];
const EXTENSIONS = /\.(ts|tsx|json|css|mdx?)$/;
const ETHIOPIC = /[ሀ-᎟ⶀ-⷟꬀-꬯]/gu;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (EXTENSIONS.test(name)) yield path;
  }
}

/** Sorted, de-duplicated Ethiopic characters found under the source folders. */
export function ethiopicChars(root = process.cwd()) {
  const found = new Set();
  for (const dir of SOURCE_DIRS) {
    for (const file of files(join(root, dir))) {
      for (const ch of readFileSync(file, "utf8").match(ETHIOPIC) ?? []) found.add(ch);
    }
  }
  return [...found].sort();
}
