"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import { BookOpen, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassroomCurriculumSidebarProps {
  course: TutorialCourse;
  lessonSlug: string;
  allLessonsCount: number;
  completedCount: number;
  progressPercent: number;
}

export function ClassroomCurriculumSidebar({
  course,
  lessonSlug,
  allLessonsCount,
  completedCount,
  progressPercent
}: ClassroomCurriculumSidebarProps) {
  const { isLessonCompleted } = useTutorials();

  return (
    <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-5">
      
      {/* Curriculum Accordion Box */}
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
            {completedCount}/{allLessonsCount} Selesai
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
        <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1 scrollbar-thin">
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
                        {les.duration || "20m"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Card */}
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
  );
}
