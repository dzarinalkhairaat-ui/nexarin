import Link from "next/link";
import { homeNewsPreview } from "@/features/home/home.data";

const GlobeNewsIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

function TopicChips({ topics }) {
  const safeTopics = Array.isArray(topics) ? topics : [];
  if (safeTopics.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {safeTopics.map((topic) => (
        <span
          key={topic}
          className="rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] shadow-lg"
          style={{
            backgroundColor: 'rgba(13,242,163,0.08)',
            border: '1px solid rgba(13,242,163,0.2)',
            color: '#0DF2A3',
          }}
        >
          {topic}
        </span>
      ))}
    </div>
  );
}

function NewsImagePlaceholder({ src, alt }) {
  let safeSrc = src;
  if (safeSrc && typeof safeSrc === 'string') {
    // Normalisasi backslash menjadi forward slash (kasus Windows paths)
    safeSrc = safeSrc.replace(/\\/g, '/');
    // Jika URL menggunakan localhost, ubah menjadi relative path agar bisa diakses dari perangkat lain (HP) di jaringan lokal
    safeSrc = safeSrc.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '');
  }

  if (safeSrc && safeSrc !== "") {
    return (
      <div className="relative mb-5 min-h-44 h-56 w-full overflow-hidden rounded-[28px] group" style={{ border: '1px solid #1A2B47', backgroundColor: '#0A1121' }}>
         <img
            src={safeSrc}
            alt={alt || "Headline News"}
            className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#030711]/80 to-transparent"></div>
      </div>
    );
  }
  return (
    <div className="relative mb-5 min-h-44 overflow-hidden rounded-[28px] p-5" style={{ backgroundColor: '#0A1121', border: '1px solid #1A2B47' }}>
      <div className="relative z-10 flex min-h-32 items-end">
        <div>
          <p
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em]"
            style={{
              backgroundColor: 'rgba(13,242,163,0.08)',
              border: '1px solid rgba(13,242,163,0.2)',
              color: '#0DF2A3',
            }}
          >
            <GlobeNewsIcon className="h-4 w-4" />
            <span>Headline Preview</span>
          </p>
          <p className="mt-4 text-sm font-black leading-7 text-white">Nexarin News</p>
          <p className="mt-1 text-xs font-semibold" style={{ color: '#708090' }}>Digital news by-rins</p>
        </div>
      </div>
    </div>
  );
}



export default function HomeNewsPreview({ articles = [] }) {
  const data = homeNewsPreview || {};

  const hasDbData = articles && articles.length > 0;
  const dbFeatured = hasDbData ? articles[0] : null;
  const dbItems = hasDbData ? articles.slice(1, 4) : [];

  const featured = dbFeatured || data.featured || {};
  const newsItems = hasDbData ? dbItems : (Array.isArray(data.items) ? data.items : []);
  const cta = data.cta || {};

  const featuredHref = dbFeatured?.slug ? `/news/artikel/${dbFeatured.slug}` : "/news";

  return (
    <section className="relative px-5 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: '#030711' }}>
      <style>{`
        .nx-news-featured {
          background-color: #0A1121;
          border: 1px solid #1A2B47;
          transition: all 0.3s ease;
        }
        .nx-news-featured:hover {
          background-color: rgba(13,242,163,0.02);
          border-color: rgba(13,242,163,0.2);
        }
        .nx-news-compact {
          border-bottom: 1px solid #1A2B47;
          transition: all 0.3s ease;
        }
        .nx-news-compact:hover {
          background-color: rgba(13,242,163,0.03);
          border-color: rgba(13,242,163,0.2);
        }
        .nx-news-cta {
          background-color: #0A1121;
          border: 1px solid #1A2B47;
          transition: all 0.3s ease;
        }
        .nx-news-cta:hover {
          border-color: rgba(13,242,163,0.3);
          background-color: rgba(13,242,163,0.08);
        }
      `}</style>

      {/* Grid Pattern Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(26,43,71,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,71,0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />


      <div
        className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full blur-[120px]"
        style={{ backgroundColor: 'rgba(13,242,163,0.04)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="relative max-w-3xl">
            <div className="relative z-10">
              <p
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] shadow-lg"
                style={{
                  backgroundColor: 'rgba(13,242,163,0.08)',
                  border: '1px solid rgba(13,242,163,0.2)',
                  color: '#0DF2A3',
                }}
              >
                <GlobeNewsIcon className="h-4 w-4" />
                <span>{data.eyebrow || "News"}</span>
              </p>

              <h2 className="mt-5 text-[2.1rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
                {data.title || "News Nexarin sedang disiapkan."}
              </h2>

              <p className="mt-5 max-w-2xl text-base font-semibold leading-8" style={{ color: '#708090' }}>
                {data.description || "Section News ini disiapkan sebagai preview awal."}
              </p>
            </div>
          </div>

          <Link
            href={cta.href || "/news"}
            className="nx-news-cta inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-sm font-black text-white shadow-xl hover:-translate-y-0.5 md:shrink-0"
          >
            {cta.label || "Buka News"} →
          </Link>
        </div>

        <div className="mt-12 mx-auto max-w-4xl">
          <Link href={featuredHref} className="block group">
            <article className="nx-news-featured relative h-full overflow-hidden rounded-[32px] p-6 shadow-xl backdrop-blur-md">
              <div className="relative z-10">
                <NewsImagePlaceholder src={featured.image} alt={featured.title} />

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span
                    className="rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em]"
                    style={{ backgroundColor: '#0A1121', border: '1px solid rgba(13,242,163,0.2)', color: '#0DF2A3' }}
                  >
                    {featured.category || "Update"}
                  </span>
                  <span className="text-xs font-bold" style={{ color: '#708090' }}>
                    {featured.date || "Coming Soon"}
                  </span>
                </div>

                <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.055em] text-white sm:text-4xl transition-colors duration-300 group-hover:text-[#0DF2A3]">
                  {featured.title || "Headline News belum tersedia"}
                </h3>

                <p className="mt-4 text-sm font-medium leading-relaxed sm:text-base line-clamp-3" style={{ color: '#708090' }}>
                  {featured.excerpt || "Ringkasan headline akan ditampilkan di bagian ini."}
                </p>

                <TopicChips topics={data.topics} />

                <div className="mt-8 pt-5" style={{ borderTop: '1px solid #1A2B47' }}>
                  <span className="inline-flex w-full items-center justify-between text-sm font-black transition" style={{ color: '#0DF2A3' }}>
                    <span>Baca Selengkapnya</span>
                    <span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </section>
  );
}