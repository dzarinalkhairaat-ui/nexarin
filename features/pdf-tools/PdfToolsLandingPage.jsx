import Link from "next/link";
import { Network, Lock } from "lucide-react";
import Header from "@/components/shared/Header";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";

export default function PdfToolsLandingPage() {


  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-emerald-400/30">
      <Header />
      
      {/* Background Glow Effects (Synced with HomeHero/PortfolioHero) */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />
      
      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 px-4 mx-auto max-w-[1400px] pt-10 sm:pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300 shadow-lg shadow-emerald-400/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              PDF TOOLS
            </p>
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.5rem] mb-8">
            <span className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 ease-out fill-mode-both inline-block">
              Semua yang Anda butuhkan untuk <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">memproses PDF</span> di browser
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-300 sm:text-xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 ease-out fill-mode-both">
            100% Client-side. Aman, Pribadi, dan Sangat Cepat. Tanpa perlu mengunggah dokumen penting Anda ke server.
          </p>

          <div className="mt-10 flex justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 ease-out fill-mode-both">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 px-8 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg shadow-black/20"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Tools Grid (6 columns on extra large screens, 4 on large, 3 on md, 2 on sm) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {pdfTools.map((tool, idx) => {
            const isLocked = tool.isActive !== true;
            const CardWrapper = isLocked ? "div" : Link;
            return (
            <CardWrapper 
              href={isLocked ? undefined : `/pdf-tools/${tool.id}`} 
              key={tool.id}
              className={`group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-2xl p-5 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${
                isLocked 
                  ? "opacity-50 grayscale cursor-not-allowed" 
                  : "hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1 cursor-pointer"
              }`}
              style={{ animationDelay: `${(idx % 10) * 50}ms` }}
            >
              {isLocked && (
                <>
                  <div className="absolute inset-0 bg-slate-950/20 z-20 backdrop-blur-[1px] pointer-events-none" />
                  <div className="absolute top-4 right-4 z-30 opacity-50">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                </>
              )}
              {tool.isNew && !isLocked && (
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full z-10">
                  New!
                </span>
              )}
              
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${tool.bgColor} ${tool.color} transition-transform duration-300 ${!isLocked ? 'group-hover:scale-110' : ''}`}>
                <tool.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              
              <h3 className={`text-base font-bold text-white mb-2 leading-tight transition-colors ${!isLocked ? 'group-hover:text-emerald-400' : ''}`}>
                {tool.title}
              </h3>
              
              <p className="text-sm text-slate-400 line-clamp-3">
                {tool.description}
              </p>
            </CardWrapper>
            );
          })}
          
          {/* Create Workflow Card (Special Styling) */}
          <div 
            className="group relative flex flex-col bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-5 transition-all duration-300 overflow-hidden sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 animate-in fade-in slide-in-from-bottom-4 fill-mode-both opacity-50 grayscale cursor-not-allowed"
            style={{ animationDelay: `1600ms` }}
          >
            <div className="absolute inset-0 bg-slate-950/20 z-20 backdrop-blur-[1px] pointer-events-none" />
            <div className="absolute top-4 right-4 z-30 opacity-50">
               <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent pointer-events-none" />
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-pink-500/20 text-pink-400 transition-transform duration-300">
              <Network className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold text-white mb-2 leading-tight transition-colors">
              Create a workflow
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
              Create custom workflows with your favorite tools, automate tasks, and reuse them anytime.
            </p>
            <div className="mt-auto pt-4 flex items-center text-xs font-semibold text-pink-400 group-hover:text-pink-300">
              Create workflow <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
