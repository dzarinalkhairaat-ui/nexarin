"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import { BookOpen, X, CheckCircle2, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassroomMobileDrawerProps {
  course: TutorialCourse;
  lessonSlug: string;
  allLessonsCount: number;
  completedCount: number;
  progressPercent: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ClassroomMobileDrawer({
  course,
  lessonSlug,
  allLessonsCount,
  completedCount,
  progressPercent,
  isOpen,
  onClose
}: ClassroomMobileDrawerProps) {
  const { isLessonCompleted } = useTutorials();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full bg-[#0B1120] border-l border-white/[0.10] p-5 flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2DD4F5]" />
            <h3 className="text-sm font-bold text-white">Daftar Kurikulum Kelas</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress in Drawer */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Kemajuan Belajar</span>
            <span className="text-[#7CF2C3] font-bold">{completedCount}/{allLessonsCount} Selesai ({progressPercent}%)</span>
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
                      onClick={onClose}
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
    </div>
  );
}
