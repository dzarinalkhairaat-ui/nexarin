"use client";

import React from "react";

interface CourseTagsCardProps {
  tags: string[];
}

export function CourseTagsCard({ tags }: CourseTagsCardProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-[#0F172A]/70 border border-white/[0.08] backdrop-blur-xl space-y-3">
      <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
        Tags Materi
      </span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-xl text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#2DD4F5]/30 transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
