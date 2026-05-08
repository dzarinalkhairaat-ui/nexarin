import Link from "next/link";
import { adminModules } from "@/features/admin/admin.data";

function AdminModuleCard({ module }) {
  const safeModule = module || {};

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-lg shadow-lg shadow-emerald-400/5">
            {safeModule.icon || "⚙️"}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black leading-tight tracking-[-0.04em] text-white">
                {safeModule.title || "Modul Admin"}
              </h3>

              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-300">
                {safeModule.status || "Preview"}
              </span>
            </div>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
              {safeModule.description ||
                "Deskripsi modul admin akan ditampilkan di sini."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={safeModule.href || "/"}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-2 text-xs font-black text-emerald-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
              >
                Preview Halaman
              </Link>

              <span className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black text-slate-500">
                CRUD nanti
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AdminModules() {
  const modules = Array.isArray(adminModules) ? adminModules : [];

  return (
    <section
      id="admin-modules"
      className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-emerald-400" />

          <div>
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Modul Dashboard
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Struktur awal admin Nexarin
            </p>
          </div>
        </div>

        {modules.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <AdminModuleCard
                key={module?.title || module?.href}
                module={module}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
            Modul dashboard belum tersedia.
          </div>
        )}
      </div>
    </section>
  );
}