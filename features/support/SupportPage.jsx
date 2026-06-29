"use client";

import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import { submitSupportFormAction } from "@/features/support/support.actions";
import Image from "next/image";

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
  selectedMethodId: "",
};

// SVG Icons mapping sama seperti di halaman admin
const makeSvg = (text, color, isItalic = false, size = 22) => 
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="50%" y="55%" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-style="${isItalic ? 'italic' : 'normal'}" font-size="${size}" fill="%23${color}" text-anchor="middle" letter-spacing="-0.5">${text}</text></svg>`;

const PAYMENT_METHODS_META = {
  'bca': { name: 'BCA', type: 'bank', logo: makeSvg('BCA', '005AA9', true, 26) },
  'mandiri': { name: 'Mandiri', type: 'bank', logo: makeSvg('mandiri', '003D79', false, 24) },
  'bni': { name: 'BNI', type: 'bank', logo: makeSvg('BNI', 'F15A23', true, 26) },
  'bri': { name: 'BRI', type: 'bank', logo: makeSvg('BRI', '00529C', false, 26) },
  'bsi': { name: 'BSI', type: 'bank', logo: makeSvg('BSI', '00A29A', false, 26) },
  'gopay': { name: 'GoPay', type: 'ewallet', logo: makeSvg('gopay', '00AED6', false, 24) },
  'ovo': { name: 'OVO', type: 'ewallet', logo: makeSvg('OVO', '4C3494', true, 26) },
  'dana': { name: 'DANA', type: 'ewallet', logo: makeSvg('DANA', '108EE9', false, 26) },
  'shopeepay': { name: 'ShopeePay', type: 'ewallet', logo: makeSvg('ShopeePay', 'EE4D2D', false, 18) },
  'linkaja': { name: 'LinkAja', type: 'ewallet', logo: makeSvg('LinkAja', 'E31837', true, 22) },
  'qris': { name: 'QRIS', type: 'qris', logo: makeSvg('QRIS', 'ED1C24', true, 26) },
};

export default function SupportPage({ paymentMethods = [] }) {
  const [form, setForm] = useState(initialSupportForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Auto-select first method if available and nothing is selected
    if (paymentMethods.length > 0 && !form.selectedMethodId) {
      updateField("selectedMethodId", paymentMethods[0].id);
    }
  }, [paymentMethods]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name) {
      alert("Mohon isi nama Anda terlebih dahulu.");
      return;
    }

    if (paymentMethods.length === 0) {
      alert("Mohon maaf, sistem pembayaran sedang dalam pemeliharaan (tidak ada metode aktif).");
      return;
    }

    if (!form.selectedMethodId) {
      alert("Pilih metode pembayaran terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("nominal", finalNominal);
      formData.append("message", form.message);

      // Kirim data ke background untuk dikirim via email
      await submitSupportFormAction(formData);

      setShowPaymentModal(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedPaymentInfo = paymentMethods.find((p) => p.id === form.selectedMethodId);
  const meta = selectedPaymentInfo ? PAYMENT_METHODS_META[selectedPaymentInfo.methodId] : null;

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
      <Header />

      {/* Modern Glassmorphism Backgrounds */}
      <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <section className="relative z-10 mx-auto px-5 py-12 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:items-start lg:gap-20 pt-8 lg:pt-16">
          
          {/* Left Column: Copywriting */}
          <div className="text-center lg:text-left lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Support by-rins
            </div>

            <h1 className="text-4xl font-black leading-[1.1] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
              Bantu Nexarin <br className="hidden lg:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                Terus Berkembang.
              </span>
            </h1>
            
            <p className="mt-6 text-sm font-medium leading-relaxed text-slate-300 sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0">
              Dukungan Anda merupakan energi bagi kami untuk terus merawat ekosistem digital ini. Setiap kontribusi sangat berarti untuk menjaga server tetap optimal dan membantu pengembangan fitur-fitur baru.
            </p>
            
            <div className="hidden lg:flex mt-12 gap-6 opacity-60 pointer-events-none">
              <div className="group flex h-20 w-20 flex-col items-center justify-center gap-2 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm transition-all shadow-xl">
                <span className="text-3xl transition-transform group-hover:scale-110">☕</span>
              </div>
              <div className="group flex h-20 w-20 flex-col items-center justify-center gap-2 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm transition-all shadow-xl">
                <span className="text-3xl transition-transform group-hover:scale-110">💻</span>
              </div>
              <div className="group flex h-20 w-20 flex-col items-center justify-center gap-2 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm transition-all shadow-xl">
                <span className="text-3xl transition-transform group-hover:scale-110">🚀</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            {/* Form Glow Effect */}
            <div className="absolute -inset-1 rounded-[42px] bg-gradient-to-b from-emerald-400/20 to-cyan-400/20 blur-xl opacity-50" />
            
            <form
              onSubmit={handleSubmit}
              className="relative rounded-[36px] border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 overflow-hidden"
            >
              {/* Inner highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="mb-8">
                <h2 className="text-2xl font-black tracking-[-0.04em] text-white">
                  Form Dukungan
                </h2>
                <p className="mt-1.5 text-xs font-semibold text-slate-400">
                  Lengkapi data di bawah untuk melanjutkan pembayaran
                </p>
              </div>

              <div className="grid gap-6">
                <label className="grid gap-2.5">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                    Nama Anda
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Nama Lengkap / Panggilan"
                    className="min-h-14 rounded-[20px] border border-white/10 bg-black/40 px-5 text-sm font-semibold text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </label>

                <label className="grid gap-2.5">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                    Pesan (Opsional)
                  </span>
                  <textarea
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Tulis pesan penyemangat untuk kami..."
                    rows={2}
                    className="min-h-[80px] resize-none rounded-[20px] border border-white/10 bg-black/40 px-5 py-4 text-sm font-semibold leading-relaxed text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-emerald-400/5 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </label>

                <label className="grid gap-2.5 mt-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                    Metode Pembayaran
                  </span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                    {paymentMethods.map((pm) => {
                      const m = PAYMENT_METHODS_META[pm.methodId];
                      const isSelected = form.selectedMethodId === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => updateField("selectedMethodId", pm.id)}
                          className={`flex min-h-14 items-center gap-3 rounded-[16px] border px-3 transition-all duration-300 ${
                            isSelected
                              ? "border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                              : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.06]"
                          }`}
                        >
                          <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                            {m ? (
                              <img src={m.logo} alt={m.name} className="h-full w-full object-contain" />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-800">?</span>
                            )}
                          </div>
                          <span className={`text-xs font-bold ${isSelected ? "text-emerald-300" : "text-white"}`}>
                            {m?.name || "Metode"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </label>

                <label className="grid gap-2.5 mt-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                    Nominal Dukungan
                  </span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {supportNominals.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => updateField("nominal", item)}
                        className={`min-h-12 rounded-[16px] border text-xs font-black transition-all duration-300 ${
                          form.nominal === item
                            ? "border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                            : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-200"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </label>

                {form.nominal === "Nominal Bebas" && (
                  <label className="grid gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                      Masukkan Nominal Khusus
                    </span>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-black text-emerald-400/70">
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
                        className="min-h-14 w-full rounded-[20px] border border-emerald-400/20 bg-emerald-400/5 pl-12 pr-5 text-sm font-semibold text-white outline-none transition-all placeholder:text-emerald-400/30 focus:border-emerald-400/70 focus:bg-emerald-400/10 focus:ring-1 focus:ring-emerald-400/70"
                      />
                    </div>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 relative inline-flex min-h-[60px] w-full items-center justify-center gap-3 overflow-hidden rounded-[24px] bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-400/30 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  <>
                    <span>Lanjut ke Pembayaran</span>
                    <span aria-hidden="true" className="text-lg">→</span>
                  </>
                )}
                
                {/* Button Inner Glow */}
                <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] pointer-events-none" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Payment Instruction Modal Popup */}
      {showPaymentModal && selectedPaymentInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowPaymentModal(false)}
          />
          
          <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl transition-all">
            <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center relative max-h-[80vh] overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-400/5 blur-[80px] pointer-events-none" />

              <p className="mb-4 text-xs font-medium text-slate-400">
                Total Tagihan: <strong className="text-emerald-400 text-sm ml-1">{finalNominal}</strong>
              </p>

              {meta?.type === 'qris' ? (
                <div className="relative z-10 w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
                  <h3 className="text-2xl font-black text-white">Scan QRIS</h3>
                  <p className="mt-2 text-sm font-medium text-slate-400 mb-6 px-4">
                    Silakan buka aplikasi M-Banking atau E-Wallet Anda, lalu scan barcode di bawah ini.
                  </p>

                  <div className="mx-auto w-full max-w-[400px] flex items-center justify-center relative">
                    {selectedPaymentInfo.qrisImage ? (
                      <img 
                        src={selectedPaymentInfo.qrisImage} 
                        alt="QRIS Barcode" 
                        className="w-full h-auto object-contain rounded-[24px] shadow-2xl"
                      />
                    ) : (
                      <div className="text-center p-8 w-full rounded-[24px] bg-white/5 border border-white/10">
                        <p className="text-sm font-black text-slate-300">QRIS belum diset</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-emerald-400">Atas Nama: {selectedPaymentInfo?.accountName || "Nexarin (QRIS)"}</p>
                </div>
              ) : (
                <div className="relative z-10 w-full animate-in zoom-in-95 duration-300">
                  <div className="mx-auto flex h-16 w-24 items-center justify-center rounded-2xl bg-white p-3 shadow-xl mb-8">
                    {meta?.logo ? (
                      <img src={meta.logo} alt={meta.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-lg font-black text-slate-900">{meta?.name}</span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2">Transfer Manual</h3>
                  <p className="text-sm font-medium text-slate-400 mb-8 px-4">
                    Salin nomor rekening di bawah ini dan transfer menggunakan m-banking atau ATM.
                  </p>

                  <div className="rounded-[24px] border border-white/10 bg-black/30 p-6 backdrop-blur-sm text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl -mr-16 -mt-16" />
                    
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Nomor Rekening / Tujuan</p>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <p className="text-3xl font-black text-white font-mono tracking-wider">
                        {selectedPaymentInfo?.accountNumber || "-"}
                      </p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedPaymentInfo?.accountNumber || "");
                          alert("Nomor disalin!");
                        }}
                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                        title="Salin Nomor"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Atas Nama</p>
                    <p className="text-lg font-bold text-slate-200">
                      {selectedPaymentInfo?.accountName || "-"}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  alert("Terima kasih banyak atas dukungan Anda! Kami akan segera memverifikasi pembayaran Anda.");
                  setShowPaymentModal(false);
                  setForm(initialSupportForm);
                }}
                className="mt-10 w-full rounded-[20px] bg-emerald-400 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 active:scale-[0.98]"
              >
                Saya Sudah Transfer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Scrollbar Styles embedded */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </main>
  );
}