"use client";

import Link from "next/link";
import { useState } from "react";
import { contactNavigation } from "@/features/contact/contact.data";

function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="Nexarin Home"
      className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-1.5 shadow-lg shadow-emerald-400/10 outline-none transition hover:border-emerald-400/35 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
    >
      <img
        src="/images/logo/nexarin-logo.png"
        alt="Nexarin logo"
        className="h-full w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}

function MenuButton({ isOpen, onClick }) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Tutup menu Contact" : "Buka menu Contact"}
      aria-expanded={isOpen}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
    >
      <span className="relative h-5 w-6">
        <span
          className={`absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-white transition ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-0 top-2 block h-0.5 w-6 rounded-full bg-white transition ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 top-4 block h-0.5 w-6 rounded-full bg-white transition ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </span>
    </button>
  );
}

function MenuPanel({ onClose }) {
  const navigation = Array.isArray(contactNavigation) ? contactNavigation : [];

  return (
    <div className="relative z-10 overflow-hidden border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-5 pb-5 pt-3 sm:px-6 lg:px-8">
        <nav className="grid gap-2 rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/30">
          {navigation.map((item) => (
            <Link
              key={item?.href || item?.label}
              href={item?.href || "/"}
              onClick={onClose}
              className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm font-black text-slate-200 shadow-lg shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-white"
            >
              <span>{item?.label || "Menu"}</span>
              <span className="text-emerald-300">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function ContactHeader() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="relative z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.1),transparent_30%)]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[52px_1fr_52px] items-center gap-3 px-5 py-4 sm:px-6 lg:px-8">
        <HeaderLogo />

        <Link
          href="/contact"
          aria-label="Contact Nexarin"
          onClick={closeMenu}
          className="min-w-0 text-center outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        >
          <p className="truncate text-base font-black leading-tight tracking-[-0.04em] text-white">
            Contact
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
            Nexarin by-rins
          </p>
        </Link>

        <MenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        />
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {isOpen && <MenuPanel onClose={closeMenu} />}
        </div>
      </div>
    </header>
  );
}