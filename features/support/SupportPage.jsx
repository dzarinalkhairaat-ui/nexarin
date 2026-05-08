"use client";

import Link from "next/link";
import { useState } from "react";

const supportOptions = [
  {
    title: "Dukung pengembangan",
    description:
      "Bantu Nexarin terus berkembang sebagai ekosistem digital by-rins yang rapi, stabil, dan mobile-first.",
    icon: "🚀",
  },
  {
    title: "Order produk digital",
    description:
      "Dukungan juga bisa dilakukan dengan membeli produk digital, template, tools, ebook, atau layanan custom.",
    icon: "🛒",
  },
  {
    title: "Bagikan Nexarin",
    description:
      "Membagikan Nexarin ke teman, komunitas, atau calon pengguna juga sangat membantu pertumbuhan project ini.",
    icon: "📣",
  },
];

const supportSteps = [
  "Isi form support manual.",
  "Tentukan jenis dukungan dan nominal.",
  "Pesan akan diarahkan ke WhatsApp.",
  "Sistem otomatis akan disiapkan setelah backend siap.",
];

const supportTypes = [
  "Dukung Pengembangan",
  "Apresiasi Konten",
  "Support Produk",
  "Donasi Bebas",
  "Kolaborasi",
];

const supportNominals = [
  "Rp 10.000",
  "Rp 25.000",
  "Rp 50.000",
  "Rp 100.000",
  "Nominal Bebas",
];

const initialSupportForm = {
  name: "",
  contact: "",
  supportType: "Dukung Pengembangan",
  nominal: "Rp 25.000",
  customNominal: "",
  message: "",
};

function SupportHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 px-5 py-4 text-white backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link
          href="/"
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-950 p-2 shadow-lg shadow-emerald-400/10"
          aria-label="Kembali ke Home"
        >
          <img
            src="/images/logo/nexarin-logo.png"
            alt="Nexarin logo"
            className="h-full w-full object-contain"
            loading="eager"
            decoding="async"
          />
        </Link>

        <div className="min-w-0 text-center">
          <p className="truncate text-lg font-black tracking-[-0.04em] text-white">
            Support Kami
          </p>
          <p className="mt-0.5 truncate text-xs font-bold text-slate-500">
            Nexarin by-rins
          </p>
        </div>

        <Link
          href="#support-form"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-xs font-black text-emerald-300 shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
        >
          Form
        </Link>
      </div>
    </header>
  );
}

function SupportHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-7 text-white sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
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
            Support Kami
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.35rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
            Bantu Nexarin terus tumbuh dan berkembang.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
            Dukungan bro akan membantu Nexarin by-rins terus membangun produk
            digital, portfolio, news, layanan custom, dan sistem yang lebih
            rapi ke depannya.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            <Link
              href="#support-form"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Isi Form Support
            </Link>

            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
            >
              Lihat Produk
            </Link>
          </div>
        </div>

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
                  Nexarin Support
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                  <p className="truncate text-xs font-semibold text-slate-400">
                    Support ecosystem
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                  Status
                </p>
                <p className="mt-1 text-sm font-black text-emerald-300">
                  Manual
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                  Next
                </p>
                <p className="mt-1 text-sm font-black text-emerald-300">
                  Payment
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-4 rounded-[28px] border border-emerald-400/15 bg-emerald-400/[0.07] p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              Support Note
            </p>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
              Untuk tahap awal, dukungan masih diarahkan secara manual. Payment,
              invoice, dan dashboard donasi akan dibuat setelah backend siap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportOptions() {
  return (
    <section className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-emerald-400" />

          <div>
            <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
              Bentuk Dukungan
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Cara sederhana untuk mendukung Nexarin
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportOptions.map((item, index) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.06]"
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-lg shadow-lg shadow-emerald-400/5">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                      0{index + 1}
                    </p>

                    <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em] text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportForm() {
  const [form, setForm] = useState(initialSupportForm);

  const finalNominal =
    form.nominal === "Nominal Bebas"
      ? form.customNominal.trim() || "Nominal bebas"
      : form.nominal;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const text = [
      "Halo Nexarin, saya ingin memberi support.",
      "",
      `Nama: ${form.name || "-"}`,
      `Kontak: ${form.contact || "-"}`,
      `Jenis Support: ${form.supportType || "-"}`,
      `Nominal: ${finalNominal || "-"}`,
      `Pesan: ${form.message || "-"}`,
      "",
      "Catatan: Support ini masih manual. Mohon info langkah berikutnya.",
    ].join("\n");

    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  return (
    <section
      id="support-form"
      className="relative overflow-hidden px-5 py-8 text-white sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(360px,1fr)] lg:items-start">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
          <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
            Form Support
          </p>

          <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white sm:text-5xl">
            Kirim dukungan manual untuk Nexarin.
          </h2>

          <p className="mt-4 text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
            Isi nama, kontak, nominal, dan pesan. Untuk sementara form ini akan
            membuka WhatsApp dengan format pesan otomatis. Payment gateway akan
            dibuat nanti saat backend sudah siap.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Metode
              </p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                Manual
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Tujuan
              </p>
              <p className="mt-1 text-sm font-black text-emerald-300">
                WhatsApp
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-emerald-400" />

            <div>
              <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                Data Support
              </h2>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Isi data dasar untuk dukungan manual
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
                Jenis Support
              </span>

              <select
                value={form.supportType}
                onChange={(event) =>
                  updateField("supportType", event.target.value)
                }
                className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-black text-white outline-none transition focus:border-emerald-400/50"
              >
                {supportTypes.map((item) => (
                  <option key={item} value={item} className="bg-slate-950">
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Nominal
              </span>

              <select
                value={form.nominal}
                onChange={(event) => updateField("nominal", event.target.value)}
                className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-black text-white outline-none transition focus:border-emerald-400/50"
              >
                {supportNominals.map((item) => (
                  <option key={item} value={item} className="bg-slate-950">
                    {item}
                  </option>
                ))}
              </select>
            </label>

            {form.nominal === "Nominal Bebas" && (
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Nominal Bebas
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={form.customNominal}
                  onChange={(event) =>
                    updateField("customNominal", event.target.value)
                  }
                  placeholder="Contoh: Rp 75.000"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
                />
              </label>
            )}

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Pesan
              </span>

              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Tulis pesan atau catatan dukungan..."
                rows={5}
                className="min-h-36 resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50"
              />
            </label>
          </div>

          <div className="mt-5 rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.07] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              Ringkasan
            </p>

            <p className="mt-2 text-sm font-semibold leading-7 text-slate-300">
              {form.supportType} · {finalNominal}
            </p>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
          >
            <span>Kirim Support</span>
            <span aria-hidden="true">→</span>
          </button>

          <p className="mt-4 text-center text-xs font-medium leading-6 text-slate-500">
            Nomor WhatsApp tujuan final bisa kita isi nanti setelah data support
            Nexarin dikunci.
          </p>
        </form>
      </div>
    </section>
  );
}

function SupportSteps() {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-5 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
              Alur Support
            </p>

            <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em] text-white sm:text-5xl">
              Untuk sekarang, support masih dibuat manual dulu.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
              Halaman ini jadi fondasi awal sebelum sistem support, payment,
              invoice, dan dashboard admin dibuat pada tahap backend nanti.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {supportSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-slate-950/55 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
                    {index + 1}
                  </span>

                  <p className="text-sm font-semibold leading-6 text-slate-300">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="#support-form"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
              >
                Isi Form Support
              </Link>

              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
              >
                Lihat Produk Nexarin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SupportPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <SupportHeader />
      <SupportHero />
      <SupportOptions />
      <SupportForm />
      <SupportSteps />
    </main>
  );
}