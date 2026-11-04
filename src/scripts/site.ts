// Keranjang + interaksi halaman. Vanilla JS, dibundle Astro satu kali.
import {
  addItem,
  setQty,
  removeItem,
  readCart,
  writeCart,
  cartCount,
  cartSubtotal,
  MAX_QTY,
  type CartState,
} from "../lib/cart";
import { buildOrderMessage } from "../lib/order";
import { waLink } from "../lib/wa";

interface ProdukClient {
  id: string;
  slug: string;
  name: string;
  priceFrom?: number;
  image: string;
}

interface DataToko {
  phone: string;
  produk: ProdukClient[];
}

const dataEl = document.getElementById("data-toko");
const data: DataToko = dataEl
  ? (JSON.parse(dataEl.textContent || "{}") as DataToko)
  : { phone: "", produk: [] };
const produkById = new Map(data.produk.map((p) => [p.id, p]));

let state: CartState = readCart();

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function priceLabel(p: ProdukClient): string {
  return p.priceFrom === undefined ? "Tanya harga" : rupiah.format(p.priceFrom);
}

function totalLabel(): string {
  const sub = cartSubtotal(state, data.produk);
  return sub === null || sub === undefined
    ? "Total dihitung via WhatsApp"
    : `Subtotal: ${rupiah.format(sub)}`;
}

function announce(msg: string): void {
  const live = document.querySelector("[data-cart-live]");
  if (live) live.textContent = msg;
}

function syncBadges(): void {
  const n = cartCount(state);
  document.querySelectorAll<HTMLElement>("[data-cart-count]").forEach((el) => {
    el.textContent = String(n);
    el.hidden = n === 0;
  });
}

/* ---------- render ---------- */

function rowHtml(item: { productId: string; qty: number }): string {
  const p = produkById.get(item.productId);
  if (!p) return "";
  return `
    <li class="flex gap-4 border-b border-cokelat/12 py-4 last:border-b-0">
      <a href="/produk/${p.slug}" class="shrink-0">
        <img src="${p.image}" alt="" width="72" height="72" loading="lazy" class="h-[72px] w-[72px] rounded-md border border-cokelat/12 object-cover" />
      </a>
      <div class="flex flex-1 flex-col">
        <a href="/produk/${p.slug}" class="font-semibold leading-snug hover:text-pandan">${p.name}</a>
        <p class="mt-0.5 text-sm text-karamel">${priceLabel(p)}</p>
        <div class="mt-2 flex items-center gap-3">
          <div class="inline-flex items-center rounded-full border border-cokelat/25">
            <button type="button" data-cart-action="dec" data-id="${p.id}" aria-label="Kurangi jumlah ${p.name}" class="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cokelat/8">−</button>
            <span class="w-9 text-center text-base font-semibold" data-row-qty="${p.id}">${item.qty}</span>
            <button type="button" data-cart-action="inc" data-id="${p.id}" aria-label="Tambah jumlah ${p.name}" class="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cokelat/8"${item.qty >= MAX_QTY ? " disabled" : ""}>+</button>
          </div>
          <button type="button" data-cart-action="remove" data-id="${p.id}" class="min-h-11 px-2 text-sm text-karamel underline underline-offset-4 hover:text-galat">Hapus</button>
        </div>
      </div>
    </li>`;
}

function emptyHtml(): string {
  return `
    <div class="py-10 text-center">
      <p class="text-lg font-medium">Keranjang Anda masih kosong.</p>
      <a href="/katalog" class="btn btn-mentega mt-5">Lihat katalog</a>
    </div>`;
}

function renderDrawer(): void {
  const box = document.querySelector("[data-cart-drawer-items]");
  const foot = document.querySelector<HTMLElement>("[data-cart-drawer-foot]");
  if (!box) return;
  box.innerHTML = state.items.length
    ? `<ul>${state.items.map(rowHtml).join("")}</ul>`
    : emptyHtml();
  if (foot) {
    foot.hidden = state.items.length === 0;
    const total = foot.querySelector("[data-cart-drawer-total]");
    if (total) total.textContent = totalLabel();
  }
}

