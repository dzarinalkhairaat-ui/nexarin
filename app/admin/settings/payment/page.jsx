import AdminPaymentPage from "@/features/admin/modules/AdminPaymentPage";

export const metadata = {
  title: "Admin Payment Settings",
  description: "Pengaturan Metode Pembayaran Nexarin",
  robots: { index: false, follow: false },
};

export default function AdminPaymentRoute() {
  return <AdminPaymentPage />;
}
