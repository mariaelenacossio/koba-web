import { readFileSync, statSync, writeFileSync } from "node:fs";
import fontverter from "fontverter";
import { Blob, Face } from "harfbuzzjs";
import subsetFont from "subset-font";
import { ethiopicChars } from "./ethiopic-chars.mjs";

/*
  Builds the fonts visitors download from the full files in scripts/fonts/source.
  - Every font keeps only the weights the CSS asks for (DESIGN.md section 3),
    so text renders exactly as before at a smaller size.
  - The Amharic fonts also keep only the characters the site uses.
  Run after adding Amharic copy or changing font weights:  pnpm fonts
*/

// Spaces and common punctuation, so Amharic lines keep the font's own spacing.
const ETHIOPIC_EXTRAS = " .,:;!?()-' ";

const fonts = [
  // Latin fonts: every character, weights limited. Bodoni keeps optical size.
  {
    from: "BodoniModa-latin-opsz-wght.woff2",
    to: "BodoniModa-latin-opsz-wght.woff2",
    wght: [400, 600],
  },
  { from: "Jost-latin-wght.woff2", to: "Jost-latin-wght.woff2", wght: [400, 500] },
  // Amharic: only the characters on the site, weights limited.
  {
    from: "NotoSerifEthiopic-ethiopic-wght.woff2",
    to: "NotoSerifEthiopic-subset-wght.woff2",
    wght: [400, 500],
    ethiopic: true,
  },
  {
    from: "NotoSansEthiopic-ethiopic-wght.woff2",
    to: "NotoSansEthiopic-subset-wght.woff2",
    wght: [400, 500],
    ethiopic: true,
  },
];

async function allCharacters(buffer) {
  const face = new Face(new Blob(await fontverter.convert(buffer, "sfnt")));
  return String.fromCodePoint(...face.collectUnicodes());
}

for (const font of fonts) {
  const from = `scripts/fonts/source/${font.from}`;
  const to = `app/fonts/${font.to}`;
  const source = readFileSync(from);
  const text = font.ethiopic
    ? ethiopicChars().join("") + ETHIOPIC_EXTRAS
    : await allCharacters(source);
  const [min, max] = font.wght;
  const built = await subsetFont(source, text, {
    targetFormat: "woff2",
    variationAxes: { wght: { min, max } },
  });
  writeFileSync(to, built);
  const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
  console.log(`${to}: ${kb(statSync(from).size)} -> ${kb(built.length)}`);
}
console.log(`${ethiopicChars().length} Ethiopic characters.`);
