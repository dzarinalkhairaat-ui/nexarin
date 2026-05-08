import AdminProductsPage from "@/features/admin/modules/AdminProductsPage";

export const metadata = {
  title: "Admin Products",
  description:
    "Admin Products Nexarin by-rins untuk pengelolaan produk digital, kategori, harga, dan status produk.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminProductsRoute() {
  return <AdminProductsPage />;
}