import AdminMapsPage from "@/features/admin/modules/AdminMapsPage";

export const metadata = {
  title: "Admin Maps Settings",
  description: "Pengaturan Peta dan Lokasi Admin Nexarin",
  robots: { index: false, follow: false },
};

export default function AdminMapsRoute() {
  return <AdminMapsPage />;
}
