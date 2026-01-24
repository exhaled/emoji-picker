import { defineConfig } from "tsdown/config";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  inlineOnly: ["emojibase"],
  clean: true,
  format: ["esm", "cjs"],
  sourcemap: true,
});
