"use client";

import React, { useState, useMemo } from "react";
import { useContent } from "@/context/ContentContext";
import { AICategoryNav, AICategoryFilter } from "@/components/ai/AICategoryNav";
import { AIHeroStory } from "@/components/ai/AIHeroStory";
import { AIFeaturedStories } from "@/components/ai/AIFeaturedStories";
import { AILatestNews } from "@/components/ai/AILatestNews";
import { AITrendingSidebar } from "@/components/ai/AITrendingSidebar";
import { AIAnalysisSection } from "@/components/ai/AIAnalysisSection";
import { AISkeleton } from "@/components/ai/AISkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { Sparkles, Search, SlidersHorizontal, RefreshCw, X } from "lucide-react";

export default function AIPortalPage() {
  const { articles } = useContent();
  const [loading, setLoading] = useState(false);

  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  // 1. Filter only published AI articles
  const allAIArticles = useMemo(() => {
    return articles.filter(
      (art) =>
        art.status === "published" &&
        (art.category.slug === "ai" ||
          art.category.id === "ai" ||
          art.tags?.some((t) => t.toLowerCase().includes("ai") || t.toLowerCase().includes("llm")))
    );
  }, [articles]);

  // 2. Dynamic Subcategories count
  const subcategories: AICategoryFilter[] = useMemo(() => {
    return [
      { id: "all", name: "Semua AI", count: allAIArticles.length },
      {
        id: "generative-ai",
        name: "Generative AI",
        count: allAIArticles.filter((a) => a.tags?.some((t) => t.toLowerCase().includes("gen") || t.toLowerCase().includes("llm"))).length
      },
      {
        id: "ai-agents",
        name: "AI Agents & Automation",
        count: allAIArticles.filter((a) => a.tags?.some((t) => t.toLowerCase().includes("agent") || t.toLowerCase().includes("auto"))).length
      },
      {
        id: "ai-tools",
        name: "AI Tools & Apps",
        count: allAIArticles.filter((a) => a.contentType === "review" || a.tags?.some((t) => t.toLowerCase().includes("tool"))).length
      },
      {
        id: "ai-research",
        name: "AI Research & Model",
        count: allAIArticles.filter((a) => a.contentType === "analysis" || a.tags?.some((t) => t.toLowerCase().includes("research"))).length
      },
      {
        id: "prompt-engineering",
        name: "Prompt Engineering",
        count: allAIArticles.filter((a) => a.tags?.some((t) => t.toLowerCase().includes("prompt"))).length
      }
    ];
  }, [allAIArticles]);

  // 3. Filter by subcategory and search query
  const filteredArticles = useMemo(() => {
    let result = [...allAIArticles];

    if (activeSubcategory !== "all") {
      result = result.filter((art) => {
        if (activeSubcategory === "generative-ai") {
          return art.tags?.some((t) => t.toLowerCase().includes("gen") || t.toLowerCase().includes("llm"));
        }
        if (activeSubcategory === "ai-agents") {
          return art.tags?.some((t) => t.toLowerCase().includes("agent") || t.toLowerCase().includes("auto"));
        }
        if (activeSubcategory === "ai-tools") {
          return art.contentType === "review" || art.tags?.some((t) => t.toLowerCase().includes("tool"));
        }
        if (activeSubcategory === "ai-research") {
          return art.contentType === "analysis" || art.tags?.some((t) => t.toLowerCase().includes("research"));
        }
        if (activeSubcategory === "prompt-engineering") {
          return art.tags?.some((t) => t.toLowerCase().includes("prompt"));
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
  }, [allAIArticles, activeSubcategory, searchQuery]);

  if (loading) {
    return <AISkeleton />;
  }

  // Segment articles for editorial layout
  const heroArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const remainingAfterHero = filteredArticles.filter((a) => a.id !== heroArticle?.id);

  const featuredStories = remainingAfterHero.slice(0, 3);
  const latestNews = remainingAfterHero.slice(3, visibleCount + 3);

  // Trending & Analysis
  const trendingArticles = [...allAIArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const analysisArticles = allAIArticles.filter((a) => a.contentType === "analysis" || a.contentType === "opinion").slice(0, 3);

  const hasMore = remainingAfterHero.length > visibleCount + 3;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-slate-100 selection:bg-[#2DD4F5]/30">
      {/* 1. EDITORIAL PORTAL HERO HEADER WITH THEMATIC BACKGROUND IMAGE */}
      <header className="relative border-b border-[#1E293B] overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-18">
        {/* Thematic External 16:9 AI Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop"
            alt="Artificial Intelligence Neural Network Matrix"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-80 scale-105 transform transition-transform duration-1000"
          />
          {/* Multi-layer Dark Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-[#0B1120]/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/80 via-[#080D1A]/50 to-[#0B1120]" />
          {/* Smooth Bottom Gradient Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/90 to-transparent" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[260px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2DD4F5]/15 text-[#2DD4F5] text-xs font-mono font-bold uppercase border border-[#2DD4F5]/35 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nexari AI Media &amp; Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pusat Berita &amp; Wawasan Artificial Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-xl">
              Liputan mendalam mengenai perkembangan Autonomous AI Agents, LLM, prompt engineering, penelitian mutakhir, dan regulasi kecerdasan buatan global.
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
                  placeholder="Cari liputan AI, model LLM, tools..."
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
      <AICategoryNav
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
                {heroArticle && <AIHeroStory article={heroArticle} />}
              </div>
              <div className="lg:col-span-4">
                <AITrendingSidebar articles={trendingArticles} />
              </div>
            </div>

            {/* FEATURED STORIES (3-Column Editorial Grid) */}
            {featuredStories.length > 0 && (
              <AIFeaturedStories articles={featuredStories} />
            )}

            {/* LATEST NEWS LIST (Left) + AI ANALYSIS & OPINION (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#1E293B]">
              <div className="lg:col-span-8 space-y-6">
                <AILatestNews articles={latestNews.length > 0 ? latestNews : remainingAfterHero} />

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
                      Muat Lebih Banyak Berita AI
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar Analysis & Perspective */}
              <div className="lg:col-span-4 space-y-8">
                <AIAnalysisSection articles={analysisArticles} />

                {/* Learning Callout Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#131E32] border border-cyan-500/25 space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#7CF2C3]">
                    Kelas Edukasi Terkait
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Ingin Membangun Agen AI Sendiri?
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Pelajari kurikulum lengkap di Nexari Tutorial Class Hub dengan panduan implementasi multi-agent dan tool use.
                  </p>
                  <a
                    href="/tutorials/ai-automation-autonomous-agents-masterclass"
                    className="inline-flex items-center text-xs font-bold text-[#2DD4F5] hover:underline pt-1"
                  >
                    Buka Tutorial Class AI →
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="Belum Ada Berita AI yang Sesuai"
            description="Tidak ditemukan artikel atau liputan AI dengan filter atau kata kunci pencarian yang Anda masukkan."
            actionText="Tampilkan Semua Berita AI"
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
