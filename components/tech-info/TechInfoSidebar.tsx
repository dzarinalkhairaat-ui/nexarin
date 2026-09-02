"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { Award, Flame, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TechInfoSidebarProps {
  trendingArticles: Article[];
  popularArticles: Article[];
}

export function TechInfoSidebar({ trendingArticles, popularArticles }: TechInfoSidebarProps) {
  return (
    <aside className="space-y-6">
      
      {/* 1. TOP 5 POPULAR ARTICLES THIS WEEK WITH THUMBNAILS */}
      <div className="rounded-3xl bg-[#0F172A]/90 border border-white/[0.08] backdrop-blur-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
          <Flame className="w-4 h-4 text-orange-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Paling Banyak Dibaca
          </h2>
        </div>

        <div className="space-y-3.5">
          {popularArticles.slice(0, 5).map((art, idx) => (
            <Link
              key={art.id || idx}
              href={`/tech-info/${art.category?.slug || "technology"}/article/${art.slug}`}
              className="flex items-center gap-3.5 group p-2 rounded-2xl hover:bg-white/[0.04] transition-all"
            >
              {/* Image Thumbnail */}
              <div className="relative w-16 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/[0.08]">
                <img
                  src={art.featuredImage || "/assets/default-cover.svg"}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/default-cover.svg";
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-[0.85]"
                  loading="lazy"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-black/70 text-[#2DD4F5]">
                  0{idx + 1}
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
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

      {/* 2. EDITOR'S PICK HIGHLIGHT WITH THUMBNAILS */}
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
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] group transition-all"
            >
              <div className="relative w-16 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/[0.08]">
                <img
                  src={art.featuredImage || "/assets/default-cover.svg"}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/default-cover.svg";
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-[0.85]"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                  {art.category?.name || "Editor's Pick"}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-[#7CF2C3] transition-colors leading-snug line-clamp-2">
                  {art.title}
                </h4>
              </div>
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
