import AdminNewsPage from "@/features/admin/news/AdminNewsPage";

export const metadata = {
  title: "Admin News",
  description:
    "Admin News Nexarin by-rins untuk pengelolaan artikel, kategori, headline, popular, draft, dan publish.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewsRoute() {
  return <AdminNewsPage />;
}