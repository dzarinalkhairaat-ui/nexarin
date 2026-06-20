import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";

function GearIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-14 w-14 animate-spin"
      fill="none"
    >
      <path
        d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.5-2-3.4-2.4 1a8.2 8.2 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6A8.2 8.2 0 0 0 7 6.6l-2.4-1-2 3.4 2 1.5c-.1.5-.1 1-.1 1.5s0 1 .1 1.5l-2 1.5 2 3.4 2.4-1a8.2 8.2 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a8.2 8.2 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function AdminNewsSettingsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminNewsNav />

      <section className="relative flex min-h-[calc(100vh-140px)] items-start pt-16 sm:items-center sm:pt-0 overflow-hidden bg-slate-950 px-4 pb-10 text-white sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto w-full max-w-xl text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-sm">
            <GearIcon />
          </div>

          <p className="mt-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
            Pengaturan News
          </p>

          <h1 className="mx-auto mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            Segera Hadir
          </h1>

          <p className="mx-auto mt-3 text-sm font-medium leading-relaxed text-slate-400">
            Halaman ini disediakan untuk pembaruan fitur News ke depannya, seperti pengaturan tampilan, prioritas konten, dan opsi SEO.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm text-left sm:text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
              Status Sistem
            </p>

            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-300">
              Pengaturan saat ini belum aktif. Fitur ini akan terbuka setelah arsitektur konten dan database siap sepenuhnya.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}