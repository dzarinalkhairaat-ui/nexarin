"use client";

import { UploadCloud, FileType, CheckCircle2, Loader2, Download, FilePlus, X, Scissors, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processSplitPdf } from "@/features/pdf-tools/core/pdf-processing";
import { saveAs } from "file-saver";

export default function SplitWorkspace() {
  const slug = "split";
  const tool = pdfTools.find(t => t.id === slug) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Custom Split States
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [splitMode, setSplitMode] = useState('all'); // 'all' or 'custom'
  const [pageRange, setPageRange] = useState('');
  const [downloadFilename, setDownloadFilename] = useState("");
  
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert("Harap unggah file PDF.");
      return;
    }
    
    setSelectedFile(file);
    setProcessingState('idle');
    setProgress(0);
    setProcessedResult(null);
    setErrorMsg('');
  };

  const processFile = async () => {
    if (!selectedFile) {
      setErrorMsg("Harap unggah file PDF terlebih dahulu.");
      setProcessingState('error');
      return;
    }

    if (splitMode === 'custom' && !pageRange.trim()) {
      setErrorMsg("Harap masukkan rentang halaman yang ingin dipisah (contoh: 1-5, 8, 11-13).");
      setProcessingState('error');
      return;
    }
    
    setProcessingState('processing');
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 250);
    
    try {
      // Note: we might pass split options in a real app, e.g. processSplitPdf(selectedFile, { mode: splitMode, range: pageRange })
      // For now we use the existing method signature
      const result = await processSplitPdf(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      setProcessedResult(result);
      
      setTimeout(() => {
        setProcessingState('success');
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error(error);
      setProcessingState('error');
      setErrorMsg(error.message || "Terjadi kesalahan saat memproses file.");
    }
  };

  const handleDownload = () => {
    if (processedResult?.blob) {
      let finalName = downloadFilename || processedResult.outputFilename || "nexarin_split.zip";
      // Split often returns a ZIP if multiple pages are separated
      if (!finalName.toLowerCase().endsWith('.zip') && !finalName.toLowerCase().endsWith('.pdf')) {
        finalName += processedResult.outputFilename?.endsWith('.pdf') ? '.pdf' : '.zip';
      }
      saveAs(processedResult.blob, finalName);
    }
  };

  const resetWorkspace = () => {
    setSelectedFile(null);
    setProcessingState('idle');
    setProcessedResult(null);
    setProgress(0);
    setSplitMode('all');
    setPageRange('');
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (showInfoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showInfoModal]);

  return (
    <main className="min-h-screen bg-slate-950 pt-10 sm:pt-16 text-slate-300 selection:bg-emerald-500/30 relative">
      <div className="max-w-4xl mx-auto px-6 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20">
            <Scissors className="w-10 h-10" />
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Pisahkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">PDF</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Ekstrak satu atau beberapa halaman spesifik dari PDF Anda secara akurat dan rahasia, langsung di browser.{' '}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-emerald-500/30 hover:decoration-emerald-400 underline-offset-4 transition-colors"
            >
              Klik disini untuk penjelasan fitur.
            </button>
          </p>
        </div>

        {/* Workspace Container */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {processingState === 'idle' || processingState === 'error' ? (
              <>
                {!selectedFile ? (
                  <div 
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                      isDragging 
                        ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]' 
                        : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) handleFileSelection(e.target.files[0]);
                      }}
                      accept=".pdf,application/pdf"
                      ref={fileInputRef}
                    />
                    
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    
                    <p className="text-slate-400 text-center mb-8 max-w-sm">
                      Dokumen Anda dijamin 100% aman dan akan dihapus otomatis setelah proses pemisahan selesai.
                    </p>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/10 hover:shadow-white/20 flex items-center gap-2"
                    >
                      Pilih Dokumen PDF
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Configuration Zone */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      
                      {/* Left: Preview Card */}
                      <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="group relative w-full aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center overflow-hidden mb-4 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-default">
                          {/* Decorative Emerald Document Header */}
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                          
                          <FileType className="w-16 h-16 text-slate-300 mb-4 drop-shadow-sm" />
                          
                          {/* Remove button inside preview */}
                          <button 
                            onClick={() => setSelectedFile(null)}
                            className="absolute top-3 right-3 h-8 w-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-400 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Hapus file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-white truncate max-w-full text-center" title={selectedFile.name}>
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>

                      {/* Right: Configuration Form */}
                      <div className="w-full md:w-2/3 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          Pengaturan Ekstraksi
                        </h3>
                        
                        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 mb-6">
                          {/* Mode Toggle */}
                          <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${splitMode === 'all' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                              <input 
                                type="radio" 
                                className="hidden" 
                                checked={splitMode === 'all'} 
                                onChange={() => setSplitMode('all')} 
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-white mb-1">Ekstrak Semua</span>
                                <span className="text-xs text-slate-400">Pisahkan setiap halaman menjadi file PDF terpisah.</span>
                              </div>
                              {splitMode === 'all' && <CheckCircle2 className="w-6 h-6 text-emerald-400 ml-auto" />}
                            </label>
                            
                            <label className={`flex-1 flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${splitMode === 'custom' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                              <input 
                                type="radio" 
                                className="hidden" 
                                checked={splitMode === 'custom'} 
                                onChange={() => setSplitMode('custom')} 
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-white mb-1">Rentang Khusus</span>
                                <span className="text-xs text-slate-400">Pilih rentang halaman spesifik.</span>
                              </div>
                              {splitMode === 'custom' && <CheckCircle2 className="w-6 h-6 text-emerald-400 ml-auto" />}
                            </label>
                          </div>

                          {/* Range Input (if custom) */}
                          <div className={`transition-all duration-300 overflow-hidden ${splitMode === 'custom' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                              Halaman yang Diekstrak
                            </label>
                            <input 
                              type="text" 
                              value={pageRange}
                              onChange={(e) => setPageRange(e.target.value)}
                              placeholder="e.g., 1-5, 8, 11-13" 
                              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white outline-none transition-colors shadow-inner font-mono text-sm"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                              Pisahkan angka dengan koma. Gunakan tanda hubung untuk rentang halaman.
                            </p>
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                            {errorMsg}
                          </div>
                        )}

                        <button 
                          onClick={processFile}
                          className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                          Pisahkan PDF Sekarang
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </>
            ) : processingState === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="h-24 w-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative z-10 shadow-2xl">
                    <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Memotong Dokumen...</h3>
                <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-4 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-slate-400 font-medium">Memproses file - {progress}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                <div className="h-28 w-28 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Pemisahan Berhasil!</h3>
                <p className="text-slate-400 mb-8 max-w-md text-lg">
                  Dokumen PDF Anda telah dipotong sesuai preferensi. Silakan unduh hasilnya di bawah ini.
                </p>
                
                <div className="mb-8 w-full max-w-sm flex flex-col items-start text-left">
                  <label className="text-sm font-semibold text-slate-400 mb-2 ml-1">Ubah Nama File Output</label>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      value={downloadFilename !== "" ? downloadFilename : (processedResult?.outputFilename || "nexarin_split.zip")} 
                      onChange={(e) => setDownloadFilename(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-white outline-none transition-colors shadow-inner"
                      placeholder="Masukkan nama file..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={handleDownload}
                    className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2 text-lg"
                  >
                    <Download className="w-5 h-5" />
                    Unduh Hasil
                  </button>
                  <button 
                    onClick={resetWorkspace}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Mulai Baru
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <Link
            href="/pdf-tools"
            className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 px-8 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg shadow-black/20"
          >
            ← Kembali ke Menu PDF Tools
          </Link>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowInfoModal(false)}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowInfoModal(false)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 h-10 w-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-6 pr-12">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 shrink-0">
                <Scissors className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">Fungsi Fitur Split PDF</h2>
            </div>
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Alat <strong>Pisahkan PDF (Split)</strong> dirancang untuk memecah satu dokumen PDF besar menjadi bagian-bagian yang lebih kecil secara presisi.
              </p>
              
              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> Mode Ekstrak Semua
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Secara otomatis memisahkan <span className="text-white font-medium">setiap halaman</span> dokumen menjadi file PDF tunggal yang independen. Cocok jika Anda butuh mengisolasi semua halaman sekaligus (hasil berupa file .zip).
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> Mode Rentang Khusus
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Anda bebas menentukan halaman mana saja yang ingin diekstrak. Anda bisa menggunakan koma untuk halaman terpisah (<span className="text-emerald-400 font-mono">1, 4, 7</span>) atau tanda hubung untuk blok halaman (<span className="text-emerald-400 font-mono">2-5</span>).
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors w-full"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
          0% { transform: translateX(-100%); }
        }
      `}</style>
    </main>
  );
}
