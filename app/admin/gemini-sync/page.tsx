"use client";

import React from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Database, FileEdit, ExternalLink } from "lucide-react";

export default function AdminGeminiSyncPage() {
  const { drafts, syncGeminiSpark } = useContent();

  const pendingDrafts = drafts.filter((d) => d.status === "draft");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Pipeline AI Gemini Spark & Google Sheets Staging"
        description="Monitoring pipeline otomatis: Scraping RSS Feed harian → Sintesis Opini Gemini Spark → Staging Google Sheets → Review Editor Manusia."
        badge="Staging Layer Online"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={syncGeminiSpark}
            className="font-bold text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Sinkronkan Antrean Sekarang
          </Button>
        }
      />

      {/* Architecture Flow Banner */}
      <AdminCard className="space-y-4 border-purple-500/30 bg-gradient-to-r from-[#0B1120] via-[#0F172A] to-[#0B1120]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-white text-sm">
            Arsitektur Pipeline Konten Terkurasi (PRD Specification):
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#061214] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">1. Ingest &amp; Scrape</span>
            <span className="text-[#F2FAF9]">3 RSS Feed Harian (TechCrunch, Verge, dsb.)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#061214] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-purple-400 font-bold uppercase block">2. Gemini Spark AI</span>
            <span className="text-[#F2FAF9]">Sintesis Opini, Klasifikasi Kategori, SEO Meta</span>
          </div>

          <div className="p-3 rounded-xl bg-[#061214] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">3. Sheets Staging</span>
            <span className="text-[#F2FAF9]">Antrean Draft Editor (Buffer sebelum Live)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#061214] border border-white/[0.08] space-y-1">
            <span className="text-[10px] text-[#49D7A5] font-bold uppercase block">4. Supabase Live</span>
            <span className="text-[#F2FAF9]">Persetujuan Editor Manusia → Publikasi Portal</span>
          </div>
        </div>
      </AdminCard>

      {/* Staging Items List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Antrean Draft di Staging Layer ({drafts.length} Item)
          </h3>
          <Link href="/admin/content" className="text-xs font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1">
            Review Semua di Editorial Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {drafts.map((d) => (
            <AdminCard key={d.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Badge variant={d.status === "draft" ? "warning" : "mint"} size="sm">
                    {d.status === "draft" ? "MENUNGGU REVIEW" : "PUBLISHED"}
                  </Badge>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {d.category}
                  </span>
                  <span className="font-mono text-xs text-[#6F8583]">
                    Sumber: <strong className="text-[#F2FAF9]">{d.sourceName}</strong>
                  </span>
                </div>

                <span className="text-[11px] font-mono text-[#6F8583]">
                  Disinkron: {d.scrapedAt.split("T")[0]}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  {d.title}
                </h4>
                <p className="text-xs text-[#6F8583] line-clamp-1 font-mono">{d.sourceUrl}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
                <a
                  href={d.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6F8583] hover:text-white flex items-center gap-1 font-mono"
                >
                  <span>Buka URL Asli</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Link href={`/admin/content/${d.id}/review`}>
                  <Button variant="primary" size="sm" className="font-bold text-xs">
                    <FileEdit className="w-3.5 h-3.5 mr-1" />
                    Review Draft
                  </Button>
                </Link>
              </div>
            </AdminCard>
          ))}
        </div>
      </section>
    </div>
  );
}