function renderPage(): void {
  const box = document.querySelector("[data-cart-page]");
  if (!box) return;
  if (!state.items.length) {
    box.innerHTML = emptyHtml();
    return;
  }
  box.innerHTML = `
    <ul class="border-t border-cokelat/12">${state.items.map(rowHtml).join("")}</ul>
    <div class="mt-8 flex flex-col gap-6 border-t border-cokelat/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-lg font-semibold" data-cart-page-total>${totalLabel()}</p>
      <div class="flex flex-wrap gap-3">
        <a href="/katalog" class="btn btn-ghost">Lihat katalog</a>
        <a href="/checkout" class="btn btn-pandan">Lanjutkan ke konfirmasi</a>
      </div>
    </div>`;
}

function renderSummary(): void {
  const box = document.querySelector("[data-checkout-summary]");
  if (!box) return;
  if (!state.items.length) {
    box.innerHTML = `
      <p class="font-medium">Keranjang Anda masih kosong.</p>
      <a href="/katalog" class="btn btn-mentega mt-4">Lihat katalog</a>`;
    return;
  }
  box.innerHTML = `
    <ul class="divide-y divide-cokelat/12">
      ${state.items
        .map((item) => {
          const p = produkById.get(item.productId);
          if (!p) return "";
          return `
            <li class="flex items-center gap-3 py-3">
              <img src="${p.image}" alt="" width="48" height="48" loading="lazy" class="h-12 w-12 rounded-md border border-cokelat/12 object-cover" />
              <div class="flex-1">
                <p class="font-medium leading-snug">${p.name}</p>
                <p class="text-sm text-karamel">${item.qty} × ${priceLabel(p)}</p>
              </div>
            </li>`;
        })
        .join("")}
    </ul>
    <p class="mt-4 text-lg font-semibold">${totalLabel()}</p>`;
}

function render(): void {
  renderDrawer();
  renderPage();
  renderSummary();

  // checkout: tombol submit mati + pesan inline saat keranjang kosong
  const submitBtn = document.querySelector<HTMLButtonElement>("[data-checkout-submit]");
  if (submitBtn) submitBtn.disabled = state.items.length === 0;
  const cartErr = document.querySelector("[data-error-for='keranjang']");
  if (cartErr) {
    cartErr.textContent =
      state.items.length === 0 ? "Keranjang masih kosong — pilih produk dulu." : "";
  }
}

function focusKatalogLink(): void {
  const link = document.querySelector<HTMLElement>("[data-checkout-summary] a[href='/katalog']");
  link?.focus();
}

function save(): void {
  writeCart(state);
  syncBadges();
  render();
}

/* ---------- drawer (keranjang) ---------- */

const drawer = document.querySelector<HTMLElement>("[data-cart-drawer]");
const navDrawer = document.querySelector<HTMLElement>("[data-nav-drawer]");
const navToggle = document.querySelector<HTMLElement>("[data-nav-toggle]");
let lastFocus: Element | null = null;

function openDrawer(): void {
  if (!drawer) return;
  lastFocus = document.activeElement;
  renderDrawer();
  drawer.hidden = false;
  document.body.style.overflow = "hidden";
  drawer.querySelector<HTMLElement>("[data-cart-close]")?.focus();
}

function closeDrawer(): void {
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus instanceof HTMLElement) lastFocus.focus();
}

