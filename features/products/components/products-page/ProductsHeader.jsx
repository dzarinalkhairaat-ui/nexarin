"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { publicNavigation } from "@/config/navigation.config";

const menuIcons = {
  Home: "⌂",
  Products: "▣",
  Portfolio: "◈",
  News: "✦",
  About: "◎",
  Contact: "✉",
};

function getMenuIcon(label) {
  return menuIcons[label] || "→";
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m16.5 16.5 4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function HeaderBrand({ onClick }) {
  return (
    <Link
      href="/products"
      aria-label="Nexarin Products"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.045] p-1.5 shadow-lg shadow-emerald-400/10 transition group-hover:-translate-y-0.5 group-hover:border-emerald-400/35 group-hover:bg-emerald-400/10">
        <img
          src="/images/logo/nexarin-logo.png"
          alt="Nexarin logo"
          className="h-full w-full object-contain drop-shadow-[0_0_14px_rgba(52,211,153,0.18)] transition group-hover:scale-105"
          loading="eager"
          decoding="async"
        />
      </span>

      <span className="min-w-0 text-left">
        <span className="block truncate text-base font-black leading-tight tracking-[-0.04em] text-white">
          Marketplace
        </span>
        <span className="mt-0.5 block truncate text-xs font-semibold text-slate-400">
          Nexarin by-rins
        </span>
      </span>
    </Link>
  );
}

function HeaderIconButton({ label, onClick, children, isActive = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={isActive}
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.065] text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-emerald-400/10"
    >
      {children}
    </button>
  );
}

function MenuButton({ isOpen, onClick }) {
  return (
    <HeaderIconButton
      label={isOpen ? "Tutup menu Nexarin" : "Buka menu Nexarin"}
      isActive={isOpen}
      onClick={onClick}
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
    </HeaderIconButton>
  );
}

function SearchHeader({ query, onQueryChange, onClose, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-3 px-5 py-3 sm:px-6 lg:px-8"
    >
      <div className="flex min-h-11 flex-1 items-center gap-3 rounded-2xl border border-emerald-400/20 bg-white/[0.065] px-4 shadow-lg shadow-black/20">
        <span className="shrink-0 text-emerald-300">
          <SearchIcon />
        </span>

        <input
          autoFocus
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Cari produk..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <button
        type="button"
        aria-label="Tutup pencarian"
        onClick={onClose}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.065] text-xl font-black text-white shadow-lg shadow-black/20 transition hover:border-emerald-400/25 hover:bg-emerald-400/10"
      >
        ×
      </button>
    </form>
  );
}

function MenuPanel({ onClose }) {
  const navigation = Array.isArray(publicNavigation) ? publicNavigation : [];

  return (
    <div className="relative z-10 overflow-hidden border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-5 pb-5 pt-3 sm:px-6 lg:px-8">
        <nav className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_70%,rgba(6,182,212,0.1),transparent_34%)]" />

          <img
            src="/images/logo/nexarin-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-5 h-40 w-40 rotate-12 object-contain opacity-[0.035]"
            loading="lazy"
            decoding="async"
          />

          <div className="relative z-10 grid gap-2">
            {navigation.length > 0 ? (
              navigation.map((item) => (
                <Link
                  key={item?.href || item?.label}
                  href={item?.href || "/"}
                  onClick={onClose}
                  className="group flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm font-black text-slate-200 shadow-lg shadow-black/10 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-white"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xs text-emerald-300">
                      {getMenuIcon(item?.label)}
                    </span>

                    <span className="truncate">{item?.label || "Menu"}</span>
                  </span>

                  <span className="text-emerald-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold text-slate-400">
                Menu belum tersedia.
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function ProductsHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function closeMenu() {
    setIsOpen(false);
  }

  function openSearch() {
    setIsOpen(false);
    setIsSearchOpen(true);
  }

  function closeSearch() {
    setSearchQuery("");
    setIsSearchOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      router.push("/products/semua");
      setIsSearchOpen(false);
      return;
    }

    router.push(`/products/semua?search=${encodeURIComponent(normalizedQuery)}`);
    setIsSearchOpen(false);
  }

  return (
    <header className="relative z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(6,182,212,0.1),transparent_30%)]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {isSearchOpen ? (
        <SearchHeader
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onClose={closeSearch}
          onSubmit={handleSearchSubmit}
        />
      ) : (
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-6 lg:px-8">
          <HeaderBrand onClick={closeMenu} />

          <div className="flex shrink-0 items-center gap-2">
            <HeaderIconButton label="Cari produk" onClick={openSearch}>
              <SearchIcon />
            </HeaderIconButton>

            <MenuButton
              isOpen={isOpen}
              onClick={() => setIsOpen((value) => !value)}
            />
          </div>
        </div>
      )}

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen && !isSearchOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {isOpen && !isSearchOpen ? <MenuPanel onClose={closeMenu} /> : null}
        </div>
      </div>
    </header>
  );
}