import { contactInfoItems } from "@/features/contact/contact.data";

function InfoCard({ item, index }) {
  const safeItem = item || {};

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-black text-emerald-300 shadow-lg shadow-emerald-400/5">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-black leading-tight tracking-[-0.04em] text-white">
              {safeItem.title || "Kontak Nexarin"}
            </h3>

            <p className="mt-2 text-sm font-medium leading-7 text-slate-400">
              {safeItem.description ||
                "Informasi kontak akan ditambahkan bertahap sesuai kebutuhan Nexarin."}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function ContactIntroCard() {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
          Contact Options
        </p>

        <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white sm:text-5xl">
          Bisa dibantu untuk project, produk, atau support.
        </h2>

        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
          Pilih jalur komunikasi yang paling sesuai. Untuk tahap awal, semua
          kebutuhan masih diarahkan secara manual agar fondasi frontend tetap
          ringan, aman, dan mudah dikembangkan.
        </p>
      </div>
    </div>
  );
}

export default function ContactInfo() {
  const items = Array.isArray(contactInfoItems) ? contactInfoItems : [];

  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <ContactIntroCard />

        <div className="mt-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-emerald-400" />

            <div>
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Bisa dibantu untuk apa?
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Jalur komunikasi awal Nexarin
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {items.length > 0 ? (
              items.map((item, index) => (
                <InfoCard
                  key={`${item?.title || "contact-info"}-${index}`}
                  item={item}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 text-center text-sm font-medium text-slate-400 md:col-span-3">
                Info kontak belum tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}