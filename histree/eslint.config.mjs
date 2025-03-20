import { defineConfig } from "eslint/config";
import globals from "globals";
//import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  {
    files: ["app/**/*.{js,mjs,cjs,ts,jsx,tsx}"], // Nur Dateien im `app`-Ordner
    ignores: ["node_modules/", "static/", "server/", "public/"], // Ignoriere diese Ordner
    languageOptions: {
      globals: globals.browser, // Browser-Globals wie `window` und `document`
      ecmaVersion: "latest", // Verwende die neueste ECMAScript-Version
      sourceType: "module", // Verwende ECMAScript-Module
      parser: tseslint.parser, // TypeScript-Parser
      parserOptions: {
        project: true, // TypeScript-Projektdatei (tsconfig.json) automatisch erkennen
      },
    },
    settings: {
      react: {
        version: "^19.0.0", // Manuell angegebene React-Version
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
    },
    rules: {
    },
  },
]);