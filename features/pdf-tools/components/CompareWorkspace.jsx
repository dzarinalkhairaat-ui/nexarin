"use client";

import { UploadCloud, FileType, CheckCircle2, ArrowLeft, Loader2, Download, FilePlus, X, FileDiff , Shield, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { 
  processJpgToPdf, processPdfToWord, processCompressPdf, 
  processPdfToExcel, processWordToPdf, processPdfToPng, 
  processEditPdf, processMergePdf, processSplitPdf,
  processPdfToPowerpoint, processPowerpointToPdf, processExcelToPdf,
  processSignPdf, processWatermarkPdf, processRotatePdf, processHtmlToPdf,
  processUnlockPdf, processProtectPdf, processOrganizePdf, processPdfToPdfa,
  processRepairPdf, processPageNumbersPdf, processScanPdf, processOcrPdf, processComparePdf, processRedactPdf,
  processCropPdf, processFormsPdf, processTranslatePdf, processMarkdownPdf,
  mockProcessPdf 
} from "@/features/pdf-tools/core/pdf-processing";
import { saveAs } from "file-saver";

export default function CompareWorkspace() {
  const slug = "compare";
  const tool = pdfTools.find(t => t.id === slug) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (showInfoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showInfoModal]);

  const isMulti = slug === 'merge' || slug === 'compare';

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
      if (isMulti) {
        handleFileSelection(Array.from(e.dataTransfer.files));
      } else {
        handleFileSelection([e.dataTransfer.files[0]]);
      }
    }
  };

  const handleFileSelection = (files) => {
    const firstFile = files[0];
    
    // Validate file type if needed
    if ((slug === 'jpg-to-pdf' || slug === 'scan') && !firstFile.type.startsWith('image/')) {
      alert("Harap unggah file gambar (JPG/PNG).");
      return;
    }
    if (slug === 'word-to-pdf' && !firstFile.name.toLowerCase().endsWith('.docx') && !firstFile.name.toLowerCase().endsWith('.doc')) {
      alert("Harap unggah file Word (.docx atau .doc).");
      return;
    }
    if (slug === 'excel-to-pdf' && !firstFile.name.toLowerCase().endsWith('.xlsx') && !firstFile.name.toLowerCase().endsWith('.xls') && !firstFile.name.toLowerCase().endsWith('.csv')) {
      alert("Harap unggah file Excel.");
      return;
    }
    if ((slug === 'powerpoint-to-pdf' || slug === 'pdf-to-powerpoint') && !firstFile.name.toLowerCase().endsWith('.pptx') && !firstFile.name.toLowerCase().endsWith('.ppt')) {
      if (slug === 'powerpoint-to-pdf') {
         alert("Harap unggah file PowerPoint.");
         return;
      }
    }
    if (slug === 'html-to-pdf' && !firstFile.name.toLowerCase().endsWith('.html') && !firstFile.name.toLowerCase().endsWith('.htm')) {
      alert("Harap unggah file HTML.");
      return;
    }
    
    if (isMulti) {
      // Append files for merge
      setSelectedFiles(prev => [...prev, ...files]);
    } else {
      setSelectedFiles([firstFile]);
    }
    
    setProcessingState('idle');
    setProgress(0);
    setProcessedResult(null);
    setErrorMsg('');
  };

  const processFile = async () => {
    if (selectedFiles.length === 0) return;
    
    if (isMulti && selectedFiles.length < 2) {
      setErrorMsg(slug === 'compare' ? "Harap unggah tepat 2 file PDF untuk dibandingkan." : "Harap unggah minimal 2 file PDF untuk digabungkan.");
      setProcessingState('error');
      return;
    }
    
    setProcessingState('processing');
    setProgress(0);
    
    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next > 90 ? 90 : next;
      });
    }, 250);
    
    try {
      let result;
      const singleFile = selectedFiles[0];
      
      if (slug === 'jpg-to-pdf') {
        result = await processJpgToPdf(singleFile);
      } else if (slug === 'pdf-to-word') {
        result = await processPdfToWord(singleFile);
      } else if (slug === 'compress') {
        result = await processCompressPdf(singleFile);
      } else if (slug === 'pdf-to-excel') {
        result = await processPdfToExcel(singleFile);
      } else if (slug === 'word-to-pdf') {
        result = await processWordToPdf(singleFile);
      } else if (slug === 'pdf-to-png') {
        result = await processPdfToPng(singleFile);
      } else if (slug === 'edit') {
        result = await processEditPdf(singleFile);
      } else if (slug === 'merge') {
        result = await processMergePdf(selectedFiles);
      } else if (slug === 'split') {
        result = await processSplitPdf(singleFile);
      } else if (slug === 'pdf-to-powerpoint') {
        result = await processPdfToPowerpoint(singleFile);
      } else if (slug === 'powerpoint-to-pdf') {
        result = await processPowerpointToPdf(singleFile);
      } else if (slug === 'excel-to-pdf') {
        result = await processExcelToPdf(singleFile);
      } else if (slug === 'sign') {
        result = await processSignPdf(singleFile);
      } else if (slug === 'watermark') {
        result = await processWatermarkPdf(singleFile);
      } else if (slug === 'rotate') {
        result = await processRotatePdf(singleFile);
      } else if (slug === 'html-to-pdf') {
        result = await processHtmlToPdf(singleFile);
      } else if (slug === 'unlock') {
        result = await processUnlockPdf(singleFile);
      } else if (slug === 'protect') {
        result = await processProtectPdf(singleFile);
      } else if (slug === 'organize') {
        result = await processOrganizePdf(singleFile);
      } else if (slug === 'pdf-to-pdfa') {
        result = await processPdfToPdfa(singleFile);
      } else if (slug === 'repair') {
        result = await processRepairPdf(singleFile);
      } else if (slug === 'page-numbers') {
        result = await processPageNumbersPdf(singleFile);
      } else if (slug === 'scan') {
        result = await processScanPdf(singleFile);
      } else if (slug === 'ocr') {
        result = await processOcrPdf(singleFile);
      } else if (slug === 'compare') {
        result = await processComparePdf(selectedFiles);
      } else if (slug === 'redact') {
        result = await processRedactPdf(singleFile);
      } else if (slug === 'crop') {
        result = await processCropPdf(singleFile);
      } else if (slug === 'forms') {
        result = await processFormsPdf(singleFile);
      } else if (slug === 'translate') {
        result = await processTranslatePdf(singleFile);
      } else if (slug === 'markdown') {
        result = await processMarkdownPdf(singleFile);
      } else {
        result = await mockProcessPdf(singleFile, slug);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      setProcessedResult(result);
      
      setTimeout(() => {
        setProcessingState('success');
      }, 500); // Brief pause at 100% before showing success
    } catch (error) {
      clearInterval(progressInterval);
      console.error(error);
      setProcessingState('error');
      setErrorMsg(error.message || "Terjadi kesalahan saat memproses file.");
    }
  };

  const handleDownload = () => {
    if (processedResult?.blob && processedResult?.outputFilename) {
      saveAs(processedResult.blob, processedResult.outputFilename);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-10 sm:pt-16 text-slate-300 selection:bg-orange-500/30 relative">
      <div className="max-w-5xl mx-auto px-6 pb-20 relative z-10">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-orange-500/10 text-orange-400 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-orange-500/20">
            <FileDiff className="w-10 h-10" />
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Bandingkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">PDF</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Bandingkan dua dokumen PDF untuk menemukan perbedaan teks dan visual secara cepat dan akurat.{' '}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-orange-400 hover:text-orange-300 font-semibold underline decoration-orange-500/30 hover:decoration-orange-400 underline-offset-4 transition-colors"
            >
              Klik disini untuk penjelasan fitur.
            </button>
          </p>
        </div>

        
        {/* Back Button (Moved from bottom) */}
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
        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-orange-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
          {selectedFiles.length > 0 ? (
            <div className="text-center animate-in zoom-in-95 duration-300 w-full max-w-lg mx-auto">
              
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative w-16 h-20 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center shadow-xl shadow-black/20 group-hover:scale-105 transition-transform">
                    {idx === 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <FileType className="w-6 h-6 text-orange-400 opacity-80 mb-1" strokeWidth={1.5} />
                    <span className="text-[10px] truncate w-14 px-1 text-slate-300">{file.name}</span>
                  </div>
                ))}
                {isMulti && processingState === 'idle' && (
                  <label className="cursor-pointer relative w-16 h-20 bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-white/20 rounded-xl flex items-center justify-center transition-colors">
                    <FilePlus className="w-6 h-6 text-slate-400" />
                    <input type="file" multiple className="hidden" accept=".pdf" onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) handleFileSelection(Array.from(e.target.files));
                    }} />
                  </label>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 truncate max-w-full px-4">
                {isMulti ? `${selectedFiles.length} File Terpilih` : selectedFiles[0].name}
              </h3>
              <p className="text-slate-400 mb-10 text-lg">Siap diproses</p>
              
              {processingState === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mt-2">
                {processingState === 'idle' || processingState === 'error' ? (
                  <>
                    <button onClick={() => setSelectedFiles([])} className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-2xl transition-all border border-slate-700 hover:border-slate-500 active:scale-95 flex items-center justify-center gap-2 shadow-sm backdrop-blur-sm">
                      Reset
                    </button>
                    <button onClick={processFile} className="w-full sm:flex-1 px-10 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-600 hover:from-orange-600 hover:via-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg border border-orange-400/30">
                      Bandingkan File
                    </button>
                  </>
                ) : processingState === 'processing' ? (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                      <span>Memproses file...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-300 relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 items-center w-full mt-4">
                    <p className="text-orange-400 font-bold text-xl">File berhasil dibandingkan!</p>
                    
                    <button 
                      onClick={handleDownload} 
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-lg border border-orange-400/20"
                    >
                      <Download className="w-6 h-6" strokeWidth={2.5} />
                      Unduh Hasil
                    </button>
                    
                    <button onClick={() => setSelectedFiles([])} className="text-slate-400 hover:text-white transition-colors text-sm font-bold underline underline-offset-4">
                      Proses File Lain
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div 
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 ${
                isDragging 
                  ? 'border-orange-400 bg-orange-500/10 scale-[1.02]' 
                  : 'border-slate-700/50 hover:border-slate-500/80 bg-slate-800/20 hover:bg-slate-800/40'
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
                  if (e.target.files && e.target.files.length > 0) handleFileSelection(Array.from(e.target.files));
                }}
                accept=".pdf,application/pdf"
                multiple={true}
              />
              
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-800/80 border border-slate-700 shadow-xl mb-6 text-orange-400 group-hover:scale-110 transition-transform">
                <FilePlus className="w-12 h-12 opacity-80" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-white font-bold text-xl mb-3 text-center px-4">
                Tarik & lepas file atau pilih dari perangkat
              </h3>
              
              <p className="text-slate-400 text-center text-sm mb-8 max-w-sm px-4 leading-relaxed">
                Anda bisa memilih file dokumen PDF yang ingin diproses secara otomatis.
              </p>
              
              <button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 flex items-center gap-2"
              >
                <UploadCloud className="w-5 h-5" />
                Pilih File PDF
              </button>
            </div>
          )}
        </div>
      </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10 px-4">
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                <Zap className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Pemrosesan Cerdas</h4>
             <p className="text-slate-400 text-sm">Engine pintar kami menganalisis dan memproses file dengan cepat & akurat.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <Shield className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Privasi Terjaga</h4>
             <p className="text-slate-400 text-sm">Seluruh proses dapat dilakukan secara aman. Data dihapus otomatis.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
             <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                <Sparkles className="w-6 h-6" />
             </div>
             <h4 className="text-white font-bold mb-2">Kualitas Terjaga</h4>
             <p className="text-slate-400 text-sm">Didesain khusus untuk menjaga kualitas teks, gambar, dan layout dokumen Anda.</p>
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
            
            <div className="flex items-center gap-4 mb-6 pr-12">
              <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400 shrink-0">
                <FileDiff className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">Fungsi Fitur Bandingkan PDF</h2>
            </div>
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Alat <strong>Bandingkan PDF (Compare PDF)</strong> digunakan untuk mencari perbedaan antara dua versi dokumen yang tampak serupa tanpa harus membacanya baris demi baris.
              </p>
              
              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" /> Sorot Perbedaan Teks
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Mesin kami akan menganalisis revisi antara dua dokumen (misal: draf awal vs draf akhir) lalu menyorot kata yang ditambahkan, dihapus, atau diubah dengan warna yang berbeda.
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" /> Hemat Waktu
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Sangat cocok bagi pengacara, editor, atau akademisi yang berurusan dengan kontrak atau manuskrip panjang, agar tidak ada satu katapun revisi yang terlewatkan.
                </p>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl transition-colors w-full"
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
