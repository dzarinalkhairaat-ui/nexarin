import Link from "next/link";
import NewsCard from "@/features/news/components/NewsCard";
import NewsCompactCard from "@/features/news/components/NewsCompactCard";

export default function SearchResults({ keyword, results }) {
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
                            {keyword ? `Keyword: ${keyword}` : "Semua artikel fallback"}
                        </p>
                    </div>
                </div>

                {safeResults.length > 0 ? (
                    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
                        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

                        <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_0.86fr]">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                                {mainResults.map((article, index) => (
                                    <NewsCard
                                        key={article?.slug || `search-main-${index}`}
                                        article={article}
                                    />
                                ))}
                            </div>

                            <div className="rounded-[30px] border border-white/10 bg-slate-950/45 p-3 shadow-xl shadow-black/10">
                                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                                    <div>
                                        <p className="text-sm font-black text-white">
                                            Hasil Lain
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                            Artikel terkait pencarian
                                        </p>
                                    </div>

                                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-300">
                                        Result
                                    </span>
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
                                        <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
                                            Hasil tambahan belum tersedia.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 text-center shadow-xl shadow-black/20">
                        <p className="text-xl font-black tracking-[-0.04em] text-white">
                            Artikel tidak ditemukan
                        </p>

                        <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
                            Coba gunakan kata kunci lain atau kembali ke halaman News.
                        </p>

                        <Link
                            href="/news"
                            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950"
                        >
                            Kembali ke News
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}