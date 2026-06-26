import AdminContactPage from "@/features/admin/modules/AdminContactPage";

export const metadata = {
  title: "Admin Contact Settings",
  description: "Pengaturan Kontak Admin Nexarin",
  robots: { index: false, follow: false },
};

export default function AdminContactRoute() {
  return <AdminContactPage />;
}
