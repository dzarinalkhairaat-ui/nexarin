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
  DownloadCloud
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
    <div className="space-y-16 sm:space-y-24 bg-[#0B1120]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4F5]/10 border border-[#2DD4F5]/30 text-[#2DD4F5] text-xs font-bold tracking-wide">
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
              Portal berita terkurasi AI & software engineering, ulasan gadget, otomotif masa depan, serta marketplace aplikasi berlisensi lifetime dengan uji coba gratis 3 hari.
            </p>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Link href="/ai">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-white/[0.10] text-[#94A3B8] hover:text-white">
                  <Cpu className="w-3.5 h-3.5 mr-1 text-[#2DD4F5]" />
                  AI & Agents
                </Button>
              </Link>
              <Link href="/gadget">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-white/[0.10] text-[#94A3B8] hover:text-white">
                  <Smartphone className="w-3.5 h-3.5 mr-1 text-purple-400" />
                  Gadgets
                </Button>
              </Link>
              <Link href="/automotive">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-white/[0.10] text-[#94A3B8] hover:text-white">
                  <Car className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  EV Tech
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="primary" size="sm" className="rounded-full text-xs font-bold">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                  Katalog Shop
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

      {/* 2. Latest Feed & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2DD4F5]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Wawasan & Berita Terkini
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

      {/* 3. Product Ecosystem Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] text-xs font-mono font-bold border border-[#7CF2C3]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nexarin Digital Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Aplikasi & Source Code Siap Pakai
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl">
              Dapatkan lisensi seumur hidup, full source code terstruktur, dan dukungan uji coba 3 hari tanpa risiko.
            </p>
          </div>

          <Link href="/shop">
            <Button variant="mint" size="md" className="font-bold text-slate-950">
              Jelajahi Semua Produk ({products.length}) →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. AI & Tutorials Double Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* AI Focus */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#2DD4F5]" />
                <h3 className="text-lg font-bold text-white">
                  Artificial Intelligence
                </h3>
              </div>
              <Link href="/ai" className="text-xs font-bold text-[#2DD4F5] hover:underline">
                Lihat Kanal AI →
              </Link>
            </div>

            <div className="space-y-4">
              {aiArticles.map((art) => (
                <Card key={art.id} hoverable className="p-4 flex gap-4 items-center bg-white/[0.035] border-white/[0.08]">
                  <img
                    src={art.featuredImage || "/assets/default-cover.svg"}
                    alt={art.title}
                    onError={(e) => {
                      e.currentTarget.src = "/assets/default-cover.svg";
                    }}
                    className="w-24 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link href={`/article/${art.slug}`}>
                      <h4 className="text-sm font-bold text-white hover:text-[#2DD4F5] line-clamp-2 transition-colors">
                        {art.title}
                      </h4>
                    </Link>
                    <span className="text-[11px] text-[#64748B] font-mono block">
                      {art.readingTimeMinutes} mnt baca • {art.views} views
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tutorials Focus */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#7CF2C3]" />
                <h3 className="text-lg font-bold text-white">
                  Tutorial & Implementasi
                </h3>
              </div>
              <Link href="/tutorials" className="text-xs font-bold text-[#7CF2C3] hover:underline">
                Lihat Semua Tutorial →
              </Link>
            </div>

            <div className="space-y-4">
              {tutorialArticles.map((art) => (
                <Card key={art.id} hoverable className="p-4 flex gap-4 items-center bg-white/[0.035] border-white/[0.08]">
                  <img
                    src={art.featuredImage || "/assets/default-cover.svg"}
                    alt={art.title}
                    onError={(e) => {
                      e.currentTarget.src = "/assets/default-cover.svg";
                    }}
                    className="w-24 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link href={`/article/${art.slug}`}>
                      <h4 className="text-sm font-bold text-white hover:text-[#7CF2C3] line-clamp-2 transition-colors">
                        {art.title}
                      </h4>
                    </Link>
                    <span className="text-[11px] text-[#64748B] font-mono block">
                      {art.readingTimeMinutes} mnt baca • {art.views} views
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Affiliate Recommendations */}
      {primaryAffiliate && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AffiliateWidget affiliate={primaryAffiliate} />
        </section>
      )}

      {/* 6. Free Resources & Assets Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white/[0.035] border border-cyan-500/20 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4F5]/10 text-cyan-400 text-xs font-mono font-bold">
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>100% Free Resources</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Unduh Starter Kits & Template Gratis
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Mulai proyek Next.js, Supabase, Tailwind, dan modul autentikasi Anda dengan arsitektur standar produksi tanpa biaya.
            </p>
          </div>

          <Link href="/free-resources">
            <Button variant="primary" size="lg" className="font-bold text-sm whitespace-nowrap">
              Akses Free Resources →
            </Button>
          </Link>
        </div>
      </section>

      {/* 7. Newsletter Subscription Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <NewsletterBox />
      </section>
    </div>
  );
}
