import test from "node:test";
import assert from "node:assert/strict";
import {
  addItem,
  cartCount,
  cartSubtotal,
  emptyCart,
  MAX_QTY,
  readCart,
  removeItem,
  setQty,
  writeCart,
  CART_KEY,
} from "../src/lib/cart.ts";

const products = [
  { id: "original", priceFrom: 50000 },
  { id: "pandan", priceFrom: 55000 },
  { id: "tanpa-harga" },
];

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
    key: () => null,
    length: 0,
  };
}

test("add menambah item dan menggabungkan qty", () => {
  let state = addItem(emptyCart(), "original", 1);
  state = addItem(state, "original", 2);
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].qty, 3);
});

test("qty dibatasi MAX_QTY", () => {
  let state = addItem(emptyCart(), "original", 1);
  state = setQty(state, "original", 999);
  assert.equal(state.items[0].qty, MAX_QTY);
});

test("qty 0 menghapus item", () => {
  let state = addItem(emptyCart(), "original", 1);
  state = setQty(state, "original", 0);
  assert.equal(state.items.length, 0);
});

test("remove menghapus item", () => {
  let state = addItem(emptyCart(), "original", 1);
  state = removeItem(state, "original");
  assert.equal(state.items.length, 0);
});

test("cartCount menjumlahkan qty", () => {
  let state = addItem(emptyCart(), "original", 2);
  state = addItem(state, "pandan", 3);
  assert.equal(cartCount(state), 5);
});

test("subtotal angka jika semua harga ada", () => {
  let state = addItem(emptyCart(), "original", 2);
  state = addItem(state, "pandan", 1);
  assert.equal(cartSubtotal(state, products), 155000);
});

test("subtotal null jika salah satu harga kosong", () => {
  let state = addItem(emptyCart(), "original", 1);
  state = addItem(state, "tanpa-harga", 1);
  assert.equal(cartSubtotal(state, products), null);
});

test("subtotal 0 untuk keranjang kosong", () => {
  assert.equal(cartSubtotal(emptyCart(), products), 0);
});

test("read/write roundtrip dan JSON rusak", () => {
  const store = memoryStorage();
  let state = addItem(emptyCart(), "original", 2);
  writeCart(state, store);
  assert.equal(readCart(store).items[0].qty, 2);

  store.setItem(CART_KEY, "{not json");
  assert.equal(readCart(store).items.length, 0);
});

test("item dengan qty negatif dibuang saat dibaca", () => {
  const store = memoryStorage();
  store.setItem(
    CART_KEY,
    JSON.stringify({ items: [{ productId: "original", qty: -2 }], updatedAt: 1 }),
  );
  assert.equal(readCart(store).items.length, 0);
});
