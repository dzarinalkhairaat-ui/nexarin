import Link from "next/link";
import NewsCard from "@/features/news/components/NewsCard";
import NewsCompactCard from "@/features/news/components/NewsCompactCard";

export default function SearchResults({ keyword, results }) {
  const safeKeyword = String(keyword || "").trim();
  const safeResults = Array.isArray(results) ? results : [];
  const mainResults = safeResults.slice(0, 2);
  const compactResults = safeResults.slice(2);

  return (
    <section className="relative px-5 pb-8 pt-8 text-white sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-cyan-400" />

          <div>
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Hasil Pencarian
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {safeKeyword
                ? `Keyword: ${safeKeyword}`
                : "Menampilkan artikel terbaru"}
            </p>
          </div>
        </div>

        {safeResults.length > 0 ? (
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {mainResults.map((article, index) => (
                <NewsCard
                  key={article?.slug || `search-main-${index}`}
                  article={article}
                />
              ))}
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-lg font-black text-white">
                    Hasil Lainnya
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {compactResults.length > 0 ? (
                  compactResults.map((article, index) => (
                    <NewsCompactCard
                      key={article?.slug || `search-compact-${index}`}
                      article={article}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 text-center text-sm font-medium text-slate-400">
                    Belum ada hasil lain untuk pencarian ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-10 text-center">
            <p className="text-xl font-black tracking-[-0.04em] text-white">
              Artikel tidak ditemukan
            </p>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
              Coba gunakan kata kunci lain atau kembali ke halaman News.
            </p>

            <Link
              href="/news"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-emerald-300"
            >
              Kembali ke News
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}