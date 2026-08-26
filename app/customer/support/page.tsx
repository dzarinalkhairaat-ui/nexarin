"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useNotification } from "@/context/NotificationContext";
import { HelpCircle, Send, CheckCircle2 } from "lucide-react";

export default function CustomerSupportPage() {
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast({
      type: "success",
      title: "Tiket Dukungan Dibuat",
      message: "Tim teknis Nexarin akan membalas tiket Anda dalam waktu 1-3 jam kerja."
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dukungan Pelanggan (Customer Support)
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#6F8583]">
          Kirimkan kendala teknis atau pertanyaan implementasi lisensi produk Anda
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Tiket Telah Terdaftar!</h4>
            <p className="text-xs text-slate-500">Nomor Tiket: #NXRN-TK-{Date.now().toString().slice(-5)}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Judul Kendala / Topik"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Contoh: Bantuan setup geolocation absensi di VPS"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-[#A8BCBA] mb-1.5">
                Detail Pertanyaan / Error Log
              </label>
              <textarea
                rows={5}
                required
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Jelaskan kendala teknis atau error yang Anda alami..."
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#18D6D0]"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full font-bold">
              <Send className="w-4 h-4 mr-2" />
              Kirim Tiket Dukungan
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
