"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse, UserLearningProgress } from "@/types/tutorial";
import { Button } from "@/components/ui/Button";
import { PlayCircle, ArrowRight } from "lucide-react";

interface ContinueLearningCardProps {
  course: TutorialCourse;
  progress: UserLearningProgress;
}

export function ContinueLearningCard({ course, progress }: ContinueLearningCardProps) {
  const completedCount = progress.completedLessonSlugs?.length || 0;
  const targetLessonSlug = progress.lastAccessedLessonSlug || course.modules[0]?.lessons[0]?.slug;

  return (
    <div className="relative rounded-2xl bg-white/[0.035] border border-white/[0.10] p-5 sm:p-6 backdrop-blur-md group hover:bg-white/[0.055] hover:border-[#2DD4F5]/30 transition-all duration-200">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Thumbnail & Course Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-[#0F172A] border border-white/[0.10] flex-shrink-0">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <PlayCircle className="w-7 h-7 text-[#2DD4F5]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-[#2DD4F5]/10 text-[#2DD4F5] border border-[#2DD4F5]/20">
                Lanjutkan Belajar
              </span>
              <span className="text-xs text-[#64748B] font-mono">
                {course.categoryName}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] leading-snug">
              {course.title}
            </h3>

            <p className="text-xs text-[#94A3B8] font-mono">
              Terakhir diakses: <strong className="text-[#F8FAFC] font-medium">{progress.lastAccessedLessonTitle || "Pelajaran"}</strong>
            </p>
          </div>
        </div>

        {/* Right: Progress bar & Jump Button */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-4 md:min-w-[280px]">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94A3B8] font-medium">
                Pelajaran {completedCount} dari {course.lessonCount}
              </span>
              <span className="font-bold text-[#7CF2C3]">{progress.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden border border-white/[0.08]">
              <div
                className="h-full bg-[#2DD4F5] transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <Link href={`/tutorials/${course.slug}/${targetLessonSlug}`}>
            <Button variant="mint" size="md" className="w-full font-bold text-xs whitespace-nowrap">
              Lanjut Sekarang
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
