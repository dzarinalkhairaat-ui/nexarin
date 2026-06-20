"use client";

import React, { useState, useTransition, useEffect } from "react";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { 
  deleteScrapedNews, 
  pickScrapedNews, 
  runManualScraper, 
  clearScraperLogs,
  deleteMultipleScrapedNews,
  pickMultipleScrapedNews 
} from "./scraping.actions";
import { useRouter } from "next/navigation";

const GLOBAL_CATEGORIES = [
  "Terkini / Nasional", 
  "Politik", 
  "Ekonomi", 
  "Hukum", 
  "Olahraga", 
  "Hiburan", 
  "Gaya Hidup", 
  "Tekno", 
  "Otomotif", 
  "Internasional"
];

const RSS_SOURCES = {
  "CNN Indonesia": {
    "Terkini / Nasional": "https://www.cnnindonesia.com/nasional/rss",
    "Tekno": "https://www.cnnindonesia.com/teknologi/rss",
    "Olahraga": "https://www.cnnindonesia.com/olahraga/rss",
    "Hiburan": "https://www.cnnindonesia.com/hiburan/rss",
    "Gaya Hidup": "https://www.cnnindonesia.com/gaya-hidup/rss",
    "Ekonomi": "https://www.cnnindonesia.com/ekonomi/rss",
    "Internasional": "https://www.cnnindonesia.com/internasional/rss"
  },
  "Antara News": {
    "Terkini / Nasional": "https://www.antaranews.com/rss/terkini.xml",
    "Tekno": "https://www.antaranews.com/rss/tekno.xml",
    "Olahraga": "https://www.antaranews.com/rss/olahraga.xml",
    "Hiburan": "https://www.antaranews.com/rss/hiburan.xml",
    "Gaya Hidup": "https://www.antaranews.com/rss/lifestyle.xml",
    "Ekonomi": "https://www.antaranews.com/rss/ekonomi.xml",
    "Politik": "https://www.antaranews.com/rss/politik.xml",
    "Hukum": "https://www.antaranews.com/rss/hukum.xml",
    "Internasional": "https://www.antaranews.com/rss/dunia.xml"
  },
  "Tribunnews": {
    "Terkini / Nasional": "https://www.tribunnews.com/rss",
    "Tekno": "https://www.tribunnews.com/techno/rss",
    "Olahraga": "https://www.tribunnews.com/superskor/rss",
    "Hiburan": "https://www.tribunnews.com/seleb/rss",
    "Gaya Hidup": "https://www.tribunnews.com/lifestyle/rss",
    "Ekonomi": "https://www.tribunnews.com/bisnis/rss",
    "Otomotif": "https://www.tribunnews.com/otomotif/rss",
    "Internasional": "https://www.tribunnews.com/internasional/rss"
  },
  "Suara.com": {
    "Terkini / Nasional": "https://www.suara.com/rss/news",
    "Tekno": "https://www.suara.com/rss/tekno",
    "Olahraga": "https://www.suara.com/rss/bola",
    "Hiburan": "https://www.suara.com/rss/entertainment",
    "Gaya Hidup": "https://www.suara.com/rss/lifestyle",
    "Ekonomi": "https://www.suara.com/rss/bisnis",
    "Otomotif": "https://www.suara.com/rss/otomotif",
  }
};

