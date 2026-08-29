"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTutorials } from "@/context/TutorialContext";
import { useAuth } from "@/context/AuthContext";
import { ClassCard } from "@/components/tutorials/ClassCard";
import { ContinueLearningCard } from "@/components/tutorials/ContinueLearningCard";
import { GuestAuthPromptModal } from "@/components/tutorials/GuestAuthPromptModal";
import { DifficultyLevel, TutorialContentType, TutorialCategory, TutorialCourse } from "@/types/tutorial";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import {
  Search,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Filter,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Radio,
  X,
  RefreshCw,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TutorialsHubPage() {
  const { categories, courses, getContinueLearningCourses, openGuestPrompt } = useTutorials();
  const { isCustomerAuthenticated } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | "all">("all");
  const [sortBy, setSortBy] = useState<"popular" | "latest" | "beginner">("popular");

  // Continue learning classes
  const continueList = getContinueLearningCourses();

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.categoryName.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((c) => c.categoryId === selectedCategory);
    }

    // Level
    if (selectedLevel !== "all") {
      result = result.filter((c) => c.level === selectedLevel);
    }

    // Sort
    if (sortBy === "popular") {
      result.sort((a, b) => b.enrolledCount - a.enrolledCount);
    } else if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === "beginner") {
      const weight = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      result.sort((a, b) => weight[a.level] - weight[b.level]);
    }

    return result;
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  const featuredCourses = courses.filter((c) => c.isFeatured);
  const popularCourses = courses.filter((c) => c.isPopular);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSortBy("popular");
  };

  const isFiltering = searchQuery || selectedCategory !== "all" || selectedLevel !== "all";

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH 3D CYBER WAVE BACKGROUND */}
      <section className="relative isolate overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28 w-full max-w-full">
        {/* Pure 3D Geometric Wave & Starlight Canvas */}
        <CyberWaveBackground className="z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            
            {/* Headline & Description */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Pusat Pembelajaran &amp; Tutorial Kelas Interaktif
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
                Kurikulum terstruktur kecerdasan buatan, Next.js 16 software engineering, cloud devops, otomatisasi bisnis, dan arsitektur frontend modern.
              </p>
            </div>

            {/* Premium Glassmorphic Class Search Bar */}
            <div className="w-full lg:w-96 relative group shrink-0">
              <div className="relative flex items-center rounded-2xl bg-[#0F172A]/85 border border-white/[0.12] hover:border-[#2DD4F5]/40 focus-within:border-[#2DD4F5] focus-within:bg-[#0B1120] focus-within:ring-1 focus-within:ring-[#2DD4F5]/30 transition-all duration-200 backdrop-blur-xl p-2 pl-4 pr-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#2DD4F5] transition-colors shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kelas: 'AI Agents', 'Next.js 16'..."
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

      {/* 3. CATEGORY & LEVEL FILTER BAR */}
      <nav aria-label="Tutorial Category Navigation" className="border-b border-white/[0.08] bg-[#0B1120]/95 backdrop-blur-xl sticky top-16 sm:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto py-3 scrollbar-none">
            {/* Category Pills */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none",
                  selectedCategory === "all"
                    ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/40"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                Semua Kategori
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none",
                    selectedCategory === cat.id
                      ? "bg-[#2DD4F5]/15 text-[#2DD4F5] font-bold border border-[#2DD4F5]/40"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Level Filter Pills */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-white/[0.08] pl-4">
              {(["all", "Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors",
                    selectedLevel === lvl
                      ? "bg-white/[0.12] text-white font-bold border border-white/20"
                      : "text-[#64748B] hover:text-slate-200"
                  )}
                >
                  {lvl === "all" ? "All Level" : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20 w-full overflow-hidden">
        
        {/* CONTINUE LEARNING BAR (If logged in & has progress) */}
        {continueList.length > 0 && !isFiltering && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Lanjutkan Pembelajaran Anda
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueList.map((course) => (
                <ContinueLearningCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* FEATURED CLASSES SPOTLIGHT */}
        {!isFiltering && featuredCourses.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#2DD4F5]" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Kelas Unggulan (Featured Classes)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Pilihan Editor
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <ClassCard key={course.id} course={course} featured />
              ))}
            </div>
          </section>
        )}

        {/* ALL / FILTERED COURSES CATALOG */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#7CF2C3]" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isFiltering ? "Hasil Pencarian Kelas" : "Katalog Lengkap Kelas Pembelajaran"}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#64748B]">
              Menampilkan <span className="text-white font-bold">{filteredCourses.length}</span> kelas
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <ClassCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4 rounded-3xl bg-[#0F172A]/50 border border-white/[0.08] p-8">
              <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Tidak Ada Kelas yang Ditemukan</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter kategori dan tingkat kesulitan.
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Reset Semua Filter
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
