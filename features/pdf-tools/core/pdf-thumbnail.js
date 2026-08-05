"use client";

// Dynamic import to prevent Next.js SSR crashes with pdfjs-dist
let pdfjsLib = null;

const initPdfJs = async () => {
  if (pdfjsLib) return pdfjsLib;
  if (typeof window === "undefined") return null;

  try {
    // Import pdfjs-dist dynamically only on client side
    pdfjsLib = await import("pdfjs-dist/build/pdf.min.mjs");
    
    // Use unpkg worker to avoid Next.js 15 Webpack worker bundling issues
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
    
    return pdfjsLib;
  } catch (err) {
    console.error("Error initializing pdfjs-dist:", err);
    return null;
  }
};

export const loadPdfDocument = async (file) => {
  try {
    const pdfjs = await initPdfJs();
    if (!pdfjs) return null;
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    return await loadingTask.promise;
  } catch (error) {
    console.error("Failed to load PDF:", error);
    return null;
  }
};

export const generateThumbnailForPage = async (pdf, pageNumber, targetWidth = 300) => {
  try {
    if (!pdf) return null;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.0 });
    const scale = targetWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };

    await page.render(renderContext).promise;
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Failed to generate thumbnail:", error);
    return null;
  }
};

export const generatePdfThumbnail = async (file) => {
  const doc = await loadPdfDocument(file);
  if (doc) {
    return await generateThumbnailForPage(doc, 1);
  }
  return null;
};
