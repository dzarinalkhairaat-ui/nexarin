"use client";

import React from "react";

interface CourseRequirementsSectionProps {
  requirements: string[];
}

export function CourseRequirementsSection({ requirements }: CourseRequirementsSectionProps) {
  if (!requirements || requirements.length === 0) return null;

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/70 border border-white/[0.08] space-y-4">
      <h2 className="text-lg font-bold text-white">Prasyarat &amp; Kebutuhan Belajar</h2>
      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
        {requirements.map((req, idx) => (
          <li key={idx} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4F5] shrink-0" />
            <span>{req}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
