"use client";

import React, { useState, useMemo } from "react";
import { useContent } from "@/context/ContentContext";
import { TechCategoryNav, TechCategoryFilter } from "@/components/technology/TechCategoryNav";
import { TechHeroStory } from "@/components/technology/TechHeroStory";
import { TechFeaturedStories } from "@/components/technology/TechFeaturedStories";
import { TechLatestNews } from "@/components/technology/TechLatestNews";
import { TechTrendingSidebar } from "@/components/technology/TechTrendingSidebar";
import { TechAnalysisSection } from "@/components/technology/TechAnalysisSection";
import { AISkeleton } from "@/components/ai/AISkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Search, RefreshCw, X, Radio, ArrowRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export default function TechnologyPortalPage() {
  const { articles } = useContent();
  const [loading, setLoading] = useState(false);

  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  // 1. Filter only published Technology articles
  const allTechArticles = useMemo(() => {
    return articles.filter(
      (art) =>
        art.status === "published" &&
        (art.category.slug === "technology" ||
          art.category.id === "technology" ||
          art.tags?.some((t) =>
            ["software", "cloud", "react", "next.js", "database", "security", "engineering", "architecture", "devops"].some(
              (keyword) => t.toLowerCase().includes(keyword)
            )
          ))
    );
  }, [articles]);

  // 2. Dynamic Subcategories count
  const subcategories: TechCategoryFilter[] = useMemo(() => {
    return [
      { id: "all", name: "Semua Teknologi", count: allTechArticles.length },
      {
        id: "software-engineering",
        name: "Software Engineering",
        count: allTechArticles.filter((a) =>
          a.tags?.some((t) => ["software", "engineering", "react", "next.js"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "cloud-devops",
        name: "Cloud & DevOps",
        count: allTechArticles.filter((a) =>
          a.tags?.some((t) => ["cloud", "devops", "kubernetes", "microservices"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "database-backend",
        name: "Database & Backend",
        count: allTechArticles.filter((a) =>
          a.tags?.some((t) => ["database", "sql", "postgresql", "backend", "supabase"].some((k) => t.toLowerCase().includes(k)))
        ).length
      },
      {
        id: "cybersecurity",
        name: "Cybersecurity",
        count: allTechArticles.filter((a) =>
          a.tags?.some((t) => ["security", "zero trust", "cyber", "api"].some((k) => t.toLowerCase().includes(k)))
        ).length
      }
    ];
  }, [allTechArticles]);

  // 3. Filter by subcategory and search query
  const filteredArticles = useMemo(() => {
    let result = [...allTechArticles];

    if (activeSubcategory !== "all") {
      result = result.filter((art) => {
        if (activeSubcategory === "software-engineering") {
          return art.tags?.some((t) => ["software", "engineering", "react", "next.js"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "cloud-devops") {
          return art.tags?.some((t) => ["cloud", "devops", "kubernetes", "microservices"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "database-backend") {
          return art.tags?.some((t) => ["database", "sql", "postgresql", "backend", "supabase"].some((k) => t.toLowerCase().includes(k)));
        }
        if (activeSubcategory === "cybersecurity") {
          return art.tags?.some((t) => ["security", "zero trust", "cyber", "api"].some((k) => t.toLowerCase().includes(k)));
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
  }, [allTechArticles, activeSubcategory, searchQuery]);

  if (loading) {
    return <AISkeleton />;
  }

  // Segment articles for editorial layout
  const heroArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const remainingAfterHero = filteredArticles.filter((a) => a.id !== heroArticle?.id);

  const featuredStories = remainingAfterHero.slice(0, 3);
  const latestNews = remainingAfterHero.slice(3, visibleCount + 3);

  // Trending & Analysis
  const trendingArticles = [...allTechArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const analysisArticles = allTechArticles.filter((a) => a.contentType === "analysis" || a.contentType === "opinion").slice(0, 3);

  const hasMore = remainingAfterHero.length > visibleCount + 3;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-slate-100 selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH 3D CYBER WAVE BACKGROUND (MATCHING HOME & AI THEME) */}
      <section className="relative isolate overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28 w-full max-w-full">
        {/* Pure 3D Geometric Wave & Starlight Aurora Canvas */}
        <CyberWaveBackground className="z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            
            {/* Headline & Description */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Pusat Berita, Riset, &amp; Wawasan Teknologi Terkini
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
                Liputan mendalam mengenai arsitektur perangkat lunak modern, Next.js 16 &amp; React 19, infrastruktur cloud DevOps, optimalisasi database PostgreSQL, dan standar keamanan siber enterprise.
              </p>
            </div>

            {/* Premium Glassmorphic Technology Search Bar */}
            <div className="w-full lg:w-96 relative group shrink-0">
              <div className="relative flex items-center rounded-2xl bg-[#0F172A]/85 border border-white/[0.12] hover:border-[#2DD4F5]/40 focus-within:border-[#2DD4F5] focus-within:bg-[#0B1120] focus-within:ring-1 focus-within:ring-[#2DD4F5]/30 transition-all duration-200 backdrop-blur-xl p-2 pl-4 pr-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#2DD4F5] transition-colors shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari artikel: 'Next.js', 'PostgreSQL'..."
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

      {/* 2. LIVE BREAKING TECH DISPATCH TICKER (CONTINUOUS SEAMLESS MARQUEE LOOP) */}
      <div className="w-full bg-[#0F172A]/90 border-y border-white/[0.08] backdrop-blur-xl py-2.5 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-hidden text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-[#2DD4F5] border border-cyan-500/30 text-[10px] font-bold uppercase shrink-0 z-10 shadow-md">
            <Radio className="w-3 h-3 text-[#2DD4F5] animate-pulse" />
            Live Tech Dispatch
          </span>

          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-slate-300 text-xs">
              <span className="flex items-center gap-2">
                <span>Next.js 16 &amp; React 19 Compiler Arsitektur Frontend</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Rust dalam Akselerasi Infrastruktur Web Modern</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Cloud Native Kubernetes Multi-Region Deployment</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Zero-Trust API Security &amp; Enterprise Authentication</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>

              {/* Duplicate track for seamless infinite looping */}
              <span className="flex items-center gap-2">
                <span>Next.js 16 &amp; React 19 Compiler Arsitektur Frontend</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Rust dalam Akselerasi Infrastruktur Web Modern</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Cloud Native Kubernetes Multi-Region Deployment</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
              <span className="flex items-center gap-2">
                <span>Zero-Trust API Security &amp; Enterprise Authentication</span>
                <span className="text-cyan-400 font-bold">•</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUBCATEGORY FILTER NAVIGATION */}
      <TechCategoryNav
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
                {heroArticle && <TechHeroStory article={heroArticle} />}
              </div>
              <div className="lg:col-span-4">
                <TechTrendingSidebar articles={trendingArticles} />
              </div>
            </div>

            {/* FEATURED STORIES (3-Column Editorial Grid) */}
            {featuredStories.length > 0 && (
              <TechFeaturedStories articles={featuredStories} />
            )}

            {/* LATEST NEWS LIST (Left) + TECH ANALYSIS & PERSPECTIVES (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-white/[0.08]">
              <div className="lg:col-span-8 space-y-6">
                <TechLatestNews articles={latestNews.length > 0 ? latestNews : remainingAfterHero} />

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
                      Muat Lebih Banyak Artikel Teknologi
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar Analysis & Perspectives */}
              <div className="lg:col-span-4 space-y-8">
                <TechAnalysisSection articles={analysisArticles} />

                {/* Technology Tutorial Callout Card */}
                <div
                  className="p-6 sm:p-7 rounded-3xl border border-transparent backdrop-blur-xl text-white space-y-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(45, 212, 245, 0.40), rgba(124, 242, 195, 0.30), rgba(255, 255, 255, 0.05)) border-box",
                    border: "1px solid transparent"
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#2DD4F5]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#7CF2C3] tracking-wider block">
                      Nexarin Class Hub
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Kuasai Arsitektur Next.js &amp; Cloud DevOps
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                      Akses kurikulum tutorial coding praktis mulai dari frontend performance hingga deployment skala production di Nexarin Class Hub.
                    </p>
                  </div>
                  <Link
                    href="/tutorials"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2DD4F5] hover:text-[#7CF2C3] transition-colors pt-1"
                  >
                    <span>Buka Tutorial Class Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Belum Ada Artikel Teknologi yang Sesuai"
            description="Tidak ditemukan artikel teknologi dengan filter atau kata kunci pencarian yang Anda masukkan."
            actionText="Tampilkan Semua Artikel Teknologi"
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
