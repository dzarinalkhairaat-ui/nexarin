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
import { CyberMeshBackground } from "@/components/ui/cyber-mesh-background";
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
  Target,
  Award,
  ShieldCheck,
  Zap,
  Star
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
      {/* 1. HERO SECTION (2-Column Ultra-Premium Layout with Unicorn Studio Interactive WebGL Background) */}
      <section
        className="relative isolate overflow-hidden pt-12 sm:pt-24 pb-36 sm:pb-48 lg:pb-60 min-h-[750px]"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0%, black 6%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 6%, black 95%, transparent 100%)"
        }}
      >
        {/* Unicorn Studio Project Background */}
        <CyberMeshBackground className="z-0" />

        {/* Top Smooth Gradient Fade (blending seamlessly with Header) */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#0B1120] via-[#0B1120]/50 to-transparent pointer-events-none z-0" />

        {/* Bottom Gentle Transition at the absolute edge (leaving full animation visible above) */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent pointer-events-none z-0" />

        {/* Subtle Dark overlay & ambient glow for optimal typography contrast */}
        <div className="absolute inset-0 bg-[#0B1120]/25 backdrop-blur-[0.5px] pointer-events-none z-0" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-[#7CF2C3]/8 rounded-full blur-[130px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
            
            {/* Left Content (col-span-7) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                Informasi, Edukasi, &amp;<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2DD4F5] via-[#7CF2C3] to-white">
                  Produk Digital
                </span><br />
                Siap Pakai.
              </h1>

              {/* Subtitle description */}
              <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-xl mx-auto lg:mx-0">
                Portal berita terkurasi AI &amp; software engineering, ulasan gadget, otomotif masa depan, tutorial praktis, serta marketplace aplikasi berlisensi lifetime dengan uji coba gratis 3 hari.
              </p>

              {/* Primary CTAs with ShinyButton */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link href="/shop" className="w-full sm:w-auto">
                  <ShinyButton className="w-full sm:w-auto">
                    <ShoppingBag className="w-4 h-4 text-[#2DD4F5]" />
                    <span>Jelajahi Digital Shop</span>
                    <ArrowRight className="w-4 h-4 text-[#7CF2C3]" />
                  </ShinyButton>
                </Link>
                <Link href="/tutorials" className="w-full sm:w-auto">
                  <ShinyButton className="w-full sm:w-auto">
                    <GraduationCap className="w-4 h-4 text-[#7CF2C3]" />
                    <span>Tutorial Class Hub</span>
                    <Sparkles className="w-4 h-4 text-[#2DD4F5]" />
                  </ShinyButton>
                </Link>
              </div>
            </div>

            {/* Right Stats & Ecosystem Showcase (col-span-5) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              {/* Stats Card */}
              <div
                className="p-6 sm:p-8 rounded-3xl border border-transparent backdrop-blur-xl relative shadow-2xl transition-all duration-300 hover:shadow-cyan-500/10"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.65)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.22), rgba(45, 212, 245, 0.20), rgba(255, 255, 255, 0.05)) border-box",
                  border: "1px solid transparent",
                  backdropFilter: "blur(20px) saturate(130%)",
                  WebkitBackdropFilter: "blur(20px) saturate(130%)",
                  boxShadow: "0 15px 40px -5px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                }}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                      150+
                    </div>
                    <div className="text-xs sm:text-sm text-[#94A3B8]">
                      Solusi &amp; Artikel Terkurasi
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-[#94A3B8]">Tingkat Kepuasan Pengguna</span>
                    <span className="font-bold text-[#7CF2C3] font-mono">98.5%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/[0.08]">
                    <div
                      className="h-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] rounded-full"
                      style={{ width: "98.5%" }}
                    />
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent my-4" />

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-lg sm:text-xl font-bold text-white font-mono">5+</div>
                    <div className="text-[10px] text-[#64748B] uppercase font-mono">Tahun Inovasi</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-lg sm:text-xl font-bold text-[#2DD4F5] font-mono">24/7</div>
                    <div className="text-[10px] text-[#64748B] uppercase font-mono">Lisensi Instan</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-lg sm:text-xl font-bold text-[#7CF2C3] font-mono">100%</div>
                    <div className="text-[10px] text-[#64748B] uppercase font-mono">Verified Quality</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE PORTAL
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    PREMIUM SUITE
                  </span>
                </div>
              </div>

              {/* Tech Stack Marquee Card */}
              <div
                className="p-5 rounded-2xl border border-transparent backdrop-blur-xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15, 23, 42, 0.70), rgba(11, 17, 32, 0.50)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.12), rgba(255, 255, 255, 0.04)) border-box",
                  border: "1px solid transparent",
                  backdropFilter: "blur(16px) saturate(130%)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35)"
                }}
              >
                <div className="text-xs font-mono text-[#64748B] uppercase mb-2.5 flex items-center justify-between">
                  <span>Ekosistem Teknologi &amp; Integrasi</span>
                  <span className="text-[#2DD4F5] text-[10px] font-bold">v2.4 Powered</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.08] text-white">
                    Next.js 16
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.08] text-cyan-300">
                    Supabase PostgreSQL
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.08] text-[#7CF2C3]">
                    Gemini AI 2.0
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.08] text-purple-300">
                    React 19
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.08] text-blue-300">
                    TypeScript
                  </span>
                </div>
              </div>
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

      {/* 3. PRODUCT ECOSYSTEM SPOTLIGHT */}
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
