"use client";

import PpobPulsaHeader from "@/features/products/components/ppob-pulsa-page/PpobPulsaHeader";
import PpobPulsaOperatorGrid from "@/features/products/components/ppob-pulsa-page/PpobPulsaOperatorGrid";

export default function PpobPulsaScreen() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 pb-12 text-white">
      <PpobPulsaHeader />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10">
          <PpobPulsaOperatorGrid />
        </div>
      </div>
    </main>
  );
}