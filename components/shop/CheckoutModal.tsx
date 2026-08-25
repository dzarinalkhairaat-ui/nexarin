"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, QrCode } from "lucide-react";
import confetti from "canvas-confetti";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const { checkoutOrder } = useShop();
  const { customer } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(customer?.name || "Ahmad Fadillah");
  const [email, setEmail] = useState(customer?.email || "ahmad.fadillah@example.com");
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
    }
  }, [customer]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await checkoutOrder(product.id, { name, email });
      if (res.success) {
        setStep("success");
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 }
          });
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === "success" ? "Transaksi Berhasil!" : `Beli ${product.name}`}
      description={step === "success" ? "Lisensi Lifetime Anda telah aktif." : "Pembayaran Aman via Mayar Payment Gateway"}
      maxWidth="md"
    >
      {step === "form" && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-white line-clamp-1">
                {product.name}
              </h5>
              <span className="text-[11px] text-slate-400 font-mono">Versi {product.currentVersion} • Lisensi Lifetime</span>
            </div>
            <span className="text-sm font-extrabold text-[#2DD4F5] font-mono">
              {formatCurrency(product.price, product.currency)}
            </span>
          </div>

          <div className="space-y-3">
            <Input
              label="Nama Pemilik Lisensi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              required
            />
            <Input
              label="Alamat Email (Akun Customer)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7CF2C3] shrink-0" />
            <span>Garansi akses update seumur hidup & dokumentasi implementasi.</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button
              variant="primary"
              className="flex-1 font-bold shadow-md shadow-cyan-500/10"
              onClick={() => setStep("payment")}
              disabled={!email || !name}
            >
              Lanjut Pembayaran
            </Button>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-2xl bg-[#0F172A] text-white border border-cyan-500/30 space-y-3">
            <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold block">
              Mayar Gateway Simulator
            </span>
            <div className="w-36 h-36 mx-auto bg-white rounded-xl p-2 shadow-md flex items-center justify-center">
              <QrCode className="w-32 h-32 text-slate-950" />
            </div>
            <div className="text-xs text-slate-300">
              <span className="block text-slate-400">Total Pembayaran:</span>
              <span className="text-lg font-bold font-mono text-[#7CF2C3]">
                {formatCurrency(product.price, product.currency)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep("form")} disabled={loading}>
              Kembali
            </Button>
            <Button variant="mint" className="flex-1 font-bold text-slate-950" onClick={handlePay} isLoading={loading}>
              Simulasi Bayar Berhasil
            </Button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="text-center space-y-5 py-2">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-extrabold text-white">
              Pembayaran Berhasil Dikonfirmasi!
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Lisensi Lifetime untuk <strong>{product.name}</strong> telah diterbitkan dan langsung tersedia di Customer Dashboard Anda.
            </p>
          </div>

          <Button
            variant="primary"
            className="w-full font-bold shadow-lg shadow-cyan-500/20"
            onClick={() => {
              onClose();
              router.push("/customer/products");
            }}
          >
            Buka Customer Dashboard Sekarang ?
          </Button>
        </div>
      )}
    </Modal>
  );
}
