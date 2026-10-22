import localFont from "next/font/local";

/*
  Fonts are bundled in the repo (SIL Open Font License, see OFL-*.txt here) so
  builds never depend on fetching from Google. Built by `pnpm fonts` from the
  variable Google Fonts files in scripts/fonts/source, each trimmed to the
  weights below:
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

// Amharic fonts are subsets holding only the characters the site uses (about
// 10KB each instead of 190KB; see scripts/fonts). They still aren't preloaded,
// so they never compete with the hero; Amharic lines swap in when they land.
export const notoSerifEthiopic = localFont({
  src: "./NotoSerifEthiopic-subset-wght.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-noto-serif-ethiopic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const notoSansEthiopic = localFont({
  src: "./NotoSansEthiopic-subset-wght.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-noto-sans-ethiopic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
});
