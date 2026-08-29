"use client";

import React from "react";

interface InstructorProps {
  instructor: {
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
  };
}

export function CourseInstructorCard({ instructor }: InstructorProps) {
  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#0F172A]/85 border border-white/[0.08] backdrop-blur-xl space-y-4 shadow-xl">
      <span className="text-[11px] font-mono font-bold uppercase text-[#2DD4F5] tracking-wider block">
        Instruktur &amp; Pengajar
      </span>
      <div className="flex items-center gap-3.5">
        <img
          src={instructor.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
          alt={instructor.name}
          className="w-12 h-12 rounded-2xl object-cover border border-white/15 shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{instructor.name}</h3>
          <p className="text-[11px] text-slate-400 font-mono truncate">{instructor.role}</p>
        </div>
      </div>
      {instructor.bio && (
        <p className="text-xs text-slate-300 leading-relaxed">
          {instructor.bio}
        </p>
      )}
    </div>
  );
}
