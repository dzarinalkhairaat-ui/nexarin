"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TutorialModule } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle2, Clock } from "lucide-react";
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
              "rounded-xl border border-white/[0.08] bg-white/[0.025] overflow-hidden transition-colors",
              isOpen && "border-white/[0.12] bg-white/[0.035]"
            )}
          >
            {/* Module Header Toggle */}
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#18D6D0] tracking-wider">
                  Modul {modIdx + 1 < 10 ? `0${modIdx + 1}` : modIdx + 1}
                </span>
                <h4 className="text-sm font-bold text-[#F2FAF9] leading-snug">
                  {mod.title}
                </h4>
                {mod.description && !isClassroomView && (
                  <p className="text-xs text-[#A8BCBA] line-clamp-1">{mod.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span className="text-[11px] font-mono text-[#6F8583]">
                  {completedInMod}/{totalLessons} Selesai
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#A8BCBA]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#A8BCBA]" />
                )}
              </div>
            </button>

            {/* Lesson items */}
            {isOpen && (
              <div className="border-t border-white/[0.08] divide-y divide-white/[0.06] bg-[#061214]/60">
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
                          ? "bg-[#18D6D0]/10 text-[#18D6D0] font-bold border-l-2 border-[#18D6D0]"
                          : "hover:bg-white/[0.04] text-[#A8BCBA]"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#49D7A5] flex-shrink-0" />
                        ) : (
                          <PlayCircle className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-[#18D6D0]" : "text-[#6F8583] group-hover:text-[#F2FAF9]")} />
                        )}
                        <span className="text-[11px] font-mono text-[#6F8583]">
                          {lesIdx + 1 < 10 ? `0${lesIdx + 1}` : lesIdx + 1}.
                        </span>
                        <span className={cn("truncate", isActive && "text-[#F2FAF9]")}>
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px] text-[#6F8583]">
                        {lesson.isPreviewAvailable && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#49D7A5]/10 text-[#49D7A5] border border-[#49D7A5]/20">
                            Preview
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#6F8583]" />
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
