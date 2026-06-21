import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import { KeyIcon, SparkleIcon, SearchIcon, SettingsIcon, LockIcon, LeftArrowIcon } from "@/components/shared/MenuIcons";

const settingsMenus = [
  {
    label: "API Keys",
    href: "/admin/settings/api-key",
    note: "Kelola API Key Gemini & Groq untuk fitur AI.",
    icon: <KeyIcon className="h-6 w-6" />,
    color: "cyan",
    locked: false,
  },
  {
    label: "Brand & Logo",
    href: "/admin/settings/brand",
    note: "Pengaturan nama, tagline, logo, dan identitas brand.",
    icon: <SparkleIcon className="h-6 w-6" />,
    color: "emerald",
    locked: true,
  },
  {
    label: "SEO Metadata",
    href: "/admin/settings/seo",
    note: "Pengaturan global SEO dan open graph.",
    icon: <SearchIcon className="h-6 w-6" />,
    color: "amber",
    locked: true,
  },
  {
    label: "Konfigurasi Umum",
    href: "/admin/settings/general",
    note: "Pengaturan SMTP, Analytics, dan konfigurasi dasar.",
    icon: <SettingsIcon className="h-6 w-6" />,
    color: "purple",
    locked: true,
  },
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
              Halaman ini merupakan pusat kontrol website Nexarin. Beberapa pengaturan masih dikunci selama proses pengembangan.
            </p>
          </div>

          {/* Module Settings Grid */}
          <div className="mt-12">
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <SettingsIcon className="h-4 w-4 text-slate-300" />
              </div>
              <h2 className="text-lg font-black tracking-[-0.04em] text-white">
                Menu Pengaturan
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {settingsMenus.map((item) => {
                const isLocked = item.locked;

                const CardContent = (
                  <div className={`flex items-center gap-4 ${isLocked ? "opacity-60" : ""}`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border bg-${item.color}-400/10 border-${item.color}-400/20 text-xl shadow-inner shadow-${item.color}-400/20`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate text-base font-black tracking-[-0.02em] text-white">
                          {item.label}
                        </h3>
                        {isLocked && (
                          <span className="rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] border-slate-400/20 bg-slate-400/10 text-slate-300 flex items-center gap-1">
                            <LockIcon className="h-2 w-2" /> Locked
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-slate-400">
                        {item.note}
                      </p>
                    </div>
                  </div>
                );

                if (isLocked) {
                  return (
                    <div
                      key={item.label}
                      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.015] p-5 cursor-not-allowed"
                    >
                      {CardContent}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05] hover:shadow-cyan-400/10"
                  >
                    {CardContent}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 border-t border-white/5 pt-8">
            <Link
              href="/admin"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-black text-white transition hover:bg-white/10"
            >
              <LeftArrowIcon className="h-4 w-4" /> Kembali ke Dashboard
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}