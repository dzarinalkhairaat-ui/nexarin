import ProductsPage from "@/features/products/ProductsPage";

export const metadata = {
  title: "Nexarin Produk - Katalog Digital",
  description:
    "Jelajahi Nexarin Produk (Nexarin products), katalog digital berisi template, source code, AI tools, PPOB starter, ebook, dan layanan custom dari Nexarin by-rins.",
  keywords: [
    "Nexarin Produk",
    "Nexarin products",
    "produk digital Nexarin",
    "katalog Nexarin",
    "beli produk Nexarin"
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Nexarin Produk - Katalog Digital by-rins",
    description:
      "Katalog digital Nexarin Produk menyediakan template, source code, AI tools, PPOB starter, ebook, dan layanan custom.",
    url: "https://nexarin.my.id/products",
    siteName: "Nexarin",
    locale: "id_ID",
    type: "website",
  },
};

export default function ProductsRoute() {
  return <ProductsPage />;
}