"use client";

import { UploadCloud, FileType, CheckCircle2, ArrowLeft, Loader2, Download, FilePlus, ChevronLeft, ChevronRight, X, Layers } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processMergePdf } from "@/features/pdf-tools/core/pdf-processing";
import { saveAs } from "file-saver";

export default function MergeWorkspace() {
  const tool = pdfTools.find(t => t.id === 'merge') || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadFilename, setDownloadFilename] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
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
      handleFileSelection(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelection = (files) => {
    // Filter only PDFs
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length < files.length) {
      alert("Beberapa file diabaikan karena bukan file PDF.");
    }
    
    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
      setProcessingState('idle');
      setProgress(0);
      setProcessedResult(null);
      setErrorMsg('');
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    const newFiles = [...selectedFiles];
    if (direction === 'left' && index > 0) {
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    } else if (direction === 'right' && index < newFiles.length - 1) {
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    }
    setSelectedFiles(newFiles);
  };

  const processFile = async () => {
    if (selectedFiles.length < 2) {
      setErrorMsg("Harap unggah minimal 2 file PDF untuk digabungkan.");
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
      const result = await processMergePdf(selectedFiles);
      
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
      let finalName = downloadFilename || processedResult.outputFilename || "nexarin_merged.pdf";
      if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';
      saveAs(processedResult.blob, finalName);
    }
  };

  const resetWorkspace = () => {
    setSelectedFiles([]);
    setProcessingState('idle');
    setProcessedResult(null);
    setProgress(0);
  };

  useEffect(() => {
    if (showInfoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showInfoModal]);

  return (
    <main className="min-h-screen bg-slate-950 pt-10 sm:pt-16 text-slate-300 selection:bg-red-500/30">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-red-500/10 text-red-400 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20">
            <Layers className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Penggabungan <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">Super Cepat</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Visualisasikan, atur urutan, dan satukan beberapa dokumen PDF menjadi satu kesatuan hanya dalam hitungan detik.{' '}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-red-400 hover:text-red-300 font-semibold underline decoration-red-500/30 hover:decoration-red-400 underline-offset-4 transition-colors"
            >
              Klik disini untuk penjelasan fitur.
            </button>
          </p>
        </div>

        {/* Workspace Container */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-red-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {processingState === 'idle' || processingState === 'error' ? (
              <>
                {/* Upload Zone */}
                <div 
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                    isDragging 
                      ? 'border-red-400 bg-red-500/10 scale-[1.02]' 
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
                      if (e.target.files) handleFileSelection(Array.from(e.target.files));
                    }}
                    accept=".pdf,application/pdf"
                    multiple
                    ref={fileInputRef}
                  />
                  
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-6 text-red-400 group-hover:scale-110 transition-transform">
                    <FilePlus className="w-10 h-10" />
                  </div>
                  
                  <p className="text-slate-400 text-center mb-8 max-w-md">
                    Anda bisa memilih banyak file sekaligus. Anda akan dapat mengatur urutannya pada langkah selanjutnya.
                  </p>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/10 hover:shadow-white/20 flex items-center gap-2"
                  >
                    <UploadCloud className="w-5 h-5" />
                    Pilih File PDF
                  </button>
                </div>

                {/* Preview & Arrange Grid */}
                {selectedFiles.length > 0 && (
                  <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white tracking-tight">Atur Urutan Dokumen</h3>
                        <span className="bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold text-red-400 border border-red-500/20">
                          {selectedFiles.length} File
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedFiles([])}
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                      >
                        Bersihkan Semua
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-10">
                      {selectedFiles.map((file, idx) => (
                        <div 
                          key={`${file.name}-${idx}`}
                          className="group relative bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all duration-300"
                        >
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeFile(idx)}
                            className="absolute -top-3 -right-3 h-8 w-8 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400 transition-colors z-20"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* PDF Visual Representation */}
                          <div className="aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center relative overflow-hidden mb-4 group-hover:scale-[1.02] group-hover:shadow-[0_8px_30px_rgba(239,68,68,0.2)] transition-all duration-300">
                            {/* Decorative Red Document Header */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-400" />
                            
                            <FileType className="w-12 h-12 text-slate-300 mb-3 drop-shadow-sm" />
                            <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full tracking-widest uppercase border border-slate-100 shadow-sm">
                              Hal {idx + 1}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate mb-1" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>

                          {/* Reordering Controls */}
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl">
                            <button 
                              onClick={() => moveFile(idx, 'left')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="w-px h-4 bg-slate-700 mx-1" />
                            <button 
                              onClick={() => moveFile(idx, 'right')}
                              disabled={idx === selectedFiles.length - 1}
                              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-4 border-t border-slate-800/80">
                      <div className="text-sm font-medium">
                        {selectedFiles.length < 2 ? (
                          <span className="text-red-400 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Butuh {2 - selectedFiles.length} file lagi
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Siap digabungkan
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={processFile}
                        disabled={selectedFiles.length < 2}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-95 flex items-center justify-center gap-3 text-lg"
                      >
                        Gabungkan PDF
                        <Layers className="w-5 h-5" />
                      </button>
                    </div>

                    {errorMsg && (
                      <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center animate-in fade-in slide-in-from-top-2">
                        {errorMsg}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : processingState === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="h-24 w-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative z-10 shadow-2xl">
                    <Loader2 className="w-10 h-10 text-red-400 animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Menyatukan Dokumen...</h3>
                <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-4 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-slate-400 font-medium">Memproses {selectedFiles.length} file - {progress}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                <div className="h-28 w-28 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Penggabungan Selesai!</h3>
                <p className="text-slate-400 mb-8 max-w-md text-lg">
                  Semua file PDF Anda telah berhasil disatukan. Anda dapat mengunduh hasilnya sekarang.
                </p>
                
                <div className="mb-8 w-full max-w-sm flex flex-col items-start text-left">
                  <label className="text-sm font-semibold text-slate-400 mb-2 ml-1">Nama File Output</label>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      value={downloadFilename !== "" ? downloadFilename : (processedResult?.outputFilename || "nexarin_merged.pdf")} 
                      onChange={(e) => setDownloadFilename(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3.5 text-white outline-none transition-colors shadow-inner"
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
                    Unduh PDF
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
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-400 shrink-0">
                <Layers className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">Fungsi Fitur Gabung PDF</h2>
            </div>
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Alat <strong>Gabung PDF (Merge)</strong> memungkinkan Anda untuk menyatukan puluhan file PDF secara instan dalam satu dokumen berurutan.
              </p>
              
              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> Atur Urutan Bebas
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Anda dapat dengan mudah memindahkan posisi urutan dokumen dengan menggunakan tombol panah kiri/kanan pada setiap file yang diunggah. Dokumen pertama akan berada di halaman paling awal.
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> Pemrosesan Sangat Cepat
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Teknologi backend kami menggabungkan file tanpa mengompresi ulang isi dokumen, sehingga kualitas dokumen asli Anda (termasuk ketajaman gambar) tetap terjaga 100%.
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors w-full"
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
