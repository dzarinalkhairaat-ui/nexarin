"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { CyberWaveBackground } from "@/components/ui/cyber-wave-background";
import { Clock, TrendingUp, ArrowRight } from "lucide-react";

interface TechInfoHeroHeadlinesProps {
  leadStory: Article;
  trendingStories: Article[];
}

export function TechInfoHeroHeadlines({ leadStory, trendingStories }: TechInfoHeroHeadlinesProps) {
  if (!leadStory) return null;

  return (
    <section className="relative isolate overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 w-full max-w-full">
      {/* 3D Cyber Wave Background */}
      <CyberWaveBackground className="z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Editorial Brand Headline */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Tech Info Newsroom
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] leading-relaxed max-w-2xl">
            Liputan mendalam seputar AI, rekayasa software, transformasi digital, review hardware gadget, dan inovasi mobilitas cerdas masa depan.
          </p>
        </div>

        {/* 3-Column Editorial Grid: Lead Story + 2 Trending Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Main Lead Story (Col 8) */}
          <div className="lg:col-span-8 group">
            <Link
              href={`/tech-info/${leadStory.category?.slug || "technology"}/article/${leadStory.slug}`}
              className="relative flex flex-col justify-end h-full min-h-[380px] sm:min-h-[460px] rounded-3xl overflow-hidden p-6 sm:p-10 border border-white/[0.12] hover:border-[#2DD4F5]/50 transition-all duration-300 backdrop-blur-xl shadow-2xl block"
            >
              {/* Background Image with Fallback and ReferrerPolicy */}
              <img
                src={leadStory.featuredImage || "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80"}
                alt={leadStory.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "/assets/article-ai.svg";
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.70]"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent" />

              {/* Content Overlay */}
              <div className="relative z-10 space-y-3.5">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-[#2DD4F5]/20 text-[#2DD4F5] font-bold uppercase border border-[#2DD4F5]/40 backdrop-blur-md">
                    {leadStory.category?.name || "Top Headline"}
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="flex items-center gap-1 text-slate-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#7CF2C3]" />
                    {leadStory.readingTimeMinutes || 4} min read
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-[#2DD4F5] transition-colors">
                  {leadStory.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 max-w-2xl">
                  {leadStory.excerpt}
                </p>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-2">
                    <img
                      src={leadStory.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                      alt={leadStory.author?.name || "Author"}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-white/30"
                    />
                    <span className="text-white font-semibold">{leadStory.author?.name || "Rins"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#2DD4F5] font-bold group-hover:translate-x-1 transition-transform">
                    Baca Berita Penuh <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* 2 Sub-Lead Trending Stories (Col 4) with Rich Images */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {trendingStories.slice(0, 2).map((story, idx) => (
              <Link
                key={story.id || idx}
                href={`/tech-info/${story.category?.slug || "technology"}/article/${story.slug}`}
                className="group relative flex flex-col sm:flex-row lg:flex-row gap-4 justify-between flex-1 rounded-3xl p-4 sm:p-5 bg-[#0F172A]/85 border border-white/[0.10] hover:border-[#7CF2C3]/40 transition-all duration-300 backdrop-blur-xl shadow-xl overflow-hidden"
              >
                {/* Visual Thumbnail for Trending Cards */}
                <div className="relative w-full sm:w-32 lg:w-32 h-32 sm:h-auto lg:h-full min-h-[100px] rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.08] shrink-0">
                  <img
                    src={story.featuredImage || "/assets/article-tech.svg"}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/article-tech.svg";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.85]"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#0B1120]/80 text-[#7CF2C3] border border-[#7CF2C3]/30 backdrop-blur-md">
                      #{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 space-y-2 min-w-0">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-[#7CF2C3]/15 text-[#7CF2C3] font-bold uppercase border border-[#7CF2C3]/30 text-[10px]">
                        {story.category?.name || "Trending"}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                        <TrendingUp className="w-2.5 h-2.5 text-[#2DD4F5]" />
                        Trending
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#7CF2C3] transition-colors leading-snug line-clamp-2">
                      {story.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[10px] font-mono text-slate-500">
                    <span>{story.readingTimeMinutes || 3} min read</span>
                    <span className="text-slate-400 group-hover:text-white font-bold flex items-center gap-1">
                      Baca <ArrowRight className="w-3 h-3 text-[#7CF2C3]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
