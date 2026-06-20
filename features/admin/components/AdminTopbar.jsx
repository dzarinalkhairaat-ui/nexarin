"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const adminMenus = [
  { label: "Dashboard", href: "/admin", icon: "⌂", status: "Main" },
  { label: "Home", href: "", icon: "H", status: "Soon", disabled: true },
  { label: "News", href: "/admin/news", icon: "N", status: "Prioritas" },
  { label: "Scraping", href: "/admin/scraping-news", icon: "R", status: "Beta" },
  { label: "Products", href: "/admin/products", icon: "P", status: "Next" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "C", status: "Next" },
  { label: "Support", href: "/admin/support", icon: "S", status: "Ready" },
  { label: "Settings", href: "/admin/settings", icon: "⚙", status: "Config" },
];

function MenuButton({ isOpen, onClick }) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Tutup menu admin" : "Buka menu admin"}
      aria-expanded={isOpen}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.065] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10"
    >
      <span className="relative h-5 w-6">
        <span
          className={`absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-white transition duration-300 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-0 top-2 block h-0.5 w-6 rounded-full bg-white transition duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 top-4 block h-0.5 w-6 rounded-full bg-white transition duration-300 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </span>
    </button>
  );
}

function AdminMenuPanel({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    document.cookie =
      "nexarin_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    setIsLoggingOut(false);
    onClose();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="relative z-10 border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-5 pb-5 pt-3 sm:px-6 lg:px-8">
        <nav className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_70%,rgba(6,182,212,0.1),transparent_34%)]" />

          <div className="relative z-10 grid gap-2">
            {adminMenus.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : item.href
                    ? pathname?.startsWith(item.href)
                    : false;

              if (item.disabled) {
                return (
                  <div
                    key={`${item.label}-disabled`}
                    className="group flex min-h-12 cursor-not-allowed items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm font-black text-slate-500 opacity-60 shadow-lg shadow-black/10"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs">
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
                      {item.status}
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex min-h-12 items-center justify-between rounded-2xl border px-4 py-3 text-sm font-black shadow-lg shadow-black/10 transition ${
                    isActive
                      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                      : "border-white/10 bg-slate-950/55 text-slate-200 hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-white"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs ${
                      isActive
                        ? "border-emerald-400/30 bg-emerald-400/20 text-emerald-300"
                        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    }`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="text-emerald-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              );
            })}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group flex mt-2 min-h-12 items-center justify-between rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm font-black text-red-300 shadow-lg shadow-black/10 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-400/15 text-xs text-red-400">
                  ⏻
                </span>
                <span className="truncate">
                  {isLoggingOut ? "Keluar..." : "Logout Admin"}
                </span>
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function AdminTopbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.13),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(6,182,212,0.1),transparent_30%)]" />
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            onClick={closeMenu}
            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-950 p-2 shadow-lg shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:border-emerald-300/35 hover:bg-emerald-400/10"
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
            className="min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            aria-label="Admin Dashboard Nexarin"
          >
            <p className="truncate text-base font-black leading-tight tracking-[-0.04em]">
              <span className="text-white">Nexarin</span>
              <span className="text-emerald-300"> Admin</span>
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
              Dashboard by-rins
            </p>
          </Link>
        </div>

        {/* Right: Hamburger Button */}
        <MenuButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
      </div>

      {/* Expandable Menu Panel (same pattern as public header) */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {isOpen && <AdminMenuPanel onClose={closeMenu} />}
        </div>
      </div>
    </header>
  );
}