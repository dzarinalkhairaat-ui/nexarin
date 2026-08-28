"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useNotification } from "@/context/NotificationContext";
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { showToast } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast({
      type: "success",
      title: "Pesan Terkirim!",
      message: "Terima kasih telah menghubungi kami. Tim editorial Nexarin akan merespons dalam 1x24 jam."
    });
  };

  return (
    <div suppressHydrationWarning className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hubungi Tim Nexarin
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#64748B] max-w-lg mx-auto leading-relaxed">
          Punya pertanyaan seputar produk digital, artikel, kerjasama affiliate, atau dukungan lisensi? Kami siap membantu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Email Utama</h4>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">support@nexarin.tech</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Jam Operasional</h4>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Senin - Jumat (09:00 - 18:00 WIB)</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-7">
          <Card className="p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pesan Anda Telah Diterima!</h4>
                <p className="text-xs text-slate-500">Kami akan membalas ke alamat email {email}.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  required
                />
                <Input
                  label="Alamat Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-[#94A3B8] mb-1.5">
                    Pesan / Pertanyaan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pertanyaan atau kebutuhan Anda di sini..."
                    className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  />
                </div>
                <Button type="submit" variant="primary" size="md" className="w-full font-bold">
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Pesan
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