function closeNav(): void {
  if (!navDrawer || navDrawer.hidden) return;
  navDrawer.hidden = true;
  navToggle?.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", (e) => {
  const t = e.target instanceof Element ? e.target : null;
  if (!t) return;

  if (t.closest("[data-cart-open]")) {
    openDrawer();
    return;
  }
  if (t.closest("[data-cart-close]") || t.closest("[data-cart-backdrop]")) {
    closeDrawer();
    return;
  }
  if (t.closest("[data-nav-toggle]")) {
    if (!navDrawer) return;
    const open = navDrawer.hidden;
    navDrawer.hidden = !open;
    navToggle?.setAttribute("aria-expanded", String(open));
    return;
  }

  // stepper lokal (PDP): ubah input di dalam [data-stepper]
  const stepBtn = t.closest<HTMLElement>("[data-step]");
  if (stepBtn) {
    const wrap = stepBtn.closest("[data-stepper]");
    const input = wrap?.querySelector<HTMLInputElement>("[data-qty]");
    if (input) {
      const next = Math.min(
        MAX_QTY,
        Math.max(1, (Number(input.value) || 1) + Number(stepBtn.dataset.step)),
      );
      input.value = String(next);
    }
    return;
  }

  // aksi item keranjang
  const actionBtn = t.closest<HTMLElement>("[data-cart-action]");
  if (actionBtn) {
    const id = actionBtn.dataset.id || "";
    const action = actionBtn.dataset.cartAction;
    const item = state.items.find((i) => i.productId === id);
    if (!item) return;
    if (action === "inc") state = addItem(state, id, 1);
    else if (action === "dec") state = setQty(state, id, item.qty - 1);
    else if (action === "remove") state = removeItem(state, id);
    save();
    announce(
      action === "remove"
        ? "Item dihapus dari keranjang."
        : `Keranjang diperbarui: ${cartCount(state)} item.`,
    );
    return;
  }

  // tambah ke keranjang (PDP)
  const addBtn = t.closest<HTMLElement>("[data-add-to-cart]");
  if (addBtn) {
    const id = addBtn.dataset.productId || "";
    const scope = addBtn.closest("[data-pdp]") || document;
    const input = scope.querySelector<HTMLInputElement>("[data-qty]");
    const qty = Math.min(MAX_QTY, Math.max(1, Number(input?.value) || 1));
    state = addItem(state, id, qty);
    save();
    const p = produkById.get(id);
    announce(`${p ? p.name : "Item"} ditambahkan ke keranjang.`);
    openDrawer();
    return;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (drawer && !drawer.hidden) closeDrawer();
  closeNav();
});

/* ---------- galeri PDP ---------- */

document.querySelectorAll<HTMLElement>("[data-gallery]").forEach((g) => {
  const main = g.querySelector<HTMLImageElement>("[data-gallery-main]");
  if (!main) return;
  g.querySelectorAll<HTMLElement>("[data-gallery-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      main.removeAttribute("srcset");
      main.removeAttribute("sizes");
      main.src = btn.dataset.full || main.src;
      main.alt = btn.dataset.alt || main.alt;
      g.querySelectorAll("[data-gallery-thumb]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn)),
      );
    });
  });
});

/* ---------- filter kategori + urutkan ---------- */

const knownKategori = new Set(["semua", "original", "pandan", "coklat", "zebra"]);

function applyFilter(kategori: string): void {
  document
    .querySelectorAll<HTMLElement>("[data-product-grid] > [data-kategori]")
    .forEach((card) => {
      card.hidden = kategori !== "semua" && card.dataset.kategori !== kategori;
    });
  document.querySelectorAll<HTMLElement>("[data-filter]").forEach((pill) => {
    const on = pill.dataset.filter === kategori;
    pill.classList.toggle("is-active", on);
    if (on) pill.setAttribute("aria-current", "true");
    else pill.removeAttribute("aria-current");
  });
}

if (document.querySelector("[data-filter-group]")) {
  const param = new URLSearchParams(location.search).get("kategori") || "semua";
  applyFilter(knownKategori.has(param) ? param : "semua");

  document.querySelector("[data-filter-group]")?.addEventListener("click", (e) => {
    const pill = (e.target instanceof Element ? e.target : null)?.closest<HTMLElement>("[data-filter]");
    if (!pill) return;
    e.preventDefault();
    const kategori = pill.dataset.filter || "semua";
    history.replaceState({}, "", `${location.pathname}?kategori=${kategori}`);
    applyFilter(kategori);
  });
}

document.querySelector<HTMLSelectElement>("[data-sort]")?.addEventListener("change", (e) => {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;
  const dir = (e.target as HTMLSelectElement).value;
  [...grid.children]
    .sort((a, b) => {
      const na = (a as HTMLElement).dataset.nama || "";
      const nb = (b as HTMLElement).dataset.nama || "";
      return dir === "za" ? nb.localeCompare(na, "id") : na.localeCompare(nb, "id");
    })
    .forEach((card) => grid.appendChild(card));
});

/* ---------- carousel testimoni ---------- */

