"use client";

import React from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { ArticleCard } from "@/components/portal/ArticleCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { AffiliateWidget } from "@/components/affiliate/AffiliateWidget";
import { NewsletterBox } from "@/components/portal/NewsletterBox";
import { Button } from "@/components/ui/Button";
import { ShinyButton } from "@/components/ui/shiny-button";
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
  ExternalLink
} from "lucide-react";

export default function HomePage() {
  const { articles } = useContent();
  const { products, affiliates } = useShop();

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const latestArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 4);
  const topProducts = products.slice(0, 3);
  const primaryAffiliate = affiliates[0];

  return (
    <div suppressHydrationWarning className="space-y-16 sm:space-y-24 bg-[#0B1120] text-slate-100">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

            {/* 3. SLENDRO-AI SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden p-7 sm:p-10 rounded-3xl border border-transparent backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-purple-500/15"
          style={{
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(11, 17, 32, 0.75)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.22), rgba(168, 85, 247, 0.35), rgba(45, 212, 245, 0.30), rgba(255, 255, 255, 0.05)) border-box",
            border: "1px solid transparent",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            boxShadow: "0 15px 40px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
          }}
        >
          {/* Ambient Lighting Accents */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Logo & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left max-w-2xl">
              {/* Slendro AI Logo with glowing frame */}
              <div className="relative shrink-0 group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-400 opacity-40 blur-md group-hover:opacity-75 transition-opacity" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950/80 border border-white/15 p-3 flex items-center justify-center backdrop-blur-md shadow-xl">
                  <img
                    src="/logo_slendro.png"
                    alt="Slendro-Ai Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>

              {/* Text & Features */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Featured AI Suite</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Unlimited Free</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Slendro-Ai
                  </h3>
                  <p className="text-sm sm:text-base text-[#94A3B8] font-medium leading-relaxed mt-1">
                    Slendro Ai - Unlimites Free Ai Video, Music &amp; Image Generator.
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/90">
                    🎬 AI Video Generator
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-cyan-300">
                    🎵 AI Music Synthesizer
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-purple-300">
                    🎨 AI Image Generator
                  </span>
                </div>
              </div>
            </div>

            {/* Right: CTA Action */}
            <div className="shrink-0 flex flex-col items-center lg:items-end gap-2.5 w-full sm:w-auto">
              <a
                href="https://slendro-ai.com/register-user.php?ref=RINSAI.PRO3734"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto block"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-black text-sm px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-xl shadow-purple-500/25 hover:shadow-cyan-500/35 transition-all duration-300 rounded-2xl flex items-center justify-center gap-2 group"
                >
                  <span>Akses Disini</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <span className="text-[11px] text-[#64748B] font-mono text-center lg:text-right">
                ✓ Akses Penuh &amp; Pendaftaran Cepat
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT ECOSYSTEM SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* 5. AFFILIATE & NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
