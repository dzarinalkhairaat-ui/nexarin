from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/redact-pdf")
async def redact_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_redact_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_redact_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        redact_word = "RAHASIA"
        
        found_any = False
        for page in doc:
            # Search for the word
            rects = page.search_for(redact_word)
            if rects:
                found_any = True
                for rect in rects:
                    page.add_redact_annot(rect, fill=(0, 0, 0)) # Black box
            
            # Apply all redactions on this page
            page.apply_redactions()
            
        # If the word wasn't found, just draw a black box at the top as a demo
        if not found_any and len(doc) > 0:
            page = doc[0]
            rect = fitz.Rect(50, 50, 300, 100)
            page.add_redact_annot(rect, text="REDACTED DEMO", fill=(0, 0, 0), text_color=(1, 1, 1))
            page.apply_redactions()
            
        doc.save(output_pdf)
        doc.close()
        
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_redacted.pdf"
        )
    except Exception as e:
        print(f"Redact PDF error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
