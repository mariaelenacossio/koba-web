import { readFileSync, statSync, writeFileSync } from "node:fs";
import subsetFont from "subset-font";
import { ethiopicChars } from "./ethiopic-chars.mjs";

/*
  Builds small Amharic fonts holding only the characters the site uses.
  The full Noto files (about 190KB each) stay in scripts/fonts/source; the
  subsets in app/fonts are what visitors download. Run after adding or
  changing Amharic copy:  pnpm fonts:ethiopic
*/

const fonts = [
  ["NotoSerifEthiopic-ethiopic-wght.woff2", "NotoSerifEthiopic-subset-wght.woff2"],
  ["NotoSansEthiopic-ethiopic-wght.woff2", "NotoSansEthiopic-subset-wght.woff2"],
];

// Spaces and common punctuation, so Amharic lines keep the font's own spacing.
const extras = " .,:;!?()-' ";
const text = ethiopicChars().join("") + extras;

for (const [source, target] of fonts) {
  const from = `scripts/fonts/source/${source}`;
  const to = `app/fonts/${target}`;
  // Variable weight axis is kept, so 400 and 500 both still work.
  const subset = await subsetFont(readFileSync(from), text, { targetFormat: "woff2" });
  writeFileSync(to, subset);
  console.log(
    `${to}: ${(statSync(from).size / 1024).toFixed(0)}KB -> ${(subset.length / 1024).toFixed(1)}KB`,
  );
}
console.log(`${ethiopicChars().length} Ethiopic characters.`);
