from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
import fitz  # PyMuPDF
import zipfile
import io
import os
import json

router = APIRouter()

@router.post("/convert/split-pdf")
async def split_pdf(file: UploadFile = File(...), ranges: str = Form(None)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Hanya menerima file PDF.")
        
    try:
        doc_bytes = await file.read()
        doc = fitz.open(stream=doc_bytes, filetype="pdf")
        
        zip_buffer = io.BytesIO()
        
        ranges_data = None
        if ranges:
            try:
                ranges_data = json.loads(ranges)
            except Exception as e:
                print(f"Error parsing ranges JSON: {e}")
                pass
        
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            if ranges_data:
                # Mode Rentang Khusus
                for idx, r in enumerate(ranges_data):
                    # Konversi ke 0-indexed untuk PyMuPDF
                    from_p = max(0, int(r.get("from", 1)) - 1)
                    to_p = min(len(doc) - 1, int(r.get("to", len(doc))) - 1)
                    
                    if from_p <= to_p:
                        new_doc = fitz.open()
                        new_doc.insert_pdf(doc, from_page=from_p, to_page=to_p)
                        page_bytes = new_doc.write()
                        new_doc.close()
                        
                        # Nama file untuk rentang ini
                        zip_file.writestr(f"range_{idx+1}_{from_p+1}-{to_p+1}.pdf", page_bytes)
            else:
                # Mode Ekstrak Semua (Default)
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
