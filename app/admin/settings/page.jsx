import AdminSettingsPage from "@/features/admin/modules/AdminSettingsPage";

export const metadata = {
  title: "Admin Settings",
  description:
    "Admin Settings Nexarin by-rins untuk pengaturan brand, logo, sosial media, SEO, sitemap, dan konfigurasi umum.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSettingsRoute() {
  return <AdminSettingsPage />;
}