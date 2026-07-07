"use client";

/**
 * Generate a thumbnail data URL from a PDF File object (Legacy function for compatibility).
 * @param {File} file - The PDF file object
 * @returns {Promise<string>} - Base64 Data URL of the first page
 */
export const generatePdfThumbnail = async (file) => {
  if (typeof window === 'undefined') return null;

  try {
    const pdf = await loadPdfDocument(file);
    if (!pdf) return null;
    const dataUrl = await generateThumbnailForPage(pdf, 1);
    // Cleanup if needed? pdfjs handles it mostly, but good practice to destroy
    if (pdf.destroy) pdf.destroy();
    return dataUrl;
  } catch (error) {
    console.error("Gagal membuat thumbnail PDF:", error);
    return null;
  }
};

/**
 * Load a PDF document using pdfjs-dist.
 * @param {File} file - The PDF file object
 * @returns {Promise<object>} - Loaded PDF Document Proxy
 */
export const loadPdfDocument = async (file) => {
  if (typeof window === 'undefined') return null;
  
  const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
  
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  return await loadingTask.promise;
};

/**
 * Generate a thumbnail data URL for a specific page from a loaded PDF document.
 * @param {object} pdf - Loaded PDF Document Proxy (from loadPdfDocument)
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {number} targetWidth - Target width of the thumbnail
 * @returns {Promise<string>} - Base64 Data URL
 */
export const generateThumbnailForPage = async (pdf, pageNumber, targetWidth = 300) => {
  if (typeof window === 'undefined' || !pdf) return null;
  
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.0 });
    const scale = targetWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport
    };
    
    await page.render(renderContext).promise;
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error(`Gagal merender halaman ${pageNumber}:`, error);
    return null;
  }
};
