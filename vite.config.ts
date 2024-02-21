/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import postcssNesting from "postcss-nesting";
import autoprefixer from "autoprefixer";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "./" : "/",
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
  },
  css: {
    postcss: {
      plugins: [postcssNesting, autoprefixer({})],
    },
  },
});
