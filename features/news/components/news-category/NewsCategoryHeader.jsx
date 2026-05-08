import Link from "next/link";

function normalizeSlug(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function BackIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
                d="M15 6 9 12l6 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
            />
        </svg>
    );
}

function CategoryIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
                d="M4.5 6.5h15M7 12h10M10 17.5h4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
            />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path
                d="m7 10 5 5 5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
            />
        </svg>
    );
}

export default function NewsCategoryHeader({ category, categories }) {
    const categoryLabel = category?.label || "Kategori";
    const currentSlug = normalizeSlug(category?.slug);
    const safeCategories = Array.isArray(categories)
        ? categories.filter((item) => {
            const itemSlug = normalizeSlug(item?.slug);
            const itemLabel = normalizeSlug(item?.label);

            return (
                itemSlug &&
                item?.label &&
                itemSlug !== "semua" &&
                itemLabel !== "semua"
            );
        })
        : [];

    return (
        <header className="relative z-40 border-b border-white/10 bg-slate-950/92 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(6,182,212,0.11),transparent_30%)]" />

            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[40px_1fr_40px] items-center gap-3 px-5 py-3 sm:px-6 lg:px-8">
                <Link
                    href="/news"
                    aria-label="Kembali ke News"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[17px] border border-emerald-300/15 bg-white/[0.055] text-emerald-200 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-300/35 hover:bg-emerald-400/10"
                >
                    <BackIcon />
                </Link>

                <Link
                    href="/news"
                    aria-label={`Kategori ${categoryLabel}`}
                    className="min-w-0 text-center outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                >
                    <p className="truncate text-[1rem] font-black leading-tight tracking-[-0.04em]">
                        <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-200 bg-clip-text text-transparent">
                            Kategori
                        </span>
                        <span className="text-cyan-300"> News</span>
                    </p>

                    <div className="mt-1 flex items-center justify-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                        <p className="truncate text-[11px] font-bold leading-none text-slate-500">
                            Nexarin-news
                        </p>
                    </div>
                </Link>

                <details className="group relative flex h-10 w-10 justify-end">
                    <summary
                        aria-label="Pilih kategori News"
                        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-[17px] border border-cyan-300/15 bg-white/[0.055] text-cyan-100 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-400/10 [&::-webkit-details-marker]:hidden"
                    >
                        <CategoryIcon />
                    </summary>

                    <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/45 backdrop-blur-2xl">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />

                        <div className="relative z-10 pt-1">

                            <Link
                                href="/news"
                                className="flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-extrabold text-slate-300 transition hover:bg-white/[0.055] hover:text-white"
                            >
                                <span>Semua News</span>
                                <ChevronIcon />
                            </Link>

                            <div className="mt-1 grid max-h-72 gap-1 overflow-y-auto pr-1">
                                {safeCategories.length > 0 ? (
                                    safeCategories.map((item) => {
                                        const itemSlug = normalizeSlug(item?.slug);
                                        const isActive = itemSlug === currentSlug;

                                        return (
                                            <Link
                                                key={itemSlug || item?.label}
                                                href={`/news/kategori/${itemSlug}`}
                                                aria-current={isActive ? "page" : undefined}
                                                className={[
                                                    "flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-extrabold transition",
                                                    isActive
                                                        ? "border border-lime-400/20 bg-lime-400/10 text-lime-300"
                                                        : "text-slate-300 hover:bg-white/[0.055] hover:text-white",
                                                ].join(" ")}
                                            >
                                                <span className="truncate">{item?.label || "Kategori"}</span>
                                                <ChevronIcon />
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-4 text-center text-xs font-semibold leading-6 text-slate-500">
                                        Kategori belum tersedia.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </header>
    );
}