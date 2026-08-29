"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTutorials } from "@/context/TutorialContext";
import { Button } from "@/components/ui/Button";
import { GuestAuthPromptModal } from "@/components/tutorials/GuestAuthPromptModal";
import { CourseHeroSection } from "@/components/tutorials/detail/CourseHeroSection";
import { WhatYouWillLearnSection } from "@/components/tutorials/detail/WhatYouWillLearnSection";
import { CourseCurriculumSection } from "@/components/tutorials/detail/CourseCurriculumSection";
import { CourseRequirementsSection } from "@/components/tutorials/detail/CourseRequirementsSection";
import { CourseInstructorCard } from "@/components/tutorials/detail/CourseInstructorCard";
import { CourseTagsCard } from "@/components/tutorials/detail/CourseTagsCard";
import { CourseRelatedSection } from "@/components/tutorials/detail/CourseRelatedSection";
import { GraduationCap } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { courses, getCourseBySlug } = useTutorials();

  const course = getCourseBySlug(slug);

  if (!course) {
    return (
      <div suppressHydrationWarning className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4 max-w-md bg-[#0F172A] p-8 rounded-3xl border border-white/[0.08]">
          <GraduationCap className="w-12 h-12 text-[#2DD4F5] mx-auto" />
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

  // Related courses in same category
  const relatedCourses = courses
    .filter((c) => c.id !== course.id && (c.categoryId === course.categoryId || c.level === course.level))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] selection:bg-[#2DD4F5]/30 w-full max-w-full overflow-x-hidden">
      
      {/* 1. DEDICATED COURSE HERO SECTION */}
      <CourseHeroSection course={course} />

      {/* 2. COURSE DETAILS & CURRICULUM GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Left Column (Col 8) */}
          <div className="lg:col-span-8 space-y-10">
            {/* What you will learn */}
            <WhatYouWillLearnSection items={course.whatYouWillLearn} />

            {/* Course Curriculum */}
            <CourseCurriculumSection
              modules={course.modules}
              courseSlug={course.slug}
              courseId={course.id}
              lessonCount={course.lessonCount}
              duration={course.duration}
            />

            {/* Requirements */}
            <CourseRequirementsSection requirements={course.requirements} />
          </div>

          {/* Right Sidebar Column (Col 4) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Instructor Profile Card */}
            <CourseInstructorCard instructor={course.instructor} />

            {/* Course Tags */}
            <CourseTagsCard tags={course.tags} />
          </aside>

        </div>

        {/* 3. RELATED CLASSES */}
        <CourseRelatedSection relatedCourses={relatedCourses} />
      </main>

      <GuestAuthPromptModal />
    </div>
  );
}
