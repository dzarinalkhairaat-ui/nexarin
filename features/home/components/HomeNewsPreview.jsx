import Link from "next/link";
import { homeNewsPreview } from "@/features/home/home.data";

function TopicChips({ topics }) {
  const safeTopics = Array.isArray(topics) ? topics : [];

  if (safeTopics.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {safeTopics.map((topic) => (
        <span
          key={topic}
          className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-lime-200 shadow-lg shadow-lime-400/5"
        >
          {topic}
        </span>
      ))}
    </div>
  );
}

function NewsImagePlaceholder({ src, alt }) {
  if (src && src !== "") {
    return (
      <div className="relative mb-5 min-h-44 h-56 w-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 group">
         <img
            src={src}
            alt={alt || "Headline News"}
            className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
      </div>
    );
  }
  return (
    <div className="relative mb-5 min-h-44 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 p-5">
      <div className="relative z-10 flex min-h-32 items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-lime-300">
            <span>📰</span>
            <span>Headline Preview</span>
          </p>

          <p className="mt-4 text-sm font-black leading-7 text-white">
            Nexarin News
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            Digital news by-rins
          </p>
        </div>
      </div>
    </div>
  );
}

function CompactNewsCard({ item, index }) {
  const safeItem = item || {};
  const number = String(index + 1).padStart(2, "0");
  const href = safeItem.slug ? `/news/artikel/${safeItem.slug}` : "/news";

  return (
    <Link href={href} className="block group">
      <article className="relative overflow-hidden rounded-[26px] border border-white/10 bg-slate-900/40 p-4 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-slate-800/60">
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 text-xs font-black text-lime-300 shadow-lg shadow-lime-400/10">
            {number}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-slate-950/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">
                {safeItem.category || "News"}
              </span>

              <span className="text-[11px] font-bold text-slate-500">
                {safeItem.date || "Preview"}
              </span>
            </div>

            <h3 className="mt-3 text-base font-black leading-6 tracking-[-0.035em] text-white line-clamp-2">
              {safeItem.title || "Judul berita belum tersedia"}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function HomeNewsPreview({ articles = [] }) {
  const data = homeNewsPreview || {};
  
  // Gunakan data DB jika tersedia, jika kosong gunakan data statis
  const hasDbData = articles && articles.length > 0;
  const dbFeatured = hasDbData ? articles[0] : null;
  const dbItems = hasDbData ? articles.slice(1, 4) : [];
  
  const featured = dbFeatured || data.featured || {};
  const newsItems = hasDbData ? dbItems : (Array.isArray(data.items) ? data.items : []);
  const cta = data.cta || {};

  const featuredHref = dbFeatured?.slug ? `/news/artikel/${dbFeatured.slug}` : "/news";

  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-16 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-lime-300 shadow-lg shadow-lime-400/10">
                <span className="text-sm">📰</span>
                <span>{data.eyebrow || "News"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "News Nexarin sedang disiapkan."}
              </h2>

              <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-300">
                {data.description ||
                  "Section News ini disiapkan sebagai preview awal."}
              </p>
            </div>
          </div>

          <Link
            href={cta.href || "/news"}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-lime-400/25 hover:bg-lime-400/10 md:shrink-0"
          >
            {cta.label || "Buka News"} →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Link href={featuredHref} className="block group">
            <article className="relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md transition hover:bg-slate-800/60">
              <div className="relative z-10">
                <NewsImagePlaceholder src={featured.image} alt={featured.title} />

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-lime-300">
                    {featured.category || "Update"}
                  </span>

                  <span className="text-xs font-bold text-slate-500">
                    {featured.date || "Coming Soon"}
                  </span>
                </div>

                <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.055em] text-white sm:text-4xl group-hover:text-lime-300 transition-colors">
                  {featured.title || "Headline News belum tersedia"}
                </h3>

                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-300 sm:text-base line-clamp-3">
                  {featured.excerpt ||
                    "Ringkasan headline akan ditampilkan di bagian ini."}
                </p>

                <TopicChips topics={data.topics} />

                <div className="mt-8 border-t border-white/10 pt-5">
                  <span className="inline-flex w-full items-center justify-between text-sm font-black text-lime-400 transition group-hover:text-lime-300">
                    <span>Baca Selengkapnya</span>
                    <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </article>
          </Link>

          <div className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-lime-300">
                  Latest News
                </p>

                <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
                  Update terbaru
                </h3>
              </div>
            </div>

            <div className="grid gap-4 flex-1">
              {newsItems.length > 0 ? (
                newsItems.map((item, index) => (
                  <CompactNewsCard
                    key={item?.id || item?.title || index}
                    item={item}
                    index={index}
                  />
                ))
              ) : (
                <div className="flex h-full min-h-32 items-center justify-center rounded-[28px] border border-white/10 bg-slate-900/40 p-6 text-center text-sm font-medium text-slate-400">
                  Berita belum tersedia.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}