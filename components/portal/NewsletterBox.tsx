"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNotification } from "@/context/NotificationContext";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useNotification();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubscribed(true);
    showToast({
      type: "success",
      title: "Berhasil Berlangganan Newsletter!",
      message: `Terima kasih! Insight teknologi dan AI mingguan akan dikirimkan ke ${email}.`
    });
  };

  return (
    <div className="relative rounded-3xl bg-white/[0.035] border border-cyan-500/20 p-8 sm:p-12 text-white overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4F5]/10 border border-[#2DD4F5]/30 text-[#2DD4F5] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nexarin Weekly Intelligence</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Dapatkan Kurasi Informasi AI & Tech Terkini Tanpa Noise
        </h3>

        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
          Ringkasan berita teknologi penting, analisis rilis LLM, tutorial praktis, dan diskon produk digital siap pakai dikirim langsung ke inbox Anda setiap pekan.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-[#7CF2C3] font-semibold text-sm pt-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>Terima kasih telah bergabung dengan komunitas Nexarin!</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan alamat email Anda..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0B1120] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
            />
            <Button type="submit" variant="primary" size="md" className="font-bold">
              Langganan Gratis
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
