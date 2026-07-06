from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/forms-pdf")
async def forms_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_forms_{unique_id}.pdf")
    output_pdf = os.path.join(temp_dir, f"output_forms_{unique_id}.pdf")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        
        if len(doc) > 0:
            page = doc[0]
            # Create a simple interactive text field
            widget = fitz.Widget()
            widget.rect = fitz.Rect(50, 50, 250, 80)
            widget.field_type = fitz.PDF_WIDGET_TYPE_TEXT
            widget.field_name = "NexarinDemoField"
            widget.field_value = "Ketik Teks Disini..."
            widget.text_color = (0, 0, 1) # Blue text
            widget.border_color = (0, 0, 0) # Black border
            page.add_widget(widget)
            
        doc.save(output_pdf)
        doc.close()
        
        return FileResponse(
            output_pdf, 
            media_type="application/pdf",
            filename=f"{file.filename.rsplit('.', 1)[0]}_interactive.pdf"
        )
    except Exception as e:
        print(f"PDF Forms error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
