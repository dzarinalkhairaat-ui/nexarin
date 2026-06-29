"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shared/Header";
import { SparkleIcon, WalletIcon, LeftArrowIcon, DatabaseIcon } from "@/components/shared/MenuIcons";
import { useState, Suspense, useRef, useEffect } from "react";

function CheckoutForm({ paymentMethods = [] }) {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "bulanan";

  const plans = {
    harian: { name: "Paket Harian", price: "15.000", duration: "24 Jam", icon: <DatabaseIcon className="h-6 w-6" /> },
    bulanan: { name: "Paket Bulanan", price: "99.000", duration: "30 Hari", icon: <SparkleIcon className="h-6 w-6" /> },
    lifetime: { name: "Paket Lifetime", price: "299.000", duration: "Selamanya", icon: <WalletIcon className="h-6 w-6" /> },
  };

  const selectedPlan = plans[plan] || plans.bulanan;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPaymentMethodObj = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Selesaikan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pembayaran</span>
        </h1>
        <p className="mt-3 text-sm font-medium text-slate-400">Selangkah lagi menuju akses tak terbatas ke seluruh fitur Nexarin.</p>
      </div>

      {/* Unified Single Card */}
      <div className="group relative overflow-hidden rounded-[40px] border border-emerald-400/30 bg-slate-900/80 p-8 sm:p-10 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl before:absolute before:inset-0 before:-z-10 before:rounded-[40px] before:bg-gradient-to-br before:from-emerald-400/5 before:to-transparent before:opacity-50 transition-all hover:border-emerald-400/50 hover:shadow-emerald-500/20">
        
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 -z-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />

        {/* Selected Package Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-400 border border-emerald-400/20 shadow-inner">
              {selectedPlan.icon}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{selectedPlan.name}</h2>
              <p className="text-xs font-bold text-emerald-400/80 mt-1 uppercase tracking-widest">Akses {selectedPlan.duration}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-emerald-400 mr-1">Rp</span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">{selectedPlan.price}</span>
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-6">
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-400 focus:bg-emerald-400/5 focus:shadow-[0_0_20px_rgba(52,211,153,0.1)]"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">No. WhatsApp</label>
              <input
                type="tel"
                placeholder="Contoh: 0812xxxx"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-400 focus:bg-emerald-400/5 focus:shadow-[0_0_20px_rgba(52,211,153,0.1)]"
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Alamat Email</label>
              <input
                type="email"
                placeholder="email@contoh.com"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-emerald-400 focus:bg-emerald-400/5 focus:shadow-[0_0_20px_rgba(52,211,153,0.1)]"
              />
            </div>
          </div>
          
          <div className="space-y-2.5 relative" ref={dropdownRef}>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Metode Pembayaran</label>
            
            {/* Custom Dropdown Trigger */}
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-black/40 p-4 transition-all duration-300 ${
                isDropdownOpen ? "border-emerald-400 bg-emerald-400/5 shadow-[0_0_20px_rgba(52,211,153,0.15)]" : "border-white/10 hover:border-white/20"
              }`}
            >
              {paymentMethod ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-emerald-400 border border-white/5 shadow-inner">
                    <WalletIcon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black text-white tracking-wide">{selectedPaymentMethodObj?.methodId.toUpperCase()}</span>
                    {(selectedPaymentMethodObj?.accountNumber || selectedPaymentMethodObj?.accountName) && (
                      <span className="text-xs font-medium text-emerald-400/80">
                        {selectedPaymentMethodObj.accountNumber} {selectedPaymentMethodObj.accountName ? `• a/n ${selectedPaymentMethodObj.accountName}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-sm font-medium text-slate-500 pl-2">Pilih metode pembayaran...</span>
              )}
              
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 bg-emerald-400/20 text-emerald-400 border border-emerald-400/30" : "text-slate-400"}`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300">
                <div className="max-h-[280px] overflow-y-auto p-3 space-y-1">
                  {paymentMethods.length === 0 ? (
                    <div className="p-8 text-center text-sm font-medium text-slate-500">Belum ada metode pembayaran tersedia.</div>
                  ) : (
                    paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => {
                          setPaymentMethod(method.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`group relative flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition-all duration-300 ${
                          paymentMethod === method.id
                            ? "bg-emerald-400/10"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          paymentMethod === method.id ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/20 shadow-inner" : "bg-black/30 text-slate-500 group-hover:text-slate-300 border border-white/5"
                        }`}>
                          <WalletIcon className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className={`text-sm font-black tracking-wide transition-colors ${paymentMethod === method.id ? "text-emerald-400" : "text-white group-hover:text-white"}`}>
                            {method.methodId.toUpperCase()}
                          </span>
                          {(method.accountNumber || method.accountName) && (
                            <span className={`mt-0.5 text-[11px] sm:text-xs font-medium transition-colors ${paymentMethod === method.id ? "text-emerald-400/70" : "text-slate-500 group-hover:text-slate-400"}`}>
                              {method.accountNumber} {method.accountName ? `• a/n ${method.accountName}` : ""}
                            </span>
                          )}
                        </div>
                        {paymentMethod === method.id && (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-900 shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex flex-row gap-3 sm:gap-4">
            <Link
              href="/premium"
              className="group flex h-14 sm:h-16 flex-none items-center justify-center gap-1 sm:gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 sm:px-8 text-sm sm:text-base font-bold text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <LeftArrowIcon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
              Kembali
            </Link>
            
            <Link
              href="/premium/access"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative flex h-14 sm:h-16 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-emerald-400 transition-all hover:scale-[1.02] hover:bg-emerald-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]"
            >
              <div className={`absolute inset-0 bg-white/20 transition-transform duration-500 ease-out ${isHovered ? "translate-x-0" : "-translate-x-full"}`} style={{ transform: isHovered ? 'skewX(-20deg) translateX(150%)' : 'skewX(-20deg) translateX(-150%)' }} />
              <span className="relative z-10 flex items-center gap-1 sm:gap-2 text-base sm:text-lg font-black text-slate-950">
                Bayar <LeftArrowIcon className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
              </span>
            </Link>
          </div>
          
          <p className="mt-6 text-center text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-2">
            <WalletIcon className="h-3.5 w-3.5" /> 
            Checkout aman. Data Anda dilindungi oleh Enkripsi End-to-End.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PremiumCheckoutPage({ paymentMethods }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
        <section className="relative min-h-screen pt-28 pb-16 px-5 sm:px-6 lg:px-8">
          {/* Ambient Background Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
          
          <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-emerald-400 font-bold animate-pulse">Memuat...</div>}>
            <CheckoutForm paymentMethods={paymentMethods} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
