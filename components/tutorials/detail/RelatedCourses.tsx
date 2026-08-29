"use client";

import React from "react";
import Link from "next/link";
import { TutorialCourse } from "@/types/tutorial";
import { ClassCard } from "@/components/tutorials/ClassCard";
import { ArrowRight } from "lucide-react";

interface RelatedCoursesProps {
  courses: TutorialCourse[];
}

export function RelatedCourses({ courses }: RelatedCoursesProps) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="space-y-6 pt-12 border-t border-white/[0.08]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Kelas Terkait Lainnya
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-mono">
            Tingkatkan keahlian Anda dengan materi kurikulum sejenis.
          </p>
        </div>
        <Link href="/tutorials" className="text-xs font-mono text-[#2DD4F5] hover:underline flex items-center gap-1 font-bold">
          Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((rel) => (
          <ClassCard key={rel.id} course={rel} />
        ))}
      </div>
    </section>
  );
}
