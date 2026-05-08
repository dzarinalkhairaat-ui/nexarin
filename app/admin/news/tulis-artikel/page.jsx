import AdminNewsWritePage from "@/features/admin/news/write/AdminNewsWritePage";

export const metadata = {
  title: "Tulis Artikel News",
  description:
    "Halaman admin Nexarin News untuk menulis artikel baru, mengatur sumber, kategori, status, headline, featured, dan gambar artikel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewsWriteRoute() {
  return <AdminNewsWritePage />;
}