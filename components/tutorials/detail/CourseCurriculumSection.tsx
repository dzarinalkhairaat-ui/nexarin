"use client";

import React from "react";
import { TutorialModule } from "@/types/tutorial";
import { CurriculumAccordion } from "@/components/tutorials/CurriculumAccordion";

interface CourseCurriculumSectionProps {
  modules: TutorialModule[];
  courseSlug: string;
  courseId: string;
  lessonCount: number;
  duration: string;
}

export function CourseCurriculumSection({
  modules,
  courseSlug,
  courseId,
  lessonCount,
  duration
}: CourseCurriculumSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Kurikulum &amp; Silabus Kelas
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">
            {modules.length} Modul • {lessonCount} Pelajaran • {duration} Total Durasi
          </p>
        </div>
      </div>

      <CurriculumAccordion
        modules={modules}
        courseSlug={courseSlug}
        courseId={courseId}
      />
    </section>
  );
}
