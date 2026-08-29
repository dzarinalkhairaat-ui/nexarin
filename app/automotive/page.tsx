"use client";

import React, { useState, useMemo } from "react";
import { useContent } from "@/context/ContentContext";
import { AutomotiveCategoryNav, AutomotiveCategoryFilter } from "@/components/automotive/AutomotiveCategoryNav";
import { AutomotiveHeroStory } from "@/components/automotive/AutomotiveHeroStory";
import { AutomotiveFeaturedStories } from "@/components/automotive/AutomotiveFeaturedStories";
import { AutomotiveLatestNews } from "@/components/automotive/AutomotiveLatestNews";
import { AutomotiveTrendingSidebar } from "@/components/automotive/AutomotiveTrendingSidebar";
import { AutomotiveAnalysisSection } from "@/components/automotive/AutomotiveAnalysisSection";
import { AISkeleton } from "@/components/ai/AISkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Search, RefreshCw, X, Radio, ArrowRight, Car } from "lucide-react";
import Link from "next/link";

export default function AutomotivePortalPage() {
  const { articles } = useContent();
  const [loading, setLoading] = useState(false);

  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  // 1. Filter only published Automotive articles
  const allAutoArticles = useMemo(() => {
    return articles.filter(
      (art) =>
        art.status === "published" &&
        (art.category.slug === "automotive" ||
          art.category.id === "automotive" ||
          art.tags?.some((t) =>
            ["otomotif", "automotive", "ev", "electric", "car", "mobil", "tesla", "byd", "battery", "supercar"].some(
              (keyword) => t.toLowerCase().includes(keyword)
            )
          ))
    );
  }, [articles]);

  // 2. Dynamic Subcategories count
  const subcategories: AutomotiveCategoryFilter[] = useMemo(() => {
    return [
      { id: "all", name: "Semua Otomotif", count: allAutoArticles.length },
      {
        id: "electric-vehicles",
        name: "Electric Vehicles (EV)",
        count: allAutoArticles.filter((a) =>
          a.tags?.some((t) => ["ev", "electric", "tesla", "byd", "hyundai"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "autonomous-driving",
        name: "Autonomous & AI Driving",
        count: allAutoArticles.filter((a) =>
          a.tags?.some((t) => ["autonomous", "fsd", "self-driving", "ai"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "supercars",
        name: "Supercars & Hypercars",
        count: allAutoArticles.filter((a) =>
          a.tags?.some((t) => ["supercar", "hypercar", "porsche", "ferrari"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "battery-charging",
        name: "Battery & Charging Tech",
        count: allAutoArticles.filter((a) =>
          a.tags?.some((t) => ["battery", "charging", "solid-state", "energy"].some((k) => t.toLowerCase().includes(k)))
        ).length
      }
    ];
  }, [allAutoArticles]);

  // 3. Filter by subcategory and search query
  const filteredArticles = useMemo(() => {
    let result = [...allAutoArticles];

    if (activeSubcategory !== "all") {
      result = result.filter((art) => {
        if (activeSubcategory === "electric-vehicles") {
          return art.tags?.some((t) => ["ev", "electric", "tesla", "byd", "hyundai"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "autonomous-driving") {
          return art.tags?.some((t) => ["autonomous", "fsd", "self-driving", "ai"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "supercars") {
          return art.tags?.some((t) => ["supercar", "hypercar", "porsche", "ferrari"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "battery-charging") {
          return art.tags?.some((t) => ["battery", "charging", "solid-state", "energy"].some((k) => t.toLowerCase().includes(k)));
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
  }, [allAutoArticles, activeSubcategory, searchQuery]);

  if (loading) {
    return <AISkeleton />;
  }

  // Segment articles for editorial layout
  const heroArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const remainingAfterHero = filteredArticles.filter((a) => a.id !== heroArticle?.id);

  const featuredStories = remainingAfterHero.slice(0, 3);
  const latestNews = remainingAfterHero.slice(3, visibleCount + 3);

  // Trending & Analysis
  const trendingArticles = [...allAutoArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const analysisArticles = allAutoArticles.filter((a) => a.contentType === "analysis" || a.contentType === "review").slice(0, 3);

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
                Pusat Berita, Riset, &amp; Wawasan Otomotif Masa Depan
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
                Liputan mendalam mengenai evolusi Electric Vehicles (EV), teknologi Autonomous Driving, arsitektur baterai solid-state, dan transformasi mobilitas cerdas global.
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
                    placeholder="Cari EV, Tesla, baterai, supercar..."
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

      {/* 2. LIVE BREAKING AUTOMOTIVE DISPATCH TICKER */}
      <div className="w-full bg-[#0F172A]/90 border-y border-white/[0.08] backdrop-blur-xl py-2.5 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-hidden text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-[#2DD4F5] border border-cyan-500/30 text-[10px] font-bold uppercase shrink-0 z-10 shadow-md">
            <Radio className="w-3 h-3 text-[#2DD4F5] animate-pulse" />
            Live Auto Dispatch
          </span>

          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-slate-300 text-xs">
              <span className="flex items-center gap-2">
                <span>Perkembangan Riset Solid-State Battery EV 1000km Range</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Tesla FSD V13 &amp; Robotaxi Ekosistem Mobilitas Cerdas</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Generasi Baru Hypercar Elektrik 1000+ Horsepower</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Infrastruktur Ultra-Fast Charging Megawatt Network</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>

              {/* Duplicate track for seamless infinite looping */}
              <span className="flex items-center gap-2">
                <span>Perkembangan Riset Solid-State Battery EV 1000km Range</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Tesla FSD V13 &amp; Robotaxi Ekosistem Mobilitas Cerdas</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Generasi Baru Hypercar Elektrik 1000+ Horsepower</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Infrastruktur Ultra-Fast Charging Megawatt Network</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUBCATEGORY FILTER NAVIGATION */}
      <AutomotiveCategoryNav
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
                {heroArticle && <AutomotiveHeroStory article={heroArticle} />}
              </div>
              <div className="lg:col-span-4">
                <AutomotiveTrendingSidebar articles={trendingArticles} />
              </div>
            </div>

            {/* FEATURED STORIES (3-Column Editorial Grid) */}
            {featuredStories.length > 0 && (
              <AutomotiveFeaturedStories articles={featuredStories} />
            )}

            {/* LATEST NEWS LIST (Left) + AUTOMOTIVE ANALYSIS & TEST DRIVE (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-white/[0.08]">
              <div className="lg:col-span-8 space-y-6">
                <AutomotiveLatestNews articles={latestNews.length > 0 ? latestNews : remainingAfterHero} />

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
                      Muat Lebih Banyak Artikel Otomotif
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar Analysis & Perspectives */}
              <div className="lg:col-span-4 space-y-8">
                <AutomotiveAnalysisSection articles={analysisArticles} />

                {/* EV Ecosystem Callout Card */}
                <div
                  className="p-6 sm:p-7 rounded-3xl border border-transparent backdrop-blur-xl text-white space-y-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(45, 212, 245, 0.40), rgba(124, 242, 195, 0.30), rgba(255, 255, 255, 0.05)) border-box",
                    border: "1px solid transparent"
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#2DD4F5]">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#7CF2C3] tracking-wider block">
                      Nexarin Future Mobility
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Kalkulator Efisiensi &amp; Ekosistem EV
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                      Eksplorasi wawasan mendalam mengenai perbandingan biaya energi kendaraan listrik vs konvensional dan tips perawatan baterai EV jangka panjang.
                    </p>
                  </div>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2DD4F5] hover:text-[#7CF2C3] transition-colors pt-1"
                  >
                    <span>Eksplorasi Portal Berita</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Belum Ada Artikel Otomotif yang Sesuai"
            description="Tidak ditemukan artikel atau ulasan otomotif dengan filter atau kata kunci pencarian yang Anda masukkan."
            actionText="Tampilkan Semua Artikel Otomotif"
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
