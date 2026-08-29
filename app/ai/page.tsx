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
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Sparkles, Search, RefreshCw, X, Radio, ArrowRight, BookOpen, Flame } from "lucide-react";
import Link from "next/link";

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
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-slate-100 selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH 3D CYBER WAVE BACKGROUND (MATCHING HOME PAGE THEME) */}
      <section
        className="relative isolate overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28 w-full max-w-full"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0%, black 6%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 6%, black 95%, transparent 100%)"
        }}
      >
        {/* Pure 3D Geometric Wave & Starlight Aurora Canvas */}
        <CyberWaveBackground className="z-0" />

        {/* Top Smooth Gradient Fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0B1120] via-[#0B1120]/50 to-transparent pointer-events-none z-0" />

        {/* Bottom Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/70 to-transparent pointer-events-none z-0" />

        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[550px] h-[280px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[260px] bg-[#7CF2C3]/8 rounded-full blur-[130px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            
            {/* Headline & Description */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Pusat Berita, Riset, &amp;{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2DD4F5] via-[#7CF2C3] to-white">
                  Wawasan Artificial Intelligence
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
                Liputan investigatif perkembangan Autonomous AI Agents, arsitektur LLM reasoning mutakhir, multimodal models, prompt engineering, open-source AI, &amp; regulasi global.
              </p>
            </div>

            {/* Premium Glassmorphic AI Search Bar */}
            <div className="w-full lg:w-96 relative group shrink-0">
              <div className="relative flex items-center rounded-2xl bg-[#0F172A]/85 border border-white/[0.12] hover:border-[#2DD4F5]/40 focus-within:border-[#2DD4F5] focus-within:bg-[#0B1120] focus-within:ring-1 focus-within:ring-[#2DD4F5]/30 transition-all duration-200 backdrop-blur-xl p-2 pl-4 pr-2">
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
        </div>
      </section>

      {/* 2. LIVE BREAKING AI DISPATCH TICKER (TOP TIER NEWS PORTAL FEATURE) */}
      <div className="w-full bg-[#0F172A]/90 border-y border-white/[0.08] backdrop-blur-xl py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-hidden text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase shrink-0 animate-pulse">
            <Radio className="w-3 h-3 text-rose-400" />
            Live AI Dispatch
          </span>
          <div className="text-slate-300 truncate text-xs">
            Claude 3.7 Sonnet &amp; Hybrid Reasoning Diluncurkan • Gemini 2.0 Flash Multimodal Workflow • OpenAI Operator Browser Automation • DeepSeek R1 Open Reasoning
          </div>
        </div>
      </div>

      {/* 3. SUBCATEGORY FILTER NAVIGATION */}
      <AICategoryNav
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

            {/* LATEST NEWS LIST (Left) + AI ANALYSIS & PERSPECTIVES (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-white/[0.08]">
              <div className="lg:col-span-8 space-y-6">
                <AILatestNews articles={latestNews.length > 0 ? latestNews : remainingAfterHero} />

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
                      Muat Lebih Banyak Liputan AI
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar Analysis & Perspectives */}
              <div className="lg:col-span-4 space-y-8">
                <AIAnalysisSection articles={analysisArticles} />

                {/* AI Tutorial Callout Card */}
                <div
                  className="p-6 sm:p-7 rounded-3xl border border-transparent backdrop-blur-xl text-white space-y-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(45, 212, 245, 0.40), rgba(124, 242, 195, 0.30), rgba(255, 255, 255, 0.05)) border-box",
                    border: "1px solid transparent"
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#2DD4F5]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#7CF2C3] tracking-wider block">
                      Nexarin Class Hub
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Ingin Membangun Autonomous AI Agent Sendiri?
                    </h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                      Pelajari kurikulum komprehensif mulai dari Function Calling, Multi-Agent Architecture, hingga integrasi tool use di Nexarin Class Hub.
                    </p>
                  </div>
                  <Link
                    href="/tutorials"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2DD4F5] hover:text-[#7CF2C3] transition-colors pt-1"
                  >
                    <span>Jelajahi Kelas AI Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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
