"use client";

import { useEffect, useState } from "react";

export default function HomeProgressChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="relative px-5 py-12 sm:py-16 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      
      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl group">
          {/* Hover glow effect */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-cyan-500/0 opacity-0 blur-xl transition-all duration-700 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-cyan-500/10 group-hover:opacity-100" />
          
          {/* Decorative Top Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

          <div className="mb-10 text-center relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-[-0.04em] drop-shadow-md">
              Nexarin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Terus Berkembang</span>
            </h2>
          </div>
          
          {/* Chart Container */}
          <div className="relative h-64 sm:h-80 w-full mt-4 flex items-end">
            
            {/* Y-axis labels - placed absolutely to the left of the chart area but inside the card */}
            <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 flex flex-col justify-between text-[10px] sm:text-xs font-black text-slate-500 z-20 pb-6 pt-1">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Main Graph Area */}
            <div className="relative ml-10 sm:ml-12 h-full w-full border-b border-l border-white/20 pb-6">
              
              <style>
                {`
                  .animated-line {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: drawLine 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  }
                  .animated-area {
                    opacity: 0;
                    animation: fadeArea 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  }
                  .animated-dot-container {
                    opacity: 0;
                    animation: showDot 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                  }
                  .animated-bar-1 { animation: growBar 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; animation-delay: 0.1s; }
                  .animated-bar-2 { animation: growBar 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; animation-delay: 0.3s; }
                  .animated-bar-3 { animation: growBar 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; animation-delay: 0.5s; }
                  .animated-bar-4 { animation: growBar 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; animation-delay: 0.7s; }
                  .animated-bar-5 { animation: growBar 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; animation-delay: 0.9s; }
                  
                  @keyframes growBar {
                    0% { transform: scaleY(0); opacity: 0; }
                    30% { transform: scaleY(1); opacity: 1; }
                    80% { transform: scaleY(1); opacity: 1; }
                    100% { transform: scaleY(0); opacity: 0; }
                  }
                  
                  @keyframes drawLine {
                    0% { stroke-dashoffset: 200; }
                    50% { stroke-dashoffset: 0; }
                    80% { stroke-dashoffset: 0; opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                  }
                  
                  @keyframes fadeArea {
                    0% { opacity: 0; }
                    30% { opacity: 0; }
                    50% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                  }
                  
                  @keyframes showDot {
                    0% { opacity: 0; transform: translateY(10px) scale(0.5); }
                    45% { opacity: 0; transform: translateY(5px) scale(0.8); }
                    50% { opacity: 1; transform: translateY(0) scale(1); }
                    80% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(0) scale(1); }
                  }
                  
                  @keyframes pulseDot {
                    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.8); }
                    50% { transform: scale(1.6); box-shadow: 0 0 0 12px rgba(34, 211, 238, 0); }
                    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
                  }
                `}
              </style>

              {/* 0. Grid lines (Behind all) */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[0%] w-full border-t border-white/5 border-dashed" />
                <div className="absolute top-[25%] w-full border-t border-white/5 border-dashed" />
                <div className="absolute top-[50%] w-full border-t border-white/5 border-dashed" />
                <div className="absolute top-[75%] w-full border-t border-white/5 border-dashed" />
                
                <div className="absolute left-[30%] h-full border-l border-white/5 border-dashed" />
                <div className="absolute left-[50%] h-full border-l border-white/5 border-dashed" />
                <div className="absolute left-[70%] h-full border-l border-white/5 border-dashed" />
              </div>

              {/* 1. Area Fill SVG (Behind Bars) */}
              <svg className="absolute inset-0 h-full w-full overflow-visible z-[5]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#34d399" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="animated-area" d="M 10,80 Q 20,72.5 30,65 T 50,45 T 70,25 T 90,5 L 90,100 L 10,100 Z" fill="url(#area-gradient)" />
              </svg>

              {/* 2. HTML Bars (In middle) */}
              <div className="absolute inset-0 z-10">
                <div className="absolute bottom-0 w-[8%] left-[6%] h-[20%] bg-gradient-to-t from-emerald-500/10 to-emerald-400/30 rounded-t-lg animated-bar-1 origin-bottom border-t border-emerald-400/40 backdrop-blur-sm" />
                <div className="absolute bottom-0 w-[8%] left-[26%] h-[35%] bg-gradient-to-t from-emerald-500/10 to-emerald-400/30 rounded-t-lg animated-bar-2 origin-bottom border-t border-emerald-400/40 backdrop-blur-sm" />
                <div className="absolute bottom-0 w-[8%] left-[46%] h-[55%] bg-gradient-to-t from-emerald-500/10 to-cyan-400/30 rounded-t-lg animated-bar-3 origin-bottom border-t border-cyan-400/40 backdrop-blur-sm" />
                <div className="absolute bottom-0 w-[8%] left-[66%] h-[75%] bg-gradient-to-t from-emerald-500/10 to-cyan-400/30 rounded-t-lg animated-bar-4 origin-bottom border-t border-cyan-400/40 backdrop-blur-sm" />
                <div className="absolute bottom-0 w-[8%] left-[86%] h-[95%] bg-gradient-to-t from-emerald-500/10 to-cyan-400/30 rounded-t-lg animated-bar-5 origin-bottom border-t border-cyan-400/40 backdrop-blur-sm" />
              </div>

              {/* 3. Line Chart SVG (In front) */}
              <svg className="absolute inset-0 h-full w-full overflow-visible z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path className="animated-line" d="M 10,80 Q 20,72.5 30,65 T 50,45 T 70,25 T 90,5" fill="none" stroke="url(#line-gradient)" strokeWidth="3" vectorEffect="non-scaling-stroke" filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* 4. Dots (Top layer) */}
              {/* Start dot */}
              <div className="absolute left-[10%] top-[80%] -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)] border border-emerald-200" />
              </div>
              
              {/* End dot */}
              <div className="absolute left-[90%] top-[5%] -translate-x-1/2 -translate-y-1/2 z-30 animated-dot-container">
                <div className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center">
                  <div className="absolute inline-flex h-full w-full rounded-full bg-cyan-400" style={{ animation: 'pulseDot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                  <div className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white shadow-lg" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