export default function AdminScrapingNewsPage({ initialData = [], logs = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState(null);
  
  // Scraper State
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  
  const [isClearing, setIsClearing] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState("CNN Indonesia");
  const [selectedCategory, setSelectedCategory] = useState("Tekno");
  
  const targetUrl = RSS_SOURCES[selectedProvider]?.[selectedCategory] || null;
  
  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  const handleRunScraper = async () => {
    if (!targetUrl) return alert("URL Sumber RSS tidak tersedia untuk kategori ini.");
    
    setIsScraping(true);
    setScrapeProgress(0);
    
    // Simulasi progress bar pintar
    const interval = setInterval(() => {
      setScrapeProgress((prev) => {
        if (prev >= 90) return 90; // Tertahan di 90% sampai fetch selesai
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 600);
    
    const result = await runManualScraper(targetUrl);
    
    clearInterval(interval);
    setScrapeProgress(100); // Meloncat ke 100% setelah selesai
    
    setTimeout(() => {
      setIsScraping(false);
      setScrapeProgress(0);
      
      if (result.ok) {
        alert(result.message);
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert("Gagal menjalankan scraper: " + result.message);
      }
    }, 500); // Jeda sebentar agar user sempat melihat tulisan 100%
  };

  const handleClearLogs = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh log? Data ini tidak dapat dikembalikan.")) return;
    
    setIsClearing(true);
    const result = await clearScraperLogs();
    setIsClearing(false);

    if (result.ok) {
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kandidat berita ini?")) return;
    
    setLoadingId(id);
    const result = await deleteScrapedNews(id);
    
    if (result.ok) {
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert(result.message);
    }
    setLoadingId(null);
  };

  const handlePick = async (id) => {
    if (!window.confirm("Pindahkan berita ini ke Draf Artikel Utama?")) return;

    setLoadingId(id);
    const result = await pickScrapedNews(id);
    
    if (result.ok) {
      alert("Berhasil dipindahkan ke Draf!");
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert(result.message);
    }
    setLoadingId(null);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(initialData.map(news => news.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Hapus ${selectedIds.length} berita terpilih?`)) return;
    setLoadingId("bulk");
    const result = await deleteMultipleScrapedNews(selectedIds);
    setLoadingId(null);
    if (result.ok) {
      setSelectedIds([]);
      startTransition(() => router.refresh());
    } else alert(result.message);
  };

  const handleBulkPick = async () => {
    if (!window.confirm(`Pindah ${selectedIds.length} berita terpilih ke Draf?`)) return;
    setLoadingId("bulk");
    const result = await pickMultipleScrapedNews(selectedIds);
    setLoadingId(null);
    if (result.ok) {
      alert(result.message);
      setSelectedIds([]);
      startTransition(() => router.refresh());
    } else alert(result.message);
  };

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
        <AdminTopbar />

        <section className="relative px-5 pt-8 pb-12 sm:px-6 lg:px-8">
          <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
            
            {/* Header Section (Lebih Bersih) */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
              
              <div className="relative z-10">
                <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
                  Modul Scraping
                </p>
                <h1 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                  Hasil Scraping
                </h1>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400 max-w-2xl">
                  Tarik berita terbaru dari berbagai sumber tepercaya dengan satu klik, lalu seleksi dan terbitkan ke portal Nexarin.
                </p>
              </div>
            </div>

            {/* Kontrol Utama & Statistik (Grid layout) */}
            <div className="grid gap-6 md:grid-cols-3 items-stretch">
              
              {/* Card Dropdown Scraping (Kiri) */}
              <div className="relative md:col-span-2 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Pengaturan Sumber Scraping</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-2 font-medium">Website Penyedia Berita</label>
                      <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer appearance-none"
                      >
                        {Object.keys(RSS_SOURCES).map((provider) => (
                          <option key={provider} value={provider}>{provider}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-2 font-medium">Kategori Topik Berita</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer appearance-none"
                      >
                        {GLOBAL_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    {!targetUrl ? (
                      <p className="text-xs text-red-400 font-medium bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg inline-block">
                        Mohon maaf, kategori "{selectedCategory}" tidak tersedia di {selectedProvider}.
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-400/70 font-medium hidden sm:block">
                        Sumber siap diekstrak (Maks. 7 Hari Terakhir)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleRunScraper}
                    disabled={isScraping || !targetUrl}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-400 px-8 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Mulai Scraping Baru
                  </button>
                </div>
              </div>

              {/* Card Kandidat Tersedia (Kanan) */}
              <div className="relative overflow-hidden rounded-[24px] border border-emerald-400/20 bg-emerald-400/5 p-6 shadow-xl backdrop-blur-md flex flex-col justify-center items-center text-center">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400 mb-3">Kandidat Berita Siap Review</p>
                <div className="text-6xl font-black text-emerald-300 drop-shadow-md">{initialData.length}</div>
                <p className="text-xs text-slate-400 mt-3 font-medium">Batas maksimum pengambilan per eksekusi adalah 10 berita.</p>
              </div>

            </div>

            {/* Table Section */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] shadow-2xl backdrop-blur-md">
              <div className="p-5 border-b border-white/10 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black tracking-[-0.04em] text-white">Daftar Kandidat Berita</h2>
                  {isPending && <span className="text-xs text-emerald-400 animate-pulse">Memperbarui data...</span>}
                </div>
                
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 mr-2">{selectedIds.length} Terpilih</span>
                    <button
                      onClick={handleBulkDelete}
                      disabled={loadingId === "bulk"}
                      className="inline-flex items-center px-4 py-2 border border-red-400/20 bg-red-400/10 text-red-400 hover:bg-red-400/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={handleBulkPick}
                      disabled={loadingId === "bulk"}
                      className="inline-flex items-center px-4 py-2 border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-emerald-400/5 disabled:opacity-50"
                    >
                      Pilih Berita
                    </button>
                  </div>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/50 text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="p-5 w-12">
                        <input 
                          type="checkbox" 
                          className="rounded border-white/10 bg-white/5 text-emerald-400 focus:ring-emerald-400 focus:ring-offset-slate-950 cursor-pointer"
                          onChange={handleSelectAll}
                          checked={initialData.length > 0 && selectedIds.length === initialData.length}
                        />
                      </th>
                      <th className="p-5 font-bold uppercase tracking-wider text-[10px]">Gambar</th>
                      <th className="p-5 font-bold uppercase tracking-wider text-[10px]">Waktu & Sumber</th>
                      <th className="p-5 font-bold uppercase tracking-wider text-[10px]">Judul & Konten</th>
                      <th className="p-5 font-bold uppercase tracking-wider text-[10px] text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {initialData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-10 text-center text-slate-500 font-medium">
                          Belum ada kandidat berita hasil scraping yang siap di-review.
                        </td>
                      </tr>
                    ) : (
                      initialData.map((news) => (
                        <tr key={news.id} className={`transition-colors hover:bg-white/[0.02] ${loadingId === news.id ? "opacity-50 pointer-events-none" : ""}`}>
                          <td className="p-5 text-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-white/10 bg-white/5 text-emerald-400 focus:ring-emerald-400 focus:ring-offset-slate-950 cursor-pointer"
                              checked={selectedIds.includes(news.id)}
                              onChange={() => handleToggleSelect(news.id)}
                            />
                          </td>
                          <td className="p-5 align-top w-32">
                            {news.imageUrl ? (
                              <div className="flex flex-col gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={news.imageUrl} alt={news.title} className="w-24 h-16 object-cover rounded-lg border border-white/10 bg-black" />
                                <a 
                                  href={news.imageUrl} 
                                  download 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-[10px] text-emerald-400 hover:underline"
                                >
                                  Buka/Download
                                </a>
                              </div>
                            ) : (
                              <div className="w-24 h-16 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center text-[10px] text-slate-500">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="p-5 whitespace-nowrap text-slate-400 font-medium align-top">
                            {new Date(news.scrapedAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}<br/>
                            <span className="text-xs text-slate-500">{new Date(news.scrapedAt).toLocaleDateString("id-ID")}</span>
                            <div className="mt-3">
                              <span className="inline-flex items-center px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-wider text-slate-300">
                                {news.sourceName}
                              </span>
                            </div>
                          </td>
                          <td className="p-5 min-w-[300px] align-top">
                            <p className="font-bold text-white text-base mb-1">{news.title}</p>
                            <p className="text-slate-400 text-xs leading-relaxed mb-3">{news.excerpt}</p>
                            
                            {news.content && (
                              <details className="text-xs text-slate-400 mb-3 bg-black/30 p-3 rounded-lg border border-white/5">
                                <summary className="cursor-pointer text-emerald-400 font-bold mb-2">Lihat Isi Artikel Draf</summary>
                                <div className="prose prose-invert prose-sm max-w-none line-clamp-6 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: news.content }} />
                              </details>
                            )}
                            
                            <a 
                              href={news.sourceUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center text-[11px] font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Lihat Sumber Asli ↗
                            </a>
                          </td>
                          <td className="p-5 whitespace-nowrap text-right align-top">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDelete(news.id)}
                                disabled={loadingId === news.id || loadingId === "bulk"}
                                className="inline-flex items-center px-4 py-2 border border-red-400/20 bg-red-400/10 text-red-400 hover:bg-red-400/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                              >
                                Hapus
                              </button>
                              <button
                                onClick={() => handlePick(news.id)}
                                disabled={loadingId === news.id || loadingId === "bulk"}
                                className="inline-flex items-center px-4 py-2 border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-emerald-400/5 disabled:opacity-50"
                              >
                                Pilih
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Logs Section */}
          <div className="relative z-10 mx-auto mt-6 w-full max-w-7xl">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-md">
              <div className="p-5 border-b border-white/10 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-black tracking-[-0.04em] text-white">Log Proses Scraper</h2>
                  <p className="text-xs text-slate-400 mt-1">Riwayat 10 eksekusi terakhir (Manual maupun Otomatis)</p>
                </div>
                {logs.length > 0 && (
                  <button
                    onClick={handleClearLogs}
                    disabled={isClearing}
                    className="inline-flex items-center px-4 py-2 border border-red-400/20 bg-red-400/10 text-red-400 hover:bg-red-400/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isClearing ? "Membersihkan..." : "Bersihkan Logs"}
                  </button>
                )}
              </div>
              <div className="p-5 font-mono text-xs sm:text-sm bg-black/40 text-slate-300 max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-slate-500 italic">Belum ada riwayat proses scraping yang dicatat.</p>
                ) : (
                  <ul className="space-y-3">
                    {logs.map((log) => (
                      <li key={log.id} className="flex flex-col sm:flex-row gap-2 border-b border-white/5 pb-2">
                        <span className="shrink-0 text-slate-500 min-w-[150px]">
                          [{new Date(log.createdAt).toLocaleString("id-ID")}]
                        </span>
                        <span className={`shrink-0 font-bold ${log.status === "SUCCESS" ? "text-emerald-400" : "text-red-400"}`}>
                          {log.status}
                        </span>
                        <span className="text-slate-300">{log.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL PROGRESS BAR */}
      {isScraping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-5">
          <div className="bg-slate-900 border border-white/10 rounded-[28px] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Sedang Mengambil Data...</h3>
            <p className="text-sm text-slate-400 mb-8">
              Mesin sedang menelusuri artikel terbaru dari <strong>{selectedProvider} ({selectedCategory})</strong>. Mohon tunggu sebentar.
            </p>
            
            <div className="w-full bg-slate-800 rounded-full h-4 mb-2 overflow-hidden border border-white/5 relative">
              <div 
                className="bg-emerald-400 h-4 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${scrapeProgress}%` }}
              ></div>
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
            </div>
            
            <p className="text-sm font-black text-emerald-400">{scrapeProgress}%</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
          0% { transform: translateX(-100%); }
        }
      `}</style>
    </>
  );
}
