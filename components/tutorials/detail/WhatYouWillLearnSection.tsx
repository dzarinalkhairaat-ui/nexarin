"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface WhatYouWillLearnSectionProps {
  items: string[];
}

export function WhatYouWillLearnSection({ items }: WhatYouWillLearnSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/85 border border-white/[0.08] backdrop-blur-xl space-y-5">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-[#7CF2C3]" />
        <h2 className="text-xl font-bold text-white tracking-tight">
          Yang Akan Anda Pelajari
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-[#2DD4F5] shrink-0 mt-0.5" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
