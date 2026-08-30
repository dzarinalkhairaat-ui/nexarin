"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Key,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Home,
  Cpu,
  Globe,
  Smartphone,
  Car,
  BookOpen,
  Download,
  Newspaper
} from "lucide-react";

const NAV_ICONS: Record<string, React.ElementType> = {
  Home,
  Sparkles,
  Cpu,
  Globe,
  Smartphone,
  Car,
  BookOpen,
  ShoppingBag,
  Download,
  Newspaper
};
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { customer, isCustomerAuthenticated, logoutCustomer, admin, isAdminAuthenticated, logoutAdmin } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  // Update sliding indicator position on pathname change or window resize
  useEffect(() => {
    setIsProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    const updateIndicator = () => {
      const activeLink = NAV_LINKS.find(
        (link) => pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
      );

      if (activeLink && linkRefs.current[activeLink.href] && navContainerRef.current) {
        const el = linkRefs.current[activeLink.href];
        const container = navContainerRef.current;
        if (el) {
          const elRect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          setIndicatorStyle({
            left: elRect.left - containerRect.left,
            width: elRect.width,
            opacity: 1
          });
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    // Small timeout to ensure DOM layout is complete
    const timer = setTimeout(updateIndicator, 20);
    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const isAuthenticated = (isCustomerAuthenticated && !!customer) || (isAdminAuthenticated && !!admin);

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
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white/90 group-hover:text-[#2DD4F5] transition-colors leading-none">
                Nexarin
              </span>
            </Link>

            {/* 2. Center: Desktop Navigation Links with Smooth Sliding Indicator */}
            <nav
              ref={navContainerRef}
              suppressHydrationWarning
              className="hidden lg:flex items-center gap-1 relative"
            >
              {/* Sliding Active Indicator Capsule with Spring Motion */}
              <div
                className="absolute top-0 bottom-0 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 2px 8px rgba(0, 0, 0, 0.35)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)"
                }}
              />

              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const IconComponent = link.icon ? NAV_ICONS[link.icon] : null;

                return (
                  <Link
                    key={link.href}
                    ref={(el) => {
                      linkRefs.current[link.href] = el;
                    }}
                    href={link.href}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors relative z-10 select-none flex items-center gap-1.5 group",
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {IconComponent && (
                      <IconComponent
                        className={cn(
                          "w-3.5 h-3.5 transition-colors",
                          isActive ? "text-[#2DD4F5]" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />
                    )}
                    <span>{link.label}</span>
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

            {/* Authenticated State: Avatar Only Profile Trigger with Glassmorphic Dropdown */}
            {isAuthenticated ? (
              <div className="relative block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="relative p-0.5 rounded-full border border-white/20 hover:border-cyan-400 bg-white/[0.04] hover:bg-white/[0.10] transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]/40"
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="Menu Profil Pengguna"
                >
                  {/* Avatar Circle */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#2DD4F5] via-[#38BDF8] to-[#7CF2C3] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    {isAdminAuthenticated && admin
                      ? (admin.name ? admin.name.charAt(0).toUpperCase() : "A")
                      : (customer?.name ? customer.name.charAt(0).toUpperCase() : "U")}
                  </div>
                  {/* Online Status Dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B1120] shadow-sm" />
                </button>

                {/* Glassmorphic Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div
                    suppressHydrationWarning
                    className="absolute right-0 top-full mt-2.5 w-64 max-w-[calc(100vw-24px)] rounded-2xl p-2 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50 pointer-events-auto"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(11, 17, 32, 0.98)) padding-box, linear-gradient(120deg, rgba(255,255,255,0.20), rgba(45,212,245,0.18)) border-box",
                      border: "1px solid transparent",
                      backdropFilter: "blur(24px) saturate(150%)",
                      WebkitBackdropFilter: "blur(24px) saturate(150%)",
                      boxShadow: "0 15px 40px -5px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    {/* User Info Header */}
                    <div className="p-2.5 pb-3 border-b border-white/[0.08] flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2DD4F5] to-[#7CF2C3] text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                        {isAdminAuthenticated && admin
                          ? (admin.name ? admin.name.charAt(0).toUpperCase() : "A")
                          : (customer?.name ? customer.name.charAt(0).toUpperCase() : "U")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">
                          {isAdminAuthenticated && admin ? admin.name : customer?.name}
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-mono truncate">
                          {isAdminAuthenticated && admin ? admin.email : customer?.email}
                        </div>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="py-1.5 space-y-0.5">
                      <Link
                        href={isAdminAuthenticated ? "/admin" : "/customer"}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:text-cyan-300 hover:bg-cyan-500/10 transition-all group"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#2DD4F5] group-hover:scale-110 transition-transform" />
                        <span>Masuk ke Dashboard</span>
                      </Link>

                      {isCustomerAuthenticated && (
                        <>
                          <Link
                            href="/customer/orders"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/[0.05] transition-all"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#7CF2C3]" />
                            <span>Pesanan &amp; Lisensi Saya</span>
                          </Link>
                          <Link
                            href="/customer/notifications"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/[0.05] transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <Bell className="w-4 h-4 text-cyan-400" />
                              <span>Notifikasi</span>
                            </div>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                                {unreadCount}
                              </span>
                            )}
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="h-px bg-white/[0.08] my-1" />

                    {/* Log Out Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (isAdminAuthenticated) logoutAdmin();
                        else logoutCustomer();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
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
                const IconComponent = link.icon ? NAV_ICONS[link.icon] : null;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all",
                      isActive
                        ? "text-white bg-white/[0.12] font-semibold border border-white/20 shadow-sm"
                        : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {IconComponent && (
                        <IconComponent
                          className={cn(
                            "w-4 h-4",
                            isActive ? "text-[#2DD4F5]" : "text-[#94A3B8]"
                          )}
                        />
                      )}
                      <span>{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-4 mt-3 border-t border-white/[0.08] space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.10]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2DD4F5] to-[#7CF2C3] text-slate-950 font-black text-xs flex items-center justify-center">
                        {isAdminAuthenticated && admin
                          ? (admin.name ? admin.name.charAt(0).toUpperCase() : "A")
                          : (customer?.name ? customer.name.charAt(0).toUpperCase() : "U")}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isAdminAuthenticated && admin ? admin.name : customer?.name}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono">
                          {isAdminAuthenticated ? "Administrator" : "Customer"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={isAdminAuthenticated ? "/admin" : "/customer"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs flex items-center justify-center gap-1.5 border-cyan-500/30 text-cyan-300">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (isAdminAuthenticated) logoutAdmin();
                        else logoutCustomer();
                      }}
                      className="w-full text-xs text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-500/10 flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log out</span>
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono hover:bg-cyan-500/20 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Masuk Portal</span>
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
                href="/login?redirect=/"
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
                href="/admin/login?redirect=/"
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
