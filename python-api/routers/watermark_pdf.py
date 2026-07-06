from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random
import math

router = APIRouter()

@router.post("/convert/watermark-pdf")
async def watermark_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_wm_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_wm_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        for page in doc:
            rect = page.rect
            # Calculate diagonal watermark placement
            watermark_text = "CONFIDENTIAL"
            fontsize = 60
            
            # Use PyMuPDF's insert_text with rotation
            p = fitz.Point(rect.width / 4, rect.height / 2)
            # Calculate hypotenuse angle roughly 45 degrees
            page.insert_text(
                p, 
                watermark_text, 
                fontsize=fontsize, 
                color=(0.8, 0.8, 0.8), # Light gray
                rotate=-45,
                fill_opacity=0.5
            )
            
        doc.save(output_pdf)
        doc.close()
        
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_watermarked.pdf"
        )
    except Exception as e:
        print(f"Watermark PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
