import { Bodoni_Moda, Jost, Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";

// Weights are limited to 400, 500 and 600 across the site (DESIGN.md section 3).

// Variable font so the optical-size axis can sharpen hairlines at display sizes.
// CSS only ever asks for 400, 500 or 600.
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500"],
  variable: "--font-noto-serif-ethiopic",
  display: "swap",
  preload: false,
});

export const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500"],
  variable: "--font-noto-sans-ethiopic",
  display: "swap",
  preload: false,
});
