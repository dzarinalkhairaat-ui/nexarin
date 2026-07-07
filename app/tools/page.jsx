"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import HomeFooter from "@/features/home/components/HomeFooter";
import { LockIcon, FileIcon, SparkleIcon, CategoryIcon, WriteIcon } from "@/components/shared/MenuIcons";

export default function NexarinToolsPage() {
  const tools = [
    {
      id: "pdf-tool",
      title: "Nexarin PDF Studio",
      description: "Suite lengkap bertenaga AI untuk mengonversi, mengompresi, mengenali teks (OCR), hingga mengekstrak formulir interaktif dari dokumen PDF Anda.",
      icon: <FileIcon className="h-5 w-5" />,
      href: "/pdf-tools",
      isLocked: false,
      color: "from-emerald-400 via-teal-500 to-emerald-600",
      shadow: "shadow-emerald-500/30",
      glow: "group-hover:shadow-[0_0_40px_rgba(52,211,153,0.4)]",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "voice-tool",
      title: "Nexarin Voice Studio",
      description: "Layanan Text-to-Speech (TTS) berbasis Neural AI untuk konversi teks ke audio dengan kualitas suara yang natural dan responsif.",
      icon: <SparkleIcon className="h-5 w-5" />,
      href: "/voice-studio",
      isLocked: false,
      color: "from-violet-400 via-purple-500 to-violet-600",
      shadow: "shadow-violet-500/30",
      glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]",
      bgImage: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "audio-tool",
      title: "Neural Audio Lab",
      description: "Isolasi vokal studio, ubah teks menjadi suara hiper-realistis, dan ciptakan musik latar orisinal menggunakan kecerdasan buatan.",
      icon: <CategoryIcon className="h-5 w-5" />,
      href: "#",
      isLocked: true,
      color: "from-slate-700 to-slate-900",
      shadow: "shadow-black/40",
      glow: "",
      bgImage: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "video-tool",
      title: "Cinematic AI Engine",
      description: "Pemotong klip otomatis, penambahan subtitle dinamis multibahasa, hingga upscale kualitas video lawas menjadi HD sebening kristal.",
      icon: <WriteIcon className="h-5 w-5" />,
      href: "#",
      isLocked: true,
      color: "from-slate-700 to-slate-900",
      shadow: "shadow-black/40",
      glow: "",
      bgImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <main className="relative min-h-screen bg-slate-950 font-sans overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
      <Header />
      
      {/* Background Ornaments (Style News) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="absolute -right-16 top-10 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:top-14 sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 lg:py-16 sm:px-6 lg:px-8 flex-grow">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20 animate-in slide-in-from-bottom-5 duration-1000 fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-black text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.15)] mb-6 backdrop-blur-md">
            <SparkleIcon className="h-4 w-4 animate-pulse" />
            <span className="tracking-wide uppercase">Ekosistem Digital Nexarin</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
            Supercharge <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-lg">Produktivitas</span> Anda.
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-medium">
            Koleksi alat cerdas karya eksklusif Founder Nexarin by-rins kelas enterprise yang dirancang khusus untuk memangkas waktu kerja Anda dari hitungan jam menjadi hitungan detik.
          </p>
        </div>

        {/* Premium Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto pb-12">
          {tools.map((tool, index) => {
            if (tool.isLocked) {
              return (
                <div 
                  key={tool.id}
                  className="group relative flex flex-col rounded-[2rem] border border-white/5 bg-slate-900 p-8 shadow-2xl backdrop-blur-xl cursor-not-allowed overflow-hidden animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${(index + 1) * 200}ms`, animationFillMode: "both" }}
                >
                  {/* Card Background Image (Locked) */}
                  <div 
                    className="absolute inset-0 z-0 opacity-10 transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${tool.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

                  {/* Nexarin Logo Watermark */}
                  <img
                    src="/images/logo/nexarin-logo.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute -right-8 -bottom-8 z-0 h-40 w-40 rotate-12 object-contain opacity-[0.03] transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg]"
                    loading="lazy"
                  />

                  {/* Lock Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[6px]">
                    <div className="flex flex-col items-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-600/50 bg-slate-800/80 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <LockIcon className="h-8 w-8 text-slate-300" />
                      </div>
                      <span className="text-sm font-black text-slate-300 tracking-[0.2em] uppercase bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-700/50">Tahap Pengembangan</span>
                    </div>
                  </div>

                  <div className="relative z-10 opacity-30 grayscale transition-all duration-500 group-hover:blur-sm group-hover:scale-95 flex-1">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-400/20 bg-slate-400/10 text-slate-300 shadow-lg shadow-slate-400/5">
                        {tool.icon}
                      </div>
                      <div className="flex h-7 items-center rounded-full border border-slate-400/40 bg-slate-400/15 px-3 text-[10px] font-black text-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.1)] backdrop-blur-md">
                        SOON
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 tracking-tight">{tool.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{tool.description}</p>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/5 pt-5 opacity-30 grayscale transition-all duration-500 group-hover:blur-sm group-hover:scale-95">
                    <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">
                      Tahap Pengembangan
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/5 text-slate-400">
                      <LockIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative flex flex-col rounded-[2rem] border border-white/10 bg-slate-900 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:shadow-[0_0_40px_rgba(52,211,153,0.15)] ${tool.glow} overflow-hidden animate-in fade-in slide-in-from-bottom-8`}
                style={{ animationDelay: `${(index + 1) * 200}ms`, animationFillMode: "both" }}
              >
                {/* Card Background Image (Unlocked) */}
                <div 
                  className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity transition-transform duration-700 group-hover:scale-110 group-hover:opacity-30"
                  style={{ backgroundImage: `url(${tool.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950/95 transition-opacity duration-500 group-hover:opacity-80" />

                {/* Nexarin Logo Watermark */}
                <img
                  src="/images/logo/nexarin-logo.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute -right-8 -bottom-8 z-0 h-40 w-40 rotate-12 object-contain opacity-[0.04] transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg] group-hover:opacity-[0.08]"
                  loading="lazy"
                />

                {/* Premium Hover Glow Background */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-20 flex-1">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-400/5 transition-transform duration-500 group-hover:scale-110 group-hover:bg-emerald-400/20">
                      {tool.icon}
                    </div>
                    <div className="flex h-7 items-center rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 text-[10px] font-black text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)] backdrop-blur-md">
                      <span className="relative flex h-1.5 w-1.5 mr-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      LIVE NOW
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight transition-colors duration-300 group-hover:text-emerald-300">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium transition-colors duration-300 group-hover:text-white">
                    {tool.description}
                  </p>
                </div>

                <div className="relative z-20 mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                    Buka Tools
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-emerald-400 transition-all duration-300 group-hover:bg-emerald-400 group-hover:text-slate-950 group-hover:border-emerald-400 group-hover:scale-110">
                    <svg className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <HomeFooter />
    </main>
  );
}
