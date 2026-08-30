"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse, TutorialLesson } from "@/types/tutorial";
import { GraduationCap, ArrowLeft, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassroomTopBarProps {
  course: TutorialCourse;
  currentLesson: TutorialLesson;
  allLessonsCount: number;
  completedCount: number;
  progressPercent: number;
  isDone: boolean;
  onToggleComplete: () => void;
  onOpenMobileDrawer: () => void;
}

export function ClassroomTopBar({
  course,
  currentLesson,
  allLessonsCount,
  completedCount,
  progressPercent,
  isDone,
  onToggleComplete,
  onOpenMobileDrawer
}: ClassroomTopBarProps) {
  return (
    <div className="w-full border-b border-white/[0.08] bg-[#0B1120]/80 backdrop-blur-xl pt-6 sm:pt-8 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Breadcrumb Navigation with ample spacing */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#64748B] min-w-0">
            <Link
              href="/"
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <Link
              href="/tutorials"
              className="hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#2DD4F5]" />
              <span>Tutorials</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <Link
              href={`/tutorials/${course.slug}`}
              className="text-[#2DD4F5] hover:underline font-bold truncate max-w-[200px] sm:max-w-[320px]"
            >
              {course.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0 hidden sm:inline" />
            <span className="text-slate-300 font-semibold truncate max-w-[260px] hidden sm:inline">
              {currentLesson.title}
            </span>
          </nav>

          {/* Desktop Right Action & Progress Capsule */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/[0.08]">
              <span>Progress:</span>
              <span className="text-[#7CF2C3] font-bold">{completedCount}/{allLessonsCount} ({progressPercent}%)</span>
              <div className="w-16 h-1.5 rounded-full bg-white/[0.10] overflow-hidden ml-1">
                <div
                  className="h-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleComplete}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 select-none shrink-0",
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
  );
}
