import { adminOverviewNotes, adminStats } from "@/features/admin/admin.data";

function AdminStatCard({ item }) {
  const safeItem = item || {};

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {safeItem.label || "Module"}
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
          {safeItem.note || "Status modul admin akan ditampilkan di sini."}
        </p>
      </div>
    </article>
  );
}

function AdminNoteCard({ item, index }) {
  const safeItem = item || {};

  return (
    <article className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-300">
          0{index + 1}
        </span>

        <div className="min-w-0">
          <h3 className="text-base font-black tracking-[-0.035em] text-white">
            {safeItem.title || "Catatan Admin"}
          </h3>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
            {safeItem.description ||
              "Catatan dashboard admin akan ditampilkan di sini."}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function AdminOverview() {
  const stats = Array.isArray(adminStats) ? adminStats : [];
  const notes = Array.isArray(adminOverviewNotes) ? adminOverviewNotes : [];

  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-emerald-400" />

          <div>
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Ringkasan Sistem
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Status awal modul Nexarin
            </p>
          </div>
        </div>

        {stats.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <AdminStatCard key={item?.label || item?.value} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400">
            Data ringkasan admin belum tersedia.
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {notes.map((item, index) => (
            <AdminNoteCard
              key={item?.title || `admin-note-${index}`}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}