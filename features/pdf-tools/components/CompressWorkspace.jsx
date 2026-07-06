"use client";

import { UploadCloud, FileType, CheckCircle2, Loader2, Download, X, Minimize2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processCompressPdf } from "@/features/pdf-tools/core/pdf-processing";
import { saveAs } from "file-saver";

export default function CompressWorkspace() {
  const slug = "compress";
  const tool = pdfTools.find(t => t.id === slug) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState("");
  
  // Compression Stats
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = () => {
    if (!originalSize || !compressedSize) return 0;
    const savings = ((originalSize - compressedSize) / originalSize) * 100;
    return Math.max(0, savings.toFixed(1)); // Don't show negative savings
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
    setOriginalSize(file.size);
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
    
    setProcessingState('processing');
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 300);
    
    try {
      const result = await processCompressPdf(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      setProcessedResult(result);
      
      // Calculate resulting size from blob
      if (result.blob) {
        setCompressedSize(result.blob.size);
      }
      
      setTimeout(() => {
        setProcessingState('success');
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error(error);
      setProcessingState('error');
      setErrorMsg(error.message || "Terjadi kesalahan saat memproses file. Pastikan engine backend berjalan.");
    }
  };

  const handleDownload = () => {
    if (processedResult?.blob) {
      let finalName = downloadFilename || processedResult.outputFilename || "nexarin_compressed.pdf";
      if (!finalName.toLowerCase().endsWith('.pdf')) {
        finalName += '.pdf';
      }
      saveAs(processedResult.blob, finalName);
    }
  };

  const resetWorkspace = () => {
    setSelectedFile(null);
    setProcessingState('idle');
    setProcessedResult(null);
    setProgress(0);
    setOriginalSize(0);
    setCompressedSize(0);
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
    <main className="min-h-screen bg-slate-950 pt-10 sm:pt-16 text-slate-300 selection:bg-amber-500/30 relative">
      <div className="max-w-4xl mx-auto px-6 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-amber-500/10 text-amber-400 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20">
            <Minimize2 className="w-10 h-10" />
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Kompres <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">PDF</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Perkecil ukuran dokumen PDF Anda tanpa kehilangan kualitas visual yang signifikan.{' '}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold underline decoration-amber-500/30 hover:decoration-amber-400 underline-offset-4 transition-colors"
            >
              Klik disini untuk penjelasan fitur.
            </button>
          </p>
        </div>

        {/* Workspace Container */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {processingState === 'idle' || processingState === 'error' ? (
              <>
                {!selectedFile ? (
                  <div 
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                      isDragging 
                        ? 'border-amber-400 bg-amber-500/10 scale-[1.02]' 
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
                    
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-6 text-amber-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    
                    <p className="text-slate-400 text-center mb-8 max-w-sm">
                      Dokumen Anda dijamin 100% aman dan akan dihapus otomatis setelah proses kompresi selesai.
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
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      
                      {/* Left: Preview Card */}
                      <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="group relative w-full aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center overflow-hidden mb-4 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] transition-all duration-300 cursor-default">
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                          <FileType className="w-16 h-16 text-slate-300 mb-4 drop-shadow-sm" />
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

                      {/* Right: Action Form */}
                      <div className="w-full md:w-2/3 flex flex-col h-full justify-center pt-4 md:pt-10">
                        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 mb-8 text-center">
                          <div className="inline-flex p-3 bg-amber-500/10 rounded-full mb-4 text-amber-400">
                            <Minimize2 className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            Siap Dikompresi
                          </h3>
                          <p className="text-slate-400 text-sm">
                            Teknologi pintar Nexarin akan menganalisis dokumen ini dan mengurangi ukuran penyimpanannya semaksimal mungkin dengan mempertahankan kualitas teks dan gambar.
                          </p>
                        </div>

                        {errorMsg && (
                          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                            {errorMsg}
                          </div>
                        )}

                        <button 
                          onClick={processFile}
                          className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                          Mulai Kompresi
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
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="h-24 w-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative z-10 shadow-2xl">
                    <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Mengompres Dokumen...</h3>
                <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-4 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-slate-400 font-medium">Memproses file - {progress}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
                <div className="h-28 w-28 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                  <CheckCircle2 className="w-14 h-14 text-amber-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Kompresi Berhasil!</h3>
                <p className="text-slate-400 mb-8 max-w-md text-lg">
                  Dokumen PDF Anda telah diperkecil ukurannya dengan optimal.
                </p>
                
                {/* Stats Box */}
                <div className="w-full max-w-md bg-slate-950/80 rounded-2xl border border-slate-800 p-6 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                    <div className="text-left">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ukuran Awal</p>
                      <p className="text-slate-300 font-mono">{formatFileSize(originalSize)}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600" />
                    <div className="text-right">
                      <p className="text-amber-500/80 text-xs font-bold uppercase tracking-wider mb-1">Ukuran Baru</p>
                      <p className="text-amber-400 font-mono font-bold text-lg">{formatFileSize(compressedSize)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-slate-400 text-sm">Anda berhasil menghemat ruang sebesar</span>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 font-bold rounded-lg text-sm">
                      {calculateSavings()}%
                    </span>
                  </div>
                </div>
                
                <div className="mb-8 w-full max-w-sm flex flex-col items-start text-left">
                  <label className="text-sm font-semibold text-slate-400 mb-2 ml-1">Ubah Nama File Output</label>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      value={downloadFilename !== "" ? downloadFilename : (processedResult?.outputFilename || "nexarin_compressed.pdf")} 
                      onChange={(e) => setDownloadFilename(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3.5 text-white outline-none transition-colors shadow-inner"
                      placeholder="Masukkan nama file..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={handleDownload}
                    className="w-full sm:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2 text-lg"
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
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 shrink-0">
                <Minimize2 className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">Fungsi Fitur Kompres PDF</h2>
            </div>
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Alat <strong>Kompres PDF</strong> bertujuan untuk memperkecil kapasitas file dokumen tanpa mengorbankan keterbacaan atau kualitas visual dari isi file.
              </p>
              
              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" /> Pembersihan Garbage Data
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Engine kami secara otomatis menghapus metadata tak berguna, membuang data duplikat, serta membersihkan struktur pohon dokumen PDF Anda ke tingkat paling rapi (Clean & Garbage=4).
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" /> Teknologi Deflate
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Kami menggunakan algoritma deflate cerdas untuk mengompresi aliran teks dan data grafis. Ini sangat cocok bagi Anda yang sering gagal mengunggah berkas karena batas ukuran file!
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition-colors w-full"
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
