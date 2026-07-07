"use client";

import { UploadCloud, FileType, CheckCircle2, ArrowLeft, Loader2, Download, FilePlus , Shield, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

export default function EditWorkspace() {
  const slug = "edit";
  const tool = pdfTools.find(t => t.id === slug) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-emerald-400/30 pt-16">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-400/5 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      <main className="container mx-auto px-4 py-10 lg:py-16 relative z-10 max-w-5xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className={`mx-auto w-24 h-24 rounded-[2rem] mb-8 flex items-center justify-center ${tool.bgColor || "bg-emerald-500/10"} ${tool.color || "text-emerald-400"} shadow-xl shadow-black/20 border border-white/5`}>
            {tool.icon ? <tool.icon className="w-12 h-12" strokeWidth={1.5} /> : <FileType className="w-12 h-12" />}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            {tool.title || "PDF Tool"}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {tool.description || "Unggah dokumen PDF untuk diproses langsung di dalam browser Anda tanpa server."}
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
          {selectedFiles.length > 0 ? (
            <div className="text-center animate-in zoom-in-95 duration-300 w-full max-w-lg mx-auto">
              
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative w-16 h-20 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center shadow-xl shadow-black/20 group-hover:scale-105 transition-transform">
                    {idx === 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <FileType className="w-6 h-6 text-emerald-400 opacity-80 mb-1" strokeWidth={1.5} />
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

              <div className="flex justify-center gap-4">
                {processingState === 'idle' || processingState === 'error' ? (
                  <>
                    <button onClick={() => setSelectedFiles([])} className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all border border-slate-700 hover:border-slate-600 active:scale-95 flex items-center justify-center gap-2">
                      Reset
                    </button>
                    <button onClick={processFile} className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 text-lg border border-emerald-400/20">
                      Proses File
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
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300 relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 items-center w-full mt-4">
                    <p className="text-emerald-400 font-bold text-xl">File berhasil diproses!</p>
                    
                    <button 
                      onClick={handleDownload} 
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-lg border border-emerald-400/20"
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
                  ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]' 
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
                multiple={false}
              />
              
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-800/80 border border-slate-700 shadow-xl mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
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
                className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 flex items-center gap-2"
              >
                <UploadCloud className="w-5 h-5" />
                Pilih File PDF
              </button>
            </div>
          )}
        </div>
      </div>

        <div className="mt-12 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link 
            href="/pdf-tools" 
            className="group inline-flex items-center gap-2.5 text-xs font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.15em] bg-white/[0.03] hover:bg-white/[0.08] px-6 py-4 rounded-2xl border border-white/[0.05] hover:border-white/[0.15] backdrop-blur-md shadow-lg shadow-black/20"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
            Kembali ke PDF Tools
          </Link>
        </div>
      </main>
    </div>
  );
}
