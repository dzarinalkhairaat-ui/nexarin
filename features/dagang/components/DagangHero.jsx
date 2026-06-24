"use client";

import { useEffect, useState } from "react";
import { dagangData } from "../dagang.data";

function AnimatedCounter({ end, duration = 2000, decimals = 0, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setCount(end * easeProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}
export default function DagangHero() {
  const { hero } = dagangData;

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-10 sm:pt-16 text-white sm:px-6 lg:px-8">
      {/* Background Image with Low Opacity */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero Background" 
          className="h-full w-full object-cover opacity-[0.08]"
        />
        {/* Gradient fade to blend into the background smoothly */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
      </div>

      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/[0.04] blur-[120px]" />
      
      {/* Grid Pattern Background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.1] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
            {hero.title.split("&").map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className="text-emerald-400">&</span>
                )}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-400 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                <AnimatedCounter end={850} suffix="+" />
              </span>
              <span className="mt-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Produk Terjual</span>
            </div>
            
            <div className="hidden h-12 w-px bg-white/10 sm:block" />
            
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                <AnimatedCounter end={420} suffix="+" />
              </span>
              <span className="mt-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Klien Aktif</span>
            </div>
            
            <div className="hidden h-12 w-px bg-white/10 sm:block" />

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                <AnimatedCounter end={4.9} decimals={1} suffix="/5" />
              </span>
              <span className="mt-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Rating Review</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
