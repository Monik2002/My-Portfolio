import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import postcssConfig from "../postcss.config.js";

test("Tailwind compiles the site's theme and class-based dark mode", async () => {
  assert.ok(postcssConfig.plugins["@tailwindcss/postcss"]);
  assert.equal(postcssConfig.plugins.tailwindcss, undefined);

  const input = path.resolve("src/index.css");
  const css = await readFile(input, "utf8");
  const result = await postcss([tailwind()]).process(css, { from: input });

  assert.match(result.css, /\.dark-bg\s*\{/);
  assert.match(result.css, /\.dark-bg\s*\{\s*background-color:\s*#121212/i);
  assert.match(result.css, /\.dark\\:bg-gray-700/);
  assert.match(result.css, /:where\(\.dark,\s*\.dark \*\)/);
  assert.match(result.css, /\.shadow-xs\s*\{/);
  assert.doesNotMatch(result.css, /@tailwind\s+(base|components|utilities)/);
});
