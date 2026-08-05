"use client";

/**
 * Generate a thumbnail data URL from a PDF File object.
 * Currently disabled to prevent Next.js 15 Webpack crashes with pdfjs-dist.
 * @param {File} file - The PDF file object
 * @returns {Promise<string|null>} - Base64 Data URL or null
 */
export const generatePdfThumbnail = async (file) => {
  // Return null to use the default UI fallback icon instead of crashing Webpack
  return null;
};

export const loadPdfDocument = async (file) => {
  return null;
};

export const generateThumbnailForPage = async (pdf, pageNumber, targetWidth = 300) => {
  return null;
};
