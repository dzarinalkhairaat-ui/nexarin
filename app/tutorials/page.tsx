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
import { Badge } from "@/components/ui/Badge";
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
  Flame,
  Globe,
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TutorialsHubPage() {
  const { categories, courses, getContinueLearningCourses, openGuestPrompt } = useTutorials();
  const { isCustomerAuthenticated } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | "all">("all");
  const [selectedType, setSelectedType] = useState<TutorialContentType | "all">("all");
  const [sortBy, setSortBy] = useState<"popular" | "latest" | "beginner">("popular");

  // Category browse modal
  const [activeCategoryModal, setActiveCategoryModal] = useState<TutorialCategory | null>(null);

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
          c.subcategoryName.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((c) => c.categoryId === selectedCategory);
    }

    // Subcategory
    if (selectedSubcategory !== "all") {
      result = result.filter((c) => c.subcategoryId === selectedSubcategory);
    }

    // Level
    if (selectedLevel !== "all") {
      result = result.filter((c) => c.level === selectedLevel);
    }

    // Type
    if (selectedType !== "all") {
      result = result.filter((c) => c.contentType === selectedType);
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
  }, [courses, searchQuery, selectedCategory, selectedSubcategory, selectedLevel, selectedType, sortBy]);

  const featuredCourses = courses.filter((c) => c.isFeatured);
  const popularCourses = courses.filter((c) => c.isPopular);
  const beginnerCourses = courses.filter((c) => c.level === "Beginner");
  const intermediateAndAdvanced = courses.filter((c) => c.level === "Intermediate" || c.level === "Advanced");

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedLevel("all");
    setSelectedType("all");
    setSortBy("popular");
  };

  const isFiltering =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedSubcategory !== "all" ||
    selectedLevel !== "all" ||
    selectedType !== "all";

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30">
      {/* 1. HERO SECTION WITH THEMATIC BACKGROUND IMAGE & BOTTOM GRADIENT */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Background Image from External URL */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop"
            alt="Guru dan Dosen Mengajar di Kelas Tutorial"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-75 scale-105 transform transition-transform duration-1000"
          />
          {/* Multi-layer Dark Gradient Overlays for Clear Visibility & Text Readability */}
          <div className="absolute inset-0 bg-[#0B1120]/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/75 via-[#080D1A]/40 to-[#0B1120]" />
          {/* Smooth Bottom Gradient Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/90 to-transparent" />
        </div>

        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Nexari Tutorial Class Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Learn. Build. <span className="text-[#2DD4F5]">Grow.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Pusat pembelajaran teknologi terstruktur: AI &amp; Otomasi, Software Engineering, UI/UX Design, Perangkat Keras, Otomotif Modern, dan Strategi Bisnis Digital.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-cyan-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kelas: 'AI Automation', 'Next.js 16', 'Mobil Listrik', 'Design System'..."
                className="w-full h-13 pl-12 pr-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2DD4F5] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-mono text-[#64748B] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* CONTINUE LEARNING (Only when Logged-in Customer has active progress) */}
        {isCustomerAuthenticated && continueList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Lanjutkan Pembelajaran Anda
              </h2>
            </div>
            <div className="space-y-4">
              {continueList.map(({ course, progress }) => (
                <ContinueLearningCard key={course.id} course={course} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* 2. FILTER & CATEGORY NAVIGATION BAR (Directly below Hero) */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            {/* Category horizontal pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSubcategory("all");
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
                  selectedCategory === "all"
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold"
                    : "bg-white/[0.035] border-white/[0.08] text-[#64748B] hover:text-[#F8FAFC]"
                )}
              >
                Semua Kategori
              </button>

              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubcategory("all");
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
                    selectedCategory === cat.id
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold"
                      : "bg-white/[0.035] border-white/[0.08] text-[#64748B] hover:text-[#F8FAFC]"
                  )}
                >
                  {cat.name}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setActiveCategoryModal(categories[0])}
                className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center gap-1"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                {categories.length} Kategori Lengkap...
              </button>
            </div>

            {/* Difficulty & Type Filters */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              {/* Difficulty */}
              <div className="flex items-center gap-1 bg-white/[0.035] p-1 rounded-xl border border-white/[0.08] text-xs font-mono">
                {(["all", "Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-colors",
                      selectedLevel === lvl
                        ? "bg-cyan-500/20 text-cyan-300 font-bold"
                        : "text-[#64748B] hover:text-[#F8FAFC]"
                    )}
                  >
                    {lvl === "all" ? "All Level" : lvl}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/[0.035] border border-white/[0.08] text-[#94A3B8] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                <option value="popular">Paling Populer</option>
                <option value="latest">Terbaru</option>
                <option value="beginner">Mulai dari Beginner</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {isFiltering && (
            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-white/[0.08] text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#64748B] font-mono">Filter Aktif:</span>
                {searchQuery && (
                  <Badge variant="cyan" size="sm">
                    Query: "{searchQuery}"
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="mint" size="sm">
                    Kategori: {categories.find((c) => c.id === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedLevel !== "all" && (
                  <Badge variant="outline" size="sm">
                    Level: {selectedLevel}
                  </Badge>
                )}
                <span className="text-[#64748B] font-mono ml-2">
                  Ditemukan: <strong className="text-cyan-400">{filteredCourses.length}</strong> kelas
                </span>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>

        {/* 4. SEARCH / FILTER RESULTS VIEW (If filtering) */}
        {isFiltering ? (
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Hasil Pencarian &amp; Filter ({filteredCourses.length} Kelas)
            </h2>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <ClassCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] p-8 max-w-xl mx-auto">
                <Search className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">Tidak Ada Kelas yang Sesuai</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Tidak ditemukan tutorial atau kelas dengan kata kunci atau filter yang Anda pilih. Silakan coba kata kunci lain atau reset filter.
                </p>
                <Button variant="primary" size="sm" onClick={clearFilters}>
                  Reset Filter &amp; Tampilkan Semua
                </Button>
              </div>
            )}
          </section>
        ) : (
          /* 5. DEFAULT EDITORIAL SECTIONS (If not filtering) */
          <>
            {/* FEATURED CLASSES */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Kelas Unggulan (Featured Classes)
                    </h2>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Materi komprehensif pilihan editor dengan kurikulum terlengkap dan latihan praktis.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <ClassCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* BROWSE ALL 12 PRIMARY CATEGORIES */}
            <section className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#7CF2C3]" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Jelajahi Berdasarkan Kategori Utama ({categories.length} Kategori)
                    </h2>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Pilih bidang keahlian dan temukan puluhan subkategori pembelajaran mendalam.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const totalSubCount = cat.subcategories.length;
                  const totalClassesInCat = cat.subcategories.reduce((a, s) => a + (s.classCount || 0), 0);

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategoryModal(cat)}
                      className="group p-5 rounded-2xl bg-white/[0.035] border border-white/[0.08] hover:border-cyan-500/40 text-left transition-all hover:bg-white/[0.055] flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">
                            {totalSubCount} Subkategori
                          </span>
                          <span className="text-[11px] font-mono text-[#64748B]">
                            {totalClassesInCat} Kelas
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-cyan-400 font-mono">
                        <span>Lihat Subkategori</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* POPULAR CLASSES */}
            <section className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Paling Populer &amp; Banyak Diikuti
                    </h2>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Kelas favorit yang paling banyak dipelajari oleh engineer dan profesional digital.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCourses.map((course) => (
                  <ClassCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* BEGINNER FRIENDLY */}
            <section className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#7CF2C3]" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Ramah Pemula (Beginner Friendly)
                    </h2>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Mulai perjalanan belajar Anda dengan penjelasan konsep dasar langkah demi langkah tanpa prasyarat rumit.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beginnerCourses.map((course) => (
                  <ClassCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* INTERMEDIATE & ADVANCED */}
            <section className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Tingkat Lanjutan (Intermediate &amp; Advanced)
                    </h2>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Pendalaman arsitektur kompleks, security zero-trust, dan optimasi performa skala enterprise.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intermediateAndAdvanced.map((course) => (
                  <ClassCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* LEARNING TOPICS CLOUD */}
            <section className="p-8 rounded-2xl bg-white/[0.035] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Topik Populer yang Sering Dicari:
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Multi-Agent AI",
                  "Next.js 16 App Router",
                  "Electric Vehicle Charging",
                  "Figma Variables",
                  "Zero-Trust Passkeys",
                  "Prompt Engineering",
                  "Linux Server Administration",
                  "Docker Containerization",
                  "Tailwind CSS Tokens",
                  "Supabase RLS",
                  "SaaS Architecture",
                  "Workstation Setup 2026"
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-900 border border-white/[0.08] text-[#94A3B8] hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#131E32] to-[#0F172A] border border-cyan-500/30 text-center space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#7CF2C3]/10 text-[#7CF2C3] border border-[#7CF2C3]/30">
                Ekosistem Terintegrasi Nexari
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ingin Mengimplementasikan Kode Langsung ke Aplikasi Anda?
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
                Jelajahi Digital Shop kami untuk mendapatkan Source Code Sistem Absensi Sekolah, Template Admin Pro, dan Starter Kit siap pakai berlisensi lifetime.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop">
                  <Button variant="primary" size="md" className="font-extrabold text-xs">
                    Kunjungi Nexarin Digital Shop
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/free-resources">
                  <Button variant="outline" size="md" className="font-bold text-xs border-white/[0.10] text-[#F8FAFC] hover:text-white">
                    Unduh Free Resources
                  </Button>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>

      {/* CATEGORY EXPLORER MODAL */}
      {activeCategoryModal && (
        <Modal
          isOpen={!!activeCategoryModal}
          onClose={() => setActiveCategoryModal(null)}
          title={`Kategori: ${activeCategoryModal.name}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {activeCategoryModal.description}
            </p>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 block">
                Pilih Subkategori Pembelajaran:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {activeCategoryModal.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(activeCategoryModal.id);
                      setSelectedSubcategory(sub.id);
                      setActiveCategoryModal(null);
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between text-xs group"
                  >
                    <span className="font-semibold text-[#F8FAFC] group-hover:text-cyan-400">
                      {sub.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {sub.classCount || 2} Kelas
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedCategory(activeCategoryModal.id);
                  setSelectedSubcategory("all");
                  setActiveCategoryModal(null);
                }}
              >
                Lihat Semua di {activeCategoryModal.name}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* GUEST AUTH PROMPT MODAL */}
      <GuestAuthPromptModal />
    </div>
  );
}
