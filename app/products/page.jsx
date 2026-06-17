import ProductsPage from "@/features/products/ProductsPage";

export const metadata = {
  title: "Products",
  description:
    "Katalog produk digital Nexarin by-rins berisi template, source code, AI tools, PPOB starter, ebook, dan layanan custom digital.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Products - Nexarin by-rins",
    description:
      "Katalog produk digital Nexarin by-rins untuk template, source code, AI tools, PPOB starter, ebook, dan layanan custom.",
    url: "https://nexarin.my.id/products",
  },
};

export default function ProductsRoute() {
  return <ProductsPage />;
}