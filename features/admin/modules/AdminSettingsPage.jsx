import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";

const settingsAdminStats = [
  {
    label: "Brand",
    value: "Nanti",
    note: "Pengaturan nama, tagline, dan identitas brand belum aktif.",
    icon: "✨",
    color: "emerald",
  },
  {
    label: "Logo",
    value: "Nanti",
    note: "Upload logo dan icon belum terhubung storage.",
    icon: "🖼️",
    color: "cyan",
  },
  {
    label: "SEO",
    value: "Basic",
    note: "Metadata dasar sudah ada, dashboard SEO belum aktif.",
    icon: "🔎",
    color: "amber",
  },
  {
    label: "Sitemap",
    value: "Ready",
    note: "Sitemap dan robots sudah tersedia untuk public route.",
    icon: "🗺️",
    color: "emerald",
  },
];

const settingsAdminTasks = [
  "Menyiapkan pengaturan brand dan identitas Nexarin.",
  "Membuat form settings untuk logo, favicon, dan sosial media.",
  "Menyiapkan dashboard SEO metadata per halaman.",
  "Mengatur sitemap dan robots dari data backend.",
  "Menyimpan konfigurasi umum ke database.",
];

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
      <AdminTopbar />

      <section className="relative overflow-hidden px-5 pb-12 pt-8 text-white sm:px-6 lg:px-8">
        {/* Background Glows */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-400/[0.04] blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="relative z-10 mx-auto w-full max-w-4xl">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 shadow-lg shadow-cyan-400/5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Settings
            </p>

            <h1 className="mt-6 text-3xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">
              Konfigurasi <span className="text-cyan-300">Sistem.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
              Halaman ini akan menjadi pusat kontrol untuk brand, SEO, dan konfigurasi umum website Nexarin. Saat ini masih dalam tahap kerangka UI.
            </p>
          </div>

          {/* Module Settings Grid */}
          <div className="mt-12">
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <span className="text-sm">⚙️</span>
              </div>
              <h2 className="text-lg font-black tracking-[-0.04em] text-white">
                Status Modul Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {settingsAdminStats.map((item) => (
                <div
                  key={item.label}
                  className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border bg-${item.color}-400/10 border-${item.color}-400/20 text-xl shadow-inner shadow-${item.color}-400/20`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate text-base font-black tracking-[-0.02em] text-white">
                          {item.label}
                        </h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] border-${item.color}-400/20 bg-${item.color}-400/10 text-${item.color}-300`}>
                          {item.value}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-slate-400">
                        {item.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap Card */}
          <div className="mt-10 overflow-hidden rounded-[28px] border border-cyan-400/20 bg-cyan-400/5 p-6 shadow-xl relative sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                    Roadmap Pengembangan
                  </p>
                  <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
                    Target Konfigurasi Database
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {settingsAdminTasks.map((task, index) => (
                  <div
                    key={task}
                    className="flex items-center gap-3 rounded-[16px] border border-white/5 bg-slate-950/40 p-3 sm:px-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-[10px] font-black text-cyan-400 ring-1 ring-cyan-400/20">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-300">
                      {task}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/admin"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-black text-white transition hover:bg-white/10"
            >
              ← Kembali ke Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-400 px-6 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
            >
              Lihat Website Publik
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}