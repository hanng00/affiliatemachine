import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@affiliate/ui": resolve(__dirname, "../../packages/ui/src"),
      "@affiliate/analytics": resolve(__dirname, "../../packages/analytics/src"),
      "@affiliate/seo": resolve(__dirname, "../../packages/seo/src"),
    },
  },
});
