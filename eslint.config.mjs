import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next already registers the jsx-a11y plugin with a handful of
  // rules. Apply the full strict rule set on top, without registering it twice.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      // ARIA tabs pattern: a tab panel without focusable content takes
      // tabIndex 0 so keyboard users can reach it. The recommended set allows
      // this; strict drops the exception, so restore it for tabpanel only.
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { tags: [], roles: ["tabpanel"], allowExpressionValues: true },
      ],
    },
  },
  // Formatting is Prettier's job; turn off any stylistic rules that overlap.
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**"]),
]);

export default eslintConfig;
