"use client";

import React, { useState, useEffect, useRef } from "react";
import { SocialMediaIcon, SuccessIcon, ErrorIcon } from "@/components/shared/MenuIcons";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { 
  getPublishedArticlesForSocialMedia, 
  generateSocialMediaCaption,
  getGeneratedSocialMediaCaptions,
  deleteSocialMediaCaption,
  generateTemporarySocialMediaCaption,
  updateSocialMediaCaption,
  toggleSocialMediaCaptionPostedAction
} from "./adminSocialMedia.actions";

const PLATFORMS = [
  "FACEBOOK",
  "INSTAGRAM",
  "TWITTER",
  "TIKTOK",
  "LINKEDIN"
];

const PLATFORM_ICONS = [
  { id: "FACEBOOK", icon: "https://cdn.simpleicons.org/facebook/1877F2" },
  { id: "INSTAGRAM", icon: "https://cdn.simpleicons.org/instagram/E4405F" },
  { id: "TWITTER", icon: "https://cdn.simpleicons.org/x/ffffff" },
  { id: "TIKTOK", icon: "https://cdn.simpleicons.org/tiktok/ffffff" },
  { id: "LINKEDIN", icon: "https://api.iconify.design/mdi:linkedin.svg?color=%230A66C2" }
];

function getPlatformBadgeColor(platform) {
  switch(platform) {
    case "FACEBOOK": return "bg-blue-600/20 text-blue-400 border-blue-600/30";
    case "INSTAGRAM": return "bg-pink-600/20 text-pink-400 border-pink-600/30";
    case "TWITTER": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
    case "TIKTOK": return "bg-slate-800/80 text-slate-300 border-slate-700";
    case "LINKEDIN": return "bg-blue-800/30 text-blue-300 border-blue-800/50";
    default: return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
  }
}

