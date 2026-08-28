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
import { Cpu, Search, RefreshCw, X, ArrowRight, Layers } from "lucide-react";

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
      { id: "all", name: "Semua Tech", count: allTechArticles.length },
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
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-slate-100 selection:bg-[#2DD4F5]/30">
      {/* 1. EDITORIAL PORTAL HERO HEADER WITH THEMATIC 16:9 BACKGROUND IMAGE */}
      <header className="relative border-b border-[#1E293B] overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-18">
        {/* Thematic External 16:9 Technology Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"
            alt="Software Engineering & Cloud Computing Architecture"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-80 scale-105 transform transition-transform duration-1000"
          />
          {/* Multi-layer Dark Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-[#0B1120]/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/80 via-[#080D1A]/50 to-[#0B1120]" />
          {/* Smooth Bottom Gradient Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/90 to-transparent" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[260px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2DD4F5]/15 text-[#2DD4F5] text-xs font-mono font-bold uppercase border border-[#2DD4F5]/35 backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5" />
              <span>Nexari Technology &amp; Engineering Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pusat Berita &amp; Wawasan Software Engineering &amp; Cloud
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-xl">
              Liputan mendalam mengenai arsitektur perangkat lunak modern, Next.js 16, infrastruktur cloud DevOps, optimalisasi database PostgreSQL, dan standar keamanan siber enterprise.
            </p>
          </div>

          {/* Premium Editorial Search Bar */}
          <div className="w-full md:w-96 relative group">
            <div className="relative flex items-center rounded-2xl bg-[#0F172A]/90 border border-white/[0.12] hover:border-[#2DD4F5]/40 focus-within:border-[#2DD4F5] focus-within:bg-[#0B1120] focus-within:ring-1 focus-within:ring-[#2DD4F5]/30 transition-all duration-200 backdrop-blur-xl p-1.5 pl-3.5 pr-2">
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
      </header>

      {/* 2. SECONDARY SUBCATEGORY NAVIGATION */}
      <TechCategoryNav
        categories={subcategories}
        activeCategory={activeSubcategory}
        onSelectCategory={setActiveSubcategory}
      />

      {/* 3. MAIN EDITORIAL CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {filteredArticles.length > 0 ? (
          <>
            {/* TOP STORY (HERO) + TRENDING SIDEBAR */}
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

            {/* LATEST NEWS LIST (Left) + TECH ANALYSIS & OPINION (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#1E293B]">
              <div className="lg:col-span-8 space-y-6">
                <TechLatestNews articles={latestNews.length > 0 ? latestNews : remainingAfterHero} />

                {/* Load More Pagination Trigger */}
                {hasMore && (
                  <div className="pt-4 text-center">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="font-bold text-xs border-[#1E293B] text-slate-300 hover:text-white hover:border-[#2DD4F5]/40"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      Muat Lebih Banyak Berita Technology
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar Analysis & Perspective */}
              <div className="lg:col-span-4 space-y-8">
                <TechAnalysisSection articles={analysisArticles} />

                {/* Learning Callout Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#131E32] border border-cyan-500/25 space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#7CF2C3]">
                    Produk &amp; Source Code
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Ingin Membangun Aplikasi SaaS Cepat?
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Dapatkan Admin Dashboard Pro &amp; Starter Kit full source code dengan lisensi seumur hidup di Nexarin Digital Shop.
                  </p>
                  <a
                    href="/shop"
                    className="inline-flex items-center text-xs font-bold text-[#2DD4F5] hover:underline pt-1"
                  >
                    Kunjungi Nexarin Digital Shop →
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Belum Ada Berita Technology yang Sesuai"
            description="Tidak ditemukan artikel atau liputan teknologi dengan filter atau kata kunci pencarian yang Anda masukkan."
            actionText="Tampilkan Semua Berita Technology"
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
