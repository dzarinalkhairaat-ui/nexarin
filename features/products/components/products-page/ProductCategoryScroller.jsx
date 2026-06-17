import Link from "next/link";

const categoryIcons = {
  semua: "✦",
  "ai-tools": "🤖",
  ppob: "⚡",
  fashion: "👕",
  ebook: "📚",
};

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getCategoryIcon(category, index) {
  const slug = category?.slug || "";

  return category?.icon || categoryIcons[slug] || (index === 0 ? "✦" : "▣");
}

function getCategoryHref(slug) {
  return slug === "semua" ? "/products/semua" : `/products/kategori/${slug}`;
}

export default function ProductCategoryScroller({ categories }) {
  const safeCategories = getSafeArray(categories);

  if (safeCategories.length === 0) {
    return (
      <section className="px-5 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-[22px] border border-white/10 bg-white/[0.035] p-4 text-center text-sm font-semibold text-slate-400">
          Kategori produk belum tersedia.
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safeCategories.map((category, index) => {
            const label = category?.label || "Kategori";
            const slug = category?.slug || "semua";
            const href = getCategoryHref(slug);

            return (
              <Link
                key={slug}
                href={href}
                className="group relative flex min-h-[76px] min-w-[78px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] px-2.5 py-3 text-center shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:border-emerald-400/28 hover:bg-emerald-400/10 sm:min-h-[92px] sm:min-w-[104px] sm:rounded-[24px]"
              >
                <div className="pointer-events-none absolute -right-7 -top-7 h-16 w-16 rounded-full bg-emerald-400/10 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:18px_18px]" />

                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-[14px] border border-white/10 bg-slate-950/72 text-base shadow-lg shadow-black/10 transition group-hover:border-emerald-400/25 group-hover:bg-emerald-400/10 sm:h-10 sm:w-10 sm:rounded-2xl sm:text-lg">
                  {getCategoryIcon(category, index)}
                </span>

                <span className="relative z-10 mt-2 line-clamp-2 text-[10.5px] font-black leading-[1.12] tracking-[-0.02em] text-white sm:text-xs">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}