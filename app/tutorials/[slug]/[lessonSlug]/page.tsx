"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTutorials } from "@/context/TutorialContext";
import { useAuth } from "@/context/AuthContext";
import { CurriculumAccordion } from "@/components/tutorials/CurriculumAccordion";
import { GuestAuthPromptModal } from "@/components/tutorials/GuestAuthPromptModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClassroomLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;
  const lessonSlug = params.lessonSlug as string;

  const { courses, getCourseBySlug, isLessonCompleted, toggleLessonCompletion, openGuestPrompt } = useTutorials();
  const { isCustomerAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return (
      <div suppressHydrationWarning className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-white/[0.035] p-8 rounded-2xl border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white">Kelas Tidak Ditemukan</h2>
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

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isDone = isLessonCompleted(course.id, currentLesson.slug);

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
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col">
      {/* CLASSROOM TOPBAR */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0B1120]/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/tutorials/${course.slug}`}
            className="p-1.5 rounded-lg border border-white/[0.08] bg-slate-900 text-[#64748B] hover:text-white transition-colors flex-shrink-0"
            title="Kembali ke Ringkasan Kelas"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block truncate">
              {course.title}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-white truncate">
              {currentLesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mobile curriculum trigger */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl border border-white/[0.08] bg-slate-900 text-[#94A3B8] hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Mark as complete button */}
          <Button
            variant={isDone ? "mint" : "outline"}
            size="sm"
            onClick={handleToggleComplete}
            className={cn(
              "text-xs font-bold transition-all",
              isDone
                ? "bg-[#7CF2C3] text-slate-950 font-extrabold"
                : "border-white/[0.10] text-[#94A3B8] hover:text-white"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {isDone ? "Selesai ✓" : "Tandai Selesai"}
          </Button>
        </div>
      </header>

      {/* CLASSROOM BODY (Sidebar + Main Lesson Content) */}
      <div className="flex-1 flex max-w-full overflow-hidden">
        {/* LEFT SIDEBAR CURRICULUM (Desktop + Mobile Drawer) */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-20 w-80 lg:w-84 bg-[#0B1120] border-r border-white/[0.08] p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300",
            mobileSidebarOpen ? "translate-x-0 top-14" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase text-[#64748B]">
                Silabus Kelas
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {currentIndex + 1} / {allLessons.length} Pelajaran
              </span>
            </div>

            <CurriculumAccordion
              modules={course.modules}
              courseSlug={course.slug}
              courseId={course.id}
              activeLessonSlug={currentLesson.slug}
              isClassroomView={true}
            />
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <Link href={`/tutorials/${course.slug}`}>
              <Button variant="ghost" size="sm" className="w-full text-xs text-[#64748B] hover:text-white">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Halaman Utama Kelas
              </Button>
            </Link>
          </div>
        </aside>

        {/* MAIN LESSON CONTENT VIEWER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 max-w-4xl mx-auto space-y-8">
          {/* Header Metadata */}
          <div className="space-y-3 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">
                Pelajaran {currentIndex + 1} dari {allLessons.length}
              </Badge>
              <span className="text-xs font-mono text-[#64748B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {currentLesson.duration}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
              {currentLesson.title}
            </h2>
          </div>

          {/* Key Takeaways Card */}
          {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Poin Kunci Pelajaran:
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#F8FAFC]">
                {currentLesson.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rendered Lesson Content */}
          <article className="prose prose-invert prose-cyan max-w-none text-xs sm:text-sm text-[#94A3B8] leading-relaxed space-y-5">
            {currentLesson.contentMarkdown.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("# ")) {
                return (
                  <h1 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-4">
                    {paragraph.replace("# ", "")}
                  </h1>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-base sm:text-xl font-bold text-white pt-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("```")) {
                const lines = paragraph.split("\n");
                const codeBody = lines.slice(1, -1).join("\n");
                return (
                  <div key={idx} className="my-4 rounded-xl bg-[#0B1120] border border-white/[0.08] p-4 font-mono text-xs overflow-x-auto text-cyan-300">
                    <pre>{codeBody}</pre>
                  </div>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </article>

          {/* Practical Exercises */}
          {currentLesson.exercises && currentLesson.exercises.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/[0.035] border border-white/[0.08] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7CF2C3] font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#7CF2C3]" />
                Latihan Praktik Mandiri:
              </h4>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                {currentLesson.exercises.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-cyan-400 font-bold">{idx + 1}.</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FOOTER LESSON NAVIGATION CONTROLS */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevLesson ? (
              <Button
                variant="outline"
                size="md"
                onClick={handlePrev}
                className="w-full sm:w-auto text-xs border-white/[0.10] text-[#94A3B8] hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Pelajaran Sebelumnya
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant={isDone ? "mint" : "primary"}
              size="md"
              onClick={handleToggleComplete}
              className="w-full sm:w-auto font-bold text-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {isDone ? "Pelajaran Selesai ✓" : "Tandai Materi Selesai"}
            </Button>

            {nextLesson ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                className="w-full sm:w-auto text-xs font-extrabold"
              >
                Pelajaran Berikutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Link href={`/tutorials/${course.slug}`} className="w-full sm:w-auto">
                <Button variant="mint" size="md" className="w-full font-extrabold text-xs text-slate-950">
                  Selesaikan Kelas 🎉
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>

      <GuestAuthPromptModal />
    </div>
  );
}
