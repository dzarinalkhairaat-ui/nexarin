"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { BookOpen, Quote } from "lucide-react";

interface AutomotiveAnalysisSectionProps {
  articles: Article[];
}

export function AutomotiveAnalysisSection({ articles }: AutomotiveAnalysisSectionProps) {
  if (articles.length === 0) return null;

  return (
    <aside
      className="rounded-3xl p-6 sm:p-7 backdrop-blur-xl border border-transparent space-y-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(11, 17, 32, 0.70)) padding-box, linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(124, 242, 195, 0.25), rgba(255, 255, 255, 0.03)) border-box",
        border: "1px solid transparent"
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#7CF2C3]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Analisis &amp; Opini Otomotif
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <article
            key={article.id}
            className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#7CF2C3]/40 transition-colors group space-y-2.5"
          >
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#7CF2C3] font-bold uppercase">
              <Quote className="w-3 h-3" />
              <span>Perspektif Otomotif</span>
            </div>

            <Link href={`/article/${article.slug}`}>
              <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC] group-hover:text-[#7CF2C3] transition-colors leading-snug line-clamp-2">
                {article.title}
              </h4>
            </Link>

            <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed italic">
              "{article.excerpt}"
            </p>

            <div className="pt-2.5 flex items-center justify-between text-[11px] font-mono text-[#64748B] border-t border-white/[0.06]">
              <span className="text-slate-400 font-medium">{article.author.name}</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
