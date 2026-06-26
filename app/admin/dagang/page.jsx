import AdminDagangPage from "@/features/admin/modules/AdminDagangPage";

export const metadata = {
  title: "Admin Dagang",
  description:
    "Admin Dagang Nexarin by-rins untuk pengelolaan produk digital, layanan, aset grafis, dan penjualan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDagangRoute() {
  return <AdminDagangPage />;
}
