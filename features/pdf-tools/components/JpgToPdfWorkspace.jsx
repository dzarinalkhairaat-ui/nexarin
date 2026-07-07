"use client";

import { UploadCloud, CheckCircle2, Loader2, Download, X, Image as ImageIcon, ArrowRight, ArrowLeft, Maximize2, Check } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processJpgToPdf } from "@/features/pdf-tools/core/pdf-processing";
import { saveAs } from "file-saver";

export default function JpgToPdfWorkspace() {
  const slug = "jpg-to-pdf";
  const tool = pdfTools.find(t => t.id === slug) || {};
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState("");
  
  // Settings
  const [pageSize, setPageSize] = useState("fit"); // fit, a4, letter
  const [orientation, setOrientation] = useState("portrait"); // portrait, landscape
  const [margin, setMargin] = useState("none"); // none, small, big
  const [mergeAll, setMergeAll] = useState(true);
  
  const fileInputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState({});

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
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert("Harap unggah file gambar (JPG/PNG).");
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Generate object URLs
    const newUrls = {};
    validFiles.forEach(f => {
      newUrls[f.name + f.size] = URL.createObjectURL(f);
    });
    setPreviewUrls(prev => ({ ...prev, ...newUrls }));
    
    if (processingState === 'success' || processingState === 'error') {
      setProcessingState('idle');
      setProgress(0);
      setProcessedResult(null);
      setErrorMsg('');
    }
  };

  const removeFile = (index) => {
    const fileToRemove = selectedFiles[index];
    const key = fileToRemove.name + fileToRemove.size;
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke url
    if (previewUrls[key]) {
      URL.revokeObjectURL(previewUrls[key]);
      const newUrls = { ...previewUrls };
      delete newUrls[key];
      setPreviewUrls(newUrls);
    }
    
    if (selectedFiles.length <= 1) {
      setProcessingState('idle');
      setProcessedResult(null);
    }
  };

  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg("Harap unggah gambar terlebih dahulu.");
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
      const result = await processJpgToPdf(selectedFiles, { 
        pageSize,
        orientation: pageSize === 'fit' ? 'auto' : orientation,
        margin,
        merge: mergeAll
      });
      
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
      let finalName = downloadFilename || processedResult.outputFilename || (mergeAll || selectedFiles.length === 1 ? "nexarin_img_to_pdf.pdf" : "nexarin_img_to_pdf.zip");
      const expectedExt = processedResult.blob.type === "application/zip" ? ".zip" : ".pdf";
      
      if (!finalName.toLowerCase().endsWith(expectedExt)) {
        finalName += expectedExt;
      }
      saveAs(processedResult.blob, finalName);
    }
  };

  const resetWorkspace = () => {
    Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls({});
    setProcessingState('idle');
    setProcessedResult(null);
    setProgress(0);
    setPageSize("fit");
    setOrientation("portrait");
    setMargin("none");
    setMergeAll(true);
  };

  useEffect(() => {
    if (showInfoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showInfoModal]);

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 pt-10 sm:pt-16 text-slate-300 selection:bg-yellow-500/30 relative">
      <div className="max-w-6xl mx-auto px-6 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-yellow-500/10 text-yellow-400 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.15)] ring-1 ring-yellow-500/20">
            <ImageIcon className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Konversi <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">JPG ke PDF</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Ubah gambar Anda menjadi PDF, atur batas margin, dan gabungkan sesuka hati.{' '}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-yellow-400 hover:text-yellow-300 font-semibold underline decoration-yellow-500/30 hover:decoration-yellow-400 underline-offset-4 transition-colors"
            >
              Klik disini untuk fitur lanjutan.
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-yellow-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {processingState === 'idle' || processingState === 'error' ? (
              <>
                {selectedFiles.length === 0 ? (
                  <div 
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 md:p-24 transition-all duration-300 ${
                      isDragging 
                        ? 'border-yellow-400 bg-yellow-500/10 scale-[1.02]' 
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
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) handleFileSelection(e.target.files);
                        e.target.value = '';
                      }}
                      accept="image/png, image/jpeg, image/jpg"
                      ref={fileInputRef}
                    />
                    
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-white font-bold text-xl md:text-3xl mb-3 text-center px-4">
                      Tarik & lepas banyak gambar sekaligus
                    </h3>
                    
                    <p className="text-slate-400 text-center text-sm md:text-base mb-8 max-w-md px-4 leading-relaxed">
                      Mendukung format JPG dan PNG. Gabungkan semua foto Anda ke dalam satu dokumen PDF berkualitas.
                    </p>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-yellow-500 text-white font-bold rounded-2xl hover:bg-yellow-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] flex items-center gap-2"
                    >
                      <UploadCloud className="w-5 h-5" />
                      Pilih Gambar
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                      
                      {/* Left: Gallery View */}
                      <div className="w-full lg:w-[55%] flex flex-col">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                          <h3 className="text-white font-bold text-xl flex items-center gap-3">
                            <span className="bg-yellow-500/20 text-yellow-400 py-1 px-3 rounded-lg text-sm">{selectedFiles.length}</span>
                            Daftar Gambar
                          </h3>
                          <div className="flex gap-2">
                            <button 
                              onClick={resetWorkspace}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-xl transition-all border border-red-500/20 flex items-center gap-2"
                            >
                              Kosongkan
                            </button>
                          </div>
                          
                          <input 
                            type="file" 
                            className="hidden" 
                            multiple
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) handleFileSelection(e.target.files);
                              e.target.value = '';
                            }}
                            accept="image/png, image/jpeg, image/jpg"
                            ref={fileInputRef}
                          />
                        </div>
                        
                        <div className="bg-slate-950/30 border border-slate-800/80 rounded-[2rem] p-6 max-h-[600px] overflow-y-auto shadow-inner">
                          <div className="flex flex-wrap gap-5">
                            {selectedFiles.map((file, idx) => (
                              <div key={idx} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-yellow-500/70 transition-all shadow-xl h-44 sm:h-52 flex-shrink-0">
                                <img 
                                  src={previewUrls[file.name + file.size]} 
                                  className="h-full w-auto object-contain bg-slate-950/50"
                                  alt={file.name}
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-yellow-400 text-xs px-2.5 py-1.5 rounded-lg font-bold border border-yellow-500/30 shadow-lg">
                                    #{idx + 1}
                                  </span>
                                  
                                  <button 
                                    onClick={() => removeFile(idx)}
                                    className="absolute top-3 right-3 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all transform scale-75 group-hover:scale-100 shadow-xl"
                                  >
                                    <X className="w-4 h-4 stroke-[3]" />
                                  </button>
                                  
                                  <div className="absolute bottom-3 left-0 w-full px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white text-xs font-medium truncate w-full drop-shadow-md px-2 py-1 bg-slate-900/60 rounded-md border border-white/10">{file.name}</p>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Tambah Button */}
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="h-44 sm:h-52 aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/20 hover:bg-yellow-500/5 hover:border-yellow-500/50 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-yellow-400 transition-all group shadow-sm flex-shrink-0"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-yellow-500/20 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg group-hover:shadow-yellow-500/20">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <span className="font-bold text-sm">Tambah Gambar</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Options & Controls */}
                      <div className="w-full lg:w-[45%] flex flex-col">
                        <h3 className="text-white font-bold text-xl mb-4">Pengaturan PDF</h3>
                        
                        {processingState === 'error' && (
                          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                            <X className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed">{errorMsg}</p>
                          </div>
                        )}
                        
                        {/* Options Selection */}
                        <div className="space-y-6 mb-8 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50">
                          
                          {/* PAGE SIZE */}
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Page Size</label>
                            <div className="relative">
                              <select 
                                value={pageSize}
                                onChange={(e) => setPageSize(e.target.value)}
                                className="w-full appearance-none bg-slate-800 border-2 border-slate-700 text-white px-5 py-4 rounded-xl font-medium hover:border-slate-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 cursor-pointer transition-all"
                              >
                                <option value="fit">Fit (Same page size as image)</option>
                                <option value="a4">A4 (210 x 297 mm)</option>
                                <option value="letter">US Letter (215.9 x 279.4 mm)</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                            </div>
                          </div>

                          {/* ORIENTATION (Always show and clickable) */}
                          <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Orientation</label>
                            </div>
                            <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shadow-inner">
                              <button 
                                onClick={() => {
                                  setOrientation('portrait');
                                  if (pageSize === 'fit') setPageSize('a4');
                                }}
                                className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all duration-300 ${orientation === 'portrait' ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-slate-900 shadow-[0_4px_15px_rgba(234,179,8,0.4)] scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                              >
                                Potret (Tegak)
                              </button>
                              <button 
                                onClick={() => {
                                  setOrientation('landscape');
                                  if (pageSize === 'fit') setPageSize('a4');
                                }}
                                className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all duration-300 ${orientation === 'landscape' ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-slate-900 shadow-[0_4px_15px_rgba(234,179,8,0.4)] scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                              >
                                Lansekap (Menyamping)
                              </button>
                            </div>
                          </div>

                          {/* MARGIN */}
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Margin</label>
                            <div className="grid grid-cols-3 gap-3">
                              
                              <button 
                                onClick={() => setMargin('none')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                  margin === 'none' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                                }`}
                              >
                                <div className={`w-8 h-10 border border-current rounded-sm flex items-center justify-center mb-2 ${margin === 'none' ? 'text-yellow-400' : 'text-slate-500'}`}>
                                  <div className="w-full h-full bg-current opacity-20"></div>
                                </div>
                                <span className={`text-xs font-bold ${margin === 'none' ? 'text-yellow-400' : 'text-slate-400'}`}>No margin</span>
                              </button>

                              <button 
                                onClick={() => setMargin('small')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                  margin === 'small' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                                }`}
                              >
                                <div className={`w-8 h-10 border border-current rounded-sm flex items-center justify-center p-1 mb-2 ${margin === 'small' ? 'text-yellow-400' : 'text-slate-500'}`}>
                                  <div className="w-full h-full border border-dashed border-current flex items-center justify-center opacity-50">
                                    <div className="w-3 h-3 bg-current opacity-30"></div>
                                  </div>
                                </div>
                                <span className={`text-xs font-bold ${margin === 'small' ? 'text-yellow-400' : 'text-slate-400'}`}>Small</span>
                              </button>

                              <button 
                                onClick={() => setMargin('big')}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                  margin === 'big' ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                              >
                                <div className={`w-8 h-10 border-2 rounded-sm flex items-center justify-center p-2 mb-3 transition-colors ${margin === 'big' ? 'border-yellow-400 text-yellow-400' : 'border-slate-500 text-slate-500'}`}>
                                  <div className="w-full h-full border border-dashed border-current flex items-center justify-center opacity-50">
                                    <div className="w-2 h-2 bg-current opacity-30"></div>
                                  </div>
                                </div>
                                <span className={`text-xs font-bold ${margin === 'big' ? 'text-yellow-400' : 'text-slate-400'}`}>Big</span>
                              </button>
                            </div>
                          </div>

                          {/* DYNAMIC LAYOUT PREVIEW */}
                          <div className="mt-8 border-t border-slate-800 pt-6">
                            <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider text-center">Live Preview</label>
                            <div className="flex bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
                              
                              {/* Fading edges for scroll hint */}
                              {selectedFiles.length > 1 && (
                                <>
                                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
                                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
                                </>
                              )}

                              <div className={`flex items-center overflow-x-auto w-full py-8 px-8 snap-x hide-scrollbar gap-8 ${selectedFiles.length === 1 ? 'justify-center' : 'justify-start'}`}>
                                {selectedFiles.map((file, idx) => (
                                  <div key={idx} className={`shrink-0 snap-center transition-all duration-700 ease-in-out bg-white rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative flex items-center justify-center overflow-hidden ring-4 ring-slate-800/60 ${pageSize === 'fit' ? 'w-48 h-48 rounded-xl' : orientation === 'portrait' ? 'w-40 h-56' : 'w-56 h-40'}`}>
                                    
                                    {/* Inner Content Area representing margins */}
                                    <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ease-in-out bg-white ${pageSize === 'fit' ? (margin === 'none' ? 'p-0' : margin === 'small' ? 'p-3' : 'p-6') : (margin === 'none' ? 'p-0' : margin === 'small' ? 'p-3' : 'p-5')}`}>
                                      
                                      {/* The Image */}
                                      <div className="w-full h-full flex items-center justify-center relative overflow-hidden transition-all duration-300">
                                        <img 
                                          src={previewUrls[file.name + file.size]} 
                                          alt={`Preview ${idx + 1}`}
                                          className="w-full h-full object-contain drop-shadow-sm"
                                        />
                                        
                                        {/* Page Number indicator */}
                                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
                                          {idx + 1}
                                        </div>

                                        {/* Margin indicators (pink dashed lines) */}
                                        {margin !== 'none' && (
                                          <div className="absolute inset-0 border-[1.5px] border-dashed border-pink-500/60 pointer-events-none animate-pulse"></div>
                                        )}
                                      </div>

                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* MERGE CHECKBOX */}
                          {selectedFiles.length > 1 && (
                            <div className="pt-2">
                              <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${mergeAll ? 'bg-yellow-500 border-yellow-500' : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'}`}>
                                  {mergeAll && <Check className="w-4 h-4 text-slate-900 font-bold" strokeWidth={3} />}
                                </div>
                                <input 
                                  type="checkbox" 
                                  checked={mergeAll}
                                  onChange={(e) => setMergeAll(e.target.checked)}
                                  className="hidden"
                                />
                                <span className={`font-semibold transition-colors ${mergeAll ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                  Merge all images in one PDF file
                                </span>
                              </label>
                            </div>
                          )}
                          
                        </div>
                        
                        <div className="mt-auto flex gap-3">
                          <button 
                            onClick={processFiles} 
                            className="flex-1 py-4 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 hover:from-yellow-600 hover:via-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2"
                          >
                            Konversi Sekarang <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : processingState === 'processing' ? (
              <div className="animate-in fade-in zoom-in duration-500 w-full max-w-md mx-auto text-center py-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                  <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Memproses {selectedFiles.length} Gambar</h3>
                <p className="text-slate-400 mb-8">
                  {mergeAll && selectedFiles.length > 1 ? "Menyusun dan menggabungkan gambar..." : "Memformat batas dan ukuran halaman..."}
                </p>
                
                <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-white/5 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-300 relative" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <div className="text-right text-sm font-bold text-yellow-400">{progress}%</div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in duration-500 w-full max-w-md mx-auto text-center py-8">
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  <CheckCircle2 className="w-12 h-12 text-yellow-400" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2">Konversi Berhasil!</h3>
                <p className="text-slate-400 mb-10">
                  {mergeAll || selectedFiles.length === 1 
                    ? "Dokumen PDF gabungan Anda telah siap untuk diunduh." 
                    : "File arsip (ZIP) berisi semua dokumen PDF Anda telah siap."}
                </p>
                
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-8 text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Ubah Nama File Output</label>
                  <input 
                    type="text" 
                    value={downloadFilename}
                    onChange={(e) => setDownloadFilename(e.target.value)}
                    placeholder={processedResult?.outputFilename || (mergeAll ? "hasil_konversi.pdf" : "hasil_konversi.zip")}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                  />
                </div>
                
                <button 
                  onClick={handleDownload} 
                  className="w-full py-4 mb-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full transition-all shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-6 h-6" /> Unduh Hasil ({mergeAll || selectedFiles.length === 1 ? 'PDF' : 'ZIP'})
                </button>
                
                <button 
                  onClick={resetWorkspace} 
                  className="text-slate-400 hover:text-white font-semibold underline underline-offset-4 text-sm transition-colors"
                >
                  Konversi Gambar lainnya
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
            
            <div className="flex items-center gap-4 mb-6 pr-12">
              <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400 shrink-0">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">Fitur Lanjutan JPG ke PDF</h2>
            </div>
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Kini Anda dapat memproses banyak foto sekaligus dan mengaturnya seperti fotografer profesional.
              </p>
              
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" /> Page Size & Orientation
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Ubah kertas ke ukuran universal seperti <strong>A4</strong> atau <strong>US Letter</strong>. Atau gunakan <strong>Fit</strong> untuk menyesuaikan dengan resolusi asli gambar.
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" /> Smart Margin
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Tambahkan bingkai/bingkai putih (margin) di sekitar gambar Anda agar tidak terpotong saat di-print. Pilih antara margin kecil (Small) atau lebar (Big).
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" /> Batch Processing (Merge)
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Unggah 10 foto sekaligus, lalu centang <strong>Merge</strong> untuk menjadikannya 1 buku PDF. Hapus centangnya jika Anda ingin menerima 10 file PDF berbeda (dikompres dalam 1 file ZIP).
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors w-full"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
