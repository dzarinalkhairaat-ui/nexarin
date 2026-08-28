"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTutorials } from "@/context/TutorialContext";
import { useAuth } from "@/context/AuthContext";
import { CurriculumAccordion } from "@/components/tutorials/CurriculumAccordion";
import { ClassCard } from "@/components/tutorials/ClassCard";
import { GuestAuthPromptModal } from "@/components/tutorials/GuestAuthPromptModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  BookOpen,
  Star,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  PlayCircle,
  FileText,
  ShieldCheck,
  Share2,
  Layers,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { courses, getCourseBySlug, getCourseProgress, openGuestPrompt } = useTutorials();
  const { isCustomerAuthenticated } = useAuth();

  const course = getCourseBySlug(slug);

  if (!course) {
    return (
      <div suppressHydrationWarning className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4 max-w-md bg-white/[0.035] p-8 rounded-2xl border border-white/[0.08]">
          <h2 className="text-xl font-bold text-white">Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-[#64748B]">
            Materi atau kelas dengan tautan "{slug}" tidak tersedia atau telah diperbarui.
          </p>
          <Link href="/tutorials">
            <Button variant="primary" size="sm">
              Kembali ke Tutorial Class Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);
  const isStarted = progress && progress.percentage > 0;
  const isCompleted = progress && progress.percentage >= 100;
  const firstLessonSlug = course.modules[0]?.lessons[0]?.slug;
  const continueLessonSlug = progress?.lastAccessedLessonSlug || firstLessonSlug;

  // Related courses in same category
  const relatedCourses = courses
    .filter((c) => c.id !== course.id && (c.categoryId === course.categoryId || c.level === course.level))
    .slice(0, 3);

  const levelColor = {
    Beginner: "bg-emerald-500/10 text-[#7CF2C3] border-emerald-500/30",
    Intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/30"
  }[course.level];

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30">
      {/* 1. BREADCRUMBS & COURSE HERO HEADER */}
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[#080D1A] to-[#0F172A] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#64748B]">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/tutorials" className="hover:text-cyan-400 transition-colors">
              Tutorials
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400">{course.categoryName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#94A3B8] truncate max-w-[200px] sm:max-w-none">
              {course.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border", levelColor)}>
                  {course.level}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {course.subcategoryName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {course.contentType.toUpperCase()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {course.description}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-mono text-[#94A3B8]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Durasi: <strong>{course.duration}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#7CF2C3]" />
                  <span>Materi: <strong>{course.lessonCount} Lessons</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-[#F8FAFC] font-bold">{course.rating.toFixed(1)}</span>
                  <span className="text-slate-500">({course.enrolledCount} Peserta)</span>
                </div>
              </div>
            </div>

            {/* Right: Action Preview Box */}
            <div className="p-6 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-5">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08]">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-cyan-400 -lg" />
                </div>
              </div>

              {/* Progress if started */}
              {isStarted && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.035] border border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Progres Belajar</span>
                    <span className="font-bold text-[#7CF2C3]">{progress.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-[#7CF2C3] transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Link href={`/tutorials/${course.slug}/${continueLessonSlug}`} className="block">
                  <Button
                    variant={isStarted ? "mint" : "primary"}
                    size="md"
                    className="w-full font-extrabold text-xs"
                  >
                    {isCompleted ? "Ulas Materi Kelas" : isStarted ? "Lanjutkan Pembelajaran" : "Mulai Belajar Sekarang"}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>

                {!isCustomerAuthenticated && (
                  <p className="text-[11px] text-center text-[#64748B] leading-tight">
                    Akses 100% Terbuka untuk umum.{" "}
                    <button
                      type="button"
                      onClick={() => openGuestPrompt("Masuk untuk melacak progres belajar Anda.")}
                      className="text-cyan-400 hover:underline font-bold"
                    >
                      Masuk akun
                    </button>{" "}
                    untuk simpan progres.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSE DETAILS & CURRICULUM GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.035] border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#7CF2C3]" />
                <h3 className="text-lg font-bold text-white">Yang Akan Anda Pelajari</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Curriculum */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Kurikulum &amp; Silabus Kelas
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {course.modules.length} Modul • {course.lessonCount} Pelajaran • {course.duration} Total Durasi
                  </p>
                </div>
              </div>

              <CurriculumAccordion
                modules={course.modules}
                courseSlug={course.slug}
                courseId={course.id}
              />
            </section>

            {/* Requirements */}
            <section className="p-6 rounded-2xl bg-white/[0.035] border border-white/[0.08] space-y-3">
              <h3 className="text-base font-bold text-white">Prasyarat &amp; Kebutuhan</h3>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                {course.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar Column: Instructor & Metadata */}
          <div className="space-y-6">
            {/* Instructor Profile */}
            <div className="p-6 rounded-2xl bg-white/[0.035] border border-white/[0.08] space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                Instruktur &amp; Penulis
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{course.instructor.name}</h4>
                  <p className="text-[11px] text-[#64748B] font-mono">{course.instructor.role}</p>
                </div>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {course.instructor.bio}
              </p>
            </div>

            {/* Course Tags */}
            <div className="p-6 rounded-2xl bg-white/[0.035] border border-white/[0.08] space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] tracking-wider">
                Tags Materi
              </span>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-white/[0.08] text-[#94A3B8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. RELATED CLASSES */}
        {relatedCourses.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Kelas Terkait Lainnya
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Lanjutkan peningkatan keahlian Anda dengan materi sejenis.
                </p>
              </div>
              <Link href="/tutorials" className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCourses.map((rel) => (
                <ClassCard key={rel.id} course={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      <GuestAuthPromptModal />
    </div>
  );
}
