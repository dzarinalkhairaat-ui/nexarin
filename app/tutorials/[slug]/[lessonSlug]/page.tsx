"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTutorials } from "@/context/TutorialContext";
import { ClassroomTopBar } from "@/components/tutorials/classroom/ClassroomTopBar";
import { LessonReader } from "@/components/tutorials/classroom/LessonReader";
import { ClassroomCurriculumSidebar } from "@/components/tutorials/classroom/ClassroomCurriculumSidebar";
import { ClassroomMobileDrawer } from "@/components/tutorials/classroom/ClassroomMobileDrawer";
import { Button } from "@/components/ui/Button";
import { GraduationCap, BookOpen, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClassroomLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;
  const lessonSlug = params.lessonSlug as string;

  const { getCourseBySlug, isLessonCompleted, toggleLessonCompletion } = useTutorials();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Scroll to top on lesson switch
  useEffect(() => {
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonSlug]);

  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return (
      <div suppressHydrationWarning className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-[#0F172A] p-8 rounded-3xl border border-white/[0.08]">
          <GraduationCap className="w-12 h-12 text-[#2DD4F5] mx-auto" />
          <h2 className="text-xl font-bold text-white">Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-[#94A3B8]">
            Materi pembelajaran tidak tersedia atau URL telah dipindahkan.
          </p>
          <Link href="/tutorials">
            <Button variant="primary" size="sm">Kembali ke Tutorial Class Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Flatten lessons to find current, prev, next
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const currentLesson = allLessons[currentIndex] || allLessons[0];

  // Current module
  const currentModule = course.modules.find((m) =>
    m.lessons.some((l) => l.slug === currentLesson.slug)
  ) || course.modules[0];

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isDone = isLessonCompleted(course.id, currentLesson.slug);
  const completedCount = allLessons.filter((l) => isLessonCompleted(course.id, l.slug)).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  const handleToggleComplete = () => {
    toggleLessonCompletion(course.id, currentLesson.slug, currentLesson.title);
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden selection:bg-[#2DD4F5]/30">
      
      {/* 1. TOP BREADCRUMB & CLASSROOM PROGRESS BAR */}
      <ClassroomTopBar
        course={course}
        currentLesson={currentLesson}
        allLessonsCount={allLessons.length}
        completedCount={completedCount}
        progressPercent={progressPercent}
        isDone={isDone}
        onToggleComplete={handleToggleComplete}
        onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
      />

      {/* 2. MAIN LMS CLASSROOM WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full pb-28 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Left Lesson Reader Column (Col 8) */}
          <main className="lg:col-span-8 min-w-0">
            <LessonReader
              course={course}
              currentModule={currentModule}
              currentLesson={currentLesson}
              currentIndex={currentIndex}
              allLessonsCount={allLessons.length}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onToggleComplete={handleToggleComplete}
            />
          </main>

          {/* Right Curriculum Sticky Sidebar (Col 4) */}
          <ClassroomCurriculumSidebar
            course={course}
            lessonSlug={lessonSlug}
            allLessonsCount={allLessons.length}
            completedCount={completedCount}
            progressPercent={progressPercent}
          />

        </div>
      </div>

      {/* 3. MOBILE FLOATING ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1120]/95 backdrop-blur-xl border-t border-white/[0.10] p-3 px-4">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.10] text-xs font-semibold text-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2DD4F5]" />
            <span>Modul ({currentIndex + 1}/{allLessons.length})</span>
          </button>

          <button
            type="button"
            onClick={handleToggleComplete}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
              isDone
                ? "bg-[#7CF2C3] text-slate-950"
                : "bg-white/[0.08] text-slate-200 border border-white/[0.10]"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isDone ? "Selesai" : "Tandai"}</span>
          </button>

          {nextLesson ? (
            <Link
              href={`/tutorials/${course.slug}/${nextLesson.slug}`}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#2DD4F5] text-slate-950 text-xs font-extrabold shadow-sm"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleToggleComplete}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#7CF2C3] text-slate-950 text-xs font-black shadow-sm"
            >
              <span>Tuntas</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. MOBILE CURRICULUM DRAWER */}
      <ClassroomMobileDrawer
        course={course}
        lessonSlug={lessonSlug}
        allLessonsCount={allLessons.length}
        completedCount={completedCount}
        progressPercent={progressPercent}
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

    </div>
  );
}
