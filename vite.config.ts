import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

export default defineConfig({
  esbuild: {
    minifyIdentifiers: !isDev,
    minifySyntax: !isDev,
  },
  build: {
    minify: !isDev,
    sourcemap: isDev,
    lib: {
      entry: {
        index: "src/index.ts",
        components: "src/components.ts",
      },
      formats: ["es"],
    },
    assetsInlineLimit: 4096, // Assets smaller than 4kb will be inlined as base64
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "tailwindcss"],
      input: {
        index: path.resolve(__dirname, "src/index.ts"),
        components: path.resolve(__dirname, "src/components.ts"),
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          tailwindcss: "tailwindcss",
        },
        assetFileNames: "assets/[name].[ext]",
        entryFileNames: "[name].es.js",
      },
      watch: {
        exclude: ["example/**/*"],
      },
    },
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      exclude: ["example/**/*"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add type declaration for image imports
  optimizeDeps: {
    exclude: ["example/**/*"],
  },
});
