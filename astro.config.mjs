import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "bolu-dadang";
const owner = (process.env.GITHUB_REPOSITORY_OWNER ?? "USERNAME").toLowerCase();

export default defineConfig({
  site: `https://${owner}.github.io`,
  base: `/${repo}`,
  vite: {
    plugins: [tailwindcss()],
  },
});
