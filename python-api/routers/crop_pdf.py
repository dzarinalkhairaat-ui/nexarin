from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/crop-pdf")
async def crop_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_crop_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_crop_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        for page in doc:
            rect = page.rect
            # Crop 10% from each side
            margin_x = rect.width * 0.1
            margin_y = rect.height * 0.1
            
            new_rect = fitz.Rect(
                rect.x0 + margin_x,
                rect.y0 + margin_y,
                rect.x1 - margin_x,
                rect.y1 - margin_y
            )
            page.set_cropbox(new_rect)
            
        doc.save(output_pdf)
        doc.close()
        
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_cropped.pdf"
        )
    except Exception as e:
        print(f"Crop PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
