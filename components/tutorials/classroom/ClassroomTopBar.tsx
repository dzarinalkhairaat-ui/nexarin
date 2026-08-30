"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse, TutorialLesson } from "@/types/tutorial";
import { GraduationCap, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
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
    <div className="border-b border-white/[0.08] bg-[#0B1120]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] min-w-0">
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

          {/* Desktop Right Action Bar */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.08]">
              <span>Progress:</span>
              <span className="text-[#7CF2C3] font-bold">{completedCount}/{allLessonsCount} Selesai</span>
              <div className="w-16 h-1.5 rounded-full bg-white/[0.08] overflow-hidden ml-1">
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
  );
}
