"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { useNotification } from "@/context/NotificationContext";
import { CustomerPageHeader } from "@/components/customer/CustomerPageHeader";
import { CustomerCard } from "@/components/customer/CustomerCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  DownloadCloud,
  Copy,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  FileCode,
  CheckCircle2,
  Terminal,
  ExternalLink
} from "lucide-react";

export default function CustomerProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { customer } = useAuth();
  const { getUserLicenses, products, downloadProduct } = useShop();
  const { showToast } = useNotification();

  const userLicenses = getUserLicenses(customer?.id || "usr-cust-001");
  const license = userLicenses.find((l) => l.productId === productId || l.productSlug === productId);
  const product = products.find((p) => p.id === productId || p.slug === productId);

  if (!license || !product) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <CustomerCard className="p-8 space-y-4 border-amber-500/30">
          <h2 className="text-xl font-bold text-white">Kepemilikan Produk Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400">
            Anda belum memiliki lisensi untuk produk ini atau sesi login Anda belum terdaftar sebagai pemilik.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/customer/products">
              <Button variant="outline" size="sm">
                Kembali ke Produk Saya
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="primary" size="sm">
                Beli Lisensi di Toko
              </Button>
            </Link>
          </div>
        </CustomerCard>
      </div>
    );
  }

  const hasUpdate = license.ownedVersion !== product.currentVersion;

  const copyKey = (key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(key);
      showToast({
        type: "success",
        title: "License Key Disalin!",
        message: key
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/customer/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Produk Saya</span>
        </Link>
      </div>

      {/* Page Header */}
      <CustomerPageHeader
        title={product.name}
        description={product.shortDescription}
        badge={license.licenseType === "lifetime" ? "Lifetime License" : "Trial 3 Hari"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="font-bold text-xs"
              onClick={() => downloadProduct(product.id, license.ownedVersion)}
            >
              <DownloadCloud className="w-3.5 h-3.5 mr-1.5" />
              Unduh Versi Dimiliki ({license.ownedVersion})
            </Button>
            {hasUpdate && (
              <Button
                variant="mint"
                size="sm"
                className="font-bold text-xs text-slate-950"
                onClick={() => downloadProduct(product.id, product.currentVersion)}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Unduh Update ({product.currentVersion})
              </Button>
            )}
          </div>
        }
      />

      {/* License & Version Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* License Key Card */}
        <CustomerCard className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Informasi Lisensi Resmi
          </h3>
          <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">License Key:</span>
              <button
                onClick={() => copyKey(license.licenseKey)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                title="Salin Key"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </button>
            </div>
            <code className="text-sm font-mono font-bold text-[#2DD4F5] block select-all">
              {license.licenseKey}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-slate-800 text-slate-400">
            <div>
              <span>Status Lisensi:</span>
              <strong className="block text-emerald-400 font-bold uppercase mt-0.5">
                {license.status}
              </strong>
            </div>
            <div>
              <span>Tanggal Pembelian:</span>
              <strong className="block text-slate-200 mt-0.5">
                {formatDate(license.issuedAt)}
              </strong>
            </div>
          </div>
        </CustomerCard>

        {/* Version Status Card */}
        <CustomerCard className="space-y-4">
          <h3 className="text-xs font-mono uppercase text-[#7CF2C3] font-bold tracking-wider">
            Status Pembaruan Software
          </h3>
          <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Versi Terinstal:</span>
              <span className="font-bold text-white text-sm">{license.ownedVersion}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Versi Rilis Terbaru:</span>
              <span className="font-bold text-cyan-400 text-sm">{product.currentVersion}</span>
            </div>
          </div>

          {hasUpdate ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span>Pembaruan versi {product.currentVersion} siap diunduh gratis!</span>
              <Button
                variant="mint"
                size="sm"
                className="font-bold text-[11px] h-7 px-2 text-slate-950"
                onClick={() => downloadProduct(product.id, product.currentVersion)}
              >
                Unduh Sekarang
              </Button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aplikasi Anda berada pada versi terbaru (Up-to-date).</span>
            </div>
          )}
        </CustomerCard>
      </div>

      {/* Version History & Release Notes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Riwayat Pembaruan &amp; Changelog Resmi
          </h3>
        </div>

        <div className="space-y-4">
          {product.versions.map((ver) => (
            <CustomerCard key={ver.id} className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Badge variant={ver.isLatest ? "mint" : "slate"} size="sm">
                    {ver.version} {ver.isLatest ? "— Terbaru" : ""}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    Rilis: {formatDate(ver.releaseDate)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-700 text-slate-300 hover:text-white"
                  onClick={() => downloadProduct(product.id, ver.version)}
                >
                  <DownloadCloud className="w-3.5 h-3.5 mr-1" />
                  Unduh ({ver.fileSize})
                </Button>
              </div>

              <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-300">
                {ver.releaseNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </CustomerCard>
          ))}
        </div>
      </section>

      {/* Quick Setup Docs Shortcut */}
      <CustomerCard className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#0B1120] to-[#131E32] border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Butuh Panduan Instalasi &amp; Deploy?</h4>
            <p className="text-xs text-slate-400">
              Pelajari panduan setup database Supabase, konfigurasi .env, dan cara menjalankan di VPS/Vercel.
            </p>
          </div>
        </div>

        <Link href="/customer/docs">
          <Button variant="outline" size="sm" className="whitespace-nowrap border-slate-700 text-slate-300 hover:text-white">
            Buka Dokumentasi ?
          </Button>
        </Link>
      </CustomerCard>
    </div>
  );
}
