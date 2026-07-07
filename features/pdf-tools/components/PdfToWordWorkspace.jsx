"use client";

import { UploadCloud, FileType, CheckCircle2, Loader2, Download, X, FileText, ArrowRight, ArrowLeft, Shield, Sparkles, FileSearch, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processPdfToWord } from "@/features/pdf-tools/core/pdf-processing";
import { loadPdfDocument, generateThumbnailForPage } from "@/features/pdf-tools/core/pdf-thumbnail";
import { saveAs } from "file-saver";

export default function PdfToWordWorkspace() {
  const slug = "pdf-to-word";
  const tool = pdfTools.find(t => t.id === slug) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState("");
  
  // OCR Mode
  const [ocrMode, setOcrMode] = useState(false); // false = No OCR, true = OCR
  
  // PDF Preview Data
  const [pdfDoc, setPdfDoc] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  
  const fileInputRef = useRef(null);

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
      // Pass the selected OCR mode
      const result = await processPdfToWord(selectedFile, { ocr: ocrMode });
      
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
      setErrorMsg(error.message || "Terjadi kesalahan saat memproses file. Pastikan engine backend berjalan.");
    }
  };

  const handleDownload = () => {
    if (processedResult?.blob) {
      let finalName = downloadFilename || processedResult.outputFilename || "nexarin_pdf_to_word.docx";
      if (!finalName.toLowerCase().endsWith('.docx')) {
        finalName += '.docx';
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
    setOcrMode(false);
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
    <main className="min-h-screen bg-slate-950 pt-10 sm:pt-16 text-slate-300 selection:bg-blue-500/30 relative">
      <div className="max-w-4xl mx-auto px-6 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-blue-500/10 text-blue-400 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20">
            <FileText className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Konversi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">PDF ke Word</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Ubah file PDF Anda menjadi dokumen Word (DOC/DOCX) yang mudah diedit dengan format yang tetap rapi.{' '}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-blue-500/30 hover:decoration-blue-400 underline-offset-4 transition-colors"
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {processingState === 'idle' || processingState === 'error' ? (
              <>
                {!selectedFile ? (
                  <div 
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 ${
                      isDragging 
                        ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
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
                    
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-white font-bold text-xl mb-3 text-center px-4">
                      Tarik & lepas file atau pilih dari perangkat
                    </h3>
                    
                    <p className="text-slate-400 text-center text-sm mb-8 max-w-sm px-4 leading-relaxed">
                      Dokumen Anda dijamin 100% aman dan akan diproses secara instan.
                    </p>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-2"
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
                        <div className="group relative w-full aspect-[3/4] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-slate-200/20 flex flex-col items-center justify-center overflow-hidden mb-4 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] transition-all duration-300">
                          {/* Decorative Blue Document Header */}
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-400 z-10" />
                          
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
                          
                          <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded text-[10px] font-bold text-white border border-slate-700/50">
                            {totalPages > 0 ? `${totalPages} Halaman` : 'Memuat...'}
                          </div>
                        </div>
                        
                        <div className="text-center w-full">
                          <p className="text-white font-bold truncate px-2 text-sm">{selectedFile.name}</p>
                          <p className="text-slate-400 text-xs mt-1">Siap dikonversi</p>
                        </div>
                      </div>

                      {/* Right: Options & Controls */}
                      <div className="w-full md:w-2/3 flex flex-col">
                        <h3 className="text-white font-bold text-xl mb-4">Pengaturan Konversi</h3>
                        
                        {processingState === 'error' && (
                          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed">{errorMsg}</p>
                          </div>
                        )}
                        
                        {/* Options Selection */}
                        <div className="space-y-4 mb-8">
                          
                          {/* Option: No OCR */}
                          <label 
                            className={`flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                              !ocrMode 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800'
                            }`}
                            onClick={() => setOcrMode(false)}
                          >
                            <div className="flex items-center gap-4 select-none">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                !ocrMode ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                              }`}>
                                {!ocrMode && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold text-lg ${!ocrMode ? 'text-white' : 'text-slate-300'}`}>Tidak ada OCR</h4>
                                <p className={`text-sm mt-1 leading-relaxed ${!ocrMode ? 'text-blue-200' : 'text-slate-500'}`}>
                                  Konversi PDF dengan teks yang dapat dipilih menjadi file Word yang dapat diedit.
                                </p>
                              </div>
                            </div>
                          </label>

                          {/* Option: OCR */}
                          <label 
                            className={`flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                              ocrMode 
                                ? 'border-indigo-500 bg-indigo-500/10' 
                                : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800'
                            }`}
                            onClick={() => setOcrMode(true)}
                          >
                            <div className="flex items-center gap-4 select-none">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                ocrMode ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'
                              }`}>
                                {ocrMode && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold text-lg flex items-center gap-2 ${ocrMode ? 'text-white' : 'text-slate-300'}`}>
                                  OCR <Sparkles className="w-4 h-4 text-indigo-400" />
                                </h4>
                                <p className={`text-sm mt-1 leading-relaxed ${ocrMode ? 'text-indigo-200' : 'text-slate-500'}`}>
                                  Konversi PDF yang dipindai dengan teks yang tidak dapat dipilih menjadi file Word yang dapat diedit.
                                </p>
                              </div>
                            </div>
                          </label>
                          
                        </div>
                        
                        <div className="mt-auto flex gap-3">
                          <button 
                            onClick={processFile} 
                            className="flex-1 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                          >
                            Konversi ke Word <ArrowRight className="w-5 h-5" />
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
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Mengonversi Dokumen</h3>
                <p className="text-slate-400 mb-8">{ocrMode ? "Menjalankan OCR dan mengonversi ke Word..." : "Membaca teks dan mengonversi ke Word..."}</p>
                
                <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-white/5 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 relative" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <div className="text-right text-sm font-bold text-blue-400">{progress}%</div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in duration-500 w-full max-w-md mx-auto text-center py-8">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <CheckCircle2 className="w-12 h-12 text-blue-400" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2">Konversi Berhasil!</h3>
                <p className="text-slate-400 mb-10">
                  Dokumen Word Anda telah siap untuk diunduh.
                </p>
                
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-8 text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Ubah Nama File Output</label>
                  <input 
                    type="text" 
                    value={downloadFilename}
                    onChange={(e) => setDownloadFilename(e.target.value)}
                    placeholder={processedResult?.outputFilename || "hasil_konversi.docx"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <button 
                  onClick={handleDownload} 
                  className="w-full py-4 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-6 h-6" /> Unduh Hasil
                </button>
                
                <button 
                  onClick={resetWorkspace} 
                  className="text-slate-400 hover:text-white font-semibold underline underline-offset-4 text-sm transition-colors"
                >
                  Konversi PDF lainnya
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10 px-4">
        <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
           <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <Sparkles className="w-6 h-6" />
           </div>
           <h4 className="text-white font-bold mb-2">Presisi Tinggi</h4>
           <p className="text-slate-400 text-sm">Menjaga format, tata letak, dan tabel seperti aslinya.</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
           <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
              <FileSearch className="w-6 h-6" />
           </div>
           <h4 className="text-white font-bold mb-2">Teknologi OCR</h4>
           <p className="text-slate-400 text-sm">Mengekstrak teks dari gambar atau dokumen hasil pindaian (scan).</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
           <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
              <Shield className="w-6 h-6" />
           </div>
           <h4 className="text-white font-bold mb-2">Privasi Terjaga</h4>
           <p className="text-slate-400 text-sm">File Anda dihapus otomatis dari server setelah proses selesai.</p>
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
            
            <div className="flex items-center gap-4 mb-6 pr-12">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 shrink-0">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">Fungsi Fitur PDF ke Word</h2>
            </div>
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Alat <strong>PDF to Word</strong> kami dirancang untuk mengonversi dokumen PDF menjadi format Microsoft Word (DOC/DOCX) dengan akurasi tinggi.
              </p>
              
              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" /> Mode Normal (Tanpa OCR)
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Digunakan untuk dokumen PDF reguler dimana teksnya memang bisa diseleksi (diblok). Mesin konversi akan mempertahankan format persis seperti PDF aslinya.
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> Mode OCR (Optical Character Recognition)
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Pilih mode ini jika PDF Anda adalah hasil foto atau jepretan kamera (teks tidak bisa diblok). AI kami akan memindai gambar tersebut dan mengenali huruf demi huruf menjadi teks yang bisa diedit.
                </p>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors w-full"
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
