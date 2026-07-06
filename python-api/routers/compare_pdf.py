from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from typing import List
import fitz  # PyMuPDF
import difflib
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/compare-pdf")
async def compare_pdf(files: List[UploadFile] = File(...)):
    if len(files) != 2:
        raise HTTPException(status_code=400, detail="Harap unggah tepat 2 file PDF untuk dibandingkan.")
        
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    report_file = os.path.join(temp_dir, f"compare_report_{unique_id}.txt")
    
    try:
        texts = []
        for file in files:
            doc_bytes = await file.read()
            doc = fitz.open(stream=doc_bytes, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
            texts.append(text.splitlines())
            
        diff = difflib.unified_diff(
            texts[0], texts[1], 
            fromfile=files[0].filename, 
            tofile=files[1].filename, 
            lineterm=''
        )
        
        diff_text = "\n".join(diff)
        if not diff_text.strip():
            diff_text = "TIDAK ADA PERBEDAAN. KEDUA DOKUMEN IDENTIK."
            
        with open(report_file, "w", encoding="utf-8") as f:
            f.write("=== NEXARIN PDF COMPARISON REPORT ===\n\n")
            f.write(diff_text)
            
        return FileResponse(
            report_file, 
            media_type="text/plain",
            filename="comparison_report.txt"
        )
    except Exception as e:
        print(f"Compare PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
