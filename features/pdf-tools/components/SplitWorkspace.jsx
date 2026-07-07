"use client";

import { UploadCloud, FileType, CheckCircle2, Loader2, Download, FilePlus, X, Scissors, Info, ArrowRight, ArrowLeft, Shield, Zap, Target, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processSplitPdf } from "@/features/pdf-tools/core/pdf-processing";
import { loadPdfDocument, generateThumbnailForPage } from "@/features/pdf-tools/core/pdf-thumbnail";
import { saveAs } from "file-saver";

export default function SplitWorkspace() {
  const slug = "split";
  const tool = pdfTools.find(t => t.id === slug) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // PDF Data
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState({}); // { 1: dataUrl, 2: dataUrl }

  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Custom Split States
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [splitMode, setSplitMode] = useState('all'); // 'all' or 'custom'
  
  // Ranges State for Custom Mode
  const [ranges, setRanges] = useState([{ id: Date.now(), from: 1, to: 1 }]);
  
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

  const handleFileSelection = async (file) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert("Harap unggah file PDF.");
      return;
    }
    
    setSelectedFile(file);
    setProcessingState('idle');
    setProgress(0);
    setProcessedResult(null);
    setErrorMsg('');
    setThumbnails({});
    setTotalPages(0);
    setRanges([{ id: Date.now(), from: 1, to: 1 }]);
    
    try {
      const doc = await loadPdfDocument(file);
      if (doc) {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setRanges([{ id: Date.now(), from: 1, to: doc.numPages }]);
        
        // Generate thumbnail for page 1 immediately
        const page1Url = await generateThumbnailForPage(doc, 1, 400);
        if (page1Url) {
          setThumbnails(prev => ({ ...prev, 1: page1Url }));
        }
      }
    } catch (err) {
      console.error("Error loading PDF document:", err);
    }
  };
  
  // Background Thumbnail Generator for "Ekstrak Semua" Mode
  useEffect(() => {
    let isCancelled = false;
    
    const generateAllThumbnails = async () => {
      if (splitMode === 'all' && pdfDoc && totalPages > 0) {
        // We already have page 1, let's load the rest
        for (let i = 2; i <= totalPages; i++) {
          if (isCancelled) break;
          // Skip if already generated
          if (!thumbnails[i]) {
            const dataUrl = await generateThumbnailForPage(pdfDoc, i, 200); // smaller thumbnail
            if (dataUrl && !isCancelled) {
              setThumbnails(prev => ({ ...prev, [i]: dataUrl }));
            }
          }
        }
      }
    };
    
    generateAllThumbnails();
    
    return () => {
      isCancelled = true;
    };
  }, [splitMode, pdfDoc, totalPages, thumbnails]);

  const addRange = () => {
    setRanges(prev => [
      ...prev, 
      { id: Date.now(), from: 1, to: totalPages }
    ]);
  };

  const removeRange = (id) => {
    if (ranges.length > 1) {
      setRanges(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateRange = (id, field, value) => {
    let numVal = parseInt(value, 10);
    if (isNaN(numVal) || numVal < 1) numVal = 1;
    if (numVal > totalPages) numVal = totalPages;
    
    setRanges(prev => prev.map(r => {
      if (r.id === id) {
        const newRange = { ...r, [field]: numVal };
        // Validasi from <= to
        if (field === 'from' && newRange.from > newRange.to) {
          newRange.to = newRange.from;
        } else if (field === 'to' && newRange.to < newRange.from) {
          newRange.from = newRange.to;
        }
        return newRange;
      }
      return r;
    }));
  };

  const processFile = async () => {
    if (!selectedFile) {
      setErrorMsg("Harap unggah file PDF terlebih dahulu.");
      setProcessingState('error');
      return;
    }

    if (splitMode === 'custom' && ranges.length === 0) {
      setErrorMsg("Harap tentukan minimal 1 rentang halaman.");
      setProcessingState('error');
      return;
    }
    
    setProcessingState('processing');
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next > 90 ? 90 : next;
      });
    }, 250);
    
    try {
      const options = splitMode === 'custom' ? { ranges: ranges.map(r => ({ from: r.from, to: r.to })) } : {};
      const result = await processSplitPdf(selectedFile, options);
      
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
      if (!finalName.toLowerCase().endsWith('.zip') && !finalName.toLowerCase().endsWith('.pdf')) {
        finalName += processedResult.outputFilename?.endsWith('.pdf') ? '.pdf' : '.zip';
      }
      saveAs(processedResult.blob, finalName);
    }
  };

  const resetWorkspace = () => {
    if (pdfDoc && pdfDoc.destroy) pdfDoc.destroy();
    setSelectedFile(null);
    setPdfDoc(null);
    setTotalPages(0);
    setThumbnails({});
    setProcessingState('idle');
    setProcessedResult(null);
    setProgress(0);
    setSplitMode('all');
    setRanges([{ id: Date.now(), from: 1, to: 1 }]);
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
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Pisahkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">PDF</span>
          </h1>
          
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {processingState === 'idle' || processingState === 'error' ? (
              <>
                {!selectedFile ? (
                  <div 
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 ${
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
                        e.target.value = '';
                      }}
                      accept=".pdf,application/pdf"
                      ref={fileInputRef}
                    />
                    
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-white font-bold text-xl mb-3 text-center px-4">
                      Tarik & lepas file atau pilih dari perangkat
                    </h3>
                    
                    <p className="text-slate-400 text-center text-sm mb-8 max-w-sm px-4 leading-relaxed">
                      Dokumen Anda dijamin 100% aman dan akan dihapus otomatis setelah proses pemisahan selesai.
                    </p>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2"
                    >
                      <UploadCloud className="w-5 h-5" />
                      Pilih File PDF
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      
                      {/* Left: Main Preview Card */}
                      <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="group relative w-full aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center overflow-hidden mb-4 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] transition-all duration-300">
                          {/* Decorative Emerald Document Header */}
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 z-10" />
                          
                          {thumbnails[1] ? (
                            <img src={thumbnails[1]} alt="Preview Cover" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center animate-pulse">
                               <Loader2 className="w-8 h-8 text-slate-300 animate-spin mb-2" />
                            </div>
                          )}
                          
                          {/* Remove button inside preview */}
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
                              {splitMode === 'all' && <CheckCircle2 className="w-6 h-6 text-emerald-400 ml-auto shrink-0" />}
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
                              {splitMode === 'custom' && <CheckCircle2 className="w-6 h-6 text-emerald-400 ml-auto shrink-0" />}
                            </label>
                          </div>

                          {/* Ekstrak Semua View (Horizontal Thumbnails) */}
                          <div className={`transition-all duration-300 overflow-hidden ${splitMode === 'all' ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            {splitMode === 'all' && (
                              <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-4 flex items-center justify-between">
                                  Pratinjau Hasil Pemisahan 
                                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg text-xs">{totalPages} File Output</span>
                                </label>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <div key={pageNum} className="snap-start shrink-0 w-24 flex flex-col items-center">
                                      <div className="w-24 h-32 bg-white rounded-lg shadow-sm border border-slate-700 overflow-hidden mb-2 relative">
                                        {thumbnails[pageNum] ? (
                                          <img src={thumbnails[pageNum]} alt={`Page ${pageNum}`} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="flex flex-col items-center justify-center h-full animate-pulse bg-slate-200">
                                             <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                                          </div>
                                        )}
                                        <div className="absolute inset-0 border-[3px] border-emerald-500/0 hover:border-emerald-500/50 transition-colors pointer-events-none rounded-lg" />
                                      </div>
                                      <span className="text-xs font-medium text-slate-400">Hal {pageNum}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Range Builder View (if custom) */}
                          <div className={`transition-all duration-500 overflow-hidden ${splitMode === 'custom' ? 'opacity-100 max-h-[800px]' : 'opacity-0 max-h-0'}`}>
                            {splitMode === 'custom' && (
                              <div className="space-y-4">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                  Atur Rentang Halaman
                                </label>
                                
                                {ranges.map((range, index) => (
                                  <div key={range.id} className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/30 rounded-xl p-3 sm:p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 transition-all duration-300 relative animate-in fade-in slide-in-from-top-2 shadow-sm hover:shadow-md">
                                    <div className="flex items-center justify-between w-full sm:w-auto shrink-0">
                                      <span className="bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1.5 rounded-lg text-sm border border-emerald-500/20 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        Range {index + 1}
                                      </span>
                                      
                                      {/* Mobile Trash */}
                                      {ranges.length > 1 && (
                                        <button 
                                          onClick={() => removeRange(range.id)}
                                          className="sm:hidden p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:flex-1">
                                      <div className="flex-1 flex items-center justify-between sm:justify-start gap-2 border border-slate-700/60 group-hover:border-slate-600 rounded-lg p-2 bg-slate-950/50 transition-colors focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50">
                                        <span className="text-slate-400 text-xs sm:text-sm font-medium pl-1 sm:pl-2 shrink-0">from page</span>
                                        <input 
                                          type="number" 
                                          min="1" 
                                          max={totalPages}
                                          value={range.from}
                                          onChange={(e) => updateRange(range.id, 'from', e.target.value)}
                                          className="w-12 sm:w-16 bg-transparent text-white font-bold text-base sm:text-lg text-right sm:text-center outline-none shrink-0"
                                        />
                                      </div>
                                      
                                      <span className="text-slate-500 shrink-0 font-medium">-</span>
                                      
                                      <div className="flex-1 flex items-center justify-between sm:justify-start gap-2 border border-slate-700/60 group-hover:border-slate-600 rounded-lg p-2 bg-slate-950/50 transition-colors focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50">
                                        <span className="text-slate-400 text-xs sm:text-sm font-medium pl-1 sm:pl-2 shrink-0">to</span>
                                        <input 
                                          type="number" 
                                          min={range.from} 
                                          max={totalPages}
                                          value={range.to}
                                          onChange={(e) => updateRange(range.id, 'to', e.target.value)}
                                          className="w-12 sm:w-16 bg-transparent text-white font-bold text-base sm:text-lg text-right sm:text-center outline-none shrink-0"
                                        />
                                      </div>
                                    </div>
                                    
                                    {/* Desktop Trash */}
                                    {ranges.length > 1 && (
                                      <button 
                                        onClick={() => removeRange(range.id)}
                                        className="hidden sm:flex p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all shrink-0 hover:scale-110"
                                        title="Hapus Rentang"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                
                                <button 
                                  onClick={addRange}
                                  className="w-full py-3 mt-2 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                  <Plus className="w-5 h-5" />
                                  Add Range
                                </button>
                                
                              </div>
                            )}
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 text-center">
                            {errorMsg}
                          </div>
                        )}

                        <button 
                          onClick={processFile}
                          disabled={totalPages === 0}
                          className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 text-lg border border-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
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

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <button 
                    onClick={handleDownload}
                    className="w-full sm:flex-1 px-10 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.7)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-lg border border-emerald-400/30"
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
             <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Zap className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Super Cepat</h4>
             <p className="text-slate-400 text-sm">Proses pemisahan berlangsung instan tanpa menurunkan kualitas PDF.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <Shield className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Privasi Terjaga</h4>
             <p className="text-slate-400 text-sm">Seluruh proses terjadi di peramban Anda. Tidak ada data yang dikirim ke server.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <Target className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Presisi Tinggi</h4>
             <p className="text-slate-400 text-sm">Pilih halaman mana pun yang Anda inginkan dengan kontrol rentang kustom.</p>
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
                <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                  <Scissors className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Fungsi Fitur<br/><span className="text-emerald-400">Split PDF</span>
              </h2>
            </div>
            
            <div className="space-y-5 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p className="text-slate-300/90 text-base sm:text-lg mb-2">
                Alat <strong className="text-white">Pisahkan PDF (Split)</strong> dirancang untuk memecah satu dokumen PDF besar menjadi bagian-bagian yang lebih kecil secara presisi.
              </p>
              
              <div className="bg-slate-800/40 rounded-3xl p-5 sm:p-6 border border-slate-700/50 shadow-inner">
                <h4 className="text-white font-bold mb-3 flex items-center gap-3 text-base">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Mode Ekstrak Semua
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed ml-5">
                  Secara otomatis memisahkan <span className="text-white font-medium">setiap halaman</span> dokumen menjadi file PDF tunggal yang independen. Cocok jika Anda butuh mengisolasi semua halaman sekaligus (hasil berupa file .zip).
                </p>
              </div>

              <div className="bg-slate-800/40 rounded-3xl p-5 sm:p-6 border border-slate-700/50 shadow-inner">
                <h4 className="text-white font-bold mb-3 flex items-center gap-3 text-base">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Mode Rentang Khusus
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed ml-5">
                  Gunakan Range Builder untuk menentukan halaman dari mana ke mana yang ingin diekstrak secara visual. Setiap rentang akan menghasilkan 1 dokumen independen.
                </p>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-lg border border-emerald-400/20"
              >
                Saya Mengerti
              </button>
              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
                <Shield className="w-4 h-4 text-emerald-500/70" strokeWidth={2.5} />
                <span>Proses dilakukan secara lokal & terenkripsi.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Style for scrollbar customization in Ekstrak Semua */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
          0% { transform: translateX(-100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </main>
  );
}
