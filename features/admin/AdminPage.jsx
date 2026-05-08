import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";

const adminStats = [
  {
    label: "Prioritas",
    value: "News",
    note: "Manager artikel",
  },
  {
    label: "Login",
    value: "Ready",
    note: "UI admin login",
  },
  {
    label: "Database",
    value: "Next",
    note: "Disambung bertahap",
  },
];

const adminModules = [
  {
    title: "News",
    description: "Kelola artikel, kategori, status publish, dan konten berita.",
    href: "/admin/news",
    badge: "Prioritas",
    icon: "N",
    active: true,
  },
  {
    title: "Products",
    description: "Kelola produk digital, kategori, harga, dan status produk.",
    href: "/admin/products",
    badge: "Next",
    icon: "P",
    active: true,
  },
  {
    title: "Portfolio",
    description: "Kelola project, case study, tech stack, dan showcase karya.",
    href: "/admin/portfolio",
    badge: "Next",
    icon: "F",
    active: true,
  },
  {
    title: "Support",
    description: "Kelola pesan, request, dan kebutuhan bantuan user.",
    href: "/admin/support",
    badge: "Ready",
    icon: "S",
    active: true,
  },
  {
    title: "Settings",
    description: "Kelola pengaturan dasar website dan konfigurasi admin.",
    href: "/admin/settings",
    badge: "Config",
    icon: "⚙",
    active: true,
  },
  {
    title: "Home",
    description: "Pengaturan halaman utama Nexarin akan disiapkan berikutnya.",
    href: "",
    badge: "Soon",
    icon: "H",
    active: false,
  },
];

function AdminHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-5 pt-7 text-white sm:px-6 sm:pb-7 sm:pt-10 lg:px-8">
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
        <div className="text-center lg:text-left">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/5">
            Dashboard Admin
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.35rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
            Pusat kontrol Nexarin.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
            Pilih modul admin untuk mengelola konten website.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {adminStats.map((item) => (
            <div
              key={item.label}
              className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 backdrop-blur-xl"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                {item.label}
              </p>

              <p className="mt-1 text-xl font-black tracking-[-0.045em] text-emerald-300">
                {item.value}
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminModuleCard({ module }) {
  const cardClassName = [
    "group relative overflow-hidden rounded-[30px] border p-4 shadow-2xl shadow-black/20 backdrop-blur-xl transition",
    module.active
      ? "border-white/10 bg-white/[0.045] hover:border-emerald-400/25 hover:bg-emerald-400/10"
      : "cursor-not-allowed border-white/10 bg-white/[0.025] opacity-70",
  ].join(" ");

  const content = (
    <>
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-400/10">
            {module.icon}
          </div>

          <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
            {module.badge}
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-black tracking-[-0.05em] text-white">
          {module.title}
        </h2>

        <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
          {module.description}
        </p>

        <div className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-black text-white transition group-hover:border-emerald-400/25 group-hover:bg-emerald-400/10 group-hover:text-emerald-200">
          {module.active ? "Buka Modul" : "Belum Aktif"}
        </div>
      </div>
    </>
  );

  if (!module.active) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <Link href={module.href} className={cardClassName}>
      {content}
    </Link>
  );
}

function AdminDashboardModules() {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-3 text-white sm:px-6 sm:pb-12 sm:pt-5 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400" />

          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Modul Dashboard
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Pilih area yang ingin dikelola.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminModules.map((module) => (
            <AdminModuleCard key={module.title} module={module} />
          ))}
        </div>

        <div className="mt-5 rounded-[30px] border border-emerald-400/15 bg-emerald-400/[0.07] p-5 shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Fokus Sekarang
          </p>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
            Modul pertama yang disiapkan untuk backend dan database adalah
            News, supaya artikel bisa dibuat, diedit, dan dipublish dari
            dashboard.
          </p>

          <Link
            href="/admin/news"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 sm:w-auto"
          >
            Kelola News
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminHero />
      <AdminDashboardModules />
    </main>
  );
}