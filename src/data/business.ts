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
