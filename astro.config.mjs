import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// TODO(owner): ganti dengan domain final sebelum deploy.
export default defineConfig({
  site: "https://boludadang.example.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
