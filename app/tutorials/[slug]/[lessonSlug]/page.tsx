"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTutorials } from "@/context/TutorialContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Menu,
  X,
  PlayCircle,
  FileText,
  Code2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Target,
  Lightbulb,
  GraduationCap,
  Layers,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClassroomLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;
  const lessonSlug = params.lessonSlug as string;

  const { getCourseBySlug, isLessonCompleted, toggleLessonCompletion } = useTutorials();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Scroll to top on lesson switch
  useEffect(() => {
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonSlug]);

  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return (
      <div suppressHydrationWarning className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-[#0F172A] p-8 rounded-3xl border border-white/[0.08]">
          <GraduationCap className="w-12 h-12 text-[#2DD4F5] mx-auto" />
          <h2 className="text-xl font-bold text-white">Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-[#94A3B8]">
            Materi pembelajaran tidak tersedia atau URL telah dipindahkan.
          </p>
          <Link href="/tutorials">
            <Button variant="primary" size="sm">Kembali ke Tutorial Class Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Flatten lessons to find current, prev, next
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const currentLesson = allLessons[currentIndex] || allLessons[0];

  // Current module
  const currentModule = course.modules.find((m) =>
    m.lessons.some((l) => l.slug === currentLesson.slug)
  ) || course.modules[0];

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isDone = isLessonCompleted(course.id, currentLesson.slug);
  const completedCount = allLessons.filter((l) => isLessonCompleted(course.id, l.slug)).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  const handleToggleComplete = () => {
    toggleLessonCompletion(course.id, currentLesson.slug, currentLesson.title);
  };

  const handleNext = () => {
    if (nextLesson) {
      router.push(`/tutorials/${course.slug}/${nextLesson.slug}`);
    }
  };

  const handlePrev = () => {
    if (prevLesson) {
      router.push(`/tutorials/${course.slug}/${prevLesson.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden selection:bg-[#2DD4F5]/30">
      
      {/* 1. TOP BREADCRUMB & CLASSROOM CONTEXT BAR (NON-STICKY, CLEAN FLOW) */}
      <div className="border-b border-white/[0.08] bg-[#0B1120]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-0">
              <Link
                href="/tutorials"
                className="hover:text-white transition-colors flex items-center gap-1 shrink-0"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#2DD4F5]" />
                <span className="hidden sm:inline">Tutorials</span>
              </Link>
              <span className="text-slate-600">/</span>
              <Link
                href={`/tutorials/${course.slug}`}
                className="text-[#2DD4F5] hover:underline font-bold truncate max-w-[140px] sm:max-w-[240px]"
              >
                {course.title}
              </Link>
              <span className="text-slate-600 hidden md:inline">/</span>
              <span className="text-slate-300 font-semibold truncate max-w-[200px] hidden md:inline">
                {currentLesson.title}
              </span>
            </div>

            {/* Desktop Quick Progress & Mark Complete */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                <span>Progress:</span>
                <span className="text-[#7CF2C3] font-bold">{completedCount}/{allLessons.length}</span>
                <div className="w-16 h-1.5 rounded-full bg-white/[0.08] overflow-hidden ml-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleComplete}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none",
                  isDone
                    ? "bg-[#7CF2C3] text-slate-950 shadow-sm shadow-emerald-500/20"
                    : "bg-cyan-500/15 text-[#2DD4F5] hover:bg-cyan-500/25 border border-cyan-500/30"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isDone ? "Selesai Dipelajari" : "Tandai Selesai"}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN LMS WORKSPACE (2-COLUMN ON DESKTOP, CLEAN FLOW ON MOBILE) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT: LESSON MAIN CONTENT READER (COL 8)                                 */}
          {/* ========================================================================= */}
          <main className="lg:col-span-8 space-y-6 sm:space-y-8 min-w-0">
            
            {/* Optional Video / Interactive Media Player */}
            {currentLesson.contentType === "video" && currentLesson.videoUrl && (
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border border-white/[0.10] shadow-2xl">
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* LESSON TITLE & META HEADER */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] backdrop-blur-xl space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-[#2DD4F5] font-bold uppercase border border-cyan-500/30">
                  {currentModule.title.replace(/^Modul \d+:\s*/, '')}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-semibold">
                  Materi {currentIndex + 1} dari {allLessons.length}
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
                  <Clock className="w-3 h-3 text-[#7CF2C3]" />
                  {currentLesson.duration || "15m"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {currentLesson.title}
              </h1>
            </div>

            {/* TARGET PEMBELAJARAN (LEARNING OBJECTIVES) */}
            <div className="p-6 rounded-3xl bg-[#111A2E]/90 border border-cyan-500/25 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#2DD4F5]">
                <Target className="w-4 h-4" />
                <span>Target &amp; Capaian Pembelajaran</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CF2C3] mt-2 shrink-0" />
                  <span>Memahami struktur prinsip dan implementasi pada materi <strong>{currentLesson.title}</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4F5] mt-2 shrink-0" />
                  <span>Menerapkan alur kerja langkah demi langkah langsung pada lingkungan kerja Anda.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                  <span>Mengoptimalkan efisiensi dan menghindari kesalahan implementasi umum.</span>
                </li>
              </ul>
            </div>

            {/* LESSON BODY ARTICLE */}
            <article className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/75 border border-white/[0.08] space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed overflow-hidden">
              {currentLesson.contentMarkdown ? (
                <div
                  className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h2:text-xl sm:prose-h2:text-2xl prose-p:text-slate-300 prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/10 prose-code:text-[#2DD4F5]"
                  dangerouslySetInnerHTML={{ __html: currentLesson.contentMarkdown }}
                />
              ) : (
                <div className="space-y-6">
                  <p className="leading-relaxed text-slate-200">
                    Selamat datang di materi <strong>{currentLesson.title}</strong>. Sesi ini dirancang untuk memberikan pemahaman menyeluruh tentang teknik kerja profesional, studi kasus nyata, dan praktik terbaik di industri teknologi modern.
                  </p>

                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[#7CF2C3]" />
                      <span>Rangkuman Inti Materi:</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Pastikan Anda mempraktikkan materi ini secara bertahap. Gunakan file template latihan yang telah disediakan untuk mempercepat pemahaman alur kerja Anda.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 space-y-1.5">
                    <span className="font-bold block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Instruksi Praktik:
                    </span>
                    <p>
                      Buka workspace Anda, ikuti setiap instruksi di atas, dan klik tombol <strong>Tandai Selesai</strong> setelah Anda berhasil mempraktikkannya.
                    </p>
                  </div>
                </div>
              )}
            </article>

            {/* DESKTOP BOTTOM PAGINATION */}
            <div className="p-5 rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevLesson ? (
                <Link
                  href={`/tutorials/${course.slug}/${prevLesson.slug}`}
                  className="w-full sm:w-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
                  <div className="text-left min-w-0">
                    <span className="text-[10px] text-slate-500 block font-mono uppercase">Sebelumnya</span>
                    <span className="truncate max-w-[180px] block">{prevLesson.title}</span>
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextLesson ? (
                <Link
                  href={`/tutorials/${course.slug}/${nextLesson.slug}`}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5 px-5 py-2.5 rounded-2xl bg-[#2DD4F5] hover:bg-[#2DD4F5]/90 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all group"
                >
                  <div className="text-left sm:text-right min-w-0">
                    <span className="text-[10px] text-slate-900/80 block font-mono uppercase">Selanjutnya</span>
                    <span className="truncate max-w-[200px] block">{nextLesson.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleComplete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan Seluruh Kelas</span>
                </button>
              )}
            </div>

          </main>

          {/* ========================================================================= */}
          {/* RIGHT: DESKTOP LMS CURRICULUM SIDEBAR PANEL (COL 4)                      */}
          {/* ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-5">
            
            {/* Curriculum Box */}
            <div className="rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] backdrop-blur-xl p-5 space-y-4 shadow-xl">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2DD4F5]" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Kurikulum Kelas
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-[#7CF2C3] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {completedCount}/{allLessons.length} Selesai
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Module & Lessons List */}
              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin">
                {course.modules.map((mod, modIdx) => (
                  <div key={mod.id} className="space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block px-1 truncate">
                      Modul {modIdx + 1}: {mod.title.replace(/^Modul \d+:\s*/, '')}
                    </span>

                    <div className="space-y-1">
                      {mod.lessons.map((les) => {
                        const isCurrent = les.slug === lessonSlug;
                        const isLesDone = isLessonCompleted(course.id, les.slug);

                        return (
                          <Link
                            key={les.id}
                            href={`/tutorials/${course.slug}/${les.slug}`}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-2xl text-xs transition-all",
                              isCurrent
                                ? "bg-[#2DD4F5]/15 text-white font-bold border border-[#2DD4F5]/40 shadow-sm"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isLesDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0" />
                              ) : isCurrent ? (
                                <span className="w-4 h-4 rounded-full bg-[#2DD4F5]/30 flex items-center justify-center shrink-0">
                                  <span className="w-2 h-2 rounded-full bg-[#2DD4F5] animate-pulse" />
                                </span>
                              ) : (
                                <PlayCircle className="w-4 h-4 text-slate-600 shrink-0" />
                              )}
                              <span className="truncate">{les.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                              {les.duration || "15m"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Box */}
            <div className="p-4 rounded-2xl bg-[#0F172A]/70 border border-white/[0.08] flex items-center gap-3">
              <img
                src={course.instructor.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                alt={course.instructor.name}
                className="w-9 h-9 rounded-xl object-cover border border-white/15 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {course.instructor.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">
                  {course.instructor.role}
                </span>
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE FLOATING BOTTOM ACTION BAR (CLEAN & NON-INTRUSIVE)              */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1120]/95 backdrop-blur-xl border-t border-white/[0.10] p-3 px-4">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          
          {/* Open Mobile Drawer */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.10] text-xs font-semibold text-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2DD4F5]" />
            <span>Modul ({currentIndex + 1}/{allLessons.length})</span>
          </button>

          {/* Mark Done Toggle */}
          <button
            type="button"
            onClick={handleToggleComplete}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              isDone
                ? "bg-[#7CF2C3] text-slate-950"
                : "bg-white/[0.08] text-slate-200 border border-white/[0.10]"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isDone ? "Selesai" : "Tandai"}</span>
          </button>

          {/* Next Lesson Button */}
          {nextLesson ? (
            <Link
              href={`/tutorials/${course.slug}/${nextLesson.slug}`}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#2DD4F5] text-slate-950 text-xs font-extrabold shadow-sm"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleToggleComplete}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#7CF2C3] text-slate-950 text-xs font-black shadow-sm"
            >
              <span>Tuntas</span>
            </button>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE CURRICULUM DRAWER MODAL                                         */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-sm h-full bg-[#0B1120] border-l border-white/[0.10] p-5 flex flex-col space-y-4">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2DD4F5]" />
                <h3 className="text-sm font-bold text-white">Daftar Modul Pembelajaran</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress in Drawer */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Kemajuan Belajar</span>
                <span className="text-[#7CF2C3] font-bold">{completedCount}/{allLessons.length} Selesai ({progressPercent}%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block px-1 truncate">
                    Modul {modIdx + 1}: {mod.title.replace(/^Modul \d+:\s*/, '')}
                  </span>

                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCurrent = les.slug === lessonSlug;
                      const isLesDone = isLessonCompleted(course.id, les.slug);

                      return (
                        <Link
                          key={les.id}
                          href={`/tutorials/${course.slug}/${les.slug}`}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-2xl text-xs transition-all",
                            isCurrent
                              ? "bg-[#2DD4F5]/15 text-white font-bold border border-[#2DD4F5]/40"
                              : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {isLesDone ? (
                              <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0" />
                            ) : isCurrent ? (
                              <span className="w-4 h-4 rounded-full bg-[#2DD4F5]/30 flex items-center justify-center shrink-0">
                                <span className="w-2 h-2 rounded-full bg-[#2DD4F5] animate-pulse" />
                              </span>
                            ) : (
                              <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                            {les.duration || "15m"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
