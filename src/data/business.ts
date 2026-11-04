import type { ImageMetadata } from "astro";
import originalImg from "../assets/products/original.jpg";
import pandanImg from "../assets/products/pandan.jpg";
import coklatImg from "../assets/products/coklat.jpg";
import zebraImg from "../assets/products/zebra.jpg";

export interface Product {
  id: string;
  name: string;
  flavor: string;
  description: string;
  image: ImageMetadata;
  alt: string;
  badge?: string;
}

export interface Business {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Digit saja, diawali 62. String kosong = CTA WA disembunyikan. */
  phone: string;
  address: {
    street: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
    mapsQuery: string;
    mapsUrl: string;
  };
  hours: { days: string; time: string }[];
  products: Product[];
  sizes: { label: string; note?: string; priceFrom?: number }[];
  testimonialsAreExamples: boolean;
  testimonials: { quote: string; author: string; source?: string }[];
  faqs: { question: string; answer: string }[];
  /** Template pesan WA; {flavor} diganti nama varian. */
  orderTemplate: string;
}

export const business: Business = {
  name: "Bolu Dadang",
  shortName: "Bolu Dadang",
  tagline: "Kelemben lembut, fresh dari oven",
  description:
    "Bolu kelemben khas Banjarmasin yang dipanggang harian. Cocok untuk camilan keluarga, teman minum teh, dan oleh-oleh.",
  // TODO(owner): konfirmasi nomor ini adalah nomor WhatsApp bisnis yang siap dipublikasikan.
  phone: "6281247189174",
  address: {
    street: "Komplek Sejahtera Mandiri Asri Blok D No. 115",
    district: "",
    city: "Banjarmasin",
    province: "Kalimantan Selatan",
    postalCode: "",
    mapsQuery: "Komplek Sejahtera Mandiri Asri Blok D No. 115 Banjarmasin",
    mapsUrl:
      "https://www.openstreetmap.org/?mlat=-3.3194&mlon=114.5908#map=16/-3.3194/114.5908",
  },
  hours: [{ days: "Setiap hari", time: "10.00–17.00 WITA" }],
  products: [
    {
      id: "original",
      name: "Kelemben Original",
      flavor: "Original",
      description:
        "Bolu kelemben klasik dengan aroma mentega dan vanila. Lembut, manisnya pas.",
      image: originalImg,
      alt: "Sepotong bolu kelemben original di atas piring putih",
      badge: "Favorit",
    },
    {
      id: "pandan",
      name: "Kelemben Pandan",
      flavor: "Pandan",
      description:
        "Aroma pandan yang khas dengan tekstur lembut. Pilihan yang segar untuk sore hari.",
      image: pandanImg,
      alt: "Sepotong bolu pandan hijau di atas kertas roti",
    },
    {
      id: "coklat",
      name: "Kelemben Coklat",
      flavor: "Coklat",
      description:
        "Bolu lembut dengan rasa coklat pekat di setiap gigitan.",
      image: coklatImg,
      alt: "Bolu gulung coklat dengan isian krim putih",
    },
    {
      id: "coklat-zebra",
      name: "Kelemben Coklat Zebra",
      flavor: "Coklat Zebra",
      description:
        "Motif zebra coklat yang cantik dengan rasa lembut dan tidak berlebihan.",
      image: zebraImg,
      alt: "Bolu motif zebra coklat yang dipotong di atas piring",
    },
  ],
  // TODO(owner): isi priceFrom setelah daftar harga tersedia.
  sizes: [
    { label: "Kecil", note: "Cocok untuk 2–4 orang" },
    { label: "Besar", note: "Cocok untuk keluarga" },
  ],
  testimonialsAreExamples: true,
  testimonials: [
    {
      quote:
        "Lembutnya pas, manisnya nggak berlebihan. Cocok banget buat teman minum teh sore.",
      author: "Pelanggan",
      source: "Contoh",
    },
    {
      quote:
        "Pesan buat acara keluarga, semua suka. Prosesnya juga gampang lewat WhatsApp.",
      author: "Pelanggan",
      source: "Contoh",
    },
    {
      quote:
        "Wangi fresh dari oven, anak-anak langsung habis satu loyang.",
      author: "Pelanggan",
      source: "Contoh",
    },
  ],
  faqs: [
    {
      question: "Berapa lama kelemben bisa disimpan?",
      answer:
        "Kelemben paling nikmat disantap segar. Untuk penyimpanan, tanyakan saran terbaik sesuai varian lewat WhatsApp.",
    },
    {
      question: "Bisa dikirim ke luar kota?",
      answer:
        "Bisa dikirim via Gojek, Grab, atau ekspedisi. Biaya dan kemasan dikonfirmasi lewat WhatsApp sebelum pesanan diproses.",
    },
    {
      question: "Apakah bisa pesan untuk acara atau jumlah banyak?",
      answer:
        "Bisa. Hubungi WhatsApp untuk mengecek ketersediaan dan jadwal pemanggangan sebelum tanggal acara.",
    },
    {
      question: "Bagaimana cara membayar?",
      answer:
        "Pemesanan dan pembayaran diatur lewat WhatsApp. Detail pembayaran akan dikonfirmasi saat pesanan.",
    },
    {
      question: "Di mana bisa ambil pesanan?",
      answer:
        "Di Komplek Sejahtera Mandiri Asri Blok D No. 115, Banjarmasin. Buka setiap hari pukul 10.00–17.00 WITA.",
    },
  ],
  orderTemplate:
    "Halo Bolu Dadang, saya mau pesan Kelemben {flavor}. Boleh info harga dan ketersediaan?",
};
