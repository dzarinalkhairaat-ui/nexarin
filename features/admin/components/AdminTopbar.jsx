"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/features/admin/components/AdminSidebar";

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export default function AdminTopbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((current) => !current);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.13),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(6,182,212,0.1),transparent_30%)]" />
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[44px_1fr_44px] items-center gap-3 px-5 py-3 sm:grid-cols-[48px_1fr_48px] sm:px-6 lg:px-8">
        <Link
          href="/admin"
          onClick={closeMenu}
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-emerald-400/20 bg-slate-950 p-2 shadow-lg shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:border-emerald-300/35 hover:bg-emerald-400/10 sm:h-12 sm:w-12"
          aria-label="Admin Dashboard"
        >
          <img
            src="/images/logo/nexarin-logo.png"
            alt="Nexarin logo"
            className="h-full w-full object-contain"
            loading="eager"
            decoding="async"
          />
        </Link>

        <Link
          href="/admin"
          onClick={closeMenu}
          className="min-w-0 text-center outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          aria-label="Admin Dashboard Nexarin"
        >
          <p className="truncate text-[1rem] font-black leading-tight tracking-[-0.04em] sm:text-lg">
            <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-200 bg-clip-text text-transparent">
              Nexarin
            </span>
            <span className="text-emerald-300"> Admin</span>
          </p>

          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

            <p className="truncate text-[11px] font-bold leading-none text-slate-500">
              Dashboard by-rins
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Tutup menu admin" : "Buka menu admin"}
          aria-expanded={isMenuOpen}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.055] text-emerald-200 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10 sm:h-12 sm:w-12"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="relative z-10 px-5 pb-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <AdminSidebar mode="dropdown" isOpen={isMenuOpen} onClose={closeMenu} />
          </div>
        </div>
      ) : null}
    </header>
  );
}