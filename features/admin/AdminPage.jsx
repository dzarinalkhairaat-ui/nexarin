import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { prisma } from "@/lib/prisma";
import {
  HomeIcon,
  NewsIcon,
  ScrapingIcon,
  PortfolioIcon,
  ContactIcon,
  SettingsIcon,
  DashboardIcon,
  DagangIcon
} from "@/components/shared/MenuIcons";

const adminModules = [
  {
    title: "Dagang",
    description: "Kelola produk dagang, layanan digital, aset grafis, dan pantau data penjualan.",
    href: "/admin/dagang",
    badge: "Tahap Dev",
    icon: <DagangIcon className="h-6 w-6" />,
    active: false,
  },
  {
    title: "News",
    description: "Kelola artikel, kategori, status publish, dan konten berita.",
    href: "/admin/news",
    badge: "Aktif",
    icon: <NewsIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Scraping News",
    description: "Kumpulkan kandidat berita otomatis dan kurasi untuk diterbitkan.",
    href: "/admin/scraping-news",
    badge: "Aktif",
    icon: <ScrapingIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Portfolio",
    description: "Kelola project, case study, tech stack, dan showcase karya.",
    href: "/admin/portfolio",
    badge: "Tahap Dev",
    icon: <PortfolioIcon className="h-6 w-6" />,
    active: false,
  },
  {
    title: "Support",
    description: "Kelola pesan, request, dan kebutuhan bantuan user.",
    href: "/admin/support",
    badge: "Aktif",
    icon: <ContactIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Settings",
    description: "Kelola pengaturan dasar website dan konfigurasi admin.",
    href: "/admin/settings",
    badge: "Aktif",
    icon: <SettingsIcon className="h-6 w-6" />,
    active: true,
  },
  {
    title: "Home",
    description: "Pengaturan halaman utama Nexarin akan disiapkan berikutnya.",
    href: "",
    badge: "Tahap Dev",
    icon: <HomeIcon className="h-6 w-6" />,
    active: false,
  },
];

function AdminHero({ stats }) {
  const adminStats = [
    {
      label: "Total Berita",
      value: stats.totalNews,
      note: "Artikel dipublikasikan",
      colorClasses: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 shadow-emerald-400/20",
      glowClass: "bg-emerald-400/10 group-hover:bg-emerald-400/20",
    },
    {
      label: "Kandidat Scraping",
      value: stats.totalScraped,
      note: "Menunggu di-review",
      colorClasses: "bg-cyan-400/10 border-cyan-400/20 text-cyan-400 shadow-cyan-400/20",
      glowClass: "bg-cyan-400/10 group-hover:bg-cyan-400/20",
    },
    {
      label: "Caption AI",
      value: stats.totalCaption,
      note: "Draft sosial media",
      colorClasses: "bg-violet-400/10 border-violet-400/20 text-violet-400 shadow-violet-400/20",
      glowClass: "bg-violet-400/10 group-hover:bg-violet-400/20",
    },
    {
      label: "Proyek Portofolio",
      value: stats.totalPortfolio,
      note: "Total showcase karya",
      colorClasses: "bg-amber-400/10 border-amber-400/20 text-amber-400 shadow-amber-400/20",
      glowClass: "bg-amber-400/10 group-hover:bg-amber-400/20",
    },
  ];

  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-8 text-white sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Dashboard Admin
          </p>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-6xl drop-shadow-2xl">
            Pusat kontrol <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Nexarin.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
            Selamat datang kembali. Semua sistem berjalan normal dan kini telah terintegrasi 100% dengan PostgreSQL.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {adminStats.map((item) => (
            <div
              key={item.label}
              className="group relative flex items-center justify-between gap-5 rounded-[24px] border border-white/10 bg-white/[0.02] p-5 shadow-2xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1 hover:border-white/20"
            >
              <div className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl transition-all duration-500 ${item.glowClass}`} />
              
              <div className="relative z-10 min-w-0 flex-1">
                <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 group-hover:text-slate-400 transition-colors">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold tracking-wide text-slate-300">
                  {item.note}
                </p>
              </div>

              <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${item.colorClasses}`}>
                <span className="text-xl font-black">{item.value}</span>
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

          <span className={`shrink-0 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${isActive ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-amber-400/20 bg-amber-400/10 text-amber-400"}`}>
            {module.badge}
          </span>
        </div>

        <h2 className={`mt-5 text-xl font-black tracking-[-0.04em] ${isActive ? "text-white" : "text-slate-400"}`}>
          {module.title}
        </h2>

        <p className={`mt-2 text-sm font-medium leading-relaxed flex-grow ${isActive ? "text-slate-400" : "text-slate-500"}`}>
          {module.description}
        </p>

        <div className={`mt-6 inline-flex min-h-10 w-full items-center justify-center rounded-xl border text-xs font-black transition-all ${isActive ? "border-white/10 bg-white/5 text-white group-hover:border-emerald-400/30 group-hover:bg-emerald-400/10 group-hover:text-emerald-300" : "border-transparent bg-slate-900/50 text-slate-600"}`}>
          {isActive ? "Buka Modul →" : "Sedang Dikembangkan"}
        </div>
      </div>
    </>
  );

  const wrapperClass = `group relative flex flex-col overflow-hidden rounded-[32px] border p-6 shadow-xl backdrop-blur-md transition-all duration-300 ${isActive ? "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-400/10 hover:border-emerald-400/20" : "border-white/5 bg-black/20 cursor-not-allowed"}`;

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
    <section className="relative overflow-hidden px-5 pb-16 pt-8 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300 shadow-lg">
            <DashboardIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-white">
              Modul Tersedia
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adminModules.map((module) => (
            <AdminModuleCard key={module.title} module={module} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 overflow-hidden rounded-[32px] border border-emerald-400/30 bg-gradient-to-r from-emerald-400/10 to-cyan-400/5 p-8 shadow-2xl shadow-emerald-400/10 relative">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Status Integrasi Database
              </p>
              <p className="mt-2 text-base font-medium leading-relaxed text-slate-300 max-w-3xl">
                Luar biasa! Sistem kini telah terhubung secara dinamis dengan <strong>PostgreSQL via Prisma</strong>. Angka statistik di atas adalah representasi langsung (<em>real-time</em>) dari isi database Anda.
              </p>
            </div>
            
            <div className="shrink-0">
               <Link
                href="/admin/news"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-400 px-6 text-sm font-black text-slate-950 shadow-lg shadow-emerald-400/20 transition-all hover:bg-emerald-300 hover:scale-105 active:scale-95"
              >
                Mulai Kelola News →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function AdminPage() {
  let stats = {
    totalNews: 0,
    totalScraped: 0,
    totalCaption: 0,
    totalPortfolio: 0,
  };

  try {
    const counts = await Promise.all([
      prisma.newsArticle.count(),
      prisma.scrapedNewsArticle.count(),
      prisma.newsSocialCaption.count(),
      prisma.portfolioProject.count(),
    ]);

    stats = {
      totalNews: counts[0] || 0,
      totalScraped: counts[1] || 0,
      totalCaption: counts[2] || 0,
      totalPortfolio: counts[3] || 0,
    };
  } catch (error) {
    console.error("Gagal memuat statistik database:", error);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white selection:bg-emerald-400/30 pb-20">
      <AdminTopbar />
      <AdminHero stats={stats} />
      <AdminDashboardModules />
    </main>
  );
}