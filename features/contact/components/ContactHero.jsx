import Link from "next/link";
import { contactHeroData } from "@/features/contact/contact.data";

const contactHighlights = [
  {
    value: "Project",
    label: "Custom request",
  },
  {
    value: "Support",
    label: "Produk digital",
  },
  {
    value: "Fast",
    label: "Respon bertahap",
  },
];

function ContactIdentityCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl lg:mx-0">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 rounded-[28px] border border-white/10 bg-slate-950/65 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-950 p-2 shadow-xl shadow-emerald-400/10">
            <img
              src="/images/logo/nexarin-logo.png"
              alt="Nexarin logo"
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-[-0.035em] text-white">
              Nexarin Contact
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
              <p className="truncate text-xs font-semibold text-slate-400">
                Communication hub
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {contactHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3 text-center"
            >
              <p className="text-sm font-black text-emerald-300">
                {item.value}
              </p>
              <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[28px] border border-emerald-400/15 bg-emerald-400/[0.07] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          Jalur Komunikasi
        </p>

        <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
          Untuk tahap awal, form masih menjadi fondasi UI. Nanti bisa
          dihubungkan ke WhatsApp, email, database, atau dashboard admin.
        </p>
      </div>
    </div>
  );
}

export default function ContactHero() {
  const data = contactHeroData || {};
  const primaryCta = data.primaryCta || {};
  const secondaryCta = data.secondaryCta || {};

  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-7 text-white sm:px-6 sm:pb-10 sm:pt-10 lg:px-8 lg:pb-14 lg:pt-14">
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

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-7 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.72fr)] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300 shadow-lg shadow-emerald-400/5">
            {data.eyebrow || "Contact"}
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.35rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
            {data.title ||
              "Mulai diskusi project, produk, atau kolaborasi digital."}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
            {data.description ||
              "Hubungi Nexarin untuk kebutuhan produk digital, custom project, support, dan kolaborasi."}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            <Link
              href={primaryCta.href || "#contact-form"}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              {primaryCta.label || "Isi Form Kontak"}
            </Link>

            <Link
              href={secondaryCta.href || "/portfolio"}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
            >
              {secondaryCta.label || "Lihat Portfolio"}
            </Link>
          </div>
        </div>

        <ContactIdentityCard />
      </div>
    </section>
  );
}