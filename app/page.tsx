"use client";

import React from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { useShop } from "@/context/ShopContext";
import { useTutorials } from "@/context/TutorialContext";
import { TutorialCourse } from "@/types/tutorial";
import { ArticleCard } from "@/components/portal/ArticleCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { AffiliateWidget } from "@/components/affiliate/AffiliateWidget";
import { NewsletterBox } from "@/components/portal/NewsletterBox";
import { Button } from "@/components/ui/Button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { UnicornBackground } from "@/components/ui/unicorn-background";
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
  const { courses } = useTutorials();
  const featuredClass = courses.find((c: TutorialCourse) => c.isFeatured) || courses[0];

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
        <UnicornBackground projectId="NaoyTHRiquOhW7PvwNgE" className="z-0" />

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

            {/* Right Column: Featured Class Glassmorphic Card (col-span-5) */}
            <div className="lg:col-span-5">
              <div
                className="group relative p-6 sm:p-7 rounded-3xl border border-transparent backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-cyan-500/15 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.65)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.22), rgba(45, 212, 245, 0.20), rgba(255, 255, 255, 0.05)) border-box",
                  border: "1px solid transparent",
                  backdropFilter: "blur(20px) saturate(130%)",
                  WebkitBackdropFilter: "blur(20px) saturate(130%)",
                  boxShadow: "0 15px 40px -5px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                }}
              >
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.08]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[#2DD4F5] text-[11px] font-mono font-bold uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Kelas Unggulan Pilihan</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5.0</span>
                    <span className="text-[10px] text-[#64748B] font-normal">(2.300+ Siswa)</span>
                  </div>
                </div>

                {/* Class Thumbnail Preview */}
                <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-white/[0.10]">
                  <img
                    src={featuredClass?.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop"}
                    alt={featuredClass?.title || "Kelas Unggulan"}
                    onError={(e) => {
                      e.currentTarget.src = "/assets/default-cover.svg";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80" />

                  {/* Floating Badges inside thumbnail */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold backdrop-blur-md">
                      {featuredClass?.level || "Beginner Friendly"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-cyan-300 border border-white/[0.12] text-[10px] font-mono backdrop-blur-md">
                      {featuredClass?.duration || "2h 30m"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                    <span className="font-mono text-[11px] font-semibold text-cyan-300">
                      {featuredClass?.categoryName || "Microsoft Skills"}
                    </span>
                    <span className="text-[10px] font-mono text-[#7CF2C3] font-bold">
                      {featuredClass?.lessonCount || 4} Pelajaran Lengkap
                    </span>
                  </div>
                </div>

                {/* Class Info */}
                <div className="space-y-2 mb-5">
                  <Link href={featuredClass ? `/tutorials/${featuredClass.slug}` : "/tutorials"}>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                      {featuredClass?.title || "Microsoft Excel Data Analytics & Automation Masterclass 2026"}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {featuredClass?.tagline || "Kuasai formula XLOOKUP, Pivot Table, Power Query, dan integrasi AI Copilot dari dasar hingga mahir."}
                  </p>
                </div>

                {/* Quick Syllabus Highlights */}
                <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] font-mono text-[#94A3B8]">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CF2C3] shrink-0" />
                    <span className="truncate">Formula XLOOKUP &amp; Pivot</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Copilot AI Prompts</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={featuredClass ? `/tutorials/${featuredClass.slug}` : "/tutorials"}
                  className="block w-full"
                >
                  <Button
                    variant="mint"
                    size="md"
                    className="w-full font-black text-xs text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Mulai Belajar Kelas Ini</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
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
