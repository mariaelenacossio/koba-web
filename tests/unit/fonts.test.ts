import { readFileSync } from "node:fs";
import fontverter from "fontverter";
import { Blob, Face } from "harfbuzzjs";
import { describe, expect, it } from "vitest";
import { ethiopicChars } from "../../scripts/fonts/ethiopic-chars.mjs";

const fonts = [
  "app/fonts/NotoSerifEthiopic-subset-wght.woff2",
  "app/fonts/NotoSansEthiopic-subset-wght.woff2",
];

async function face(path: string) {
  const sfnt = await fontverter.convert(readFileSync(path), "sfnt");
  return new Face(new Blob(sfnt));
}

describe("Amharic subset fonts", () => {
  const used = ethiopicChars() as string[];

  it.each(fonts)("%s covers every Amharic character on the site", async (path) => {
    const covered = new Set((await face(path)).collectUnicodes());
    const missing = used.filter((ch) => !covered.has(ch.codePointAt(0)!));
    // If this fails, run `pnpm fonts` and commit the new fonts.
    expect(missing, `Missing from ${path}: ${missing.join(" ")}`).toEqual([]);
  });

  it.each(fonts)("%s keeps the weight axis for 400 and 500", async (path) => {
    const wght = (await face(path)).getAxisInfos().wght;
    expect(wght?.min).toBeLessThanOrEqual(400);
    expect(wght?.max).toBeGreaterThanOrEqual(500);
  });
});

describe("Latin fonts", () => {
  // Weight ranges are trimmed to what the CSS asks for; these must stay.
  it("Bodoni Moda keeps weights 400 to 600 and optical size", async () => {
    const axes = (await face("app/fonts/BodoniModa-latin-opsz-wght.woff2")).getAxisInfos();
    expect(axes.wght?.min).toBeLessThanOrEqual(400);
    expect(axes.wght?.max).toBeGreaterThanOrEqual(600);
    expect(axes.opsz).toBeDefined();
  });

  it("Jost keeps weights 400 to 500", async () => {
    const wght = (await face("app/fonts/Jost-latin-wght.woff2")).getAxisInfos().wght;
    expect(wght?.min).toBeLessThanOrEqual(400);
    expect(wght?.max).toBeGreaterThanOrEqual(500);
  });
});
