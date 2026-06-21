import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";
import { prisma } from "@/lib/prisma";
import { ArticleIcon, WriteIcon, CategoryIcon, SettingsIcon } from "@/components/shared/MenuIcons";

const newsDashboardMenus = [
  {
    title: "Artikel",
    description: "Lihat, edit, hapus, dan pantau seluruh artikel News.",
    href: "/admin/news/artikel",
    badge: "Table",
    icon: <ArticleIcon className="h-6 w-6" />,
  },
  {
    title: "Tulis Artikel",
    description: "Buat artikel baru lengkap dengan sumber, kategori, dan gambar.",
    href: "/admin/news/tulis-artikel",
    badge: "Editor",
    icon: <WriteIcon className="h-6 w-6" />,
  },
  {
    title: "Kategori",
    description: "Tambah dan kelola kategori untuk halaman News.",
    href: "/admin/news/kategori",
    badge: "Manage",
    icon: <CategoryIcon className="h-6 w-6" />,
  },
  {
    title: "Pengaturan",
    description: "Area kosong untuk update fitur News ke depannya.",
    href: "/admin/news/pengaturan",
    badge: "Soon",
    icon: <SettingsIcon className="h-6 w-6" />,
  },
];

function DashboardCard({ item }) {
  return (
    <Link
      href={item.href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.05]"
    >
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-400/10">
            {item.icon}
          </div>

          <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
            {item.badge}
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-black tracking-[-0.05em] text-white">
          {item.title}
        </h2>

        <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
          {item.description}
        </p>

        <div className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-slate-300 transition group-hover:border-emerald-400/25 group-hover:bg-emerald-400/10 group-hover:text-emerald-300">
          Buka Halaman
        </div>
      </div>
    </Link>
  );
}

export default async function AdminNewsPage() {
  const [articleCount, categoryCount, publishedCount] = await Promise.all([
    prisma.newsArticle.count(),
    prisma.newsCategory.count({ where: { isActive: true } }),
    prisma.newsArticle.count({ where: { status: "PUBLISHED" } }),
  ]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminNewsNav />

      <section className="relative overflow-hidden bg-slate-950 pb-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Dashboard News
            </h1>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-400">
              Kelola seluruh konten News Anda di sini. Pantau statistik artikel, kelola kategori, dan buat berita terbaru untuk pengunjung Nexarin.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-6 shadow-xl transition hover:bg-white/[0.04]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl transition group-hover:bg-emerald-400/20" />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/70">
                  Total Artikel
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="text-4xl font-black tracking-[-0.045em] text-white">
                    {articleCount}
                  </p>
                  <p className="mb-1 text-sm font-semibold text-slate-500">
                    Artikel DB
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-6 shadow-xl transition hover:bg-white/[0.04]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300/70">
                  Kategori
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="text-4xl font-black tracking-[-0.045em] text-white">
                    {categoryCount}
                  </p>
                  <p className="mb-1 text-sm font-semibold text-slate-500">
                    Aktif
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-6 shadow-xl transition hover:bg-white/[0.04]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lime-400/10 blur-2xl transition group-hover:bg-lime-400/20" />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-lime-300/70">
                  Published
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="text-4xl font-black tracking-[-0.045em] text-white">
                    {publishedCount}
                  </p>
                  <p className="mb-1 text-sm font-semibold text-slate-500">
                    Artikel Live
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newsDashboardMenus.map((item) => (
              <DashboardCard key={item.href} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}