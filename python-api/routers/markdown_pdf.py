from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import markdownify
import fitz  # PyMuPDF
import tempfile
import os
import time
import random

router = APIRouter()

@router.post("/convert/markdown-pdf")
async def markdown_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    unique_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
    temp_dir = tempfile.gettempdir()
    
    input_pdf = os.path.join(temp_dir, f"input_md_{unique_id}.pdf")
    output_md = os.path.join(temp_dir, f"output_md_{unique_id}.md")
    
    try:
        with open(input_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        doc = fitz.open(input_pdf)
        md_content = ""
        
        for i, page in enumerate(doc):
            html = page.get_text("html")
            md = markdownify.markdownify(html, heading_style="ATX")
            md_content += md + "\n\n---\n\n"
            
        doc.close()
        
        with open(output_md, "w", encoding="utf-8") as f:
            f.write(md_content)
            
        return FileResponse(
            output_md, 
            media_type="text/markdown",
            filename=f"{file.filename.rsplit('.', 1)[0]}.md"
        )
    except Exception as e:
        print(f"PDF to Markdown error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(input_pdf):
            try: os.remove(input_pdf)
            except: pass
