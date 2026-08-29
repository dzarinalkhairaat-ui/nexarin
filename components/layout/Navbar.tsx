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
      <header suppressHydrationWarning className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 pointer-events-none transition-all">
        <div
          className="max-w-6xl mx-auto rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 pointer-events-auto transition-all duration-300 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,16,26,0.75), rgba(14,16,26,0.45)) padding-box, linear-gradient(120deg, rgba(255,255,255,0.25), rgba(45,212,245,0.20), rgba(255,255,255,0.06)) border-box",
            border: "1px solid transparent",
            backdropFilter: "blur(18px) saturate(130%)",
            WebkitBackdropFilter: "blur(18px) saturate(130%)",
            boxShadow: "0 10px 35px -5px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)"
          }}
        >
          {/* 1. Left: Compact Logo & Brand */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/assets/nexarin-logo.png"
                alt="Nexarin Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white/90 group-hover:text-[#2DD4F5] transition-colors leading-none">
                  Nexarin
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#2DD4F5]/15 text-[#2DD4F5] border border-[#2DD4F5]/25 leading-none">
                  Tech
                </span>
              </div>
            </Link>

            {/* 2. Center: Desktop Navigation Links (Pill Style) */}
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
                      "px-3 py-1 rounded-full text-xs font-medium transition-all relative flex items-center gap-1.5 select-none",
                      isActive
                        ? "text-[#2DD4F5] bg-[#2DD4F5]/10 font-bold border border-[#2DD4F5]/25 shadow-sm shadow-cyan-500/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
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

          {/* 3. Right: Actions & User State */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Button */}
            <Link
              href="/search"
              aria-label="Cari Artikel & Produk"
              className="p-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-cyan-500/30 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </Link>

            {/* Customer Authenticated State */}
            {isCustomerAuthenticated && customer ? (
              <div className="hidden sm:flex items-center gap-2">
                {/* Notification Bell */}
                <Link
                  href="/customer/notifications"
                  aria-label="Notifikasi Customer"
                  className="relative p-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Customer Dashboard Link */}
                <Link href="/customer">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-300 transition-colors text-xs font-bold font-mono">
                    <User className="w-3 h-3 text-[#2DD4F5]" />
                    <span>{customer.name.split(" ")[0]}</span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logoutCustomer}
                  title="Keluar dari akun Customer"
                  aria-label="Logout"
                  className="p-1.5 rounded-full border border-white/10 text-[#64748B] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : isAdminAuthenticated && admin ? (
              <div className="hidden sm:flex items-center gap-2">
                {/* Admin Console Link */}
                <Link href="/admin">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-300 transition-colors text-xs font-bold font-mono">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    <span>Console Admin</span>
                  </div>
                </Link>

                {/* Logout Admin */}
                <button
                  onClick={logoutAdmin}
                  title="Keluar dari Admin Console"
                  aria-label="Logout Admin"
                  className="p-1.5 rounded-full border border-white/10 text-[#64748B] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center">
                {/* Unified Single Login Button */}
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-[#2DD4F5] border border-cyan-500/30 text-xs font-bold font-mono transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            suppressHydrationWarning
            className="lg:hidden mt-2 max-w-6xl mx-auto rounded-3xl p-5 border border-white/10 pointer-events-auto animate-in slide-in-from-top-2 duration-200"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,16,26,0.92), rgba(14,16,26,0.85)) padding-box, linear-gradient(120deg, rgba(255,255,255,0.20), rgba(45,212,245,0.15)) border-box",
              border: "1px solid transparent",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
            }}
          >
            <div className="space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all",
                      isActive
                        ? "text-[#2DD4F5] bg-[#2DD4F5]/10 font-bold border border-[#2DD4F5]/30"
                        : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] font-bold border border-[#7CF2C3]/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-4 mt-3 border-t border-white/[0.08] space-y-2">
              {isCustomerAuthenticated && customer ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{customer.name} (Customer)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/customer" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Portal Saya
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        logoutCustomer();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-xs"
                    >
                      Keluar
                    </Button>
                  </div>
                </div>
              ) : isAdminAuthenticated && admin ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span>{admin.name} (Admin)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        Admin Console
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        logoutAdmin();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-xs"
                    >
                      Keluar
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-[#7CF2C3]/20 border border-cyan-500/40 text-white font-bold text-xs shadow-lg shadow-cyan-500/10"
                >
                  <LogIn className="w-4 h-4 text-[#2DD4F5]" />
                  <span>Login ke Akun</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 4. PREMIUM GLASS SELECTOR POPUP MODAL (CUSTOMER VS ADMIN LOGIN)            */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div
          suppressHydrationWarning
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Backdrop with Strong Blur & Dark Tint */}
          <div
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-xl transition-opacity"
          />

          {/* Premium Glass Modal Box */}
          <div
            suppressHydrationWarning
            className="relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/[0.15] shadow-2xl shadow-cyan-500/10 space-y-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(15, 23, 42, 0.90) 0%, rgba(11, 17, 32, 0.95) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)"
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  <Key className="w-3 h-3" />
                  <span>Nexarin Authentication</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Pilih Portal Masuk
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Silakan pilih jenis akun yang ingin Anda akses di platform Nexarin.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-white/[0.10] transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Options Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Customer Portal */}
              <Link
                href="/login"
                onClick={() => setIsLoginModalOpen(false)}
                className="group relative p-5 rounded-2xl border border-cyan-500/25 bg-cyan-500/[0.04] hover:bg-cyan-500/[0.08] hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-cyan-500/15"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Customer
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                      Akses lisensi produk, materi tutorial, dan riwayat pesanan digital Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-[#2DD4F5] font-mono group-hover:translate-x-1 transition-transform">
                  <span>Masuk Portal Pelanggan</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              {/* Option 2: Admin Internal Console */}
              <Link
                href="/admin/login"
                onClick={() => setIsLoginModalOpen(false)}
                className="group relative p-5 rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.04] hover:bg-indigo-500/[0.08] hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-indigo-500/15"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Admin
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                      Console manajemen internal, editorial artikel, pesanan, dan sistem AI.
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-indigo-400 font-mono group-hover:translate-x-1 transition-transform">
                  <span>Masuk Internal Console</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            </div>

            {/* Footer Notice */}
            <div className="text-center pt-2 border-t border-white/[0.06]">
              <span className="text-[11px] text-[#64748B] font-mono">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Daftar Akun Customer Gratis
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
