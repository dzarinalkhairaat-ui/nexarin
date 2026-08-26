"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import { Button } from "@/components/ui/Button";
import { Clock, BookOpen, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  course: TutorialCourse;
  className?: string;
}

export function ClassCard({ course, className }: ClassCardProps) {
  const { getCourseProgress } = useTutorials();
  const progress = getCourseProgress(course.id);
  const isStarted = progress && progress.percentage > 0;
  const isCompleted = progress && progress.percentage >= 100;

  const levelColor = {
    Beginner: "bg-[#7CF2C3]/10 text-[#7CF2C3] border-[#7CF2C3]/25",
    Intermediate: "bg-[#2DD4F5]/10 text-[#2DD4F5] border-[#2DD4F5]/25",
    Advanced: "bg-purple-500/10 text-purple-300 border-purple-500/25"
  }[course.level] || "bg-white/[0.04] text-[#94A3B8] border-white/[0.08]";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl bg-white/[0.035] border border-white/[0.08] hover:border-[#2DD4F5]/30 hover:bg-white/[0.055] transition-all duration-200 overflow-hidden backdrop-blur-md",
        className
      )}
    >
      {/* Top: Thumbnail & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0F172A]">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent opacity-90" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={cn("px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border", levelColor)}>
            {course.level}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#0B1120]/80 backdrop-blur-md text-[#F8FAFC] border border-white/[0.10] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#2DD4F5]" />
            {course.duration}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-2.5 left-3">
          <span className="text-[10px] font-mono font-bold uppercase text-[#2DD4F5] tracking-wider">
            {course.categoryName} • {course.subcategoryName}
          </span>
        </div>
      </div>

      {/* Middle: Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={`/tutorials/${course.slug}`}>
            <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
            {course.tagline || course.description}
          </p>
        </div>

        {/* Metadata stats */}
        <div className="pt-3 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{course.lessonCount} Lessons</span>
            </div>
            <div className="flex items-center gap-1 text-[#E4C46A]">
              <Star className="w-3.5 h-3.5 fill-[#E4C46A]" />
              <span className="font-bold text-[#F8FAFC]">{course.rating.toFixed(1)}</span>
              <span className="text-[10px] text-[#64748B] font-normal">({course.enrolledCount})</span>
            </div>
          </div>

          {/* Progress bar if user started */}
          {isStarted && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  {isCompleted ? <CheckCircle2 className="w-3 h-3 text-[#7CF2C3]" /> : null}
                  Progres: {progress.percentage}%
                </span>
                <span className="text-[#2DD4F5]">{isCompleted ? "Selesai" : "Sedang Berjalan"}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full bg-[#2DD4F5] transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Instructor & CTA */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-6 h-6 rounded-full object-cover border border-white/[0.12]"
              />
              <span className="text-xs text-[#94A3B8] font-medium truncate max-w-[110px]">
                {course.instructor.name}
              </span>
            </div>

            <Link href={`/tutorials/${course.slug}`}>
              <Button
                variant={isStarted ? "mint" : "outline"}
                size="sm"
                className="text-xs px-3 py-1 font-bold"
              >
                {isCompleted ? "Ulas Materi" : isStarted ? "Lanjut Belajar" : "Mulai Kelas"}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
