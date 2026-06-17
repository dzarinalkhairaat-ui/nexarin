"use client";

import PpobFooter from "@/features/products/components/ppob-page/PpobFooter";
import PpobHeader from "@/features/products/components/ppob-page/PpobHeader";
import PpobHeroBanner from "@/features/products/components/ppob-page/PpobHeroBanner";
import PpobServiceSection from "@/features/products/components/ppob-page/PpobServiceSection";
import { ppobSections } from "@/features/products/components/ppob-page/ppob.data";

export default function PpobCategoryScreen() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <PpobHeader />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10">
          <PpobHeroBanner />

          {ppobSections.map((section) => (
            <PpobServiceSection key={section.title} section={section} />
          ))}

          <div className="mt-10">
            <PpobFooter />
          </div>
        </div>
      </div>
    </main>
  );
}