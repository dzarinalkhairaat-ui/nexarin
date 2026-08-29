"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface CourseRequirementsProps {
  requirements: string[];
}

export function CourseRequirements({ requirements }: CourseRequirementsProps) {
  if (!requirements || requirements.length === 0) return null;

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/70 border border-white/[0.08] space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[#2DD4F5]" />
        <span>Prasyarat &amp; Kebutuhan Belajar</span>
      </h2>
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
