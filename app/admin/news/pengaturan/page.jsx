import AdminNewsSettingsPage from "@/features/admin/news/settings/AdminNewsSettingsPage";

export const metadata = {
  title: "Pengaturan News Admin",
  description:
    "Halaman pengaturan admin Nexarin News untuk update fitur News ke depan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewsSettingsRoute() {
  return <AdminNewsSettingsPage />;
}