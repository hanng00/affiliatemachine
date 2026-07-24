import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx() },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
  ssr: {
    // react-helmet-async ships CJS; bundle it so the SSR/prerender build can
    // resolve its named exports under Node ESM.
    noExternal: ["react-helmet-async"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@affiliate/ui": resolve(__dirname, "../../packages/ui/src"),
      "@affiliate/analytics": resolve(__dirname, "../../packages/analytics/src"),
      "@affiliate/sites": resolve(__dirname, "../../packages/sites/src"),
      "@affiliate/seo": resolve(__dirname, "../../packages/seo/src"),
      "@affiliate/mdx": resolve(__dirname, "../../packages/mdx/src"),
    },
  },
});
