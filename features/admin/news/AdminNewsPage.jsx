import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";
import { adminNewsArticles, adminNewsCategories } from "@/features/admin/news/adminNews.data";

const newsDashboardMenus = [
  {
    title: "Artikel",
    description: "Lihat, edit, hapus, dan pantau seluruh artikel News.",
    href: "/admin/news/artikel",
    badge: "Table",
    icon: "A",
  },
  {
    title: "Tulis Artikel",
    description: "Buat artikel baru lengkap dengan sumber, kategori, dan gambar.",
    href: "/admin/news/tulis-artikel",
    badge: "Editor",
    icon: "T",
  },
  {
    title: "Kategori",
    description: "Tambah dan kelola kategori untuk halaman News.",
    href: "/admin/news/kategori",
    badge: "Manage",
    icon: "K",
  },
  {
    title: "Pengaturan",
    description: "Area kosong untuk update fitur News ke depannya.",
    href: "/admin/news/pengaturan",
    badge: "Soon",
    icon: "P",
  },
];

function DashboardCard({ item }) {
  return (
    <Link
      href={item.href}
      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
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

        <div className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-black text-white transition group-hover:border-emerald-400/25 group-hover:bg-emerald-400/10 group-hover:text-emerald-200">
          Buka Halaman
        </div>
      </div>
    </Link>
  );
}

export default function AdminNewsPage() {
  const articleCount = Array.isArray(adminNewsArticles) ? adminNewsArticles.length : 0;
  const categoryCount = Array.isArray(adminNewsCategories)
    ? adminNewsCategories.filter((item) => item?.slug && item.slug !== "semua").length
    : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminNewsNav />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
          <div className="text-center lg:text-left">
            <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
              News Manager
            </p>

            <h1 className="mx-auto mt-4 max-w-3xl text-[2.1rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
              Dashboard News.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
              Pilih halaman admin News yang ingin dikelola.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Artikel
              </p>
              <p className="mt-1 text-xl font-black tracking-[-0.045em] text-emerald-300">
                {articleCount}
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                Data awal
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Kategori
              </p>
              <p className="mt-1 text-xl font-black tracking-[-0.045em] text-emerald-300">
                {categoryCount}
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                Aktif
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Database
              </p>
              <p className="mt-1 text-xl font-black tracking-[-0.045em] text-emerald-300">
                Next
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                Tahap berikutnya
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {newsDashboardMenus.map((item) => (
              <DashboardCard key={item.href} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}