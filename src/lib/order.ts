import type { CartItem } from "./cart";

export type Fulfillment = "pickup" | "delivery";

export interface OrderDetails {
  name: string;
  phone: string;
  fulfillment: Fulfillment;
  date?: string;
  address?: string;
  note?: string;
}

export function buildOrderMessage(
  items: CartItem[],
  products: { id: string; name: string }[],
  details: OrderDetails,
): string {
  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? `- ${product.name} × ${item.qty}` : "";
    })
    .filter(Boolean);

  if (lines.length === 0) return "";

  const parts = [
    "Halo Bolu Dadang, saya mau pesan:",
    ...lines,
    "",
    `Mode: ${details.fulfillment === "pickup" ? "Ambil di tempat" : "Kirim"}`,
  ];

  if (details.date) parts.push(`Tanggal: ${details.date}`);
  if (details.name.trim()) parts.push(`Nama: ${details.name.trim()}`);
  if (details.phone.trim()) parts.push(`WA: ${details.phone.trim()}`);
  if (details.fulfillment === "delivery" && details.address?.trim()) {
    parts.push(`Alamat: ${details.address.trim()}`);
  }
  if (details.note?.trim()) parts.push(`Catatan: ${details.note.trim()}`);

  parts.push("", "Mohon konfirmasi harga dan ketersediaan.");
  return parts.join("\n");
}
