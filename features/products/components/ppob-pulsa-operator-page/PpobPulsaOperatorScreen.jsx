"use client";

import PpobPulsaNominalGrid from "@/features/products/components/ppob-pulsa-operator-page/PpobPulsaNominalGrid";
import PpobPulsaOperatorHeader from "@/features/products/components/ppob-pulsa-operator-page/PpobPulsaOperatorHeader";
import PpobPulsaOperatorHero from "@/features/products/components/ppob-pulsa-operator-page/PpobPulsaOperatorHero";
import PpobPulsaPhoneNumberBox from "@/features/products/components/ppob-pulsa-operator-page/PpobPulsaPhoneNumberBox";
import { getPpobPulsaOperator } from "@/features/products/components/ppob-pulsa-operator-page/ppobPulsaOperator.data";

export default function PpobPulsaOperatorScreen({ operatorSlug }) {
  const operator = getPpobPulsaOperator(operatorSlug);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <PpobPulsaOperatorHeader operator={operator} />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10">
          <PpobPulsaOperatorHero operator={operator} />
          <PpobPulsaPhoneNumberBox />
          <PpobPulsaNominalGrid />
        </div>
      </div>
    </main>
  );
}