from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import zipfile
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/pdf-to-png")
async def convert_pdf_to_png(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_png_{unique_id}.pdf")
    output_zip = os.path.join(temp_dir, f"output_pngs_{unique_id}.zip")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        png_files = []
        
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=150)
            img_path = os.path.join(temp_dir, f"page_{i+1}_{unique_id}.png")
            pix.save(img_path)
            png_files.append(img_path)
        doc.close()
        
        with zipfile.ZipFile(output_zip, 'w') as zf:
            for i, f in enumerate(png_files):
                zf.write(f, f"page_{i+1}.png")
                
        for f in png_files:
            try: os.remove(f)
            except: pass
            
        return FileResponse(
            output_zip, 
            media_type="application/zip",
            filename=f"{file.filename.rsplit('.', 1)[0]}_images.zip"
        )
    except Exception as e:
        print(f"PDF to PNG error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