export default function AdminNewsSocialMediaClient() {
  const [articles, setArticles] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  const [selectedPlatform, setSelectedPlatform] = useState("FACEBOOK");
  const [selectedArticleId, setSelectedArticleId] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [isProcessingTable, setIsProcessingTable] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [regenerateMode, setRegenerateMode] = useState({ active: false, captionId: null, articleId: null, platform: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", isError: false });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, captionText: "", platform: "", articleTitle: "", articleSlug: "", sourceUrl: "", sourceName: "" });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setIsLoadingInitial(true);
    const [resArticles, resCaptions] = await Promise.all([
      getPublishedArticlesForSocialMedia(),
      getGeneratedSocialMediaCaptions()
    ]);
    
    if (resArticles.ok) {
      setArticles(resArticles.data);
    }
    if (resCaptions.ok) {
      setCaptions(resCaptions.data);
    }
    setIsLoadingInitial(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter artikel yang BELUM memiliki caption untuk platform yang dipilih
  const filteredArticles = articles.filter(
    a => !a.socialCaptions?.some(c => c.platform === selectedPlatform)
  );

  const selectedArticle = filteredArticles.find(a => a.id === selectedArticleId);
  const selectedArticleLink = selectedArticle ? `https://nexarin.my.id/news/artikel/${selectedArticle.slug}` : "";
  const selectedArticleSourceUrl = selectedArticle?.sourceUrl || "";

  // Set default article selection when platform changes or articles change
  useEffect(() => {
    if (filteredArticles.length > 0) {
      // Hanya reset jika selectedArticleId tidak ada di filteredArticles
      if (selectedArticleId && !filteredArticles.find(a => a.id === selectedArticleId)) {
        setSelectedArticleId("");
      }
    } else {
      setSelectedArticleId("");
    }
  }, [selectedPlatform, articles]); // dependensi dipersempit agar tidak loop

  const handleGenerate = async () => {
    if (!selectedArticleId) {
      setAlertModal({ isOpen: true, message: "Pilih artikel terlebih dahulu.", isError: true });
      return;
    }
    if (!selectedPlatform) {
      setAlertModal({ isOpen: true, message: "Pilih platform terlebih dahulu.", isError: true });
      return;
    }

    setIsGenerating(true);
    setGeneratedCaption("");
    setCopied(false);
    setGenerateProgress(0);

    const interval = setInterval(() => {
      setGenerateProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 500);

    const res = await generateSocialMediaCaption(selectedArticleId, selectedPlatform);
    
    clearInterval(interval);
    setGenerateProgress(100);

    setTimeout(async () => {
      setIsGenerating(false);
      setGenerateProgress(0);

      if (res.ok) {
        setGeneratedCaption(res.caption);
        // Refresh data to update dropdown and table
        await fetchData();
      } else {
        setAlertModal({ isOpen: true, message: res.message, isError: true });
      }
    }, 500);
  };

  const handleCopy = () => {
    if (generatedCaption) {
      navigator.clipboard.writeText(generatedCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [statusEdits, setStatusEdits] = useState({});

  const handleStatusChange = (id, val) => {
    setStatusEdits(prev => ({ ...prev, [id]: val }));
  };

  const handleSaveStatus = async (id) => {
    const newStatus = statusEdits[id];
    if (newStatus === undefined) return;

    setIsProcessingTable(true);
    const result = await toggleSocialMediaCaptionPostedAction(id, newStatus === 'true');
    if (result.ok) {
      setCaptions(prev => prev.map(c => c.id === id ? { ...c, isPosted: newStatus === 'true' } : c));
      setAlertModal({ isOpen: true, message: result.message, isError: false });
      setStatusEdits(prev => { const next = { ...prev }; delete next[id]; return next; });
    } else {
      setAlertModal({ isOpen: true, message: result.message, isError: true });
    }
    setIsProcessingTable(false);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Caption",
      message: "Apakah Anda yakin ingin menghapus caption ini secara permanen? Data yang dihapus tidak dapat dikembalikan.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setIsProcessingTable(true);
        const res = await deleteSocialMediaCaption(id);
        setIsProcessingTable(false);
        
        if (res.ok) {
          await fetchData();
          if (!regenerateMode.active) setGeneratedCaption("");
        } else {
          setAlertModal({ isOpen: true, message: res.message, isError: true });
        }
      }
    });
  };

  const openRegenerateMode = (captionItem) => {
    setRegenerateMode({
      active: true,
      captionId: captionItem.id,
      articleId: captionItem.articleId,
      platform: captionItem.platform
    });
    setGeneratedCaption(""); // bersihkan hasil sebelumnya
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto trigger generate first draft
    handleRunRegenerate(captionItem.articleId, captionItem.platform);
  };

  const handleRunRegenerate = async (artId, plat) => {
    setIsGenerating(true);
    setGeneratedCaption("");
    setCopied(false);
    setGenerateProgress(0);

    const interval = setInterval(() => {
      setGenerateProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 500);

    const res = await generateTemporarySocialMediaCaption(artId, plat);
    
    clearInterval(interval);
    setGenerateProgress(100);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerateProgress(0);

      if (res.ok) {
        setGeneratedCaption(res.caption);
      } else {
        setAlertModal({ isOpen: true, message: res.message, isError: true });
      }
    }, 500);
  };

  const handleSelectRegeneratedCaption = () => {
    if (!generatedCaption) return;
    
    setConfirmModal({
      isOpen: true,
      title: "Pilih Caption",
      message: "Apakah Anda yakin ingin menggunakan draft ini? Draft lama akan digantikan dengan yang baru.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setIsGenerating(true); // pinjam state loading
        
        const res = await updateSocialMediaCaption(regenerateMode.captionId, generatedCaption);
        
        setIsGenerating(false);
        if (res.ok) {
          await fetchData();
          setAlertModal({ isOpen: true, message: res.message, isError: false });
          // Exit mode regenerate
          setRegenerateMode({ active: false, captionId: null, articleId: null, platform: null });
          setGeneratedCaption("");
        } else {
          setAlertModal({ isOpen: true, message: res.message, isError: true });
        }
      }
    });
  };

  const handleCancelRegenerate = () => {
    setRegenerateMode({ active: false, captionId: null, articleId: null, platform: null });
    setGeneratedCaption("");
  };

  const handleRefresh = () => {
    setRegenerateMode({ active: false, captionId: null, articleId: null, platform: null });
    setGeneratedCaption("");
    setCopied(false);
    fetchData();
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="mt-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
          Social Media Generator
        </p>
        <h1 className="mx-auto mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          AI Auto-Caption
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-400">
          Buat caption menarik untuk berbagai platform Social Media secara instan. Sistem menggunakan model AI untuk merangkum artikel Published dan membuat copywriting lengkap dengan CTA & Hashtag.
        </p>
        
        <button 
          onClick={handleRefresh}
          className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
        >
          Bersihkan / Muat Ulang Halaman
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mb-10">
        {/* Kolom Kiri: Form */}
        <div className={`relative z-20 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl transition-opacity duration-300 ${regenerateMode.active ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-emerald-400"></span>
            Pengaturan Generate Baru
          </h2>

          {isLoadingInitial ? (
            <div className="flex flex-col items-center justify-center py-10 text-emerald-400">
              <LoadingSpinner className="h-8 w-8 mb-3" />
              <p className="text-sm font-bold">Memuat data artikel...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  1. Pilih Platform
                </label>
                <div className="flex flex-wrap gap-3 rounded-[24px] border border-white/10 bg-white/[0.04] p-3 shadow-lg shadow-black/10 backdrop-blur-xl">
                  {PLATFORM_ICONS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      disabled={p.id !== "FACEBOOK"}
                      title={p.id !== "FACEBOOK" ? `${p.id} (Segera Hadir)` : `Pilih ${p.id}`}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border p-2.5 shadow-lg shadow-black/20 transition ${
                        p.id !== "FACEBOOK" 
                          ? 'opacity-40 cursor-not-allowed border-slate-700 bg-slate-900 grayscale'
                          : selectedPlatform === p.id 
                            ? 'border-emerald-400 bg-emerald-400/20 shadow-emerald-400/10 hover:-translate-y-0.5' 
                            : 'border-cyan-300/15 bg-slate-950/60 hover:border-cyan-300/35 hover:bg-cyan-400/10 hover:-translate-y-0.5'
                      }`}
                    >
                      <img src={p.icon} alt={p.id} className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  2. Pilih Artikel (Belum Memiliki Caption {selectedPlatform})
                </label>
                {filteredArticles.length === 0 ? (
                  <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-5 text-sm font-semibold text-blue-300 text-center">
                    Semua artikel sudah dibuatkan caption untuk platform {selectedPlatform}, atau tidak ada artikel.
                  </div>
                ) : (
                  <div className="relative group" ref={dropdownRef}>
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full rounded-2xl border ${isDropdownOpen ? 'border-emerald-400 bg-slate-900 ring-2 ring-emerald-400/30' : 'border-white/10 bg-slate-950/80 hover:border-white/20 hover:bg-slate-900'} px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-black/20 backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between`}
                    >
                      <span className={!selectedArticleId ? "text-slate-500" : "text-white line-clamp-1 pr-4"}>
                        {selectedArticleId ? selectedArticle?.title : "Pilih Artikel Untuk Membuat Caption"}
                      </span>
                      <div className={`flex items-center text-emerald-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}>
                        <svg className="h-5 w-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className={`absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl transition-all duration-300 origin-top ${isDropdownOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
                      <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-2 space-y-1">
                        {filteredArticles.length === 0 ? (
                           <div className="px-4 py-3 text-sm font-medium text-slate-500 text-center">Tidak ada artikel tersedia.</div>
                        ) : (
                          filteredArticles.map(a => (
                            <div 
                              key={a.id}
                              onClick={() => {
                                setSelectedArticleId(a.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all cursor-pointer ${selectedArticleId === a.id ? 'bg-emerald-400/10 text-emerald-400 font-bold' : 'text-slate-300 hover:bg-white/5 hover:text-white hover:pl-5'}`}
                            >
                              <div className={`h-2 w-2 rounded-full shrink-0 transition-all ${selectedArticleId === a.id ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-100' : 'bg-transparent scale-0'}`}></div>
                              <span className="line-clamp-2">{a.title}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedArticle && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4 shadow-lg backdrop-blur-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-300 mb-2">Link Artikel Nexarin</p>
                      <div className="flex items-center gap-3">
                        <input 
                          readOnly 
                          value={selectedArticleLink}
                          className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-400 focus:outline-none"
                        />
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedArticleLink);
                            setAlertModal({ isOpen: true, message: "Link artikel berhasil disalin!", isError: false });
                          }}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 transition"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    {selectedArticleSourceUrl && (
                      <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4 shadow-lg backdrop-blur-xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-300 mb-2">Link Sumber Asli ({selectedArticle.sourceName})</p>
                        <div className="flex items-center gap-3">
                          <input 
                            readOnly 
                            value={selectedArticleSourceUrl}
                            className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-400 focus:outline-none"
                          />
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(selectedArticleSourceUrl);
                              setAlertModal({ isOpen: true, message: "Link sumber berhasil disalin!", isError: false });
                            }}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 transition"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || filteredArticles.length === 0}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex h-full w-full items-center justify-center gap-3 rounded-2xl bg-slate-950/20 px-4 py-4 backdrop-blur-sm transition-colors group-hover:bg-transparent">
                    {isGenerating ? (
                      <><LoadingSpinner className="h-5 w-5 border-slate-950" /> <span className="font-black text-slate-950">Sedang Menulis...</span></>
                    ) : (
                      <>
                        <svg className="h-5 w-5 text-emerald-100 group-hover:animate-bounce" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3V5M12.5 4L11 5.5M16 11H18M15 12.5L16.5 14M8 20L9.5 18.5M3 11H5M4.5 12.5L6 14M5 7L19 21M7 5L21 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="font-black tracking-wide text-white group-hover:text-slate-950 drop-shadow-md">GENERATE CAPTION AI</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Hasil Generate / Regenerate */}
        <div className={`relative z-10 rounded-3xl border ${regenerateMode.active ? 'border-amber-400/30 bg-amber-400/[0.03] shadow-amber-400/10' : 'border-white/10 bg-white/[0.03]'} p-6 shadow-xl backdrop-blur-xl flex flex-col transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className={`h-6 w-1 rounded-full ${regenerateMode.active ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
              {regenerateMode.active ? "Regenerate Caption" : "Hasil Generate"}
            </h2>
            {generatedCaption && !regenerateMode.active && (
              <button 
                onClick={handleCopy}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
              >
                {copied ? "Tersalin!" : "Copy"}
              </button>
            )}
          </div>

          <div className={`flex-1 rounded-2xl border ${regenerateMode.active ? 'border-amber-400/15 bg-slate-950/80' : 'border-white/10 bg-slate-950'} p-4 relative overflow-hidden`}>
            {isGenerating ? (
              <div className={`flex h-full flex-col items-center justify-center min-h-[250px] space-y-4 ${regenerateMode.active ? 'text-amber-400' : 'text-cyan-400'}`}>
                <LoadingSpinner className="h-10 w-10 animate-spin" />
                <p className={`text-sm font-bold uppercase tracking-widest ${regenerateMode.active ? 'text-amber-400/70' : 'text-cyan-400/70'}`}>
                  AI Sedang Menulis... {generateProgress}%
                </p>
                <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-300 ease-out ${regenerateMode.active ? 'bg-amber-400' : 'bg-cyan-400'}`}
                    style={{ width: `${generateProgress}%` }}
                  />
                </div>
              </div>
            ) : generatedCaption ? (
              <textarea 
                readOnly
                value={generatedCaption}
                className={`h-full w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-h-[250px] ${regenerateMode.active ? 'text-amber-100' : 'text-slate-300'}`}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-500 min-h-[250px] text-center">
                <p className="text-sm font-semibold">
                  {regenerateMode.active 
                    ? "Menyiapkan draft baru untuk platform " + regenerateMode.platform 
                    : "Hasil AI yang baru di-generate akan muncul di sini."}
                </p>
              </div>
            )}
          </div>
          
          {/* Action Buttons for Regenerate Mode */}
          {regenerateMode.active && (
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={handleCancelRegenerate}
                className="w-full sm:w-auto sm:mr-auto rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black tracking-wide text-white transition hover:bg-white/10"
              >
                Batal
              </button>
              <button
                onClick={() => handleRunRegenerate(regenerateMode.articleId, regenerateMode.platform)}
                disabled={isGenerating}
                className="w-full sm:w-auto rounded-xl bg-amber-500/10 border border-amber-500/20 px-5 py-3 text-xs font-black tracking-wide text-amber-400 transition hover:bg-amber-500/20 disabled:opacity-50 whitespace-nowrap"
              >
                Generate Ulang
              </button>
              <button
                onClick={handleSelectRegeneratedCaption}
                disabled={isGenerating || !generatedCaption}
                className="w-full sm:w-auto rounded-xl bg-amber-400 px-5 py-3 text-xs font-black tracking-wide text-slate-950 transition hover:bg-amber-300 disabled:opacity-50 shadow-lg shadow-amber-400/20 whitespace-nowrap"
              >
                Pilih Caption
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabel Manajemen Caption */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-violet-400"></span>
          Daftar Caption yang Sudah Dibuat
        </h2>

        {isLoadingInitial || isProcessingTable ? (
           <div className="flex flex-col items-center justify-center py-10 text-violet-400">
             <LoadingSpinner className="h-8 w-8 mb-3" />
             <p className="text-sm font-bold">{isProcessingTable ? "Memproses Data..." : "Memuat data tabel..."}</p>
           </div>
        ) : captions.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">
            Belum ada satupun caption yang di-generate.
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Platform</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Artikel</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Preview Caption</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">Tanggal</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 text-center">Status</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {captions.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${getPlatformBadgeColor(c.platform)}`}>
                        {c.platform}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-[200px]">
                      <p className="line-clamp-2 text-sm font-black leading-5 text-white">{c.article.title}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-500">/{c.article.slug}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div 
                        onClick={() => setPreviewModal({ isOpen: true, captionText: c.caption, platform: c.platform, articleTitle: c.article.title, articleSlug: c.article.slug, sourceUrl: c.article.sourceUrl, sourceName: c.article.sourceName })}
                        className="group/preview cursor-pointer rounded-xl border border-transparent p-2 transition-all hover:border-white/10 hover:bg-white/5"
                        title="Klik untuk melihat teks lengkap"
                      >
                        <div className="text-xs font-medium leading-relaxed text-slate-400 line-clamp-3 group-hover/preview:text-slate-300">
                          {c.caption}
                        </div>
                        <div className="mt-2 text-[10px] font-bold tracking-widest text-emerald-400/0 transition-colors group-hover/preview:text-emerald-400 flex items-center gap-1 uppercase">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          Lihat Detail
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4 text-center align-middle">
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <select
                          value={statusEdits[c.id] !== undefined ? statusEdits[c.id] : (c.isPosted ? 'true' : 'false')}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          disabled={isProcessingTable}
                          className="w-24 bg-slate-900 border border-white/10 text-slate-300 text-[11px] font-medium rounded-lg px-2 py-1.5 outline-none focus:border-violet-500 transition-colors disabled:opacity-50"
                        >
                          <option value="false">Draft</option>
                          <option value="true">Di-Post</option>
                        </select>
                        
                        {statusEdits[c.id] !== undefined && statusEdits[c.id] !== (c.isPosted ? 'true' : 'false') && (
                          <button
                            onClick={() => handleSaveStatus(c.id)}
                            disabled={isProcessingTable}
                            className="w-24 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold py-1.5 px-2 hover:bg-emerald-500/20 transition disabled:opacity-50 shadow-sm flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            Simpan
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <div className="flex flex-col items-end justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openRegenerateMode(c)}
                          disabled={isProcessingTable || regenerateMode.active}
                          className="w-24 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2 py-1.5 text-[11px] font-bold text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition disabled:opacity-50 text-center"
                        >
                          Regenerate
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
                          disabled={isProcessingTable}
                          className="w-24 rounded-lg bg-red-500/10 border border-red-500/20 px-2 py-1.5 text-[11px] font-bold text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition disabled:opacity-50 text-center"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl transform transition-all scale-100">
            <h3 className="mb-2 text-xl font-black text-white">{confirmModal.title}</h3>
            <p className="mb-6 text-sm font-medium leading-relaxed text-slate-400">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
              >
                Batal
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`rounded-xl px-4 py-2.5 text-xs font-black text-slate-950 transition ${
                  confirmModal.title.includes("Hapus") 
                    ? "bg-red-400 hover:bg-red-300" 
                    : "bg-emerald-400 hover:bg-emerald-300"
                }`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Caption Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 shadow-2xl transform transition-all flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h3 className="text-lg font-black text-white mb-1">Detail Caption</h3>
                <p className="text-xs font-medium text-slate-400">
                  <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${getPlatformBadgeColor(previewModal.platform)} mr-2`}>
                    {previewModal.platform}
                  </span>
                  {previewModal.articleTitle}
                </p>
              </div>
              <button 
                onClick={() => setPreviewModal({ isOpen: false, captionText: "", platform: "", articleTitle: "" })}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-4">
              <textarea 
                readOnly
                value={previewModal.captionText}
                className="w-full min-h-[250px] resize-none bg-transparent text-sm leading-relaxed text-slate-300 focus:outline-none"
              />
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4 shadow-lg backdrop-blur-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-300 mb-2">Link Artikel Nexarin</p>
                  <div className="flex items-center gap-3">
                    <input 
                      readOnly 
                      value={`https://nexarin.my.id/news/artikel/${previewModal.articleSlug}`}
                      className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-400 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://nexarin.my.id/news/artikel/${previewModal.articleSlug}`);
                        setAlertModal({ isOpen: true, message: "Link artikel berhasil disalin!", isError: false });
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                {previewModal.sourceUrl && (
                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4 shadow-lg backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-300 mb-2">Link Sumber Asli ({previewModal.sourceName})</p>
                    <div className="flex items-center gap-3">
                      <input 
                        readOnly 
                        value={previewModal.sourceUrl}
                        className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-400 focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(previewModal.sourceUrl);
                          setAlertModal({ isOpen: true, message: "Link sumber berhasil disalin!", isError: false });
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-4 bg-white/[0.02] flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewModal.captionText);
                  setAlertModal({ isOpen: true, message: "Caption berhasil disalin ke clipboard!", isError: false });
                }}
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-2.5 text-xs font-bold text-cyan-400 transition hover:bg-cyan-400/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copy Caption
              </button>
              <button
                onClick={() => setPreviewModal({ isOpen: false, captionText: "", platform: "", articleTitle: "", articleSlug: "", sourceUrl: "", sourceName: "" })}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-center transform transition-all">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${alertModal.isError ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'} mb-4`}>
              {alertModal.isError ? <ErrorIcon className="h-6 w-6" /> : <SuccessIcon className="h-6 w-6" />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{alertModal.isError ? 'Pemberitahuan' : 'Berhasil'}</h3>
            <p className="text-sm text-slate-400 mb-6">{alertModal.message}</p>
            <button 
              onClick={() => setAlertModal({ isOpen: false, message: "", isError: false })}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
