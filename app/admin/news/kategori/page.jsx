import AdminNewsCategoriesPage from "@/features/admin/news/categories/AdminNewsCategoriesPage";

export const metadata = {
  title: "Kategori News Admin",
  description:
    "Halaman admin Nexarin News untuk menambah dan mengelola kategori artikel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewsCategoriesRoute() {
  return <AdminNewsCategoriesPage />;
}