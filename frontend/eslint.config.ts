// @ts-nocheck
import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  // Next.js recommended config (includes web vitals + ts rules)
  next(),

  // Global ignores (override Next.js defaults)
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
