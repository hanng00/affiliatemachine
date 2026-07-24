import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  ssr: {
    // react-helmet-async ships CJS; bundle it so the SSR/prerender build can
    // resolve its named exports under Node ESM.
    noExternal: ["react-helmet-async"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@affiliate/analytics": resolve(__dirname, "../../packages/analytics/src"),
      "@affiliate/sites": resolve(__dirname, "../../packages/sites/src"),
      "@affiliate/seo": resolve(__dirname, "../../packages/seo/src"),
      "@affiliate/bike-benefit": resolve(__dirname, "../../domains/bike-benefit/src"),
    },
  },
});
