import { PDFDocument, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function processJpgToPdf(files, options = {}) {
  try {
    const fileArray = Array.isArray(files) ? files : [files];
    const pdfDoc = await PDFDocument.create();

    for (const file of fileArray) {
      const imageBytes = await file.arrayBuffer();
      let image;
      const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
      if (isPng) {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        image = await pdfDoc.embedJpg(imageBytes);
      }
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const outputFilename = fileArray[0].name.replace(/\.[^/.]+$/, "") + "_nexarin.pdf";
    return { blob, outputFilename };
  } catch (clientError) {
    console.warn("Client-side JPG to PDF failed, trying API fallback:", clientError);
    const formData = new FormData();
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach(file => {
      formData.append('files', file);
    });
    
    if (options.orientation) formData.append('orientation', options.orientation);
    if (options.pageSize) formData.append('pageSize', options.pageSize);
    if (options.margin) formData.append('margin', options.margin);
    if (options.merge !== undefined) formData.append('merge', options.merge);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/img-to-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      let errMsg = "Gagal mengonversi file. Pastikan file gambar valid.";
      try {
        const errorData = await response.json();
        if (errorData.detail) errMsg = `Server Error: ${errorData.detail}`;
      } catch (e) {}
      throw new Error(errMsg);
    }
    
    const blob = await response.blob();
    const outputFilename = fileArray[0].name.replace(/\.[^/.]+$/, "") + "_nexarin.pdf";
    return { blob, outputFilename };
  }
}

export async function processPdfToWord(file, options = {}) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.ocr) {
      formData.append('ocr', 'true');
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/pdf-to-word`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      let errMsg = "Gagal mengonversi file. Pastikan API Python berjalan.";
      try {
        const errorData = await response.json();
        if (errorData.detail) errMsg = `Server Error: ${errorData.detail}`;
      } catch (e) {}
      throw new Error(errMsg);
    }
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.docx";
    
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error converting PDF to Word via API:", error);
    throw error;
  }
}

export async function processCompressPdf(file, options = {}) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.level) {
      formData.append('level', options.level);
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/compress-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Gagal mengompres file. Pastikan API Python berjalan.");
    }
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_compressed_nexarin.pdf";
    
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error compressing PDF via API:", error);
    throw error;
  }
}

export async function processPdfToExcel(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/pdf-to-excel`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi file ke Excel.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.xlsx";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error PDF to Excel:", error);
    throw error;
  }
}

export async function processWordToPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/word-to-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi Word ke PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Word to PDF:", error);
    throw error;
  }
}

export async function processPdfToPng(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/pdf-to-png`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi PDF ke PNG.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_images.zip";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error PDF to PNG:", error);
    throw error;
  }
}

export async function processEditPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/edit-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengedit PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_edited.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Edit PDF:", error);
    throw error;
  }
}

export async function processMergePdf(files) {
  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return { blob, outputFilename: 'merged_nexarin.pdf' };
  } catch (clientError) {
    console.warn("Client-side Merge PDF failed, trying API fallback:", clientError);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/merge-pdf`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error("Gagal menggabungkan PDF. Pastikan file PDF valid.");
    const blob = await response.blob();
    return { blob, outputFilename: 'merged_nexarin.pdf' };
  }
}

export async function processSplitPdf(file, options = {}) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageCount = srcDoc.getPageCount();

    const splitDoc = await PDFDocument.create();
    let indices = Array.from({ length: pageCount }, (_, i) => i);
    
    if (options.ranges && Array.isArray(options.ranges) && options.ranges.length > 0) {
      indices = options.ranges.map(r => Number(r) - 1).filter(i => !isNaN(i) && i >= 0 && i < pageCount);
    }

    if (indices.length === 0) {
      indices = Array.from({ length: pageCount }, (_, i) => i);
    }

    const copiedPages = await splitDoc.copyPages(srcDoc, indices);
    copiedPages.forEach(p => splitDoc.addPage(p));

    const pdfBytes = await splitDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_split.pdf";
    return { blob, outputFilename };
  } catch (clientError) {
    console.warn("Client-side Split PDF failed, trying API fallback:", clientError);
    const formData = new FormData();
    formData.append('file', file);
    if (options.ranges) formData.append('ranges', JSON.stringify(options.ranges));
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/split-pdf`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error("Gagal memecah PDF. Pastikan file PDF valid.");
    const blob = await response.blob();
    return { blob, outputFilename: file.name.replace(/\.[^/.]+$/, "") + "_split.pdf" };
  }
}

export async function processPdfToPowerpoint(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/pdf-to-pptx`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi PDF ke PowerPoint.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.pptx";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error PDF to PowerPoint:", error);
    throw error;
  }
}

