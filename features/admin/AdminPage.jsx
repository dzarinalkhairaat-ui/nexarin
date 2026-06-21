import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import {
  HomeIcon,
  NewsIcon,
  ScrapingIcon,
  ProductsIcon,
  PortfolioIcon,
  ContactIcon,
  SettingsIcon,
  DashboardIcon
} from "@/components/shared/MenuIcons";

const adminStats = [
  {
    label: "Sistem",
    value: "Online",
    note: "Semua layanan berjalan normal",
    color: "emerald",
  },
  {
    label: "Modul Aktif",
    value: "5",
    note: "News, Products, Portfolio, dll",
    color: "cyan",
  },
  {
    label: "Status",
    value: "Beta",
    note: "Masih dalam pengembangan",
    color: "amber",
  },
];

const adminModules = [
  {
    title: "News",
    description: "Kelola artikel, kategori, status publish, dan konten berita.",
    href: "/admin/news",
    badge: "Prioritas",
    icon: <NewsIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Scraping News",
    description: "Kumpulkan kandidat berita otomatis dan kurasi untuk diterbitkan.",
    href: "/admin/scraping-news",
    badge: "Beta",
    icon: <ScrapingIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Products",
    description: "Kelola produk digital, kategori, harga, dan status produk.",
    href: "/admin/products",
    badge: "Next",
    icon: <ProductsIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Portfolio",
    description: "Kelola project, case study, tech stack, dan showcase karya.",
    href: "/admin/portfolio",
    badge: "Next",
    icon: <PortfolioIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Support",
    description: "Kelola pesan, request, dan kebutuhan bantuan user.",
    href: "/admin/support",
    badge: "Ready",
    icon: <ContactIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Settings",
    description: "Kelola pengaturan dasar website dan konfigurasi admin.",
    href: "/admin/settings",
    badge: "Config",
    icon: <SettingsIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Home",
    description: "Pengaturan halaman utama Nexarin akan disiapkan berikutnya.",
    href: "",
    badge: "Soon",
    icon: <HomeIcon className="h-6 w-6" />,
    active: false,
  },
];

function AdminHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-8 text-white sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Dashboard Admin
          </p>

          <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">
            Pusat kontrol <span className="text-emerald-300">Nexarin.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
            Selamat datang kembali. Pilih modul di bawah ini untuk mulai mengelola konten dan pengaturan website Anda.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {adminStats.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.025] p-5 shadow-xl shadow-black/10 backdrop-blur-md"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border bg-${item.color}-400/10 border-${item.color}-400/20 text-${item.color}-300 shadow-inner shadow-${item.color}-400/20`}>
                <span className="text-lg font-black">{item.value.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
                <p className={`mt-0.5 truncate text-lg font-black tracking-[-0.04em] text-${item.color}-300`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminModuleCard({ module }) {
  const isActive = module.active;
  
  const content = (
    <>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${isActive ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-emerald-400/10" : "border-slate-600/20 bg-slate-800/50 text-slate-500"} text-lg font-black shadow-lg`}>
            {module.icon}
          </div>

          <span className={`shrink-0 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${isActive ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/5 bg-white/5 text-slate-500"}`}>
            {module.badge}
          </span>
        </div>

        <h2 className={`mt-5 text-xl font-black tracking-[-0.04em] ${isActive ? "text-white" : "text-slate-500"}`}>
          {module.title}
        </h2>

        <p className={`mt-2 text-sm font-medium leading-relaxed flex-grow ${isActive ? "text-slate-400" : "text-slate-600"}`}>
          {module.description}
        </p>

        <div className={`mt-6 inline-flex min-h-10 w-full items-center justify-center rounded-xl border text-xs font-black transition-all ${isActive ? "border-white/10 bg-white/5 text-white group-hover:border-emerald-400/30 group-hover:bg-emerald-400/10 group-hover:text-emerald-300" : "border-transparent bg-slate-900/50 text-slate-600"}`}>
          {isActive ? "Buka Modul →" : "Belum Tersedia"}
        </div>
      </div>
    </>
  );

  const wrapperClass = `group relative flex flex-col overflow-hidden rounded-[28px] border p-5 sm:p-6 shadow-xl backdrop-blur-md transition-all duration-300 ${isActive ? "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-400/10 hover:border-emerald-400/20" : "border-white/5 bg-black/20 cursor-not-allowed"}`;

  if (!isActive) {
    return <div className={wrapperClass}>{content}</div>;
  }

  return (
    <Link href={module.href} className={wrapperClass}>
      {content}
    </Link>
  );
}

function AdminDashboardModules() {
  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-4 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-300">
            <DashboardIcon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-[-0.04em] text-white">
              Modul Tersedia
            </h2>
          </div>
        </div>

        {/* 
          Responsive Grid:
          - Mobile: 1 column (grid-cols-1 default)
          - Tablet: 2 columns (sm:grid-cols-2)
          - Desktop: 3 columns (lg:grid-cols-3)
        */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {adminModules.map((module) => (
            <AdminModuleCard key={module.title} module={module} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 overflow-hidden rounded-[24px] border border-emerald-400/20 bg-emerald-400/5 p-6 shadow-lg shadow-black/20 relative">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                Informasi Sistem
              </p>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-300 max-w-2xl">
                Modul saat ini masih berjalan dengan data statis. Database Supabase akan segera diintegrasikan untuk manajemen konten yang dinamis.
              </p>
            </div>
            
            <div className="shrink-0">
               <Link
                href="/admin/news"
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-400 px-5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
              >
                Coba Modul News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
      <AdminTopbar />
      <AdminHero />
      <AdminDashboardModules />
    </main>
  );
}