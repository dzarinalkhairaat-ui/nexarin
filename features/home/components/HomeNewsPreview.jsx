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

function NewsImagePlaceholder() {
  return (
    <div className="relative mb-5 min-h-44 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/75 p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(132,204,22,0.2),transparent_34%),radial-gradient(circle_at_78%_70%,rgba(16,185,129,0.15),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:24px_24px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -bottom-6 h-40 w-40 rotate-12 object-contain opacity-[0.08]"
        loading="lazy"
        decoding="async"
      />

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

  return (
    <article className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-lime-400/25 hover:bg-lime-400/10">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-lime-400/10 blur-3xl transition group-hover:bg-lime-400/20" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 text-xs font-black text-lime-300 shadow-lg shadow-lime-400/10">
          {number}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-slate-950/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">
              {safeItem.category || "News"}
            </span>

            <span className="text-[11px] font-bold text-slate-500">
              {safeItem.date || "Preview"}
            </span>
          </div>

          <h3 className="mt-3 text-base font-black leading-6 tracking-[-0.035em] text-white">
            {safeItem.title || "Judul berita belum tersedia"}
          </h3>
        </div>
      </div>
    </article>
  );
}

export default function HomeNewsPreview() {
  const data = homeNewsPreview || {};
  const featured = data.featured || {};
  const newsItems = Array.isArray(data.items) ? data.items : [];
  const cta = data.cta || {};

  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(132,204,22,0.16),transparent_34%),radial-gradient(circle_at_10%_80%,rgba(6,182,212,0.12),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <img
        src="/images/logo/nexarin-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-20 h-80 w-80 -rotate-12 object-contain opacity-[0.045]"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-gradient-to-l from-lime-400/20 via-emerald-400/10 to-transparent blur-3xl" />

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

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <article className="relative overflow-hidden rounded-[34px] border border-lime-400/15 bg-white/[0.045] p-5 shadow-2xl shadow-black/30">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime-400/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />

            <div className="relative z-10">
              <NewsImagePlaceholder />

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-lime-300">
                  {featured.category || "Update"}
                </span>

                <span className="text-xs font-bold text-slate-500">
                  {featured.date || "Coming Soon"}
                </span>
              </div>

              <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.055em] text-white sm:text-4xl">
                {featured.title || "Headline News belum tersedia"}
              </h3>

              <p className="mt-5 text-sm font-medium leading-7 text-slate-300 sm:text-base">
                {featured.excerpt ||
                  "Ringkasan headline akan ditampilkan di bagian ini."}
              </p>

              <TopicChips topics={data.topics} />
            </div>
          </article>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-lime-400/10 blur-3xl" />

              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-300">
                  Latest Preview
                </p>

                <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
                  Update terbaru
                </h3>

                <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
                  Daftar ini masih memakai data statis sampai sistem News dan
                  database dibuat.
                </p>
              </div>
            </div>

            {newsItems.length > 0 ? (
              newsItems.map((item, index) => (
                <CompactNewsCard
                  key={item?.title || index}
                  item={item}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
                Berita belum tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}