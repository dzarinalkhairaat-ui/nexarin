"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import {
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#080D1A] text-slate-300 text-sm selection:bg-[#2DD4F5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#1E293B]">
          {/* Brand & Socials Column (2-Span) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <img
                src="/assets/nexarin-logo.png"
                alt="Nexarin Logo"
                className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#2DD4F5] transition-colors leading-none">
                    Nexarin
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#2DD4F5]/10 text-[#2DD4F5] border border-[#2DD4F5]/20 leading-none">
                    Tech Hub
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-1">
                  by Rins
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Platform ekosistem teknologi modern yang menggabungkan portal informasi kecerdasan buatan terkurasi, ulasan gadget, otomotif masa depan, serta marketplace produk digital siap pakai berlisensi lifetime.
            </p>

            {/* Official Social Media Channels with Real Brand Icons */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                Kanal Sosial &amp; Komunitas:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Instagram */}
                <a
                  href="https://instagram.com/nexarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ikuti Nexarin di Instagram"
                  className="w-9 h-9 rounded-xl bg-[#0E1626] border border-[#1E293B] text-slate-400 hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10 flex items-center justify-center transition-all duration-150 group shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* 2. YouTube */}
                <a
                  href="https://youtube.com/@nexarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Tonton Tutorial Nexarin di YouTube"
                  className="w-9 h-9 rounded-xl bg-[#0E1626] border border-[#1E293B] text-slate-400 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10 flex items-center justify-center transition-all duration-150 group shadow-sm"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* 3. Facebook */}
                <a
                  href="https://facebook.com/nexarintech"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ikuti Nexarin di Facebook"
                  className="w-9 h-9 rounded-xl bg-[#0E1626] border border-[#1E293B] text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 flex items-center justify-center transition-all duration-150 group shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* 4. GitHub */}
                <a
                  href="https://github.com/dzarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lihat Source Code di GitHub"
                  className="w-9 h-9 rounded-xl bg-[#0E1626] border border-[#1E293B] text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-all duration-150 group shadow-sm"
                  title="GitHub"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                {/* 5. X / Twitter */}
                <a
                  href="https://x.com/nexarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ikuti update di X"
                  className="w-9 h-9 rounded-xl bg-[#0E1626] border border-[#1E293B] text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-all duration-150 group shadow-sm"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* 6. LinkedIn */}
                <a
                  href="https://linkedin.com/company/nexarin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Koneksi profesional di LinkedIn"
                  className="w-9 h-9 rounded-xl bg-[#0E1626] border border-[#1E293B] text-slate-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 flex items-center justify-center transition-all duration-150 group shadow-sm"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Explore Portal */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2DD4F5] mb-4">
              Jelajahi Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/ai" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Artificial Intelligence</span>
                </Link>
              </li>
              <li>
                <Link href="/technology" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Technology &amp; Cloud</span>
                </Link>
              </li>
              <li>
                <Link href="/digital" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Digital Transformation</span>
                </Link>
              </li>
              <li>
                <Link href="/gadget" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Gadget &amp; Peripherals</span>
                </Link>
              </li>
              <li>
                <Link href="/automotive" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>EV &amp; Smart Mobility</span>
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Developer Tutorials</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop & Resources */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7CF2C3] mb-4">
              Toko &amp; Sumber Daya
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Nexarin Digital Shop</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    LIVE
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/free-resources" className="hover:text-white transition-colors">
                  Starter Kits &amp; Templates
                </Link>
              </li>
              <li>
                <Link href="/customer/updates" className="hover:text-white transition-colors">
                  Pusat Update Software
                </Link>
              </li>
              <li>
                <Link href="/customer/docs" className="hover:text-white transition-colors">
                  Panduan &amp; Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/customer" className="hover:text-white transition-colors">
                  Customer Portal Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">
              Informasi &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Tentang Nexarin by Rins
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Kontak &amp; Dukungan Tim
                </Link>
              </li>
              <li>
                <Link href="/legal/license" className="hover:text-white transition-colors">
                  Ketentuan Lisensi Produk
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-white transition-colors">
                  Kebijakan Pengembalian Dana
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Service Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© 2026 Nexarin Tech Hub — Brand of Nexarin by Rins. Hak cipta dilindungi undang-undang.</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Seluruh Layanan Online</span>
            </div>
            <span className="text-slate-500 hidden md:inline">
              Built with precision &amp; modern engineering
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