export async function processPowerpointToPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/pptx-to-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi PowerPoint ke PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error PowerPoint to PDF:", error);
    throw error;
  }
}

export async function processExcelToPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/excel-to-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi Excel ke PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Excel to PDF:", error);
    throw error;
  }
}

export async function processSignPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/sign-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal menandatangani PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_signed.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Sign PDF:", error);
    throw error;
  }
}

export async function processWatermarkPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/watermark-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal memberi watermark PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_watermarked.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Watermark PDF:", error);
    throw error;
  }
}

export async function processRotatePdf(file, options = {}) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const rotationAngle = options.rotation || 90;
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationAngle) % 360));
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_rotated.pdf";
    return { blob, outputFilename };
  } catch (clientError) {
    console.warn("Client-side Rotate PDF failed, trying API fallback:", clientError);
    const formData = new FormData();
    formData.append('file', file);
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/rotate-pdf`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error("Gagal memutar PDF. Pastikan file PDF valid.");
    const blob = await response.blob();
    return { blob, outputFilename: file.name.replace(/\.[^/.]+$/, "") + "_rotated.pdf" };
  }
}

export async function processHtmlToPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/html-to-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi HTML ke PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error HTML to PDF:", error);
    throw error;
  }
}

export async function processUnlockPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_unlocked.pdf";
    return { blob, outputFilename };
  } catch (clientError) {
    console.warn("Client-side Unlock PDF failed, trying API fallback:", clientError);
    const formData = new FormData();
    formData.append('file', file);
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/unlock-pdf`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error("Gagal membuka kunci PDF.");
    const blob = await response.blob();
    return { blob, outputFilename: file.name.replace(/\.[^/.]+$/, "") + "_unlocked.pdf" };
  }
}

export async function processProtectPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/protect-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal melindungi PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_protected.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Protect PDF:", error);
    throw error;
  }
}

export async function processOrganizePdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/organize-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal menyusun PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_organized.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Organize PDF:", error);
    throw error;
  }
}

export async function processPdfToPdfa(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/pdf-to-pdfa`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi PDF ke PDF/A.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_pdfa.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error PDF to PDF/A:", error);
    throw error;
  }
}

export async function processRepairPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/repair-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal memperbaiki PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_repaired.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Repair PDF:", error);
    throw error;
  }
}

export async function processPageNumbersPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/page-numbers`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal menambahkan nomor halaman.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_numbered.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Page Numbers:", error);
    throw error;
  }
}

export async function processScanPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/scan-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal melakukan proses Scan to PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_scanned.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Scan to PDF:", error);
    throw error;
  }
}

export async function processOcrPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/ocr-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal memproses OCR PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_searchable.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error OCR PDF:", error);
    throw error;
  }
}

export async function processComparePdf(files) {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/compare-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal membandingkan PDF.");
    
    const blob = await response.blob();
    const outputFilename = "comparison_report.txt";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Compare PDF:", error);
    throw error;
  }
}

export async function processRedactPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/redact-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal menahan/redact PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_redacted.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Redact PDF:", error);
    throw error;
  }
}

export async function processCropPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/crop-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal memotong PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_cropped.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Crop PDF:", error);
    throw error;
  }
}

export async function processFormsPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/forms-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal membuat formulir interaktif PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_interactive.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Forms PDF:", error);
    throw error;
  }
}

export async function processTranslatePdf(file, targetLang = 'id') {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_lang', targetLang);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/translate-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal menerjemahkan PDF.");
    
    const detectedLang = response.headers.get("X-Detected-Lang") || "Otomatis";
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_translated.pdf";
    return { blob, outputFilename, detectedLang };
  } catch (error) {
    console.error("Error Translate PDF:", error);
    throw error;
  }
}

export async function processMarkdownPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/markdown-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal mengonversi PDF ke Markdown.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + ".md";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Markdown PDF:", error);
    throw error;
  }
}

// Basic mock function for tools that are not fully implemented yet
export async function mockProcessPdf(file, toolId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        blob: new Blob(["Mock PDF Content"], { type: 'application/pdf' }),
        outputFilename: `mock_${toolId}_${file.name}`
      });
    }, 2000); // simulate 2s processing
  });
}
