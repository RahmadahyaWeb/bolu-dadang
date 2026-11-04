# Bolu Dadang — Toko Online Statis

Situs multi-halaman untuk **Bolu Dadang**, usaha kue bolu kelemben di Banjarmasin.
Stack: Astro 7 (static) + Tailwind CSS 4. Tanpa backend; checkout berakhir di WhatsApp.

## Halaman

| Route | Isi |
|---|---|
| `/` | Beranda: hero, teaser katalog, tentang, nilai, testimoni, kontak |
| `/katalog` | Semua produk + filter kategori (`?kategori=pandan`) |
| `/produk/[slug]` | Detail produk, galeri, info, qty, tambah ke keranjang |
| `/keranjang` | Keranjang penuh, ubah qty, hapus |
| `/checkout` | Konfirmasi pesanan → pesan WhatsApp |
| `/tentang` | Cerita dan nilai usaha |
| `/lokasi` | Alamat, jam, peta statis OpenStreetMap |

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output ke dist/
npm run preview
npm run verify   # cek semua route & aset hasil build
npm test         # cart, order, wa
```

## Data

- **Kontak, alamat, jam, FAQ, testimoni:** `src/data/business.ts`
- **Produk & kategori:** `src/data/catalog.ts`
- **Keranjang:** `src/lib/cart.ts` (localStorage `bolu-cart-v1`)
- **Pesan checkout:** `src/lib/order.ts`

Yang wajib diisi sebelum publikasi (tandai `TODO(owner)`):
- `priceFrom` per produk di `catalog.ts` — selama kosong, UI menampilkan "Tanya harga".
- `ingredients`, `allergens`, `storage`, `packaging` — hanya jika sudah dikonfirmasi. Selama kosong, PDP menampilkan satu accordion CTA tanya via WhatsApp.
- `weight`, `servings` bila tersedia.
- `testimonials` → ganti kutipan contoh dengan ulasan asli, lalu set `testimonialsAreExamples: false`.
- Jam buka dan nomor WhatsApp di `business.ts`.

Nomor WhatsApp disimpan sebagai digit `62…` (mis. `6281247189174`). Nomor kosong = CTA WA disembunyikan.

## Keranjang & checkout

- Item disimpan di `localStorage`, bertahan setelah refresh dan antar halaman.
- Qty 1–20; qty 0 menghapus item.
- Subtotal hanya tampil jika semua produk punya `priceFrom`; jika tidak, "Dihitung via WhatsApp".
- Checkout mewajibkan nama, nomor WA, dan mode ambil/kirim. Tanggal, alamat, dan catatan opsional.
- Tombol checkout membentuk pesan terstruktur lalu membuka `wa.me`. Tidak ada pembayaran online.

## Foto

Semua foto lokal di `src/assets/`:

- `hero.jpg`, `products/{original,pandan,coklat,zebra}.jpg`
- `gallery/01.jpg` … `06.jpg`
- `about-texture.jpg`
- `public/og.jpg` (1200×630), `public/map.jpg` (OpenStreetMap)

Timpa file dengan nama sama, lalu `npm run build`. Foto saat ini adalah ilustrasi AI dan **wajib diganti foto asli** sebelum publikasi; lihat `CREDITS.md` dan `docs/image-prompts.md`.

## Verifikasi

- `npm run verify` memeriksa 10 halaman hasil build: satu `<h1>`, title/description/canonical/OG, JSON-LD, link internal, `wa.me/62`, aset, dan larangan `TODO`/`lorem`.
- `npm test` menguji `cart.ts`, `order.ts`, `wa.ts`.
- Screenshot QA (tidak di-commit) ada di `qa-screenshots/`.

## Deploy ke GitHub Pages

Situs di-deploy otomatis lewat `.github/workflows/deploy.yml` setiap push ke `main`.

1. Buat repo GitHub (mis. `bolu-dadang`), lalu push:
   ```bash
   git remote add origin https://github.com/<username>/bolu-dadang.git
   git push -u origin main
   ```
2. Di repo: **Settings → Pages → Source: GitHub Actions**.
3. URL hasil: `https://<username>.github.io/<repo>/` (mis. `/bolu-dadang/`).

`astro.config.mjs` membaca `GITHUB_REPOSITORY`/`GITHUB_REPOSITORY_OWNER` dari Actions untuk `site` dan `base`; tidak perlu edit manual. Semua link internal memakai helper `src/lib/path.ts`, jadi base otomatis ikut.

Jika memakai custom domain: set `base: "/"`, `site` ke domain, dan tambahkan `public/CNAME`.
