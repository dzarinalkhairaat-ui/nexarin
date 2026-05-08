import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";

const newsAdminStats = [
  {
    label: "Data",
    value: "Static",
    note: "Artikel news masih dibaca dari file lokal.",
    icon: "📰",
  },
  {
    label: "CRUD",
    value: "Nanti",
    note: "Tambah, edit, hapus artikel belum aktif.",
    icon: "🛠️",
  },
  {
    label: "Publish",
    value: "Nanti",
    note: "Draft, publish, headline, dan popular belum pakai backend.",
    icon: "🚀",
  },
  {
    label: "Media",
    value: "Nanti",
    note: "Upload gambar artikel belum terhubung storage.",
    icon: "🖼️",
  },
];

const newsAdminTasks = [
  "Menyiapkan struktur data artikel.",
  "Membuat form tambah/edit artikel.",
  "Menambahkan kategori, headline, popular, dan status publish.",
  "Menyiapkan upload gambar artikel.",
  "Menghubungkan artikel ke database dan dashboard admin.",
];

function StatCard({ item }) {
  const safeItem = item || {};

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {safeItem.label || "Status"}
            </p>

            <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
              {safeItem.value || "Preview"}
            </p>
          </div>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-lg">
            {safeItem.icon || "⚙️"}
          </span>
        </div>

        <p className="mt-4 text-sm font-medium leading-6 text-slate-400">
          {safeItem.note || "Status admin module akan ditampilkan di sini."}
        </p>
      </div>
    </article>
  );
}

export default function AdminNewsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />

      <section className="relative overflow-hidden px-5 pb-8 pt-7 text-white sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
            >
              ← Admin
            </Link>

            <Link
              href="/news"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300 transition hover:bg-emerald-400/15"
            >
              Public News
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative z-10">
              <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                Admin News
              </p>

              <h1 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl">
                Kelola artikel News Nexarin.
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                Halaman ini masih placeholder admin news. Nanti di sini akan
                ada fitur tambah artikel, edit artikel, kategori, headline,
                popular, draft, publish, gambar, dan SEO artikel.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/news"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
                >
                  Preview News
                </Link>

                <Link
                  href="/admin"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
                >
                  Kembali Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newsAdminStats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </div>

          <div className="mt-6 rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
            <p className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-300">
              Roadmap News
            </p>

            <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white">
              CRUD artikel dibuat setelah database siap.
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {newsAdminTasks.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-slate-950/55 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
                    {index + 1}
                  </span>

                  <p className="text-sm font-semibold leading-6 text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}