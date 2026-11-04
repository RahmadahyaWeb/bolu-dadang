import type { ImageMetadata } from "astro";
import originalImg from "../assets/products/original.jpg";
import pandanImg from "../assets/products/pandan.jpg";
import coklatImg from "../assets/products/coklat.jpg";
import zebraImg from "../assets/products/zebra.jpg";
import batterImg from "../assets/gallery/03.jpg";
import boxImg from "../assets/gallery/06.jpg";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "original" | "pandan" | "coklat" | "zebra";
  categoryLabel: string;
  flavor: string;
  description: string;
  longDescription: string;
  priceFrom?: number;
  weight?: string;
  servings?: string;
  ingredients?: string[];
  allergens?: string[];
  storage?: string;
  packaging?: string;
  images: ImageMetadata[];
  alt: string;
  badge?: string;
}

export const categories = [
  { id: "semua", label: "Semua" },
  { id: "original", label: "Original" },
  { id: "pandan", label: "Pandan" },
  { id: "coklat", label: "Coklat" },
  { id: "zebra", label: "Zebra" },
] as const;

// TODO(owner): isi berat, porsi, bahan, alergen, penyimpanan, dan kemasan
// hanya setelah dikonfirmasi. Selama kosong, PDP menampilkan CTA tanya via WhatsApp.
export const products: Product[] = [
  {
    id: "original",
    slug: "kelemben-original",
    name: "Kelemben Original",
    category: "original",
    categoryLabel: "Original",
    flavor: "Original",
    description:
      "Bolu kelemben klasik dengan aroma mentega dan vanila. Lembut, manisnya pas.",
    longDescription:
      "Bolu kelemben klasik yang dipanggang harian. Teksturnya lembut dengan rongga halus, dipotong tebal agar mudah disantap bersama teh atau kopi. Cocok untuk camilan keluarga dan oleh-oleh.",
    images: [originalImg, batterImg, boxImg],
    alt: "Satu loyang bolu kelemben original di atas talenan kayu",
    badge: "Favorit",
  },
  {
    id: "pandan",
    slug: "kelemben-pandan",
    name: "Kelemben Pandan",
    category: "pandan",
    categoryLabel: "Pandan",
    flavor: "Pandan",
    description:
      "Aroma pandan yang khas dengan tekstur lembut. Pilihan yang segar untuk sore hari.",
    longDescription:
      "Bolu kelemben dengan aroma pandan yang khas dan tekstur lembut. Warna hijaunya berasal dari pandan, memberi rasa segar yang tidak berlebihan. Nikmat disajikan bersama minuman hangat.",
    images: [pandanImg, batterImg, boxImg],
    alt: "Bolu kelemben pandan dengan crumb hijau pucat, dipotong di atas talenan",
  },
  {
    id: "coklat",
    slug: "kelemben-coklat",
    name: "Kelemben Coklat",
    category: "coklat",
    categoryLabel: "Coklat",
    flavor: "Coklat",
    description: "Bolu lembut dengan rasa coklat pekat di setiap gigitan.",
    longDescription:
      "Bolu kelemben dengan rasa coklat pekat dan tekstur lembut. Dipanggang harian, dipotong tebal, cocok untuk penggemar rasa coklat yang tidak terlalu manis.",
    images: [coklatImg, batterImg, boxImg],
    alt: "Bolu kelemben coklat dengan crumb coklat tua di atas talenan",
  },
  {
    id: "coklat-zebra",
    slug: "kelemben-coklat-zebra",
    name: "Kelemben Coklat Zebra",
    category: "zebra",
    categoryLabel: "Zebra",
    flavor: "Coklat Zebra",
    description:
      "Motif zebra coklat yang cantik dengan rasa lembut dan tidak berlebihan.",
    longDescription:
      "Bolu kelemben dengan motif zebra coklat yang terbentuk dari adonan coklat dan vanila. Tampilannya cantik untuk suguhan tamu, dengan rasa lembut yang tidak berlebihan.",
    images: [zebraImg, batterImg, boxImg],
    alt: "Bolu kelemben zebra dengan pola coklat berlapis di atas talenan",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
