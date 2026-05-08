import AdminNewsArticlesPage from "@/features/admin/news/articles/AdminNewsArticlesPage";

export const metadata = {
  title: "Admin News Artikel",
  description:
    "Halaman admin Nexarin News untuk melihat, mengedit, dan mengelola seluruh artikel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewsArticlesRoute() {
  return <AdminNewsArticlesPage />;
}