"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";
import confetti from "canvas-confetti";

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function TrialModal({ isOpen, onClose, product }: TrialModalProps) {
  const { startTrial } = useShop();
  const { customer } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleActivate = async () => {
    setLoading(true);
    try {
      const res = await startTrial(product.id);
      if (res.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        onClose();
        router.push("/customer/products");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aktivasi Trial Gratis 3 Hari"
      description={`Mulai akses penuh untuk ${product.name}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#2DD4F5] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h5 className="font-bold text-white">
              Durasi Uji Coba: 3 x 24 Jam (72 Jam Penuh)
            </h5>
            <p className="text-slate-400 leading-relaxed">
              Anda mendapatkan akses ke semua fitur aplikasi dan source code selama 3 hari ke akun <strong>{customer?.email}</strong>. Tanpa kartu kredit atau komitmen biaya tersembunyi.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Fitur yang Langsung Terbuka:
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7CF2C3]" />
              <span className="text-slate-300">Full Source Code & Database Schema ({product.currentVersion})</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7CF2C3]" />
              <span className="text-slate-300">Lisensi Trial & Akses Download di Customer Dashboard</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7CF2C3]" />
              <span className="text-slate-300">Panduan Setup & Dokumentasi Lengkap</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" className="flex-1 font-bold shadow-md shadow-cyan-500/10" onClick={handleActivate} isLoading={loading}>
            <Sparkles className="w-4 h-4 mr-1.5 text-slate-950" />
            Aktifkan Sekarang
          </Button>
        </div>
      </div>
    </Modal>
  );
}
