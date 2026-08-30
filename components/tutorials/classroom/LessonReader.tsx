"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse, TutorialLesson, TutorialModule } from "@/types/tutorial";
import { LessonMarkdownRenderer } from "./LessonMarkdownRenderer";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  Target,
  Lightbulb,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  HelpCircle,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonReaderProps {
  course: TutorialCourse;
  currentModule: TutorialModule;
  currentLesson: TutorialLesson;
  currentIndex: number;
  allLessonsCount: number;
  prevLesson: TutorialLesson | null;
  nextLesson: TutorialLesson | null;
  onToggleComplete: () => void;
}

export function LessonReader({
  course,
  currentModule,
  currentLesson,
  currentIndex,
  allLessonsCount,
  prevLesson,
  nextLesson,
  onToggleComplete
}: LessonReaderProps) {
  return (
    <article
      className="rounded-3xl p-6 sm:p-10 backdrop-blur-xl border border-transparent space-y-8 shadow-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.90), rgba(11, 17, 32, 0.85)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.25), rgba(124, 242, 195, 0.10)) border-box",
        border: "1px solid transparent"
      }}
    >
      {/* 1. LESSON HEADER META */}
      <div className="space-y-4 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-[#2DD4F5] font-bold uppercase border border-cyan-500/30">
            {currentModule.title.replace(/^Modul \d+:\s*/, '')}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-semibold">
            Materi {currentIndex + 1} dari {allLessonsCount}
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1 text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08]">
            <Clock className="w-3 h-3 text-[#7CF2C3]" />
            {currentLesson.duration || "20 min"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
          {currentLesson.title}
        </h1>
      </div>

      {/* 2. VIDEO EMBED (IF PRESENT) */}
      {currentLesson.contentType === "video" && currentLesson.videoUrl && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.10] shadow-2xl">
          <iframe
            src={currentLesson.videoUrl}
            title={currentLesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 3. TARGET PEMBELAJARAN (LEARNING OBJECTIVES) */}
      <div className="p-6 rounded-2xl bg-[#111A2E]/90 border border-cyan-500/25 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#2DD4F5]">
          <Target className="w-4 h-4" />
          <span>Target &amp; Capaian Pembelajaran Materi Ini</span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CF2C3] mt-2 shrink-0" />
            <span>Memahami prinsip arsitektur dan alur eksekusi pada <strong>{currentLesson.title}</strong>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4F5] mt-2 shrink-0" />
            <span>Menerapkan teknik dan alur kerja langsung pada proyek nyata Anda.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
            <span>Menghindari kesalahan umum dan mengoptimalkan standar efisiensi kerja.</span>
          </li>
        </ul>
      </div>

      {/* 4. MAIN ARTICLE CONTENT RENDERER */}
      <div className="space-y-6 pt-2">
        {currentLesson.contentMarkdown ? (
          <LessonMarkdownRenderer content={currentLesson.contentMarkdown} />
        ) : (
          <div className="space-y-5 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              Selamat datang di materi <strong>{currentLesson.title}</strong>. Pada modul ini, Anda akan mempelajari konsep fundamental, studi kasus implementasi, serta praktik terbaik yang digunakan dalam industri teknologi modern.
            </p>
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 space-y-1">
              <span className="font-bold block">💡 Panduan Belajar:</span>
              <p>
                Ikuti setiap instruksi dengan teliti dan coba terapkan langsung di lingkungan kerja lokal Anda.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. KEY TAKEAWAYS (IF PRESENT IN DATA) */}
      {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/[0.10] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#7CF2C3]">
            <Lightbulb className="w-4 h-4" />
            <span>Rangkuman Inti (Key Takeaways)</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {currentLesson.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. EXERCISES / HANDS-ON PRACTICE */}
      {currentLesson.exercises && currentLesson.exercises.length > 0 && (
        <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#2DD4F5]">
            <Sparkles className="w-4 h-4" />
            <span>Latihan Mandiri &amp; Tantangan Praktik</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-cyan-200">
            {currentLesson.exercises.map((ex, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono font-bold text-[#2DD4F5]">{idx + 1}.</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 7. BOTTOM PAGINATION NAVIGATION */}
      <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
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
            onClick={onToggleComplete}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Selesaikan Seluruh Kelas</span>
          </button>
        )}
      </div>

    </article>
  );
}
