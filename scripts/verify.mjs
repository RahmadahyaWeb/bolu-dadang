import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const htmlPath = join(dist, "index.html");
if (!existsSync(htmlPath)) {
  console.error("verify: dist/index.html tidak ada. Jalankan `npm run build` dulu.");
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const errors = [];

function check(label, ok) {
  if (!ok) errors.push(label);
}

// 1. satu h1
check("harus ada tepat satu <h1>", (html.match(/<h1\b/g) || []).length === 1);

// 2. section id wajib
for (const id of ["menu", "tentang", "cara-pesan", "galeri", "testimoni", "lokasi", "faq"]) {
  check(`section #${id} harus ada`, new RegExp(`id=["']${id}["']`).test(html));
}

// 3. semua wa.me diawali 62 dan punya text=
const waLinks = [...html.matchAll(/href=["']([^"']*wa\.me[^"']*)["']/g)].map((m) => m[1]);
for (const link of waLinks) {
  check(`wa.me harus https://wa.me/62... : ${link}`, /^https:\/\/wa\.me\/62/.test(link));
  check(`wa.me harus punya ?text= : ${link}`, /\?text=/.test(link));
}

// 4. tidak ada marker terlarang
for (const bad of ["TODO", "lorem", "http://"]) {
  check(`tidak boleh ada "${bad}" di HTML`, !html.includes(bad));
}
check('tidak boleh ada src=""', !/src=["']\s*["']/.test(html));

// 5. meta & JSON-LD
check("lang=id", /<html[^>]*\slang=["']id["']/.test(html));
check("<title> ada", /<title>[^<]+<\/title>/.test(html));
check("meta description ada", /<meta[^>]+name=["']description["']/.test(html));
check("canonical ada", /<link[^>]+rel=["']canonical["']/.test(html));
check("og:image ada", /<meta[^>]+property=["']og:image["']/.test(html));

const ld = [...html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g)];
check("JSON-LD minimal satu", ld.length >= 1);
for (const m of ld) {
  try {
    JSON.parse(m[1]);
  } catch (e) {
    errors.push(`JSON-LD tidak valid: ${e.message}`);
  }
}

// 6. file gambar yang direferensikan ada di dist
const imgSrcs = [...html.matchAll(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|avif|svg))["']/g)].map((m) => m[1]);
for (const src of imgSrcs) {
  if (src.startsWith("http")) continue;
  const clean = src.replace(/^\//, "").split("?")[0];
  const full = join(dist, clean);
  check(`aset gambar ada: ${src}`, existsSync(full));
}

if (errors.length) {
  console.error("verify gagal:");
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}

console.log(`verify OK (${waLinks.length} tautan WA, ${ld.length} JSON-LD, ${imgSrcs.length} gambar).`);
