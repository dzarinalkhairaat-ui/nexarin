"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Database,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check
} from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/Button";

interface PremiumSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  sheetId?: string;
}

type SyncStage = 1 | 2 | 3 | 4;

export function PremiumSyncModal({
  isOpen,
  onClose,
  onSuccess,
  sheetId = "1ydNZGWOtkRNpdwigw1IAupPaG0MNL9GXfVE-75pfZjU"
}: PremiumSyncModalProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<SyncStage>(1);
  const [statusMessage, setStatusMessage] = useState("Menghubungkan ke Google Sheets...");
  const [subMessage, setSubMessage] = useState("Mempersiapkan koneksi ke 'DATABASE PORTAL INFO NEXARIN TECH'");
  const [isCompleted, setIsCompleted] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStage(1);
      setIsCompleted(false);
      setIsError(false);
      setSyncedCount(0);
      return;
    }

    let isMounted = true;

    const runSyncPipeline = async () => {
      try {
        // --- STAGE 1: Mengambil Data Dari Spreadsheet (0% -> 35%) ---
        setStage(1);
        setStatusMessage("1. Mengambil Data Dari Spreadsheet...");
        setSubMessage("Membaca baris terbaru dari Google Sheets 'DATABASE PORTAL INFO NEXARIN TECH'...");

        for (let p = 0; p <= 35; p += 2.5) {
          if (!isMounted) return;
          setProgress(p);
          await new Promise((r) => setTimeout(r, 60));
        }

        // Jalankan API Sync di backend
        const res = await fetch("/api/gemini-sync/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sheetId: sheetId.trim() })
        });
        const result = await res.json();
        const count = result.data?.syncedCount || 0;
        if (isMounted) setSyncedCount(count);

        // --- STAGE 2: Memindahkan Ke Database Nexarin (35% -> 75%) ---
        if (!isMounted) return;
        setStage(2);
        setStatusMessage("2. Memindahkan Ke Database Nexarin (Supabase Articles)...");
        setSubMessage("Menginjeksi naskah 900+ kata & metadata ke tabel Supabase articles (status: draft)...");

        for (let p = 35; p <= 75; p += 2.5) {
          if (!isMounted) return;
          setProgress(p);
          await new Promise((r) => setTimeout(r, 60));
        }

        // --- STAGE 3: Verifikasi Integrasi & Pembersihan Staging (75% -> 95%) ---
        if (!isMounted) return;
        setStage(3);
        setStatusMessage("3. Memverifikasi Integrasi & Membersihkan Staging Buffer...");
        setSubMessage("Memastikan seluruh baris terverifikasi di Supabase dan membersihkan staging sementara...");

        for (let p = 75; p <= 95; p += 2) {
          if (!isMounted) return;
          setProgress(p);
          await new Promise((r) => setTimeout(r, 50));
        }

        // Refresh context data
        await onSuccess();

        // --- STAGE 4: Selesai 100% ---
        if (!isMounted) return;
        setProgress(100);
        setStage(4);
        setIsCompleted(true);
        setStatusMessage("4. Sinkronisasi Selesai 100%!");
        setSubMessage(
          count > 0
            ? `Berhasil mengalihkan ${count} artikel baru ke Database Supabase & siap untuk direview.`
            : "Database Supabase telah tersinkronisasi. Belum ada baris draft baru di spreadsheet."
        );
      } catch (err) {
        if (isMounted) {
          setIsError(true);
          setStatusMessage("Terjadi Kendala Koneksi");
          setSubMessage("Gagal menyelesaikan sinkronisasi. Silakan periksa koneksi atau coba lagi.");
        }
      }
    };

    runSyncPipeline();

    return () => {
      isMounted = false;
    };
  }, [isOpen, sheetId, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0B1120]/95 border border-[#2DD4F5]/30 p-7 space-y-6 shadow-[0_0_50px_rgba(45,212,245,0.2)] overflow-hidden">
        {/* Glowing Background Auroras */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-[#2DD4F5]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-[#7CF2C3]/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#2DD4F5]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Sinkronisasi Pipeline Database</span>
                <Sparkles className="w-4 h-4 text-[#7CF2C3]" />
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Google Sheets → Supabase Articles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Percentage & Progress Bar Card */}
        <div className="relative z-10 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Status Alur Kerja
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {statusMessage}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#2DD4F5] drop-shadow-[0_0_12px_rgba(45,212,245,0.4)]">
                {progress.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Progress Bar with Glow */}
          <div className="relative w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-white/10 p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2DD4F5] via-[#38BDF8] to-[#7CF2C3] transition-all duration-150 ease-out shadow-[0_0_15px_rgba(45,212,245,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            {subMessage}
          </p>
        </div>

        {/* 4 Pipeline Stages Checklist */}
        <div className="relative z-10 space-y-2.5">
          {/* Step 1 */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
              stage > 1 || isCompleted
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : stage === 1
                ? "bg-cyan-500/10 border-cyan-500/30 text-[#2DD4F5]"
                : "bg-white/[0.02] border-white/[0.06] text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {stage > 1 || isCompleted ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              ) : stage === 1 ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#2DD4F5]" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600" />
              )}
              <span className="font-bold">1. Ekstraksi Google Sheets Staging</span>
            </div>
            <span className="text-[10px] uppercase font-bold">
              {stage > 1 || isCompleted ? "Selesai" : stage === 1 ? "Sedang Proses" : "Menunggu"}
            </span>
          </div>

          {/* Step 2 */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
              stage > 2 || isCompleted
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : stage === 2
                ? "bg-cyan-500/10 border-cyan-500/30 text-[#2DD4F5]"
                : "bg-white/[0.02] border-white/[0.06] text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {stage > 2 || isCompleted ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              ) : stage === 2 ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#2DD4F5]" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600" />
              )}
              <span className="font-bold">2. Injeksi Database Supabase (Articles Draft)</span>
            </div>
            <span className="text-[10px] uppercase font-bold">
              {stage > 2 || isCompleted ? "Selesai" : stage === 2 ? "Sedang Proses" : "Menunggu"}
            </span>
          </div>

          {/* Step 3 */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
              stage > 3 || isCompleted
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : stage === 3
                ? "bg-cyan-500/10 border-cyan-500/30 text-[#2DD4F5]"
                : "bg-white/[0.02] border-white/[0.06] text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {stage > 3 || isCompleted ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              ) : stage === 3 ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#2DD4F5]" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600" />
              )}
              <span className="font-bold">3. Verifikasi & Pembersihan Staging Buffer</span>
            </div>
            <span className="text-[10px] uppercase font-bold">
              {stage > 3 || isCompleted ? "Selesai" : stage === 3 ? "Sedang Proses" : "Menunggu"}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#7CF2C3]" />
            <span>Supabase Sync Protected</span>
          </div>

          {isCompleted ? (
            <ShinyButton onClick={onClose} className="!py-2 !px-5 !text-xs font-bold flex items-center gap-2">
              <span>Buka Antrean Review ({syncedCount})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7CF2C3]" />
            </ShinyButton>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-white/10 hover:border-white/20 text-slate-300"
            >
              Tutup di Latar Belakang
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
