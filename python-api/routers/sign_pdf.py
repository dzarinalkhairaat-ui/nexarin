from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/sign-pdf")
async def sign_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_sign_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_sign_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        for page in doc:
            rect = page.rect
            # Add a visual "signed" stamp at the bottom right
            stamp_text = "SIGNED SECURELY BY NEXARIN"
            p = fitz.Point(rect.width - 250, rect.height - 50)
            page.insert_text(p, stamp_text, fontsize=12, color=(0, 0.5, 0)) # Green color
            
        doc.save(output_pdf)
        doc.close()
        
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_signed.pdf"
        )
    except Exception as e:
        print(f"Sign PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
