"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { ArticleCard } from "@/components/portal/ArticleCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { AffiliateWidget } from "@/components/affiliate/AffiliateWidget";
import { NewsletterBox } from "@/components/portal/NewsletterBox";
import { Button } from "@/components/ui/Button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ValenceButton } from "@/components/ui/valence-button";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Card } from "@/components/ui/Card";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
  ShoppingBag,
  DownloadCloud,
  Layers,
  CheckCircle2,
  GraduationCap,
  Zap,
  ExternalLink,
  X,
  Video,
  Music,
  Image as ImageIcon,
  Crown,
  Clock,
  Calendar,
  Flame,
  Star,
  Infinity as InfinityIcon
} from "lucide-react";

export default function HomePage() {
  const [isSlendroDocsOpen, setIsSlendroDocsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const { isCustomerAuthenticated, customer, isAdminAuthenticated, admin } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();

  const handleSelectPlan = (planName: string, price: string) => {
    // 1. If logged in as Admin
    if (isAdminAuthenticated) {
      showToast({
        type: "info",
        title: "Akses Administrator Terdeteksi",
        message: "Anda saat ini sedang login sebagai Administrator. Paket berlangganan ini ditujukan untuk akun Customer/Pelanggan."
      });
      return;
    }

    // 2. If not logged in as Customer
    if (!isCustomerAuthenticated) {
      showToast({
        type: "warning",
        title: "Wajib Login Customer",
        message: `Silakan Masuk atau Daftar Akun Customer terlebih dahulu untuk melanjutkan pembelian ${planName}.`
      });
      router.push("/login?redirect=/#pricing");
      return;
    }

    // 3. If logged in as Customer
    showToast({
      type: "success",
      title: "Paket Dipilih",
      message: `Halo ${customer?.name || "Customer"}, ${planName} (${price}) berhasil dipilih. Mengarahkan ke gerbang pembayaran...`
    });
  };

  const { articles } = useContent();
  const { products, affiliates } = useShop();

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const latestArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 4);
  const topProducts = products.slice(0, 3);
  const primaryAffiliate = affiliates[0];

  return (
    <div suppressHydrationWarning className="space-y-16 sm:space-y-24 bg-[#0B1120] text-slate-100 w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION (Ultra-Premium Layout with 3D Geometric Wave & Glowing Tech Aurora Background) */}
      <section
        className="relative isolate overflow-hidden pt-12 sm:pt-24 pb-36 sm:pb-48 lg:pb-60 min-h-[750px]"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0%, black 6%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 6%, black 95%, transparent 100%)"
        }}
      >
        {/* Pure 3D Geometric Wave, Tech Grid & Starlight Aurora Canvas */}
        <CyberWaveBackground className="z-0" />

        {/* Top Smooth Gradient Fade (blending seamlessly with Header) */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#0B1120] via-[#0B1120]/50 to-transparent pointer-events-none z-0" />

        {/* Bottom Gentle Transition at the absolute edge (leaving full animation visible above) */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent pointer-events-none z-0" />

        {/* Subtle Dark overlay & ambient glow for optimal typography contrast */}
        <div className="absolute inset-0 bg-[#0B1120]/25 backdrop-blur-[0.5px] pointer-events-none z-0" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-[#7CF2C3]/8 rounded-full blur-[130px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5 sm:space-y-6 mb-12 sm:mb-16">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Informasi, Edukasi, &amp;{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2DD4F5] via-[#7CF2C3] to-white">
                Produk Digital
              </span>{" "}
              Siap Pakai.
            </h1>

            {/* Subtitle description */}
            <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
              Portal berita terkurasi AI &amp; software engineering, ulasan gadget, otomotif masa depan, tutorial praktis, serta marketplace aplikasi berlisensi lifetime dengan uji coba gratis 3 hari.
            </p>

            {/* Primary CTAs with ShinyButton */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link href="/shop">
                <ShinyButton>
                  <ShoppingBag className="w-4 h-4 text-[#2DD4F5]" />
                  <span>Jelajahi Digital Shop</span>
                  <ArrowRight className="w-4 h-4 text-[#7CF2C3]" />
                </ShinyButton>
              </Link>
              <Link href="/tutorials">
                <ShinyButton>
                  <GraduationCap className="w-4 h-4 text-[#7CF2C3]" />
                  <span>Tutorial Class Hub</span>
                  <Sparkles className="w-4 h-4 text-[#2DD4F5]" />
                </ShinyButton>
              </Link>
            </div>
          </div>

          {/* Featured Article Spotlight */}
          {featuredArticle && (
            <div className="max-w-5xl mx-auto">
              <ArticleCard article={featuredArticle} featured />
            </div>
          )}
        </div>
      </section>

      {/* 2. LATEST FEED & GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2DD4F5]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Wawasan &amp; Berita Terkini
            </h2>
          </div>
          <Link href="/news" className="text-xs font-bold text-[#2DD4F5] hover:underline flex items-center gap-1">
            Lihat Semua Berita <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

            {/* 3. SLENDRO-AI SHOWCASE SECTION (2 Dual ShinyButtons & Documentation Modal) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-hidden">
        {/* Subtle Ambient Radial Lighting in Background */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          
          {/* Left: Pure Floating Logo (Enlarged & Pulsing) & Clean Modern Content */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-10 text-center sm:text-left max-w-3xl">
            {/* Enlarged Pure Floating Slendro AI Logo with Scale Heartbeat Pulse Animation */}
            <div className="relative shrink-0 flex items-center justify-center">
              <img
                src="/logo_slendro.png"
                alt="Slendro-Ai Logo"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain animate-pulse-scale filter drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] drop-shadow-[0_0_45px_rgba(45,212,245,0.35)]"
              />
            </div>

            {/* Text & Feature Highlights */}
            <div className="space-y-3.5">
              <div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  Slendro-Ai
                </h3>
                <p className="text-base sm:text-lg text-[#94A3B8] font-medium leading-relaxed mt-2 max-w-xl">
                  Slendro Ai - Unlimites Free Ai Video, Music &amp; Image Generator.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/90">
                  🎬 AI Video Generator
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-cyan-300">
                  🎵 AI Music Synthesizer
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-purple-300">
                  🎨 AI Image Generator
                </span>
              </div>
            </div>
          </div>

          {/* Right: Dual ShinyButtons (Akses Disini & Dokumentasi Fitur) */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:items-end gap-3.5 w-full sm:w-auto">
            {/* Button 1: Akses Disini */}
            <a
              href="https://slendro-ai.com/register-user.php?ref=RINSAI.PRO3734"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <ShinyButton className="w-full sm:w-auto">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Akses Disini</span>
                <ArrowRight className="w-4 h-4 text-[#2DD4F5]" />
              </ShinyButton>
            </a>

            {/* Button 2: Dokumentasi Fitur (Trigger Modal) */}
            <ShinyButton
              onClick={() => setIsSlendroDocsOpen(true)}
              className="w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4 text-[#7CF2C3]" />
              <span>Dokumentasi Fitur</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </ShinyButton>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SLENDRO-AI FEATURE DOCUMENTATION FULLSCREEN PORTAL MODAL                  */}
      {/* ========================================================================= */}
      {mounted && isSlendroDocsOpen && createPortal(
        <div
          suppressHydrationWarning
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Fullscreen Edge-to-Edge Backdrop Blur */}
          <div
            onClick={() => setIsSlendroDocsOpen(false)}
            className="fixed inset-0 w-screen h-screen min-h-screen bg-[#0B1120]/85 backdrop-blur-2xl transition-opacity duration-300"
          />

          {/* Modal Container */}
          <div
            suppressHydrationWarning
            className="relative z-10 w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-white/[0.15] shadow-2xl shadow-purple-500/20 space-y-6 my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            style={{
              background:
                "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 17, 32, 0.98) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(168, 85, 247, 0.25)"
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3.5">
                <img
                  src="/logo_slendro.png"
                  alt="Slendro Logo"
                  className="w-12 h-12 object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[10px] font-mono font-bold text-purple-300 uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>Panduan &amp; Dokumentasi Resmi</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    Dokumentasi Fitur Slendro-Ai
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Eksplorasi fitur generator kecerdasan buatan tanpa batas untuk kreator &amp; profesional.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsSlendroDocsOpen(false)}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-white/[0.10] transition-colors"
                aria-label="Tutup Dokumentasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Feature 1: AI Video Generator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-purple-500/20 hover:border-purple-500/40 transition-colors space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <Video className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    1. AI Video Generator
                  </h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Konversi teks prompt menjadi video cinematic HD/4K secara instan. Mendukung motion control kamera, transisi dinamis, dan animasi karakter realistis untuk kebutuhan konten sosial media.
                </p>
                <div className="text-[11px] font-mono text-purple-300 font-semibold">
                  ✓ Text-to-Video &amp; Image-to-Video HD
                </div>
              </div>

              {/* Feature 2: AI Music Synthesizer */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 hover:border-cyan-500/40 transition-colors space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#2DD4F5]">
                    <Music className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    2. AI Music &amp; Audio Synthesizer
                  </h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Ciptakan aransemen musik orisinal lengkap dengan vokal, melodi, dan lirik otomatis. Tersedia berbagai genre: Lo-Fi, Cinematic, Pop, EDM, Rock, hingga latar musik podcast bebas royalti.
                </p>
                <div className="text-[11px] font-mono text-cyan-300 font-semibold">
                  ✓ Vokal AI &amp; Backsound Bebas Royalti
                </div>
              </div>

              {/* Feature 3: AI Image Generator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-pink-500/20 hover:border-pink-500/40 transition-colors space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-300">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    3. AI Image &amp; Art Generator
                  </h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Sintesis visual ultra-realistis dengan resolusi tinggi (8K Upscaling). Cocok untuk pembuatan ilustrasi artikel, mockup produk digital, poster marketing, dan artwork digital tanpa watermark.
                </p>
                <div className="text-[11px] font-mono text-pink-300 font-semibold">
                  ✓ Negative Prompt &amp; 8K Upscaling
                </div>
              </div>

              {/* Feature 4: Unlimited Free Access */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    4. Unlimited Free Access
                  </h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Dapatkan kebebasan berkreasi tanpa pembatasan token harian yang membebani. Komputasi awan berkecepatan tinggi dengan antrean rendering cepat bagi pengguna terdaftar.
                </p>
                <div className="text-[11px] font-mono text-[#7CF2C3] font-semibold">
                  ✓ Akselerasi GPU Cloud &amp; Tanpa Kuota Ketat
                </div>
              </div>

            </div>

            {/* Quick Prompt Guide Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-transparent border border-white/[0.08] space-y-1.5">
              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Tips Cepat Memulai:</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Gunakan format deskripsi prompt yang spesifik (Subjek + Gaya Visual + Pencahayaan + Resolusi) untuk mendapatkan hasil video, audio, atau gambar terbaik di platform Slendro-Ai.
              </p>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
              <span className="text-xs text-[#64748B] font-mono">
                Tersedia melalui jaringan partner resmi Nexarin
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsSlendroDocsOpen(false)}
                  className="w-full sm:w-auto text-xs border-white/10"
                >
                  Tutup
                </Button>
                <a
                  href="https://slendro-ai.com/register-user.php?ref=RINSAI.PRO3734"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="md"
                    className="w-full sm:w-auto text-xs font-bold bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-500/25"
                  >
                    <span>Daftar &amp; Buka Slendro AI</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 4. PRODUCT ECOSYSTEM SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#7CF2C3]" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Nexarin Digital Shop &amp; Source Code
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Aplikasi siap pakai berlisensi lifetime dengan fitur trial gratis 3 hari dan update berkelanjutan.
            </p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-[#2DD4F5] hover:underline flex items-center gap-1">
            Jelajahi Semua Produk <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. FREE RESOURCES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        <div
          className="p-8 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.78), rgba(11, 17, 32, 0.55)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.20), rgba(45, 212, 245, 0.18), rgba(255, 255, 255, 0.05)) border-box",
            border: "1px solid transparent",
            backdropFilter: "blur(20px) saturate(130%)",
            WebkitBackdropFilter: "blur(20px) saturate(130%)",
            boxShadow: "0 12px 35px -5px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
          }}
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#2DD4F5]/10 text-[#2DD4F5] border border-[#2DD4F5]/20">
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Free Resources</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Template Excel, Source Code &amp; Starter Kit Gratis
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
              Unduh aset pendukung produktivitas, format absensi, dan komponen UI siap pakai tanpa biaya.
            </p>
          </div>
          <Link href="/free-resources">
            <Button variant="outline" size="md" className="font-bold text-xs whitespace-nowrap border-white/[0.15] text-white hover:border-[#2DD4F5]/50 bg-white/[0.04]">
              Unduh Free Resources
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>

            {/* 6. NEXARIN PREMIUM PRICING SECTION (Professional Multi-Tier & ULTRA Lifetime Pass) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full overflow-hidden" id="pricing">
        {/* Ambient Radial Lighting Accents */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-mono font-bold text-[#2DD4F5] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparan &amp; Fleksibel • Pilihan Paket Berlangganan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Investasi Cerdas untuk <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2DD4F5] via-[#7CF2C3] to-[#A855F7] bg-clip-text text-transparent">
              Perjalanan Karir &amp; Skill Anda
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Pilih skema langganan yang tepat sesuai kebutuhan Anda—mulai dari akses harian kilat, bulanan, tahunan, hingga <strong className="text-white">Paket ULTRA Unlimited Seumur Hidup</strong> dengan update gratis selamanya.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex lg:hidden items-center justify-center gap-2 mb-4 text-xs font-mono text-[#94A3B8] animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#2DD4F5]" />
          <span>Geser ke samping untuk melihat seluruh paket</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#7CF2C3]" />
        </div>

        {/* 4 Pricing Cards (Horizontal Carousel with Snap on Mobile, 4-Col Grid on Desktop) */}
        <div className="flex lg:grid lg:grid-cols-4 gap-5 sm:gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-6 lg:pb-0 px-4 sm:px-6 lg:px-0 -mx-4 sm:-mx-6 lg:mx-0 items-stretch">
          
          {/* ========================================================================= */}
          {/* TIER 1: PAKET HARIAN (DAILY PASS)                                         */}
          {/* ========================================================================= */}
          <div
            className="w-[85vw] max-w-[320px] sm:max-w-[340px] lg:w-auto lg:max-w-none shrink-0 snap-center lg:shrink rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1.5"
            style={{
              background:
                "linear-gradient(180deg, rgba(15, 23, 42, 0.75), rgba(11, 17, 32, 0.60)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.20), rgba(255, 255, 255, 0.03)) border-box",
              border: "1px solid transparent",
              backdropFilter: "blur(16px)",
              boxShadow: "0 12px 30px -5px rgba(0,0,0,0.4)"
            }}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#2DD4F5]">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70">
                  24 Jam Akses
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Paket Harian</h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Solusi ideal untuk riset kilat, tugas mendesak, atau evaluasi materi.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tight">Rp 15.000</span>
                  <span className="text-xs text-[#64748B] font-mono">/hari</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">Akses penuh berlaku 24 jam</p>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs text-[#94A3B8]">
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Akses 24 Jam ke Semua Modul Tutorial</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Unduh 2 Free Starter Kit &amp; Source Code</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Akses Komunitas Komentar &amp; Diskusi</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Responsive Web &amp; Mobile Friendly</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSelectPlan("Paket Harian", "Rp 15.000/hari")}
                className="w-full text-xs font-bold py-3 border-white/15 text-white hover:border-[#2DD4F5]/50 bg-white/[0.04]"
              >
                Pilih Paket Harian
              </Button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TIER 2: PAKET BULANAN (MONTHLY PRO - POPULAR)                             */}
          {/* ========================================================================= */}
          <div
            className="w-[85vw] max-w-[320px] sm:max-w-[340px] lg:w-auto lg:max-w-none shrink-0 snap-center lg:shrink rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-cyan-400/60 hover:-translate-y-1.5 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(45, 212, 245, 0.50), rgba(124, 242, 195, 0.40), rgba(255, 255, 255, 0.10)) border-box",
              border: "1px solid transparent",
              backdropFilter: "blur(16px)",
              boxShadow: "0 18px 40px -5px rgba(6, 182, 212, 0.15)"
            }}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#2DD4F5]">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-cyan-500/20 text-[#2DD4F5] border border-cyan-500/30">
                  ⚡ PALING POPULER
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Paket Bulanan</h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Pilihan utama developer, freelancer, dan mahasiswa aktif belajar.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tight">Rp 149.000</span>
                  <span className="text-xs text-[#64748B] font-mono">/bulan</span>
                </div>
                <p className="text-[11px] text-cyan-400 font-semibold mt-1">Akses penuh 30 hari + bonus</p>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs text-[#94A3B8]">
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Akses Penuh 30 Hari Tanpa Batasan</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Unduh Semua Free Resources &amp; Template</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Diskon Eksklusif 25% Nexarin Digital Shop</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Update Modul &amp; Artikel Baru Tiap Minggu</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Dukungan Teknis Tanya Jawab via Portal</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="button"
                onClick={() => handleSelectPlan("Paket Bulanan", "Rp 149.000/bln")}
                className="w-full text-xs font-black py-3 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-cyan-500/25"
              >
                Pilih Paket Bulanan
              </Button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TIER 3: PAKET TAHUNAN (ANNUAL MASTER - BEST VALUE)                        */}
          {/* ========================================================================= */}
          <div
            className="w-[85vw] max-w-[320px] sm:max-w-[340px] lg:w-auto lg:max-w-none shrink-0 snap-center lg:shrink rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1.5"
            style={{
              background:
                "linear-gradient(180deg, rgba(15, 23, 42, 0.75), rgba(11, 17, 32, 0.60)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(168, 85, 247, 0.30), rgba(255, 255, 255, 0.03)) border-box",
              border: "1px solid transparent",
              backdropFilter: "blur(16px)",
              boxShadow: "0 12px 30px -5px rgba(0,0,0,0.4)"
            }}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                  🔥 HEMAT 45%
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Paket Tahunan</h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Solusi komprehensif bagi praktisi profesional &amp; agensi digital.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tight">Rp 999.000</span>
                  <span className="text-xs text-[#64748B] font-mono">/tahun</span>
                </div>
                <p className="text-[11px] text-purple-300 font-semibold mt-1">Setara Rp 83rb/bln (Hemat Rp 789rb)</p>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs text-[#94A3B8]">
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Akses Penuh 365 Hari ke Semua Modul</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Lisensi Komersial untuk 5 Proyek Klien</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Diskon Ekstra 40% Semua Source Code Shop</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Konsultasi Arsitektur 1-on-1 Bulanan</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Prioritas Request Materi &amp; Artikel Khusus</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSelectPlan("Paket Tahunan", "Rp 999.000/thn")}
                className="w-full text-xs font-bold py-3 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
              >
                Pilih Paket Tahunan
              </Button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TIER 4: PAKET ULTRA (UNLIMITED SEUMUR HIDUP / LIFETIME VIP - FLAGSHIP)    */}
          {/* ========================================================================= */}
          <div
            className="w-[88vw] max-w-[330px] sm:max-w-[350px] lg:w-auto lg:max-w-none shrink-0 snap-center lg:shrink rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group"
            style={{
              background:
                "linear-gradient(180deg, rgba(20, 15, 38, 0.92), rgba(11, 17, 32, 0.85)) padding-box, linear-gradient(120deg, rgba(245, 158, 11, 0.70), rgba(168, 85, 247, 0.80), rgba(45, 212, 245, 0.70), rgba(124, 242, 195, 0.60)) border-box",
              border: "1.5px solid transparent",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 50px -5px rgba(168, 85, 247, 0.25), 0 0 35px -5px rgba(45, 212, 245, 0.20)"
            }}
          >
            {/* Holographic Glowing Sweep Light Effect */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-gradient-to-br from-amber-400/20 via-purple-500/25 to-cyan-400/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400/20 via-purple-500/20 to-cyan-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
                  <Crown className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-purple-500/20 to-cyan-400/20 text-amber-300 border border-amber-400/30 shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>ULTRA LIFETIME</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Paket ULTRA</span>
                  <InfinityIcon className="w-5 h-5 text-cyan-400" />
                </h3>
                <p className="text-xs text-amber-200/80 font-medium mt-1">
                  Akses Unlimited Seumur Hidup + Gratis Semua Update Selamanya.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tight">Rp 2.499.000</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">/Sekali Bayar</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Sekali Bayar untuk Selamanya</p>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 pt-4 border-t border-white/[0.12] text-xs text-slate-200">
                <div className="flex items-start gap-2 font-bold text-white">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Akses Tanpa Batas Seumur Hidup (Lifetime)</span>
                </div>
                <div className="flex items-start gap-2 font-semibold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Gratis Seluruh Update &amp; Versi Baru Selamanya</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#2DD4F5] shrink-0 mt-0.5" />
                  <span>Free Download Semua Source Code Digital Shop</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                  <span>Jalur Khusus VIP AI Generator &amp; Cloud Tools</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                  <span>Lisensi Komersial Unlimited Tanpa Batas Proyek</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Grup VIP Private &amp; Support Prioritas 24/7 Langsung</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                  <span>Early-Bird Akses Produk Baru Sebelum Rilis Publik</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6">
              <Button
                type="button"
                onClick={() => handleSelectPlan("Paket ULTRA Lifetime", "Rp 2.499.000 (Sekali Bayar)")}
                className="w-full text-xs font-black py-3.5 bg-gradient-to-r from-amber-400 via-purple-600 to-cyan-500 hover:from-amber-300 hover:to-cyan-400 text-slate-950 shadow-xl shadow-purple-500/30 hover:shadow-cyan-500/40"
              >
                Ambil Paket ULTRA Lifetime
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Trust & Assurance Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Jaminan Transaksi Aman &amp; Aktivasi Otomatis</div>
              <div className="text-xs text-[#94A3B8]">Semua paket didukung aktivasi lisensi instan dan jaminan garansi kepuasan.</div>
            </div>
          </div>
          <Link href="/contact">
            <Button variant="outline" size="sm" className="text-xs border-white/15 text-white/90 hover:border-cyan-400">
              Konsultasi dengan Kami
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. AFFILIATE & NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            {primaryAffiliate && <AffiliateWidget affiliate={primaryAffiliate} />}
          </div>
          <div className="lg:col-span-5">
            <NewsletterBox />
          </div>
        </div>
      </section>
    </div>
  );
}
