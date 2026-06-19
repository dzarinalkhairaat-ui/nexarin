import NewsPage from "@/features/news/NewsPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Nexarin News - Portal Berita Digital",
  description:
    "Nexarin News adalah portal informasi digital dari Nexarin by-rins. Temukan headline, artikel terbaru, berita populer, dan informasi seputar ekosistem Nexarin.",
  keywords: [
    "Nexarin News",
    "berita Nexarin",
    "artikel Nexarin",
    "Nexarin by-rins news",
    "berita digital Nexarin"
  ],
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Nexarin News - Portal Berita Digital",
    description:
      "Portal informasi digital Nexarin News berisi headline, artikel terbaru, berita populer, dan update ekosistem Nexarin by-rins.",
    url: "https://nexarin.my.id/news",
    siteName: "Nexarin",
    locale: "id_ID",
    type: "website",
  },
};

export default function NewsRoute() {
  return <NewsPage />;
}