"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, BookOpen, Star, Users, ArrowRight, CheckCircle2 } from "lucide-react";
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
    Beginner: "bg-emerald-500/10 text-[#7CF2C3] border-emerald-500/30",
    Intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/30"
  }[course.level] || "bg-slate-800 text-slate-300 border-slate-700";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-500/5 overflow-hidden",
        className
      )}
    >
      {/* Top: Thumbnail & Overlays */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border", levelColor)}>
            {course.level}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-slate-300 border border-white/10 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            {course.duration}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-2.5 left-3">
          <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
            {course.categoryName} • {course.subcategoryName}
          </span>
        </div>
      </div>

      {/* Middle: Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={`/tutorials/${course.slug}`}>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {course.tagline || course.description}
          </p>
        </div>

        {/* Metadata stats */}
        <div className="pt-3 border-t border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{course.lessonCount} Lessons</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-slate-200">{course.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 font-normal">({course.enrolledCount})</span>
            </div>
          </div>

          {/* Progress bar if user started */}
          {isStarted && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  {isCompleted ? <CheckCircle2 className="w-3 h-3 text-[#7CF2C3]" /> : null}
                  Progres: {progress.percentage}%
                </span>
                <span className="text-cyan-400">{isCompleted ? "Selesai" : "Sedang Berjalan"}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-[#7CF2C3] transition-all duration-500"
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
                className="w-6 h-6 rounded-full object-cover border border-slate-700"
              />
              <span className="text-xs text-slate-300 font-medium truncate max-w-[110px]">
                {course.instructor.name}
              </span>
            </div>

            <Link href={`/tutorials/${course.slug}`}>
              <Button
                variant={isStarted ? "mint" : "outline"}
                size="sm"
                className={cn(
                  "text-xs px-3 py-1.5 font-bold transition-all",
                  isStarted
                    ? "text-slate-950 font-extrabold"
                    : "border-slate-700 text-slate-200 hover:text-white hover:border-cyan-400"
                )}
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
