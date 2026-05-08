import AdminSupportPage from "@/features/admin/modules/AdminSupportPage";

export const metadata = {
  title: "Admin Support",
  description:
    "Admin Support Nexarin by-rins untuk pengelolaan data support, donasi manual, invoice, payment, dan status dukungan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSupportRoute() {
  return <AdminSupportPage />;
}