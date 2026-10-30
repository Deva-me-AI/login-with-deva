import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "next/headers": path.resolve(
        __dirname,
        "examples/nextjs-credits/node_modules/next/headers.js",
      ),
      "@deva-me/login-with-deva/server": path.resolve(
        __dirname,
        "./src/ai-server.ts",
      ),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 50,
      },
    },
  },
});
