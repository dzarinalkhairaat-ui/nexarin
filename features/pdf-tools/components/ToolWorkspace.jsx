"use client";

import { UploadCloud, FileType, CheckCircle2, ArrowLeft, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { pdfTools } from "@/features/pdf-tools/pdf-tools.data";
import { processJpgToPdf, processPdfToWord, processCompressPdf, processPdfToExcel, processWordToPdf, processPdfToPng, processEditPdf, mockProcessPdf } from "@/features/pdf-tools/core/pdf-processing";
import { saveAs } from "file-saver";

export default function ToolWorkspace({ slug }) {
  const tool = pdfTools.find(t => t.id === slug) || {};
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [processedResult, setProcessedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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
    // Validate file type if needed
    if (slug === 'jpg-to-pdf' && !file.type.startsWith('image/')) {
      alert("Harap unggah file gambar (JPG/PNG).");
      return;
    }
    if (slug === 'word-to-pdf' && !file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
      alert("Harap unggah file Word (.docx atau .doc).");
      return;
    }
    setSelectedFile(file);
    setProcessingState('idle');
    setProgress(0);
    setProcessedResult(null);
    setErrorMsg('');
  };

  const processFile = async () => {
    if (!selectedFile) return;
    setProcessingState('processing');
    setProgress(0);
    
    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 250);
    
    try {
      let result;
      if (slug === 'jpg-to-pdf') {
        result = await processJpgToPdf(selectedFile);
      } else if (slug === 'pdf-to-word') {
        result = await processPdfToWord(selectedFile);
      } else if (slug === 'compress') {
        result = await processCompressPdf(selectedFile);
      } else if (slug === 'pdf-to-excel') {
        result = await processPdfToExcel(selectedFile);
      } else if (slug === 'word-to-pdf') {
        result = await processWordToPdf(selectedFile);
      } else if (slug === 'pdf-to-png') {
        result = await processPdfToPng(selectedFile);
      } else if (slug === 'edit') {
        result = await processEditPdf(selectedFile);
      } else {
        result = await mockProcessPdf(selectedFile, slug);
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

        {/* Dropzone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center min-h-[420px] p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 shadow-2xl ${
            isDragging 
              ? "border-emerald-400 bg-emerald-400/10 scale-[1.02] shadow-emerald-500/20" 
              : "border-white/10 bg-[#0f172a80] hover:bg-[#1e293b80] hover:border-white/20 shadow-black/50 backdrop-blur-xl"
          }`}
        >
          {/* Subtle Inner Glow for Dropzone */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          {selectedFile ? (
            <div className="text-center animate-in zoom-in-95 duration-300 w-full max-w-lg mx-auto">
              <div className="relative w-20 h-24 mx-auto bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-black/20 group-hover:scale-105 transition-transform">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <FileType className="w-10 h-10 text-emerald-400 opacity-80" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 truncate max-w-full px-4" title={selectedFile.name}>
                {selectedFile.name}
              </h3>
              <p className="text-slate-400 mb-10 text-lg">Siap diproses ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
              
              {processingState === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-center gap-4">
                {processingState === 'idle' || processingState === 'error' ? (
                  <>
                    <button onClick={() => setSelectedFile(null)} className="px-6 py-3 rounded-xl font-bold transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10">
                      Ganti File
                    </button>
                    <button onClick={processFile} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/25">
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
                      className="w-full max-w-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-xl font-black transition-all shadow-lg shadow-emerald-500/25 inline-flex justify-center items-center gap-3 text-lg hover:-translate-y-1"
                    >
                      <Download className="w-6 h-6" strokeWidth={2.5} />
                      Unduh Hasil
                    </button>
                    
                    <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white transition-colors text-sm font-bold underline underline-offset-4">
                      Proses File Lain
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center pointer-events-none relative z-10">
              <div className="w-28 h-28 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-8 text-slate-300 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                <UploadCloud className="w-12 h-12" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Pilih File PDF</h3>
              <p className="text-slate-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                Tarik dan lepaskan file Anda di area ini, atau klik tombol di bawah. File tidak akan pernah diunggah ke server.
              </p>
              <label className="cursor-pointer bg-white text-slate-950 hover:bg-slate-200 px-12 py-4 rounded-2xl font-black transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] inline-flex items-center gap-3 text-lg pointer-events-auto hover:-translate-y-1">
                Jelajahi File
                <input type="file" className="hidden" accept={
                  slug === 'jpg-to-pdf' ? "image/png, image/jpeg" : 
                  slug === 'word-to-pdf' ? ".doc, .docx" : 
                  ".pdf"
                } onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) handleFileSelection(e.target.files[0]);
                }} />
              </label>
            </div>
          )}
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
