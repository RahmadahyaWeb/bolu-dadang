# Bolu Dadang — Landing Page

Landing page statis untuk **Bolu Dadang**, usaha kue bolu kelemben di Banjarmasin.
Stack: Astro 7 (static) + Tailwind CSS 4. Tidak ada backend.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output ke dist/
npm run preview  # preview build
npm run verify   # cek artefak build
npm test         # uji helper waLink
```

## Mengganti data bisnis

Semua data bisnis ada di `src/data/business.ts`. Edit file itu, lalu `npm run build`.

Yang wajib diisi sebelum publikasi (tandai `TODO(owner)`):
- `sizes[].priceFrom` (harga per ukuran, rupiah utuh, mis. `50000`).
- `hours` jika jam buka berubah.
- `testimonials` → ganti 3 kutipan contoh dengan ulasan asli, lalu set `testimonialsAreExamples: false`.
- `links.instagram` jika ada akun Instagram.

Nomor WhatsApp disimpan di `business.phone` dalam bentuk digit `62…` (mis. `6281247189174`).

## Mengganti foto

Semua foto disimpan lokal di `src/assets/`:

- `src/assets/hero.jpg` — foto hero.
- `src/assets/products/original.jpg`, `pandan.jpg`, `coklat.jpg`, `zebra.jpg` — foto varian.
- `src/assets/gallery/01.jpg` … `06.jpg` — galeri.
- `src/assets/about-texture.jpg` — tekstur/crumb (dipakai di section Tentang).
- `public/og.jpg` — gambar Open Graph (1200×630).

Cukup timpa file dengan nama yang sama; `npm run build` akan memproses ulang.
Foto placeholder saat ini berasal dari Unsplash dan Wikimedia Commons; lihat `CREDITS.md`.

## Deploy

Output statis ada di `dist/`. Dapat di-deploy ke Vercel, Netlify, atau Cloudflare Pages.
Jangan lupa set `site` di `astro.config.mjs` ke domain final sebelum deploy (untuk canonical & OG).
