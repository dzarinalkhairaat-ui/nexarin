"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { TrendingUp, Award, Flame, Tag, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TechInfoSidebarProps {
  trendingArticles: Article[];
  popularArticles: Article[];
}

export function TechInfoSidebar({ trendingArticles, popularArticles }: TechInfoSidebarProps) {
  return (
    <aside className="space-y-6">
      
      {/* 1. TOP 5 POPULAR ARTICLES THIS WEEK */}
      <div className="rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] backdrop-blur-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
          <Flame className="w-4 h-4 text-orange-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Paling Banyak Dibaca
          </h2>
        </div>

        <div className="space-y-4">
          {popularArticles.slice(0, 5).map((art, idx) => (
            <Link
              key={art.id || idx}
              href={`/tech-info/${art.category?.slug || "technology"}/article/${art.slug}`}
              className="flex items-start gap-3 group"
            >
              <span className="text-xl font-black font-mono text-[#2DD4F5] shrink-0 w-6">
                0{idx + 1}
              </span>
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-mono text-[#7CF2C3] font-bold uppercase block">
                  {art.category?.name || "Tech"}
                </span>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-[#2DD4F5] transition-colors leading-snug line-clamp-2">
                  {art.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. EDITOR'S PICK HIGHLIGHT */}
      <div className="rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] backdrop-blur-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
          <Award className="w-4 h-4 text-[#7CF2C3]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Pilihan Redaksi
          </h2>
        </div>

        <div className="space-y-3">
          {trendingArticles.slice(0, 3).map((art, idx) => (
            <Link
              key={art.id || idx}
              href={`/tech-info/${art.category?.slug || "technology"}/article/${art.slug}`}
              className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] block group transition-all"
            >
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                {art.category?.name || "Editor's Pick"}
              </span>
              <h4 className="text-xs font-bold text-white group-hover:text-[#7CF2C3] transition-colors leading-snug line-clamp-2">
                {art.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. NEWSLETTER SUBSCRIBE BOX */}
      <div className="rounded-3xl p-6 border border-cyan-500/25 space-y-3 bg-[#0F172A] shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#2DD4F5]">
          <Mail className="w-4 h-4" />
          <span>Tech Dispatch Weekly</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Dapatkan ringkasan riset AI, tren gadget, dan artikel mendalam langsung di inbox Anda setiap hari Senin.
        </p>
        <div className="space-y-2 pt-2">
          <input
            type="email"
            placeholder="Masukkan email Anda..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#0B1120] border border-white/[0.10] text-xs text-white focus:outline-none focus:border-[#2DD4F5]"
          />
          <Button variant="primary" size="sm" className="w-full text-xs font-bold h-9">
            Langganan Buletin Gratis
          </Button>
        </div>
      </div>

    </aside>
  );
}
