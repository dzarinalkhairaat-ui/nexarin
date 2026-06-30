"use client";

import Header from "@/components/shared/Header";
import DagangHero from "./components/DagangHero";
import DagangCatalog from "./components/DagangCatalog";
import HomeFooter from "@/features/home/components/HomeFooter";

export default function DagangPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
        <DagangHero />
        <DagangCatalog />
      </main>
      <HomeFooter />
    </>
  );
}
