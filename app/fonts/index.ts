import localFont from "next/font/local";

/*
  Fonts are bundled in the repo (SIL Open Font License, see OFL-*.txt here) so
  builds never depend on fetching from Google. Variable woff2 files from
  Google Fonts, one subset each:
  - Bodoni Moda: latin, weight 400 to 600 plus the optical-size axis
  - Jost: latin, weight 400 to 500
  - Noto Serif and Sans Ethiopic: ethiopic, weight 400 to 500
  CSS only ever asks for 400, 500 or 600 (DESIGN.md section 3).
*/

export const bodoni = localFont({
  src: "./BodoniModa-latin-opsz-wght.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-bodoni",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const jost = localFont({
  src: "./Jost-latin-wght.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-jost",
  display: "swap",
  adjustFontFallback: "Arial",
});

// The Ethiopic files are about 190KB each, so they aren't preloaded: Amharic
// lines swap in once the font arrives instead of competing with the hero.
export const notoSerifEthiopic = localFont({
  src: "./NotoSerifEthiopic-ethiopic-wght.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-noto-serif-ethiopic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const notoSansEthiopic = localFont({
  src: "./NotoSansEthiopic-ethiopic-wght.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-noto-sans-ethiopic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
});
