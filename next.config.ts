import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
