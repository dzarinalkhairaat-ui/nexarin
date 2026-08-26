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
import { Card } from "@/components/ui/Card";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Smartphone,
  Car,
  BookOpen,
  ShoppingBag,
  DownloadCloud,
  Layers,
  CheckCircle2,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  const { articles } = useContent();
  const { products, affiliates } = useShop();

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const latestArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 4);
  const aiArticles = articles.filter((a) => a.category.slug === "ai").slice(0, 3);
  const tutorialArticles = articles.filter((a) => a.category.slug === "tutorials").slice(0, 3);
  const topProducts = products.slice(0, 3);
  const primaryAffiliate = affiliates[0];

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#0B1120] text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-8">
        {/* Subtle ambient light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2DD4F5]/10 border border-[#2DD4F5]/30 text-[#2DD4F5] text-xs font-bold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ekosistem Teknologi Terintegrasi • Nexarin by Rins</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Informasi, Edukasi, dan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3]">
                Produk Digital
              </span>{" "}
              Siap Pakai.
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
              Portal berita terkurasi AI &amp; software engineering, ulasan gadget, otomotif masa depan, tutorial praktis, serta marketplace aplikasi berlisensi lifetime dengan uji coba gratis 3 hari.
            </p>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Link href="/ai">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-white/[0.10] text-[#94A3B8] hover:text-white bg-white/[0.03] backdrop-blur-md">
                  <Cpu className="w-3.5 h-3.5 mr-1 text-[#2DD4F5]" />
                  AI &amp; Agents
                </Button>
              </Link>
              <Link href="/tutorials">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-white/[0.10] text-[#94A3B8] hover:text-white bg-white/[0.03] backdrop-blur-md">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-[#7CF2C3]" />
                  Tutorial Class Hub
                </Button>
              </Link>
              <Link href="/gadget">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-white/[0.10] text-[#94A3B8] hover:text-white bg-white/[0.03] backdrop-blur-md">
                  <Smartphone className="w-3.5 h-3.5 mr-1 text-purple-400" />
                  Gadgets
                </Button>
              </Link>
              <Link href="/automotive">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-white/[0.10] text-[#94A3B8] hover:text-white bg-white/[0.03] backdrop-blur-md">
                  <Car className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  EV Tech
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="primary" size="sm" className="rounded-full text-xs font-extrabold">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                  Digital Shop
                </Button>
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

      {/* 3. TUTORIAL CLASS HUB BANNER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-10 border border-cyan-500/25 bg-gradient-to-r from-[#0F172A] via-[#131E32] to-[#0F172A] backdrop-blur-xl overflow-hidden group">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#7CF2C3]/10 text-[#7CF2C3] border border-[#7CF2C3]/20">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Pusat Pembelajaran Digital</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Nexari Tutorial Class Hub
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Pelajari AI Automation, Microsoft Skills (Excel, PowerPoint, Word), Next.js 16, UI/UX Design System, dan Otomotif EV dengan silabus terstruktur dan classroom viewer mandiri.
              </p>
            </div>
            <Link href="/tutorials">
              <Button variant="mint" size="md" className="font-extrabold text-xs text-slate-950 whitespace-nowrap">
                Mulai Belajar Sekarang
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
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

      {/* 5. FREE RESOURCES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#0F172A]/70 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
            <Button variant="outline" size="md" className="font-bold text-xs whitespace-nowrap border-white/[0.12] text-white hover:border-[#2DD4F5]/40">
              Unduh Free Resources
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. AFFILIATE & NEWSLETTER SECTION */}
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
