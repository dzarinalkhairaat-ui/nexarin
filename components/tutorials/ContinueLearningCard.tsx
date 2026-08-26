"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse, UserLearningProgress } from "@/types/tutorial";
import { Button } from "@/components/ui/Button";
import { PlayCircle, Clock, BookOpen, ArrowRight, Sparkles } from "lucide-react";

interface ContinueLearningCardProps {
  course: TutorialCourse;
  progress: UserLearningProgress;
}

export function ContinueLearningCard({ course, progress }: ContinueLearningCardProps) {
  const completedCount = progress.completedLessonSlugs?.length || 0;
  const targetLessonSlug = progress.lastAccessedLessonSlug || course.modules[0]?.lessons[0]?.slug;

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#131E32] to-[#0F172A] border border-cyan-500/30 p-5 sm:p-6 shadow-xl overflow-hidden group">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Thumbnail & Course Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-cyan-400 drop-shadow-md" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Lanjutkan Belajar
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {course.categoryName}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {course.title}
            </h3>

            <p className="text-xs text-slate-300 font-mono">
              Terakhir diakses: <strong className="text-slate-100">{progress.lastAccessedLessonTitle || "Pelajaran"}</strong>
            </p>
          </div>
        </div>

        {/* Right: Progress bar & Jump Button */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-4 md:min-w-[280px]">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">
                Pelajaran {completedCount} dari {course.lessonCount}
              </span>
              <span className="font-bold text-[#7CF2C3]">{progress.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-[#7CF2C3] transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <Link href={`/tutorials/${course.slug}/${targetLessonSlug}`}>
            <Button variant="mint" size="md" className="w-full font-extrabold text-xs text-slate-950 shadow-md shadow-emerald-500/10 whitespace-nowrap">
              Lanjut Sekarang
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