document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((c) => {
  const track = c.querySelector<HTMLElement>("[data-carousel-track]");
  const counter = c.querySelector<HTMLElement>("[data-carousel-counter]");
  if (!track) return;
  const slides = [...track.children] as HTMLElement[];
  if (!slides.length) return;

  const step = () => slides[0].getBoundingClientRect().width + 24;
  const update = () => {
    if (!counter) return;
    const i = Math.min(slides.length, Math.round(track.scrollLeft / step()) + 1);
    counter.textContent = `${i} / ${slides.length}`;
  };

  c.querySelector("[data-carousel-prev]")?.addEventListener("click", () =>
    track.scrollBy({ left: -step(), behavior: "smooth" }),
  );
  c.querySelector("[data-carousel-next]")?.addEventListener("click", () =>
    track.scrollBy({ left: step(), behavior: "smooth" }),
  );
  track.addEventListener("scroll", update, { passive: true });
});

/* ---------- checkout ---------- */

const form = document.querySelector<HTMLFormElement>("[data-checkout-form]");

function setError(name: string, msg: string): void {
  const err = document.querySelector(`[data-error-for="${name}"]`);
  const field = form?.querySelector<HTMLElement>(`[name="${name}"]`);
  if (err) err.textContent = msg;
  if (field) field.setAttribute("aria-invalid", "true");
}

function clearErrors(): void {
  form?.querySelectorAll<HTMLElement>("[data-error-for]").forEach((el) => {
    el.textContent = "";
  });
  form?.querySelectorAll<HTMLElement>("[aria-invalid]").forEach((el) => {
    el.removeAttribute("aria-invalid");
  });
}

// alamat hanya relevan untuk mode kirim
const addressField = document.querySelector<HTMLElement>("[data-address-field]");
function syncAddressVisibility(): void {
  if (!addressField || !form) return;
  const mode = form.querySelector<HTMLInputElement>("input[name='mode']:checked");
  addressField.hidden = mode?.value !== "delivery";
}
form?.querySelectorAll("input[name='mode']").forEach((r) =>
  r.addEventListener("change", syncAddressVisibility),
);
syncAddressVisibility();

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  // keranjang kosong: jangan buka WhatsApp, tunjukkan pesan + fokus ke katalog
  if (state.items.length === 0) {
    setError("keranjang", "Keranjang masih kosong — pilih produk dulu.");
    focusKatalogLink();
    return;
  }

  clearErrors();

  const nama = form.querySelector<HTMLInputElement>("[name='nama']")?.value.trim() || "";
  const telp = form.querySelector<HTMLInputElement>("[name='telepon']")?.value.trim() || "";
  const mode = form.querySelector<HTMLInputElement>("input[name='mode']:checked")?.value;

  let firstInvalid: HTMLElement | null = null;

  if (!nama) {
    setError("nama", "Mohon isi nama Anda.");
    firstInvalid = firstInvalid || form.querySelector("[name='nama']");
  }
  if (!telp) {
    setError("telepon", "Mohon isi nomor WhatsApp Anda.");
    firstInvalid = firstInvalid || form.querySelector("[name='telepon']");
  } else if (!/^\+?[\d\s-]{9,}$/.test(telp)) {
    setError("telepon", "Nomor WhatsApp belum lengkap. Contoh: 081234567890.");
    firstInvalid = firstInvalid || form.querySelector("[name='telepon']");
  }
  if (!mode) {
    setError("mode", "Pilih Ambil di tempat atau Kirim.");
    firstInvalid = firstInvalid || form.querySelector("input[name='mode']");
  }

  if (firstInvalid instanceof HTMLElement) {
    firstInvalid.focus();
    return;
  }

  const msg = buildOrderMessage(state.items, data.produk, {
    name: nama,
    phone: telp,
    fulfillment: mode === "delivery" ? "delivery" : "pickup",
    date: form.querySelector<HTMLInputElement>("[name='tanggal']")?.value || undefined,
    address: form.querySelector<HTMLTextAreaElement>("[name='alamat']")?.value || undefined,
    note: form.querySelector<HTMLTextAreaElement>("[name='catatan']")?.value || undefined,
  });

  const url = waLink(data.phone, msg);
  if (!url) {
    announce("Nomor WhatsApp belum tersedia.");
    return;
  }
  // same-tab: tahan popup blocker di mobile & desktop
  window.location.assign(url);
});

/* ---------- init ---------- */

if (drawer) drawer.hidden = true;
syncBadges();
render();
