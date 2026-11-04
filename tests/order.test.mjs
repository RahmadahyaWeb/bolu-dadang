import test from "node:test";
import assert from "node:assert/strict";
import { buildOrderMessage } from "../src/lib/order.ts";

const products = [
  { id: "original", name: "Kelemben Original" },
  { id: "pandan", name: "Kelemben Pandan" },
];

test("pesan memuat item, qty, dan mode", () => {
  const msg = buildOrderMessage(
    [
      { productId: "pandan", qty: 2 },
      { productId: "original", qty: 1 },
    ],
    products,
    { name: "Rina", phone: "0812", fulfillment: "pickup" },
  );
  assert.match(msg, /Kelemben Pandan × 2/);
  assert.match(msg, /Kelemben Original × 1/);
  assert.match(msg, /Mode: Ambil di tempat/);
  assert.match(msg, /Nama: Rina/);
});

test("alamat hanya muncul untuk mode kirim", () => {
  const base = { name: "Rina", phone: "0812", address: "Jl. Mawar 1" };
  const pickup = buildOrderMessage([{ productId: "original", qty: 1 }], products, {
    ...base,
    fulfillment: "pickup",
  });
  const delivery = buildOrderMessage([{ productId: "original", qty: 1 }], products, {
    ...base,
    fulfillment: "delivery",
  });
  assert.doesNotMatch(pickup, /Alamat:/);
  assert.match(delivery, /Alamat: Jl. Mawar 1/);
});

test("tanggal dan catatan opsional", () => {
  const msg = buildOrderMessage([{ productId: "original", qty: 1 }], products, {
    name: "Rina",
    phone: "0812",
    fulfillment: "pickup",
    date: "2026-11-08",
    note: "Potong 8 bagian",
  });
  assert.match(msg, /Tanggal: 2026-11-08/);
  assert.match(msg, /Catatan: Potong 8 bagian/);
});

test("keranjang kosong menghasilkan string kosong", () => {
  assert.equal(
    buildOrderMessage([], products, { name: "R", phone: "0", fulfillment: "pickup" }),
    "",
  );
});
