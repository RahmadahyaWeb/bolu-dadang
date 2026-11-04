import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const routes = [
  "index.html",
  "katalog/index.html",
  "produk/kelemben-original/index.html",
  "produk/kelemben-pandan/index.html",
  "produk/kelemben-coklat/index.html",
  "produk/kelemben-coklat-zebra/index.html",
  "keranjang/index.html",
  "checkout/index.html",
  "tentang/index.html",
  "lokasi/index.html",
];

const errors = [];
const pages = new Map();

function check(label, ok) {
  if (!ok) errors.push(label);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const distFiles = existsSync(dist) ? walk(dist) : [];

for (const route of routes) {
  const file = join(dist, route);
  if (!existsSync(file)) {
    errors.push(`route hilang: ${route}`);
    continue;
  }
  pages.set(route, readFileSync(file, "utf8"));
}

for (const [route, html] of pages) {
  const name = route.replace("/index.html", "") || "beranda";

  check(`${name}: tepat satu <h1>`, (html.match(/<h1\b/g) || []).length === 1);
  check(`${name}: lang=id`, /<html[^>]*\slang=["']id["']/.test(html));
  check(`${name}: <title>`, /<title>[^<]+<\/title>/.test(html));
  check(`${name}: meta description`, /<meta[^>]+name=["']description["']/.test(html));
  check(`${name}: canonical`, /<link[^>]+rel=["']canonical["']/.test(html));
  check(`${name}: og:image`, /<meta[^>]+property=["']og:image["']/.test(html));
  check(`${name}: tidak ada TODO`, !html.includes("TODO"));
  check(`${name}: tidak ada lorem`, !html.toLowerCase().includes("lorem"));
  check(`${name}: tidak ada src kosong`, !/src=["']\s*["']/.test(html));

  for (const m of html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      errors.push(`${name}: JSON-LD tidak valid: ${e.message}`);
    }
  }

  for (const m of html.matchAll(/href=["']([^"']+)["']/g)) {
    const href = m[1];
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) continue;
    if (href.startsWith("/_astro/") || href.startsWith("/map.jpg") || href.startsWith("/og.jpg")) continue;
    if (href.startsWith("/")) {
      const clean = href.split("?")[0].split("#")[0].replace(/\/$/, "");
      const candidates = [
        join(dist, clean.slice(1), "index.html"),
        join(dist, clean.slice(1) + ".html"),
      ];
      check(`${name}: link internal valid ${href}`, candidates.some((c) => existsSync(c)) || clean === "");
    }
  }
}

for (const [route, html] of pages) {
  for (const m of html.matchAll(/href=["']([^"']*wa\.me[^"']*)["']/g)) {
    check(`${route}: wa.me 62`, /^https:\/\/wa\.me\/62/.test(m[1]));
    check(`${route}: wa.me text`, /\?text=/.test(m[1]));
  }
}

const referenced = new Set();
for (const html of pages.values()) {
  for (const m of html.matchAll(/(?:src|srcset)=["']([^"']+)["']/g)) {
    for (const part of m[1].split(",")) {
      const src = part.trim().split(" ")[0];
      if (!src || src.startsWith("http")) continue;
      if (src.startsWith("/")) referenced.add(src.split("?")[0]);
    }
  }
}
for (const src of referenced) {
  check(`aset ada: ${src}`, distFiles.includes(join(dist, src.slice(1))));
}

if (errors.length) {
  console.error("verify gagal:");
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}

console.log(`verify OK (${pages.size} route, ${referenced.size} aset).`);
