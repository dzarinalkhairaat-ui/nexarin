import NewsPage from "@/features/news/NewsPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "News",
  description:
    "News Nexarin by-rins adalah portal informasi digital berisi headline, artikel terbaru, berita populer, kategori, dan informasi ekosistem Nexarin.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "News - Nexarin by-rins",
    description:
      "Portal informasi digital Nexarin by-rins berisi headline, artikel terbaru, berita populer, kategori, dan update ekosistem Nexarin.",
    url: "https://nexarin.my.id/news",
  },
};

export default function NewsRoute() {
  return <NewsPage />;
}