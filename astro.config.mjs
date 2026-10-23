// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://hyperfocus.es",
  integrations: [
    react(),
    sitemap({
      // Fuera del sitemap: páginas en construcción y textos legales.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, "");
        const excluded = ["/soluciones", "/trabajo", "/aviso-legal", "/privacidad", "/cookies"];
        return !excluded.some((p) => path === p || path.startsWith(p + "/"));
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
