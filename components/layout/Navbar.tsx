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
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { customer, isCustomerAuthenticated, logoutCustomer } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.08] bg-[#061214]/85 backdrop-blur-md transition-colors">
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
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#18D6D0] transition-colors leading-none">
                    Nexarin
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#18D6D0]/10 text-[#18D6D0] border border-[#18D6D0]/20 leading-none">
                    Tech
                  </span>
                </div>
                <span className="text-[10px] text-[#6F8583] font-mono tracking-wider mt-1">
                  by Rins
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
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
                        ? "text-[#18D6D0] bg-[#18D6D0]/10 font-bold border border-[#18D6D0]/25 "
                        : "text-[#A8BCBA] hover:text-white hover:bg-white/[0.04]/60"
                    )}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[#49D7A5]/15 text-[#49D7A5] font-bold border border-[#49D7A5]/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#49D7A5] animate-pulse" />
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
              className="p-2.5 rounded-xl border border-white/[0.08] text-[#A8BCBA] hover:text-white hover:bg-white/[0.04]/80 hover:border-cyan-500/30 transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Customer Authentication State */}
            {isCustomerAuthenticated && customer ? (
              <div className="hidden sm:flex items-center gap-2.5">
                {/* Notification Bell */}
                <Link
                  href="/customer/notifications"
                  aria-label="Notifikasi Customer"
                  className="relative p-2.5 rounded-xl border border-white/[0.08] text-[#A8BCBA] hover:text-white hover:bg-white/[0.04]/80 transition-colors"
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
                    <User className="w-3.5 h-3.5 text-[#18D6D0]" />
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
                  className="p-2 rounded-xl border border-white/[0.08] text-[#6F8583] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#A8BCBA] hover:text-white hover:bg-white/[0.04]/80 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#18D6D0] hover:bg-[#20b8d8] text-slate-950 /15 active:scale-[0.98] transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
              className="p-2.5 lg:hidden rounded-xl border border-white/[0.08] text-[#A8BCBA] hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#061214] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/[0.08]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors",
                  pathname === link.href
                    ? "bg-[#18D6D0]/15 text-[#18D6D0] border border-[#18D6D0]/30 font-bold"
                    : "text-[#A8BCBA] hover:bg-white/[0.04]/60"
                )}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#49D7A5]/15 text-[#49D7A5] font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            {isCustomerAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                    Masuk
                  </Button>
                </Link>
                <Link
                  href="/register"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="sm" className="w-full font-bold text-xs">
                    Daftar Akun
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
