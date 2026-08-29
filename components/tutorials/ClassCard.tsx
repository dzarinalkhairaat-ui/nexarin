"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import {
  Clock,
  BookOpen,
  Users,
  Star,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  course: TutorialCourse;
  featured?: boolean;
}

export function ClassCard({ course, featured = false }: ClassCardProps) {
  const { getCourseProgress } = useTutorials();
  const progress = getCourseProgress(course.id);
  const isEnrolled = !!progress;
  const isCompleted = progress && progress.percentage >= 100;

  const levelColor = {
    Beginner: "bg-emerald-500/15 text-[#7CF2C3] border-emerald-500/30",
    Intermediate: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    Advanced: "bg-purple-500/15 text-purple-400 border-purple-500/30"
  }[course.level];

  const coverImage =
    course.thumbnail &&
    !course.thumbnail.includes(".svg") &&
    !course.thumbnail.includes("placeholder")
      ? course.thumbnail
      : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop";

  return (
    <article
      className={cn(
        "group flex flex-col justify-between rounded-3xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl border border-transparent hover:border-cyan-500/40 relative overflow-hidden",
        featured ? "bg-slate-900/80" : "bg-[#0F172A]/75"
      )}
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(45, 212, 245, 0.25), rgba(124, 242, 195, 0.10)) border-box",
        border: "1px solid transparent"
      }}
    >
      <div>
        {/* Cover Thumbnail */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.08]">
          <img
            src={coverImage}
            alt={course.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border backdrop-blur-md", levelColor)}>
              {course.level}
            </span>
            {course.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white bg-[#0B1120]/85 border border-white/20 backdrop-blur-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              {course.durationHours}j {course.durationMinutes}m
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
            <span className="text-[#2DD4F5] font-bold uppercase truncate max-w-[160px]">
              {course.categoryName}
            </span>
            <span>•</span>
            <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Pelajaran</span>
          </div>

          <Link href={`/tutorials/${course.slug}`}>
            <h3 className="text-base font-bold text-white group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      {/* Footer Meta & Progress */}
      <div className="pt-4 mt-4 border-t border-white/[0.08] space-y-3">
        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Progress Belajar</span>
              <span className="text-[#7CF2C3] font-bold">{progress.percentage}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] rounded-full transition-all"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{course.enrolledCount} siswa</span>
          </div>

          <Link
            href={`/tutorials/${course.slug}`}
            className="flex items-center gap-1 text-xs font-bold text-[#2DD4F5] group-hover:text-[#7CF2C3] transition-colors"
          >
            <span>{isEnrolled ? "Lanjutkan" : "Buka Kelas"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
