import AdminNewsSocialMediaPage from "@/features/admin/news/social-media/AdminNewsSocialMediaPage";

export const metadata = {
  title: "Social Media News Admin",
  description:
    "Halaman integrasi social media admin Nexarin News.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewsSocialMediaRoute() {
  return <AdminNewsSocialMediaPage />;
}