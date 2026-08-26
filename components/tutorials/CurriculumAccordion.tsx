"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TutorialModule, TutorialLesson } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle2, Lock, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumAccordionProps {
  modules: TutorialModule[];
  courseSlug: string;
  courseId: string;
  activeLessonSlug?: string;
  isClassroomView?: boolean;
}

export function CurriculumAccordion({
  modules,
  courseSlug,
  courseId,
  activeLessonSlug,
  isClassroomView = false
}: CurriculumAccordionProps) {
  const { isLessonCompleted } = useTutorials();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    modules.forEach((m, idx) => {
      // Open first module or active module by default
      const hasActive = m.lessons.some((l) => l.slug === activeLessonSlug);
      initial[m.id] = idx === 0 || hasActive;
    });
    return initial;
  });

  const toggleModule = (modId: string) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="space-y-3">
      {modules.map((mod, modIdx) => {
        const isOpen = openModules[mod.id] ?? false;
        const totalLessons = mod.lessons.length;
        const completedInMod = mod.lessons.filter((l) => isLessonCompleted(courseId, l.slug)).length;

        return (
          <div
            key={mod.id}
            className={cn(
              "rounded-xl border border-[#1E293B] bg-[#0F172A] overflow-hidden transition-colors",
              isOpen && "border-slate-700"
            )}
          >
            {/* Module Header Toggle */}
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                  Modul {modIdx + 1 < 10 ? `0${modIdx + 1}` : modIdx + 1}
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {mod.title}
                </h4>
                {mod.description && !isClassroomView && (
                  <p className="text-xs text-slate-400 line-clamp-1">{mod.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span className="text-[11px] font-mono text-slate-400">
                  {completedInMod}/{totalLessons} Selesai
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {/* Lesson items */}
            {isOpen && (
              <div className="border-t border-[#1E293B] divide-y divide-[#1E293B] bg-[#080D1A]/60">
                {mod.lessons.map((lesson, lesIdx) => {
                  const isDone = isLessonCompleted(courseId, lesson.slug);
                  const isActive = lesson.slug === activeLessonSlug;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/tutorials/${courseSlug}/${lesson.slug}`}
                      className={cn(
                        "flex items-center justify-between p-3.5 text-xs transition-colors group",
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400"
                          : "hover:bg-slate-800/30 text-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#7CF2C3] flex-shrink-0" />
                        ) : (
                          <PlayCircle className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />
                        )}
                        <span className="text-[11px] font-mono text-slate-500">
                          {lesIdx + 1 < 10 ? `0${lesIdx + 1}` : lesIdx + 1}.
                        </span>
                        <span className={cn("truncate", isActive && "text-white")}>
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px] text-slate-400">
                        {lesson.isPreviewAvailable && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-[#7CF2C3] border border-emerald-500/20">
                            Preview
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {lesson.duration}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
