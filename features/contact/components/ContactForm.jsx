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
    window.location.href = `https://wa.me/?text=${encodedText}`;
  }

  return (
    <section
      id="contact-form"
      className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(360px,1fr)] lg:items-start">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
            Contact Form
          </p>

          <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white sm:text-5xl">
            Tulis kebutuhan singkatnya.
          </h2>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            Form ini masih tahap frontend foundation. Untuk sementara, tombol
            kirim akan membuka pesan WhatsApp manual berisi data yang sudah
            kamu isi.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Status
              </p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                Manual
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Next
              </p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                Backend
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-emerald-400" />

            <div>
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Form Kontak
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Isi data dasar untuk mulai diskusi
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Nama
              </span>

              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Nama kamu"
                className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Kontak
              </span>

              <input
                type="text"
                value={form.contact}
                onChange={(event) => updateField("contact", event.target.value)}
                placeholder="WhatsApp / Email"
                className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Kebutuhan
              </span>

              <select
                value={form.need}
                onChange={(event) => updateField("need", event.target.value)}
                className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-black text-white outline-none transition focus:border-emerald-400/50"
              >
                {options.map((option) => (
                  <option key={option} value={option} className="bg-slate-950">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Pesan
              </span>

              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Tulis kebutuhan singkatnya..."
                rows={5}
                className="min-h-36 resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
          >
            <span>Kirim Pesan</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className="mt-4 text-center text-xs font-medium leading-6 text-slate-500">
            Nomor tujuan WhatsApp final bisa kita isi nanti setelah data kontak
            Nexarin sudah dikunci.
          </p>
        </form>
      </div>
    </section>
  );
}