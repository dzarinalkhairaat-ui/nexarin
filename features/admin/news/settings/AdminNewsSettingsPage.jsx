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

      <section className="relative flex min-h-[calc(100vh-140px)] items-center overflow-hidden bg-slate-950 px-5 py-10 text-white sm:px-6 lg:px-8">
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

        <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[34px] border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-2xl shadow-emerald-400/10">
            <GearIcon />
          </div>

          <p className="mt-7 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
            Pengaturan News
          </p>

          <h1 className="mx-auto mt-5 max-w-xl text-[2.1rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl">
            Fitur pengaturan disiapkan.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            Halaman ini disediakan untuk update fitur News ke depannya, seperti
            pengaturan tampilan, prioritas konten, konfigurasi SEO, dan opsi
            lainnya.
          </p>

          <div className="mt-7 rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              Status
            </p>

            <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
              Belum ada pengaturan aktif. Fitur ini akan diisi setelah alur
              artikel, kategori, backend, dan database News sudah siap.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}