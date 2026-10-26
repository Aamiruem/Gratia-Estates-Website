import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SITE_URL } from "./site.config.js";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "site-url",
      transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", SITE_URL),
    },
  ],
  define: { __SITE_URL__: JSON.stringify(SITE_URL) },
  server: { port: 5173, host: true },
});
