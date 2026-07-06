from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
import fitz  # PyMuPDF
import io

router = APIRouter()

@router.post("/convert/merge-pdf")
async def merge_pdf(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Pilih minimal 2 file PDF untuk digabungkan.")
        
    try:
        merged_doc = fitz.open()
        
        for file in files:
            if not file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400, detail="Semua file harus berformat PDF.")
            doc_bytes = await file.read()
            doc = fitz.open(stream=doc_bytes, filetype="pdf")
            merged_doc.insert_pdf(doc)
            doc.close()
            
        output_bytes = merged_doc.write()
        merged_doc.close()
        
        return StreamingResponse(
            io.BytesIO(output_bytes), 
            media_type="application/pdf", 
            headers={"Content-Disposition": 'attachment; filename="merged_document.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat menggabungkan PDF: {str(e)}")
