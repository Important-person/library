import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // TypeScript поддержка
  {
    files: ["**/*.{ts,js,mjs,cjs}"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,ts,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",
    },
  },

  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

