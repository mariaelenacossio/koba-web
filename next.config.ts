import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF first, WebP as the fallback; the JPG sources are the last resort.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Defaults plus 540, the width of the portrait hero poster, so its srcset
    // can list its true size (components/hero/HeroVideo.tsx).
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 540],
    // Only our own media folder can be optimized, with no query strings.
    localPatterns: [{ pathname: "/media/**", search: "" }],
  },
  turbopack: {
    rules: {
      // Run Tailwind on global stylesheets only. CSS Modules (*.module.css)
      // keep their own handling so their class names stay scoped; they use
      // the design tokens through CSS variables, not Tailwind directives.
      "*.css": {
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
