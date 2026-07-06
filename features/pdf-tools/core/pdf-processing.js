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
