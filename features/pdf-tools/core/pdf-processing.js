import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function processJpgToPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/img-to-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Gagal mengonversi file. Pastikan API Python berjalan.");
    }
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.pdf";
    
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error converting JPG to PDF via API:", error);
    throw error;
  }
}

export async function processPdfToWord(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/pdf-to-word`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Gagal mengonversi file. Pastikan API Python berjalan.");
    }
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_nexarin.docx";
    
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error converting PDF to Word via API:", error);
    throw error;
  }
}

export async function processCompressPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
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
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/merge-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal menggabungkan PDF.");
    
    const blob = await response.blob();
    const outputFilename = "merged_nexarin.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Merge PDF:", error);
    throw error;
  }
}

export async function processSplitPdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/split-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal memecah PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_split.zip";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Split PDF:", error);
    throw error;
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

export async function processRotatePdf(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/rotate-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal memutar PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_rotated.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Rotate PDF:", error);
    throw error;
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
    const formData = new FormData();
    formData.append('file', file);
    
    const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'https://nexarin-nexarin-backend-python.hf.space';
    const response = await fetch(`${apiUrl}/convert/unlock-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error("Gagal membuka kunci PDF.");
    
    const blob = await response.blob();
    const outputFilename = file.name.replace(/\.[^/.]+$/, "") + "_unlocked.pdf";
    return { blob, outputFilename };
  } catch (error) {
    console.error("Error Unlock PDF:", error);
    throw error;
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
