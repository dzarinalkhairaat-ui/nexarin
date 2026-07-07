"use client";

import { UploadCloud, FileType, CheckCircle2, Loader2, Download, X, Zap, ArrowRight, ArrowLeft, Shield, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processCompressPdf } from "@/features/pdf-tools/core/pdf-processing";
import { loadPdfDocument, generateThumbnailForPage } from "@/features/pdf-tools/core/pdf-thumbnail";
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
  
  // Compression Level
  const [compressionLevel, setCompressionLevel] = useState('recommended'); // extreme, recommended, less
  
  // PDF Preview Data
  const [pdfDoc, setPdfDoc] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  
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

  const getEstimatedSize = () => {
    if (!originalSize) return 0;
    if (compressionLevel === 'extreme') return originalSize * 0.35;
    if (compressionLevel === 'recommended') return originalSize * 0.60;
    if (compressionLevel === 'less') return originalSize * 0.85;
    return originalSize;
  };

  const getEstimatedSavings = () => {
    if (compressionLevel === 'extreme') return 65;
    if (compressionLevel === 'recommended') return 40;
    if (compressionLevel === 'less') return 15;
    return 0;
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

  const handleFileSelection = async (file) => {
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
    setThumbnailUrl(null);
    setTotalPages(0);
    
    try {
      const doc = await loadPdfDocument(file);
      if (doc) {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        
        // Generate thumbnail for page 1 immediately
        const page1Url = await generateThumbnailForPage(doc, 1, 400);
        if (page1Url) {
          setThumbnailUrl(page1Url);
        }
      }
    } catch (err) {
      console.error("Error loading PDF document:", err);
    }
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
      // Pass the selected compression level
      const result = await processCompressPdf(selectedFile, { level: compressionLevel });
      
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
    if (pdfDoc && pdfDoc.destroy) pdfDoc.destroy();
    setSelectedFile(null);
    setPdfDoc(null);
    setThumbnailUrl(null);
    setTotalPages(0);
    
    setProcessingState('idle');
    setProcessedResult(null);
    setProgress(0);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressionLevel('recommended');
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
    <main className="min-h-screen bg-slate-950 pt-10 sm:pt-16 text-slate-300 selection:bg-green-500/30 relative">
      <div className="max-w-4xl mx-auto px-6 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-green-500/10 text-green-400 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20">
            <Zap className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Kompres <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">PDF</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Perkecil ukuran dokumen PDF Anda tanpa kehilangan kualitas visual yang signifikan.{' '}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-green-400 hover:text-green-300 font-semibold underline decoration-green-500/30 hover:decoration-green-400 underline-offset-4 transition-colors"
            >
              Klik disini untuk penjelasan fitur.
            </button>
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <Link
            href="/pdf-tools"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-sm backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Menu
          </Link>
        </div>

        {/* Workspace Container */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-green-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {processingState === 'idle' || processingState === 'error' ? (
              <>
                {!selectedFile ? (
                  <div 
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 ${
                      isDragging 
                        ? 'border-green-400 bg-green-500/10 scale-[1.02]' 
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
                        e.target.value = '';
                      }}
                      accept=".pdf,application/pdf"
                      ref={fileInputRef}
                    />
                    
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-6 text-green-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-white font-bold text-xl mb-3 text-center px-4">
                      Tarik & lepas file atau pilih dari perangkat
                    </h3>
                    
                    <p className="text-slate-400 text-center text-sm mb-8 max-w-sm px-4 leading-relaxed">
                      Dokumen Anda dijamin 100% aman dan akan dihapus otomatis setelah proses kompresi selesai.
                    </p>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center gap-2"
                    >
                      <UploadCloud className="w-5 h-5" />
                      Pilih File PDF
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      
                      {/* Left: Preview Card */}
                      <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="group relative w-full aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center overflow-hidden mb-4 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(34,197,94,0.2)] transition-all duration-300">
                          {/* Decorative Emerald Document Header */}
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 z-10" />
                          
                          {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt="Preview Cover" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center animate-pulse">
                               <Loader2 className="w-8 h-8 text-slate-300 animate-spin mb-2" />
                            </div>
                          )}
                          
                          <button 
                            onClick={resetWorkspace}
                            className="absolute top-3 right-3 h-8 w-8 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400 transition-colors z-20 shadow-lg opacity-0 group-hover:opacity-100"
                            title="Hapus file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-white truncate max-w-full text-center" title={selectedFile.name}>
                          {selectedFile.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-400">
                            {formatFileSize(selectedFile.size)}
                          </p>
                          <span className="w-1 h-1 bg-slate-600 rounded-full" />
                          <p className="text-xs text-slate-400 font-medium">
                            {totalPages > 0 ? `${totalPages} Halaman` : <Loader2 className="w-3 h-3 animate-spin inline-block" />}
                          </p>
                        </div>
                      </div>

                      {/* Right: Action Form */}
                      <div className="w-full md:w-2/3 flex flex-col pt-2">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          Pilih Tingkat Kompresi
                        </h3>
                        
                        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 mb-8 flex flex-col gap-4">
                          
                          {/* Extreme Compression */}
                          <label className={`relative flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 select-none ${compressionLevel === 'extreme' ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                            <input 
                              type="radio" 
                              className="hidden" 
                              checked={compressionLevel === 'extreme'} 
                              onChange={() => setCompressionLevel('extreme')} 
                            />
                            <div className="flex flex-col flex-1 pl-2">
                              <span className="font-bold text-white mb-1 flex items-center gap-2">
                                Extreme Compression
                              </span>
                              <span className="text-sm text-slate-400 leading-relaxed">Kualitas lebih rendah, kompresi tinggi</span>
                            </div>
                            <div className="shrink-0 mt-1">
                              {compressionLevel === 'extreme' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                              )}
                            </div>
                          </label>

                          {/* Recommended Compression */}
                          <label className={`relative flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 select-none ${compressionLevel === 'recommended' ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                            {compressionLevel === 'recommended' && (
                              <div className="absolute -top-3 left-6 bg-green-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Recommended
                              </div>
                            )}
                            <input 
                              type="radio" 
                              className="hidden" 
                              checked={compressionLevel === 'recommended'} 
                              onChange={() => setCompressionLevel('recommended')} 
                            />
                            <div className="flex flex-col flex-1 pl-2">
                              <span className="font-bold text-white mb-1">Recommended Compression</span>
                              <span className="text-sm text-slate-400 leading-relaxed">Kualitas bagus, kompresi yang baik</span>
                            </div>
                            <div className="shrink-0 mt-1">
                              {compressionLevel === 'recommended' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                              )}
                            </div>
                          </label>

                          {/* Less Compression */}
                          <label className={`relative flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 select-none ${compressionLevel === 'less' ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                            <input 
                              type="radio" 
                              className="hidden" 
                              checked={compressionLevel === 'less'} 
                              onChange={() => setCompressionLevel('less')} 
                            />
                            <div className="flex flex-col flex-1 pl-2">
                              <span className="font-bold text-white mb-1">Less Compression</span>
                              <span className="text-sm text-slate-400 leading-relaxed">Kualitas tinggi, kompresi lebih sedikit</span>
                            </div>
                            <div className="shrink-0 mt-1">
                              {compressionLevel === 'less' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                              )}
                            </div>
                          </label>
                          
                        </div>

                        {/* Estimation Box */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <h4 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-green-400" />
                            Estimasi Penghematan
                          </h4>
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                            <span className="text-slate-400 text-sm">Ukuran File Awal</span>
                            <span className="font-mono text-slate-300">{formatFileSize(originalSize)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm font-medium">Estimasi Ukuran Baru</span>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg shrink-0">
                                -{getEstimatedSavings()}%
                              </span>
                              <span className="font-mono text-green-400 font-bold text-lg">{formatFileSize(getEstimatedSize())}</span>
                            </div>
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 text-center">
                            {errorMsg}
                          </div>
                        )}

                        <button 
                          onClick={processFile}
                          disabled={!pdfDoc}
                          className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(34,197,94,0.5)] hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.7)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 text-lg border border-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="h-24 w-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative z-10 shadow-2xl">
                    <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Mengompres Dokumen...</h3>
                <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-4 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-slate-400 font-medium">Memproses file - {progress}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
                <div className="h-28 w-28 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-14 h-14 text-green-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Kompresi Berhasil!</h3>
                <p className="text-slate-400 mb-8 max-w-md text-lg">
                  Dokumen PDF Anda telah diperkecil ukurannya dengan optimal.
                </p>
                
                {/* Premium Stats Box */}
                <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-md rounded-[2rem] border border-slate-700/50 p-8 mb-8 relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-6 relative z-10">
                    <div className="text-left flex flex-col gap-1">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Ukuran Awal</p>
                      <p className="text-slate-300 font-mono text-xl">{formatFileSize(originalSize)}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
                    <div className="text-right flex flex-col gap-1">
                      <p className="text-green-400/80 text-xs font-bold uppercase tracking-widest">Ukuran Baru</p>
                      <p className="text-green-400 font-mono font-bold text-2xl">{formatFileSize(compressedSize)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <span className="text-slate-300 text-sm font-medium">Ruang penyimpanan berhasil dihemat</span>
                    <span className="px-3 py-1.5 bg-green-500/20 text-green-400 font-black rounded-xl text-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
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
                      className="w-full bg-slate-900 border border-slate-700 focus:border-green-500 rounded-xl px-4 py-3.5 text-white outline-none transition-colors shadow-inner"
                      placeholder="Masukkan nama file..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <button 
                    onClick={handleDownload}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(34,197,94,0.5)] hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.7)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-lg border border-green-400/20"
                  >
                    <Download className="w-5 h-5" />
                    Unduh Hasil
                  </button>
                  <button 
                    onClick={resetWorkspace}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-2xl transition-all border border-slate-700 hover:border-slate-500 active:scale-95 flex items-center justify-center gap-2 shadow-sm backdrop-blur-sm"
                  >
                    Mulai Baru
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Trust Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                <Zap className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Kompresi Cerdas</h4>
             <p className="text-slate-400 text-sm">Teknologi Deflate kami memperkecil ukuran file secara maksimal dalam hitungan detik.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <Shield className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Privasi Terjaga</h4>
             <p className="text-slate-400 text-sm">Seluruh proses terjadi di peramban Anda. Tidak ada data yang dikirim ke server.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Sparkles className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Kualitas Terjaga</h4>
             <p className="text-slate-400 text-sm">Membersihkan garbage data tanpa mengurangi kualitas teks dan gambar sama sekali.</p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" 
            onClick={() => setShowInfoModal(false)}
          />
          <div className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] w-full max-w-lg p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowInfoModal(false)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 h-10 w-10 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all z-10 group"
            >
              <X className="w-4 h-4 stroke-[1.5] group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            <div className="flex items-center gap-5 mb-8 pr-12">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl text-green-400 shrink-0 shadow-lg shadow-green-500/20">
                  <Zap className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Fungsi Fitur<br/><span className="text-green-400">Kompres PDF</span>
              </h2>
            </div>
            
            <div className="space-y-5 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p className="text-slate-300/90 text-base sm:text-lg mb-2">
                Alat <strong className="text-white">Kompres PDF</strong> bertujuan untuk memperkecil kapasitas file dokumen tanpa mengorbankan keterbacaan atau kualitas visual dari isi file.
              </p>
              
              <div className="bg-slate-800/40 rounded-3xl p-5 sm:p-6 border border-slate-700/50 shadow-inner">
                <h4 className="text-white font-bold mb-3 flex items-center gap-3 text-base">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> Tiga Level Kompresi
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed ml-5">
                  Anda bisa memilih 3 jenis kompresi: <b>Extreme</b> (ukuran file sangat kecil, namun sedikit menurunkan resolusi), <b>Recommended</b> (keseimbangan ukuran dan kualitas), dan <b>Less</b> (kualitas diutamakan).
                </p>
              </div>

              <div className="bg-slate-800/40 rounded-3xl p-5 sm:p-6 border border-slate-700/50 shadow-inner">
                <h4 className="text-white font-bold mb-3 flex items-center gap-3 text-base">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> Teknologi Deflate & GC
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed ml-5">
                  Kami menggunakan algoritma deflate cerdas dan Garbage Collection (GC) untuk membersihkan metadata usang serta melakukan kompresi pada aliran teks dan grafik vektor!
                </p>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(34,197,94,0.5)] hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.7)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-lg border border-green-400/20"
              >
                Saya Mengerti
              </button>
              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
                <Shield className="w-4 h-4 text-green-500/70" strokeWidth={2.5} />
                <span>Proses dilakukan secara lokal & terenkripsi.</span>
              </div>
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
