from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/unlock-pdf")
async def unlock_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_unlock_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_unlock_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        # If it requires a password, try the default "nexarin"
        if doc.needs_pass:
            if not doc.authenticate("nexarin"):
                raise Exception("Dokumen dikunci dengan password yang tidak diketahui. Gunakan password 'nexarin' untuk mencoba fitur ini.")
                
        # Save without encryption
        doc.save(output_pdf, encryption=fitz.PDF_ENCRYPT_NONE)
        doc.close()
        
        if not os.path.exists(output_pdf):
            raise Exception("File PDF gagal dibuat.")
            
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_unlocked.pdf"
        )
    except Exception as e:
        print(f"Unlock PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
