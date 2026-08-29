"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse } from "@/types/tutorial";
import { useTutorials } from "@/context/TutorialContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  BookOpen,
  Star,
  Users,
  ChevronRight,
  PlayCircle,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseHeroProps {
  course: TutorialCourse;
}

export function CourseHero({ course }: CourseHeroProps) {
  const { getCourseProgress, openGuestPrompt } = useTutorials();
  const { isCustomerAuthenticated } = useAuth();

  const progress = getCourseProgress(course.id);
  const isStarted = progress && progress.percentage > 0;
  const isCompleted = progress && progress.percentage >= 100;
  const firstLessonSlug = course.modules[0]?.lessons[0]?.slug;
  const continueLessonSlug = progress?.lastAccessedLessonSlug || firstLessonSlug;

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
    <section className="border-b border-white/[0.08] bg-[#0B1120] py-8 sm:py-12 lg:py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#64748B]">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/tutorials" className="hover:text-white transition-colors">
            Tutorials
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#2DD4F5] font-bold">{course.categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none hidden sm:inline">
            {course.title}
          </span>
        </nav>

        {/* Hero 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Course Info (Col 7) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={cn("px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase border backdrop-blur-md", levelColor)}>
                {course.level}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {course.subcategoryName}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-white/[0.05] text-slate-300 border border-white/[0.10]">
                {course.contentType.toUpperCase()}
              </span>
            </div>

            {/* Title (Pure solid white) */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              {course.description}
            </p>

            {/* Meta Stats Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-mono text-slate-300 border-t border-white/[0.08]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2DD4F5]" />
                <span>Durasi: <strong className="text-white">{course.duration}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#7CF2C3]" />
                <span>Materi: <strong className="text-white">{course.lessonCount} Pelajaran</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-white font-bold">{course.rating.toFixed(1)}</span>
                <span className="text-slate-500">({course.enrolledCount} Siswa)</span>
              </div>
            </div>
          </div>

          {/* Right: Course Preview & Action Card (Col 5) */}
          <div
            className="lg:col-span-5 p-6 sm:p-7 rounded-3xl backdrop-blur-xl border border-transparent space-y-6 shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(15, 23, 42, 0.90), rgba(11, 17, 32, 0.80)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.18), rgba(45, 212, 245, 0.25), rgba(124, 242, 195, 0.10)) border-box",
              border: "1px solid transparent"
            }}
          >
            {/* Media Thumbnail with Play Overlay */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.10]">
              <img
                src={coverImage}
                alt={course.title}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-[#2DD4F5]" />
                </div>
              </div>
            </div>

            {/* Progress if already started */}
            {isStarted && (
              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Kemajuan Belajar</span>
                  <span className="font-bold text-[#7CF2C3]">{progress.percentage}% Selesai</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2DD4F5] to-[#7CF2C3] rounded-full transition-all"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="space-y-3">
              <Link href={`/tutorials/${course.slug}/${continueLessonSlug}`} className="block">
                <Button
                  variant={isStarted ? "mint" : "primary"}
                  size="lg"
                  className="w-full font-extrabold text-sm py-4 shadow-lg shadow-cyan-500/20"
                >
                  {isCompleted ? "Ulas Seluruh Materi Kelas" : isStarted ? "Lanjutkan Pembelajaran" : "Mulai Belajar Sekarang"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Features checklist */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2.5 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7CF2C3] shrink-0" />
                  <span>Akses 100% Terbuka &amp; Terstruktur</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7CF2C3] shrink-0" />
                  <span>File Praktik, Dokumen &amp; Source Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7CF2C3] shrink-0" />
                  <span>Pelacakan Progres Belajar Realtime</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
