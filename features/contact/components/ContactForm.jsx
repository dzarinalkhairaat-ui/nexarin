"use client";

import { useState } from "react";
import { contactNeedOptions } from "@/features/contact/contact.data";

const initialForm = {
  name: "",
  contact: "",
  need: "Custom Project",
  message: "",
};

const fallbackOptions = [
  "Custom Project",
  "Produk Digital",
  "Support",
  "Kolaborasi",
];

const contactDetails = [
  {
    icon: "✉️",
    label: "Email",
    value: "hello@nexarin.com",
    href: "mailto:hello@nexarin.com",
  },
  {
    icon: "💬",
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Jakarta, Indonesia",
    href: "#",
  },
];

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const options =
    Array.isArray(contactNeedOptions) && contactNeedOptions.length > 0
      ? contactNeedOptions
      : fallbackOptions;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const text = [
      "Halo Nexarin, saya ingin diskusi.",
      "",
      `Nama: ${form.name || "-"}`,
      `Kontak: ${form.contact || "-"}`,
      `Kebutuhan: ${form.need || "-"}`,
      `Pesan: ${form.message || "-"}`,
    ].join("\n");

    const encodedText = encodeURIComponent(text);
    window.location.href = `https://wa.me/6281234567890?text=${encodedText}`;
  }

  return (
    <section className="relative px-5 py-12 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center lg:mb-16">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
            Get in Touch
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            Hubungi Kami
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-400 sm:text-base">
            Punya pertanyaan seputar produk digital, butuh custom project, atau ingin berkolaborasi?
            Jangan ragu untuk mengirimkan pesan, kami siap membantu Anda.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(380px,1.15fr)] lg:gap-12 lg:items-start">
          {/* Left Column: Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-6 sm:p-8 shadow-2xl shadow-black/25">
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Informasi Kontak
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Pilih jalur komunikasi yang paling nyaman bagi Anda. Tim kami akan segera merespons pesan Anda secara bertahap.
              </p>

              <div className="mt-8 grid gap-4">
                {contactDetails.map((detail) => (
                  <a
                    key={detail.label}
                    href={detail.href}
                    className="group flex items-center gap-4 rounded-[24px] border border-white/5 bg-slate-950/40 p-4 transition hover:bg-white/[0.04] hover:border-emerald-400/20"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 text-xl shadow-lg shadow-emerald-400/10 transition group-hover:scale-110">
                      {detail.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                        {detail.label}
                      </p>
                      <p className="mt-1 text-sm font-bold text-emerald-300">
                        {detail.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="rounded-[34px] border border-emerald-400/15 bg-emerald-400/[0.05] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                Catatan Penting
              </p>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                Form di sebelah kanan akan mengarahkan pesan Anda langsung ke WhatsApp untuk memudahkan komunikasi lebih cepat dan interaktif.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[34px] border border-white/10 bg-white/[0.045] p-6 sm:p-8 shadow-2xl shadow-black/25"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-emerald-400" />
              <div>
                <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                  Kirim Pesan
                </h2>
              </div>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Nama Anda
                </span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="John Doe"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Kontak (WhatsApp/Email)
                </span>
                <input
                  type="text"
                  required
                  value={form.contact}
                  onChange={(event) => updateField("contact", event.target.value)}
                  placeholder="0812xxxx / john@mail.com"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Kebutuhan
                </span>
                <div className="relative">
                  <select
                    value={form.need}
                    onChange={(event) => updateField("need", event.target.value)}
                    className="w-full appearance-none min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 pl-4 pr-10 text-sm font-black text-white outline-none transition focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                  >
                    {options.map((option) => (
                      <option key={option} value={option} className="bg-slate-950">
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </div>
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Detail Pesan
                </span>
                <textarea
                  required
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Ceritakan detail kebutuhan atau pertanyaan Anda di sini..."
                  rows={5}
                  className="min-h-36 resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-slate-950/80 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>
            </div>

            <button
              type="submit"
              className="group mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              <span>Kirim Pesan via WhatsApp</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}