import AdminScrapingNewsPage from "@/features/admin/scraping-news/AdminScrapingNewsPage";
import { getScrapedNews, getScrapingStats, getScraperLogs } from "@/features/admin/scraping-news/scraping.actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin - Hasil Scraping | Nexarin by-rins",
  description: "Halaman admin untuk review dan seleksi berita hasil scraping.",
};

export default async function ScrapingNewsRoute() {
  const result = await getScrapedNews();
  const initialData = result.ok ? result.data : [];
  
  const stats = await getScrapingStats();
  const logs = await getScraperLogs();

  return <AdminScrapingNewsPage initialData={initialData} stats={stats} logs={logs} />;
}
