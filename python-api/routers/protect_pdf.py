from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/protect-pdf")
async def protect_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_protect_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_protect_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        # Save with AES 256 encryption and default password "nexarin"
        # In the future, the password will be passed from the UI
        perm = int(
            fitz.PDF_PERM_PRINT | 
            fitz.PDF_PERM_COPY | 
            fitz.PDF_PERM_ANNOTATE
        )
        
        doc.save(
            output_pdf, 
            encryption=fitz.PDF_ENCRYPT_AES_256,
            owner_pw="nexarin",
            user_pw="nexarin",
            permissions=perm
        )
        doc.close()
        
        if not os.path.exists(output_pdf):
            raise Exception("File PDF gagal dilindungi.")
            
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_protected.pdf"
        )
    except Exception as e:
        print(f"Protect PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
