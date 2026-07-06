from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import fitz  # PyMuPDF
import zipfile
import io
import os

router = APIRouter()

@router.post("/convert/split-pdf")
async def split_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Hanya menerima file PDF.")
        
    try:
        doc_bytes = await file.read()
        doc = fitz.open(stream=doc_bytes, filetype="pdf")
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for i in range(len(doc)):
                new_doc = fitz.open()
                new_doc.insert_pdf(doc, from_page=i, to_page=i)
                page_bytes = new_doc.write()
                new_doc.close()
                
                zip_file.writestr(f"page_{i+1}.pdf", page_bytes)
                
        doc.close()
        zip_buffer.seek(0)
        
        base_name = os.path.splitext(file.filename)[0]
        return StreamingResponse(
            zip_buffer, 
            media_type="application/zip", 
            headers={"Content-Disposition": f'attachment; filename="{base_name}_split.zip"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memecah PDF: {str(e)}")
