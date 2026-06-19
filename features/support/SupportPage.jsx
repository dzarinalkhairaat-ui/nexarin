"use client";

import { useState } from "react";
import Header from "@/components/shared/Header";

const supportNominals = [
  "Rp 10.000",
  "Rp 25.000",
  "Rp 50.000",
  "Rp 100.000",
  "Nominal Bebas",
];

const initialSupportForm = {
  name: "",
  nominal: "Rp 25.000",
  customNominal: "",
  message: "",
};

export default function SupportPage() {
  const [form, setForm] = useState(initialSupportForm);
  const [showQris, setShowQris] = useState(false);

  const finalNominal =
    form.nominal === "Nominal Bebas"
      ? form.customNominal.trim()
        ? `Rp ${form.customNominal.trim()}`
        : "Nominal bebas"
      : form.nominal;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name) {
      alert("Mohon isi nama Anda terlebih dahulu.");
      return;
    }
    // Menampilkan popup QRIS
    setShowQris(true);
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      <Header />

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <section className="relative z-10 mx-auto px-5 py-12 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:items-start">
          
          <div className="text-center lg:text-left lg:sticky lg:top-32">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              Bantu Nexarin <br className="hidden lg:block" /> Terus Tumbuh.
            </h1>
            <p className="mt-6 text-sm font-medium leading-relaxed text-slate-300 sm:text-base lg:text-lg">
              Dukungan Anda sangat berarti untuk pengembangan produk dan layanan ekosistem digital by-rins. Setiap donasi membantu kami menjaga server tetap hidup dan terus merilis fitur baru.
            </p>
            
            <div className="hidden lg:flex mt-10 gap-4 opacity-50 pointer-events-none">
              <div className="h-16 w-16 rounded-3xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-3xl">☕</div>
              <div className="h-16 w-16 rounded-3xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-3xl">💻</div>
              <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">🚀</div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[34px] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/25 backdrop-blur-sm sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              <div>
                <h2 className="text-2xl font-black tracking-[-0.045em] text-white">
                  Form Support
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Isi data untuk melanjutkan ke pembayaran
                </p>
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
                  placeholder="Masukkan nama"
                  className="min-h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Nominal
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {supportNominals.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => updateField("nominal", item)}
                      className={`min-h-12 rounded-xl border text-sm font-bold transition-all ${
                        form.nominal === item
                          ? "border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </label>

              {form.nominal === "Nominal Bebas" && (
                <label className="grid gap-2 transition-all">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Masukkan Nominal
                  </span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required={form.nominal === "Nominal Bebas"}
                      value={form.customNominal}
                      onChange={(event) =>
                        updateField("customNominal", event.target.value)
                      }
                      placeholder="Contoh: 75.000"
                      className="min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                    />
                  </div>
                </label>
              )}

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Pesan (Opsional)
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Tulis pesan penyemangat..."
                  rows={3}
                  className="min-h-24 resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0"
            >
              <span>Lanjut Pembayaran via QRIS</span>
              <span aria-hidden="true" className="text-lg">→</span>
            </button>
          </form>
        </div>
      </section>

      {/* QRIS Modal Popup */}
      {showQris && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowQris(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 p-6 shadow-2xl transition-all">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl"></div>
            
            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-2xl">
                📱
              </div>
              <h3 className="mt-4 text-xl font-black text-white">Scan QRIS</h3>
              <p className="mt-1 text-sm font-medium text-slate-400">
                Silakan scan kode QRIS di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda.
              </p>

              {/* QRIS Image Box */}
              <div className="relative mx-auto mt-6 aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-inner flex items-center justify-center">
                <img 
                  src="/images/placeholders/image-placeholder.svg" 
                  alt="QRIS Placeholder" 
                  className="h-20 w-20 object-contain opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span className="text-sm font-black text-slate-800">Ganti Gambar QRIS<br/>di Sini Nanti</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-3">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-300">Total Tagihan</p>
                <p className="mt-1 text-lg font-black text-white">{finalNominal}</p>
              </div>

              <button
                onClick={() => setShowQris(false)}
                className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-800 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                Tutup & Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}