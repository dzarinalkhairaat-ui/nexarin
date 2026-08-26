"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { BookOpen, Quote } from "lucide-react";

interface TechAnalysisSectionProps {
  articles: Article[];
}

export function TechAnalysisSection({ articles }: TechAnalysisSectionProps) {
  if (articles.length === 0) return null;

  return (
    <aside className="rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] p-6 backdrop-blur-md space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#7CF2C3]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Analisis Arsitektur &amp; Opini
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <article
            key={article.id}
            className="p-4 rounded-xl bg-[#131E32]/60 border border-[#1E293B] hover:border-[#7CF2C3]/30 hover:bg-[#131E32] transition-colors group space-y-2.5"
          >
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#7CF2C3] font-bold uppercase">
              <Quote className="w-3 h-3" />
              <span>Perspektif Engineering</span>
            </div>

            <Link href={`/article/${article.slug}`}>
              <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC] group-hover:text-[#7CF2C3] transition-colors leading-snug line-clamp-2">
                {article.title}
              </h4>
            </Link>

            <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed italic">
              "{article.excerpt}"
            </p>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#64748B] border-t border-[#1E293B]/50">
              <span>{article.author.name}</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
