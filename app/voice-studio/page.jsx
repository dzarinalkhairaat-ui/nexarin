"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/shared/Header";
import HomeFooter from "@/features/home/components/HomeFooter";
import { SparkleIcon } from "@/components/shared/MenuIcons";
import { Play, Loader2, Download, Volume2, Settings2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VoiceStudioPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("id-ID-ArdiNeural");
  const [voices, setVoices] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);

  useEffect(() => {
    fetch("/api/voice-studio")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVoices(data.filter(v => v.Locale.startsWith("id") || v.Locale.startsWith("en")));
        }
      })
      .catch(err => console.error("Failed to fetch voices:", err));
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Mohon masukkan teks terlebih dahulu.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);
    
    try {
      const response = await fetch("/api/voice-studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Terjadi kesalahan saat proses generasi suara.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 font-sans overflow-hidden selection:bg-violet-500/30 selection:text-violet-200 flex flex-col">
      <Header />
      
      {/* Background Ornaments */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-12 lg:py-20 sm:px-6 lg:px-8 flex-grow flex flex-col">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-in slide-in-from-bottom-5 duration-1000 fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-bold text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.15)] mb-6 backdrop-blur-md">
            <SparkleIcon className="h-4 w-4 animate-pulse" />
            <span className="tracking-wide uppercase">Neural Engine Aktif</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6 leading-tight">
            Nexarin <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 drop-shadow-lg">Voice Studio</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-medium mb-8">
            Ubah teks Anda menjadi suara hiper-realistis dengan teknologi Neural AI. Sempurna untuk voice-over, presentasi, dan konten digital.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-white transition-all duration-300 font-medium group backdrop-blur-md shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Tools
            </Link>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto flex-grow h-full items-start">
          
          {/* Editor Panel (Left/Main) */}
          <div className="lg:col-span-2 flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-violet-400" />
                    Teks Skrip
                  </h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-white/5">
                    Maks. 5000 karakter
                  </span>
                </div>
                
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ketik teks yang ingin Anda ubah menjadi suara di sini..."
                  className="w-full h-64 bg-slate-950/50 border border-white/10 rounded-2xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none font-medium leading-relaxed"
                />

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-red-500/20 items-center justify-center font-bold text-red-400">!</span>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings Panel (Right) */}
          <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 flex flex-col gap-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <Settings2 className="h-5 w-5 text-fuchsia-400" />
                  Pengaturan Suara
                </h2>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Profil Suara</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all cursor-pointer font-medium appearance-none"
                  >
                    <option value="id-ID-ArdiNeural">Ardi (Indonesia - Pria)</option>
                    <option value="id-ID-GadisNeural">Gadis (Indonesia - Wanita)</option>
                    <option value="en-US-ChristopherNeural">Christopher (Inggris - Pria)</option>
                    <option value="en-US-JennyNeural">Jenny (Inggris - Wanita)</option>
                    {voices.filter(v => !["id-ID-ArdiNeural", "id-ID-GadisNeural", "en-US-ChristopherNeural", "en-US-JennyNeural"].includes(v.ShortName)).map(v => (
                      <option key={v.ShortName} value={v.ShortName}>
                        {v.FriendlyName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !text.trim()}
                  className="mt-4 w-full relative group/btn flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-4 px-6 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 fill-current" />
                        Generate Suara
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Result Player Panel */}
            {audioUrl && (
              <div className="rounded-[2rem] border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 shadow-[0_0_30px_rgba(52,211,153,0.1)] backdrop-blur-xl animate-in zoom-in-95 duration-500">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Hasil Audio</h3>
                    <div className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    controls
                    src={audioUrl}
                    className="w-full h-12 rounded-lg bg-slate-900 border border-white/5"
                    autoPlay
                  />

                  <a
                    href={audioUrl}
                    download={`nexarin-voice-${Date.now()}.mp3`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-white/10 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-800 hover:border-white/20 transition-all mt-2"
                  >
                    <Download className="h-4 w-4" />
                    Download MP3
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <HomeFooter />
    </main>
  );
}
