from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from PIL import Image, ImageEnhance
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/scan-pdf")
async def scan_pdf(file: UploadFile = File(...)):
    valid_extensions = ('.jpg', '.jpeg', '.png')
    if not file.filename.lower().endswith(valid_extensions):
        raise HTTPException(status_code=400, detail="Harap unggah gambar (JPG/PNG).")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_img = os.path.join(temp_dir, f"input_scan_{unique_id}.png")
    output_pdf = os.path.join(temp_dir, f"output_scan_{unique_id}.pdf")
    
    try:
        with open(input_img, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        image = Image.open(input_img)
        
        # Apply "Scanner" effect: convert to grayscale and increase contrast
        image = image.convert('L')
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        image.save(output_pdf, "PDF", resolution=150.0)
        
        if not os.path.exists(output_pdf):
            raise Exception("File PDF gagal dibuat.")
            
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_scanned.pdf"
        )
    except Exception as e:
        print(f"Scan to PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_img):
            try: os.remove(input_img)
            except: pass
