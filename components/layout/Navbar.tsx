"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Button } from "@/components/ui/Button";
import {
  Menu,
  X,
  Search,
  User,
  ShoppingBag,
  LogOut,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  Layers,
  Terminal,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { customer, isCustomerAuthenticated, logoutCustomer, admin, isAdminAuthenticated, logoutAdmin } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header suppressHydrationWarning className="sticky top-0 z-30 w-full border-b border-white/[0.08] bg-[#0B1120]/85 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <img
                  src="/assets/nexarin-logo.png"
                  alt="Nexarin Logo"
                  className="w-11 h-11 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#2DD4F5] transition-colors leading-none">
                      Nexarin
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#2DD4F5]/10 text-[#2DD4F5] border border-[#2DD4F5]/20 leading-none">
                      Tech
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-mono tracking-wider mt-1">
                    by Rins
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav suppressHydrationWarning className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 select-none",
                        isActive
                          ? "text-[#2DD4F5] bg-[#2DD4F5]/10 font-bold border border-[#2DD4F5]/25"
                          : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04]/60"
                      )}
                    >
                      {link.label}
                      {link.badge && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] font-bold border border-[#7CF2C3]/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7CF2C3] animate-pulse" />
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions & User State */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <Link
                href="/search"
                aria-label="Cari Artikel & Produk"
                className="p-2.5 rounded-xl border border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-white/[0.04]/80 hover:border-cyan-500/30 transition-colors"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Customer Authenticated State */}
              {isCustomerAuthenticated && customer ? (
                <div className="hidden sm:flex items-center gap-2.5">
                  {/* Notification Bell */}
                  <Link
                    href="/customer/notifications"
                    aria-label="Notifikasi Customer"
                    className="relative p-2.5 rounded-xl border border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-white/[0.04]/80 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Customer Dashboard Link */}
                  <Link href="/customer">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-300 transition-colors">
                      <User className="w-3.5 h-3.5 text-[#2DD4F5]" />
                      <span className="text-xs font-bold font-mono">
                        {customer.name.split(" ")[0]} (Portal)
                      </span>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logoutCustomer}
                    title="Keluar dari akun Customer"
                    aria-label="Logout"
                    className="p-2 rounded-xl border border-white/[0.08] text-[#64748B] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : isAdminAuthenticated && admin ? (
                <div className="hidden sm:flex items-center gap-2.5">
                  {/* Admin Console Link */}
                  <Link href="/admin">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-300 transition-colors">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-bold font-mono">
                        Console Admin
                      </span>
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logoutAdmin}
                    title="Keluar dari sesi Admin"
                    aria-label="Logout Admin"
                    className="p-2 rounded-xl border border-white/[0.08] text-[#64748B] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Unified Single LOGIN Button */
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#2DD4F5] hover:bg-[#20b8d8] text-slate-950 shadow-lg shadow-[#2DD4F5]/20 hover:shadow-[#2DD4F5]/30 active:scale-[0.98] transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
                className="p-2.5 lg:hidden rounded-xl border border-white/[0.08] text-[#94A3B8] hover:bg-white/[0.04] hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] bg-[#0B1120] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/[0.08]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors",
                    pathname === link.href
                      ? "bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/30 font-bold"
                      : "text-[#94A3B8] hover:bg-white/[0.04]/60"
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="pt-1">
              {isCustomerAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/customer"
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full font-bold text-xs">
                      Customer Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logoutCustomer();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    Keluar
                  </Button>
                </div>
              ) : isAdminAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full font-bold text-xs">
                      Console Admin
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logoutAdmin();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  >
                    Keluar
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-[#2DD4F5] hover:bg-[#20b8d8] text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4F5]/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login (Pilih Customer / Admin)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* PREMIUM GLASS POPUP MODAL: PILIHAN LOGIN (Customer & Admin)                */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div
          suppressHydrationWarning
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsLoginModalOpen(false)}
        >
          {/* Modal Container */}
          <div
            suppressHydrationWarning
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0F172A]/95 border border-white/[0.15] shadow-2xl backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Background Aesthetic Glow Effects */}
            <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#2DD4F5]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#2DD4F5]/10 border border-[#2DD4F5]/25 flex items-center justify-center text-[#2DD4F5]">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Pilih Portal Masuk
                  </h3>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Silakan pilih jenis portal autentikasi sesuai dengan hak akses Anda.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors shrink-0 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Selection Cards Grid */}
            <div className="grid grid-cols-1 gap-3.5 relative z-10">
              {/* Option 1: Customer Portal */}
              <Link
                href="/login"
                onClick={() => setIsLoginModalOpen(false)}
                className="group p-5 rounded-2xl bg-[#0B1120]/80 hover:bg-cyan-500/[0.06] border border-white/[0.08] hover:border-[#2DD4F5]/50 transition-all duration-200 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-[#2DD4F5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#2DD4F5] transition-colors flex items-center gap-1.5">
                      Portal Pelanggan (Customer)
                    </h4>
                    <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#2DD4F5] group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Akses riwayat pembelian, download source code software, kunci lisensi aktif, dan kelas tutorial.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#7CF2C3]">
                    <span className="px-2 py-0.5 rounded bg-[#7CF2C3]/10 border border-[#7CF2C3]/20">
                      ✓ Email &amp; Google 1-Click
                    </span>
                    <span className="text-[#64748B]">Bisa daftar akun baru</span>
                  </div>
                </div>
              </Link>

              {/* Option 2: Administrator Console */}
              <Link
                href="/admin/login"
                onClick={() => setIsLoginModalOpen(false)}
                className="group p-5 rounded-2xl bg-[#0B1120]/80 hover:bg-indigo-500/[0.06] border border-white/[0.08] hover:border-indigo-400/50 transition-all duration-200 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                      Internal Console (Administrator)
                    </h4>
                    <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Kelola CMS artikel AI &amp; teknologi, katalog produk digital, CRM pelanggan, dan sinkronisasi Gemini.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-indigo-300">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      🔒 Otorisasi Terproteksi
                    </span>
                    <span className="text-[#64748B]">Role Master Admin</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Modal Bottom Note */}
            <div className="pt-2 border-t border-white/[0.08] text-center text-xs text-[#64748B] relative z-10">
              Belum memiliki akun?{" "}
              <Link
                href="/register"
                onClick={() => setIsLoginModalOpen(false)}
                className="text-[#2DD4F5] hover:underline font-semibold"
              >
                Daftar Akun Customer Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
