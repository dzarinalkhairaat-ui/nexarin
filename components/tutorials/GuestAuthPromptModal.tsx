"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useTutorials } from "@/context/TutorialContext";
import { Sparkles, CheckCircle2, UserPlus, LogIn } from "lucide-react";

export function GuestAuthPromptModal() {
  const { guestPromptOpen, guestPromptReason, closeGuestPrompt } = useTutorials();

  return (
    <Modal
      isOpen={guestPromptOpen}
      onClose={closeGuestPrompt}
      title="Simpan Progres Belajar Anda"
    >
      <div className="space-y-5 text-center sm:text-left">
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-200 leading-relaxed">
            {guestPromptReason || "Masuk dengan Akun Pelanggan untuk menandai materi yang sudah selesai, menyimpan catatan, dan melanjutkan belajar kapan saja."}
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7CF2C3]" />
            <span>Pelacakan progres persen (%) penyelesaian kelas</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7CF2C3]" />
            <span>Akses kembali ke materi terakhir secara instan</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7CF2C3]" />
            <span>Gratis 100% tanpa biaya pendaftaran</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
          <Link href="/login" onClick={closeGuestPrompt}>
            <Button variant="primary" size="md" className="w-full font-bold text-xs">
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Masuk Akun
            </Button>
          </Link>
          <Link href="/register" onClick={closeGuestPrompt}>
            <Button variant="mint" size="md" className="w-full font-extrabold text-xs text-slate-950">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Daftar Akun Baru
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
