import test from "node:test";
import assert from "node:assert/strict";
import { waLink } from "../src/lib/wa.ts";

const msg = "Halo, saya mau pesan Kelemben Pandan?";

test("nomor lokal 08 dinormalkan ke 62", () => {
  assert.equal(
    waLink("0852-4870-9230", msg),
    `https://wa.me/6285248709230?text=${encodeURIComponent(msg)}`,
  );
});

test("nomor +62 dengan spasi dinormalkan", () => {
  assert.equal(
    waLink("+62 852 4870 9230", msg),
    `https://wa.me/6285248709230?text=${encodeURIComponent(msg)}`,
  );
});

test("nomor yang sudah diawali 62 tidak diubah", () => {
  assert.equal(
    waLink("6281247189174", "Halo"),
    "https://wa.me/6281247189174?text=Halo",
  );
});

test("nomor tanpa 0 di depan tetap diberi 62", () => {
  assert.equal(
    waLink("81247189174", "Halo"),
    "https://wa.me/6281247189174?text=Halo",
  );
});

test("nomor kosong menghasilkan string kosong", () => {
  assert.equal(waLink("", msg), "");
  assert.equal(waLink("  -  ", msg), "");
});

test("karakter khusus pesan di-encode", () => {
  assert.ok(waLink("0852", "a&b c?d").endsWith("?text=a%26b%20c%3Fd"));
});
