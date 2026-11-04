# Kredit & status foto

Semua foto di `src/assets/` dan `public/og.jpg` saat ini adalah **ilustrasi AI** yang dibuat dengan Gemini / Nano Banana, bukan foto produk asli. Prompt tersimpan di `docs/image-prompts.md`.

## Status

| File | Sumber | Status |
|---|---|---|
| `src/assets/hero.jpg` | AI (Nano Banana) | placeholder |
| `src/assets/products/original.jpg` | AI | placeholder |
| `src/assets/products/pandan.jpg` | AI | placeholder |
| `src/assets/products/coklat.jpg` | AI | placeholder |
| `src/assets/products/zebra.jpg` | AI | placeholder |
| `src/assets/gallery/01–06.jpg` | AI | placeholder |
| `src/assets/about-texture.jpg` | AI (crop galeri 4) | placeholder |
| `public/og.jpg` | AI (crop hero) | placeholder |

## Sebelum publikasi

1. Ganti dengan foto asli Bolu Dadang (minimal hero, 4 varian, dan 3 galeri).
2. Timpa file dengan nama yang sama, lalu `npm run build`.
3. Perbarui alt text di `src/data/business.ts`, `Hero.astro`, `About.astro`, dan `Gallery.astro` bila isi foto berubah.
4. Hapus catatan "Foto ilustrasi AI" di footer setelah semua foto asli terpasang.

Gambar AI memiliki watermark SynthID tak terlihat dan **tidak boleh** dipakai sebagai bukti produk nyata di halaman yang sudah tayang.

## Peta

`public/map.jpg` dihasilkan dari OpenStreetMap (© OpenStreetMap contributors, ODbL) pada koordinat perkiraan Banjarmasin. Atribusi ditampilkan di bawah peta. Perbarui gambar bila alamat/koordinat final sudah pasti.
