import AllProductsPage from "@/features/products/AllProductsPage";

export const metadata = {
  title: "Semua Produk",
  description:
    "Lihat semua produk digital Nexarin by-rins, mulai dari AI tools, PPOB starter, template, ebook, source code, dan layanan digital.",
  alternates: {
    canonical: "/products/semua",
  },
  openGraph: {
    type: "website",
    title: "Semua Produk - Nexarin by-rins",
    description:
      "Kumpulan semua produk digital Nexarin by-rins, termasuk AI tools, PPOB starter, template, ebook, source code, dan layanan digital.",
    url: "https://nexarin.my.id/products/semua",
    siteName: "Nexarin by-rins",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semua Produk - Nexarin by-rins",
    description:
      "Kumpulan semua produk digital Nexarin by-rins dalam satu halaman katalog.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductsAllRoute() {
  return <AllProductsPage />;
}