"use client";

import React from "react";

export function TechInfoNewsTicker() {
  const headlines = [
    "Anthropic Merilis Claude 3.7 Sonnet dengan Hybrid Reasoning Traces",
    "Next.js 16.3 Mempercepat Kompilasi Webpack & Server Actions v2",
    "DeepSeek V3 Mengguncang Ekosistem Open-Source LLM Global",
    "NVIDIA Mengumumkan Arsitektur GPU Generasi Baru untuk AI Data Center",
    "Apple M4 Ultra Menghadirkan Lonjakan Kinerja Machine Learning Lokal",
    "Tesla FSD v13 Meluncur dengan End-to-End Neural Network Navigation"
  ];

  return (
    <div className="w-full bg-[#0F172A]/90 border-y border-white/[0.08] backdrop-blur-xl py-2.5 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center overflow-hidden text-xs font-mono">
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-slate-300 text-xs">
            {headlines.map((text, idx) => (
              <span key={`ticker-1-${idx}`} className="flex items-center gap-2">
                <span>{text}</span>
                <span className="text-[#2DD4F5] font-bold">•</span>
              </span>
            ))}
            {headlines.map((text, idx) => (
              <span key={`ticker-2-${idx}`} className="flex items-center gap-2">
                <span>{text}</span>
                <span className="text-[#2DD4F5] font-bold">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
