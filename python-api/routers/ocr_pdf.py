from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import subprocess
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/ocr-pdf")
async def ocr_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_ocr_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_ocr_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        # Call ocrmypdf
        # Adding --force-ocr to force OCR even if text exists
        # Adding -l eng+ind for English and Indonesian support
        subprocess.run([
            'ocrmypdf', 
            '--force-ocr', 
            '-l', 'eng+ind',
            input_pdf, 
            output_pdf
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        if not os.path.exists(output_pdf):
            raise Exception("File PDF gagal diproses OCR.")
            
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_searchable.pdf"
        )
    except Exception as e:
        print(f"OCR PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
