import AdminPage from "@/features/admin/AdminPage";

export const metadata = {
  title: "Admin",
  description:
    "Admin Dashboard Nexarin by-rins untuk pengelolaan produk, portfolio, news, support, dan settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRoute() {
  return <AdminPage />;
}