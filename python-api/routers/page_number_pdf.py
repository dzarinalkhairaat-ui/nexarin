from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/page-numbers")
async def page_numbers(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_pgnum_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_pgnum_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        total_pages = len(doc)
        
        for i, page in enumerate(doc):
            rect = page.rect
            text = f"Page {i+1} of {total_pages}"
            p = fitz.Point(rect.width / 2.0 - 30, rect.height - 20)
            page.insert_text(p, text, fontsize=10, color=(0, 0, 0))
            
        doc.save(output_pdf)
        doc.close()
        
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_numbered.pdf"
        )
    except Exception as e:
        print(f"Page Numbers error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
