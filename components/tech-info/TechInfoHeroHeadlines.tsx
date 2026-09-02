"use client";

import React from "react";
import { Article } from "@/types/content";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Sparkles, ShieldCheck, Zap, Globe } from "lucide-react";

interface TechInfoHeroHeadlinesProps {
  leadStory?: Article;
  trendingStories?: Article[];
  categoryTitle?: string;
  categoryDescription?: string;
}

export function TechInfoHeroHeadlines({
  leadStory,
  trendingStories,
  categoryTitle,
  categoryDescription
}: TechInfoHeroHeadlinesProps) {
  const displayTitle = categoryTitle || "Tech Info Newsroom";
  const displayDesc =
    categoryDescription ||
    "Liputan mendalam seputar AI, rekayasa software, transformasi digital, review hardware gadget, dan inovasi mobilitas cerdas masa depan.";

  return (
    <section className="relative isolate overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-16 w-full max-w-full">
      {/* 3D Cyber Wave Background */}
      <CyberWaveBackground className="z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2DD4F5]/10 border border-[#2DD4F5]/30 text-[#2DD4F5] text-xs font-mono font-bold tracking-wide backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#7CF2C3]" />
          <span>PORTAL INFORMASI &amp; JURNALISME TEKNOLOGI TERKURASI</span>
        </div>

        {/* Editorial Brand Headline */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            {displayTitle}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-3xl">
            {displayDesc}
          </p>
        </div>

        {/* Editorial Highlights Badges Bar */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <ShieldCheck className="w-4 h-4 text-[#7CF2C3]" />
            <span className="text-slate-300 font-semibold">Fakta &amp; Riset Terverifikasi</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <Zap className="w-4 h-4 text-[#2DD4F5]" />
            <span className="text-slate-300 font-semibold">Analisis Mendalam 900+ Kata</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">5 Kanal Industri Utama</span>
          </div>
        </div>

      </div>
    </section>
  );
}
