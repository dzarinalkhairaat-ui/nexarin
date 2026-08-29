"use client";

import React, { useState, useMemo } from "react";
import { useContent } from "@/context/ContentContext";
import { GadgetCategoryNav, GadgetCategoryFilter } from "@/components/gadget/GadgetCategoryNav";
import { GadgetHeroStory } from "@/components/gadget/GadgetHeroStory";
import { GadgetFeaturedStories } from "@/components/gadget/GadgetFeaturedStories";
import { GadgetLatestNews } from "@/components/gadget/GadgetLatestNews";
import { GadgetTrendingSidebar } from "@/components/gadget/GadgetTrendingSidebar";
import { GadgetAnalysisSection } from "@/components/gadget/GadgetAnalysisSection";
import { AISkeleton } from "@/components/ai/AISkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Search, RefreshCw, X, Radio, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";

export default function GadgetPortalPage() {
  const { articles } = useContent();
  const [loading, setLoading] = useState(false);

  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  // 1. Filter only published Gadget articles
  const allGadgetArticles = useMemo(() => {
    return articles.filter(
      (art) =>
        art.status === "published" &&
        (art.category.slug === "gadget" ||
          art.category.id === "gadget" ||
          art.tags?.some((t) =>
            ["gadget", "smartphone", "laptop", "audio", "camera", "wearable", "apple", "samsung"].some(
              (keyword) => t.toLowerCase().includes(keyword)
            )
          ))
    );
  }, [articles]);

  // 2. Dynamic Subcategories count
  const subcategories: GadgetCategoryFilter[] = useMemo(() => {
    return [
      { id: "all", name: "Semua Gadget", count: allGadgetArticles.length },
      {
        id: "smartphones",
        name: "Smartphones",
        count: allGadgetArticles.filter((a) =>
          a.tags?.some((t) => ["phone", "smartphone", "iphone", "galaxy"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "laptops-pc",
        name: "Laptops & PC",
        count: allGadgetArticles.filter((a) =>
          a.tags?.some((t) => ["laptop", "macbook", "pc", "computer"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "audio-wearables",
        name: "Audio & Wearables",
        count: allGadgetArticles.filter((a) =>
          a.tags?.some((t) => ["audio", "headphone", "earphone", "watch", "wearable"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "hardware-accessories",
        name: "Hardware & Gear",
        count: allGadgetArticles.filter((a) =>
          a.tags?.some((t) => ["hardware", "gear", "accessories", "camera"].some((k) => t.toLowerCase().includes(k)))
        ).length
      }
    ];
  }, [allGadgetArticles]);

  // 3. Filter by subcategory and search query
  const filteredArticles = useMemo(() => {
    let result = [...allGadgetArticles];

    if (activeSubcategory !== "all") {
      result = result.filter((art) => {
        if (activeSubcategory === "smartphones") {
          return art.tags?.some((t) => ["phone", "smartphone", "iphone", "galaxy"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "laptops-pc") {
          return art.tags?.some((t) => ["laptop", "macbook", "pc", "computer"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "audio-wearables") {
          return art.tags?.some((t) => ["audio", "headphone", "earphone", "watch", "wearable"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "hardware-accessories") {
          return art.tags?.some((t) => ["hardware", "gear", "accessories", "camera"].some((k) => t.toLowerCase().includes(k)));
        }
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allGadgetArticles, activeSubcategory, searchQuery]);

  if (loading) {
    return <AISkeleton />;
  }

  // Segment articles for editorial layout
  const heroArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const remainingAfterHero = filteredArticles.filter((a) => a.id !== heroArticle?.id);

  const featuredStories = remainingAfterHero.slice(0, 3);
  const latestNews = remainingAfterHero.slice(3, visibleCount + 3);

  // Trending & Analysis
  const trendingArticles = [...allGadgetArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const analysisArticles = allGadgetArticles.filter((a) => a.contentType === "analysis" || a.contentType === "review").slice(0, 3);

  const hasMore = remainingAfterHero.length > visibleCount + 3;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-slate-100 selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH 3D CYBER WAVE BACKGROUND */}
      <section className="relative isolate overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28 w-full max-w-full">
        {/* Pure 3D Geometric Wave & Starlight Aurora Canvas */}
        <CyberWaveBackground className="z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            
            {/* Headline & Description */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Pusat Berita, Review, &amp; Wawasan Gadget Terkini
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
                Ulasan mendalam flagship smartphone, laptop performa tinggi, wearable tech, audio gear audiophile, dan perangkat keras inovatif masa depan.
              </p>
            </div>

            {/* Premium Glassmorphic Search Bar */}
            <div className="w-full lg:w-96 relative group shrink-0">
              <div className="relative flex items-center rounded-2xl bg-[#0F172A]/85 border border-white/[0.12] hover:border-[#2DD4F5]/40 focus-within:border-[#2DD4F5] focus-within:bg-[#0B1120] focus-within:ring-1 focus-within:ring-[#2DD4F5]/30 transition-all duration-200 backdrop-blur-xl p-2 pl-4 pr-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#2DD4F5] transition-colors shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari gadget, laptop, smartphone..."
                    className="w-full bg-transparent text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
                  />
                </div>
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Bersihkan pencarian"
                    className="p-1 text-[#64748B] hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors text-[11px] font-mono shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1 pl-2 shrink-0">
                    <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-[#64748B] bg-white/[0.05] rounded-md border border-white/[0.08]">
                      ⌘K
                    </kbd>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE BREAKING GADGET DISPATCH TICKER */}
      <div className="w-full bg-[#0F172A]/90 border-y border-white/[0.08] backdrop-blur-xl py-2.5 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-hidden text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-[#2DD4F5] border border-cyan-500/30 text-[10px] font-bold uppercase shrink-0 z-10 shadow-md">
            <Radio className="w-3 h-3 text-[#2DD4F5] animate-pulse" />
            Live Gadget Dispatch
          </span>

          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-slate-300 text-xs">
              <span className="flex items-center gap-2">
                <span>Apple Silicon M4 &amp; MacBook Pro Flagship 2026</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Snapdragon 8 Elite Arsitektur 3nm Nuvia Cores</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Inovasi Foldable &amp; Tri-Fold Smartphone OLED</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Spatial Computing &amp; Perangkat VR Next-Gen</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>

              {/* Duplicate track for seamless infinite looping */}
              <span className="flex items-center gap-2">
                <span>Apple Silicon M4 &amp; MacBook Pro Flagship 2026</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Snapdragon 8 Elite Arsitektur 3nm Nuvia Cores</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Inovasi Foldable &amp; Tri-Fold Smartphone OLED</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Spatial Computing &amp; Perangkat VR Next-Gen</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUBCATEGORY FILTER NAVIGATION */}
      <GadgetCategoryNav
        categories={subcategories}
        activeCategory={activeSubcategory}
        onSelectCategory={setActiveSubcategory}
      />

      {/* 4. MAIN EDITORIAL CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20 w-full overflow-hidden">
        {filteredArticles.length > 0 ? (
          <>
            {/* TOP STORY (HERO CARD) + TOP 5 TRENDING SIDEBAR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                {heroArticle && <GadgetHeroStory article={heroArticle} />}
              </div>
              <div className="lg:col-span-4">
                <GadgetTrendingSidebar articles={trendingArticles} />
              </div>
            </div>

            {/* FEATURED STORIES (3-Column Editorial Grid) */}
            {featuredStories.length > 0 && (
              <GadgetFeaturedStories articles={featuredStories} />
            )}

            {/* LATEST NEWS LIST (Left) + GADGET ANALYSIS & REVIEWS (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-white/[0.08]">
              <div className="lg:col-span-8 space-y-6">
                <GadgetLatestNews articles={latestNews.length > 0 ? latestNews : remainingAfterHero} />

                {/* Load More Pagination Trigger */}
                {hasMore && (
                  <div className="pt-6 text-center">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="font-bold text-xs border-white/15 text-slate-300 hover:text-white hover:border-[#2DD4F5]/50 bg-white/[0.03]"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      Muat Lebih Banyak Ulasan Gadget
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar Analysis & Perspectives */}
              <div className="lg:col-span-4 space-y-8">
                <GadgetAnalysisSection articles={analysisArticles} />

                {/* Gadget Affiliate Callout Card */}
                <div
                  className="p-6 sm:p-7 rounded-3xl border border-transparent backdrop-blur-xl text-white space-y-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(45, 212, 245, 0.40), rgba(124, 242, 195, 0.30), rgba(255, 255, 255, 0.05)) border-box",
                    border: "1px solid transparent"
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#2DD4F5]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#7CF2C3] tracking-wider block">
                      Rekomendasi Terverifikasi
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Koleksi Gear &amp; Gadget Produktivitas Pilihan
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                      Dapatkan rekomendasi perangkat kerja, setup workstation minimalis, dan diskon resmi marketplace terverifikasi oleh Nexarin.
                    </p>
                  </div>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2DD4F5] hover:text-[#7CF2C3] transition-colors pt-1"
                  >
                    <span>Cari Rekomendasi Gadget</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Belum Ada Ulasan Gadget yang Sesuai"
            description="Tidak ditemukan artikel atau ulasan gadget dengan filter atau kata kunci pencarian yang Anda masukkan."
            actionText="Tampilkan Semua Ulasan Gadget"
            onAction={() => {
              setActiveSubcategory("all");
              setSearchQuery("");
            }}
          />
        )}
      </main>
    </div>
  );
}
